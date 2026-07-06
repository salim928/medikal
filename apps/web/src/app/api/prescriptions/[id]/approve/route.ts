/**
 * Prescription Approval API Endpoints
 * Allows physicians to approve/reject prescriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  Prescription,
  ApprovePrescriptionRequest,
  ApprovePrescriptionResponse,
  PrescriptionApproval,
} from '@/types/compliance';

/**
 * POST /api/prescriptions/[id]/approve
 * Approve or reject a prescription
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prescriptionId = (await params).id;
    const body: ApprovePrescriptionRequest = await req.json();
    const { action, reason, modifications } = body;

    // Verify user is a physician
    const userRole = user.user_metadata?.role;
    if (userRole !== 'doctor') {
      return NextResponse.json(
        { error: 'Only physicians can approve prescriptions' },
        { status: 403 }
      );
    }

    // Fetch prescription
    const { data: prescription, error: fetchError } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('id', prescriptionId)
      .single();

    if (fetchError || !prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Verify this physician is the assigned approver
    if (prescription.approving_physician_id !== user.id) {
      return NextResponse.json(
        { error: 'You are not assigned to approve this prescription' },
        { status: 403 }
      );
    }

    // Verify prescription is in correct status
    if (prescription.status !== 'pending_approval') {
      return NextResponse.json(
        { error: `Cannot approve prescription with status: ${prescription.status}` },
        { status: 400 }
      );
    }

    // Process approval/rejection
    let newStatus: string;
    let approvalAction: string;

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        approvalAction = 'approved';
        break;
      case 'reject':
        newStatus = 'rejected';
        approvalAction = 'rejected';
        break;
      case 'request_modifications':
        newStatus = 'pending';
        approvalAction = 'modified';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update prescription
    const { data: updatedPrescription, error: updateError } = await supabase
      .from('prescriptions')
      .update({
        status: newStatus,
        approved_at: action === 'approve' ? new Date().toISOString() : undefined,
        rejection_reason: action === 'reject' ? reason : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', prescriptionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating prescription:', updateError);
      return NextResponse.json(
        { error: 'Failed to update prescription' },
        { status: 500 }
      );
    }

    // Create approval record
    const approvalRecord: Partial<PrescriptionApproval> = {
      prescription_id: prescriptionId,
      approver_id: user.id,
      action: approvalAction as any,
      reason,
      modifications,
    };

    const { data: approval, error: approvalError } = await supabase
      .from('prescription_approvals')
      .insert([approvalRecord])
      .select()
      .single();

    if (approvalError) {
      console.error('Error creating approval record:', approvalError);
      // Don't fail the request, approval was already updated
    }

    const response: ApprovePrescriptionResponse = {
      prescription: updatedPrescription as Prescription,
      approval: approval as PrescriptionApproval,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/prescriptions/[id]/approve
 * Get approval history for a prescription
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prescriptionId = (await params).id;

    // Fetch approval history
    const { data: approvals, error } = await supabase
      .from('prescription_approvals')
      .select(`
        *,
        approver:auth.users!approver_id(id, email, raw_user_meta_data)
      `)
      .eq('prescription_id', prescriptionId)
      .order('approved_at', { ascending: false });

    if (error) {
      console.error('Error fetching approvals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch approval history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ approvals });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
