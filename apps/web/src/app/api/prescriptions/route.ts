/**
 * Prescription Workflow API Endpoints
 * Implements prescription creation, approval, and tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  Prescription,
  CreatePrescriptionRequest,
  CreatePrescriptionResponse,
  PrescriptionAuthority,
  DEASchedule,
} from '@/types/compliance';

/**
 * GET /api/prescriptions
 * List prescriptions (filtered by role)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patient_id');
    const status = searchParams.get('status');

    // Build query based on user role
    let query = supabase
      .from('prescriptions')
      .select(`
        *,
        patient:auth.users!patient_id(id, email, raw_user_meta_data),
        prescriber:auth.users!prescriber_id(id, email, raw_user_meta_data),
        approver:auth.users!approving_physician_id(id, email, raw_user_meta_data)
      `);

    // Role-based filtering (RLS policies also enforce this)
    const userRole = user.user_metadata?.role;
    
    if (userRole === 'patient') {
      query = query.eq('patient_id', user.id);
    } else if (userRole === 'pharmacist') {
      // Pharmacists can see approved prescriptions
      query = query.in('status', ['approved', 'dispensed']);
    } else if (!['doctor', 'nurse', 'midwife', 'platform_admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Apply filters
    if (patientId) query = query.eq('patient_id', patientId);
    if (status) query = query.eq('status', status);

    const { data: prescriptions, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
    }

    return NextResponse.json({ prescriptions });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/prescriptions
 * Create a new prescription
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreatePrescriptionRequest = await req.json();
    const {
      patient_id,
      medication_name,
      dea_schedule,
      dosage,
      quantity,
      refills,
      instructions,
    } = body;

    // Validate required fields
    if (!patient_id || !medication_name || !dosage || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check prescriber authority
    const { data: authority, error: authError2 } = await supabase
      .from('prescription_authority')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (authError2 || !authority) {
      return NextResponse.json(
        { error: 'You do not have prescription authority' },
        { status: 403 }
      );
    }

    // Validate prescription authority
    const authValidation = validatePrescriptionAuthority(authority, dea_schedule);
    if (!authValidation.valid) {
      return NextResponse.json(
        { error: authValidation.reason },
        { status: 403 }
      );
    }

    // Determine if physician sign-off is required
    const requiresSignoff = authority.requires_supervision || 
                           (dea_schedule && ['I', 'II', 'III'].includes(dea_schedule));

    // Create prescription
    const newPrescription: Partial<Prescription> = {
      patient_id,
      prescriber_id: user.id,
      medication_name,
      dea_schedule,
      dosage,
      quantity,
      refills: refills || 0,
      instructions,
      status: requiresSignoff ? 'pending_approval' : 'pending',
      requires_physician_signoff: requiresSignoff,
      approving_physician_id: requiresSignoff ? authority.supervising_physician_id : undefined,
    };

    const { data: prescription, error: createError } = await supabase
      .from('prescriptions')
      .insert([newPrescription])
      .select()
      .single();

    if (createError) {
      console.error('Error creating prescription:', createError);
      return NextResponse.json(
        { error: 'Failed to create prescription' },
        { status: 500 }
      );
    }

    const response: CreatePrescriptionResponse = {
      prescription: prescription as Prescription,
      requires_physician_signoff: requiresSignoff,
      approving_physician_id: requiresSignoff ? authority.supervising_physician_id : undefined,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Validate prescription authority
 */
function validatePrescriptionAuthority(
  authority: PrescriptionAuthority,
  deaSchedule?: DEASchedule
): { valid: boolean; reason?: string } {
  // Check if can prescribe at all
  if (!authority.can_prescribe) {
    return { valid: false, reason: 'You do not have prescription privileges' };
  }

  // Check validity period
  if (authority.valid_until && new Date(authority.valid_until) < new Date()) {
    return { valid: false, reason: 'Your prescription authority has expired' };
  }

  // Check controlled substances
  if (deaSchedule) {
    if (!authority.controlled_substances) {
      return { 
        valid: false, 
        reason: 'You are not authorized to prescribe controlled substances' 
      };
    }

    // Check DEA schedule limits
    if (authority.max_dea_schedule) {
      const scheduleOrder: Record<string, number> = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5 };
      const maxLevel = scheduleOrder[authority.max_dea_schedule];
      const requestedLevel = scheduleOrder[deaSchedule];

      if (requestedLevel < maxLevel) {
        return {
          valid: false,
          reason: `You can only prescribe Schedule ${authority.max_dea_schedule} or lower controlled substances`,
        };
      }
    }
  }

  return { valid: true };
}
