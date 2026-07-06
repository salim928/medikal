/**
 * Prescription Authority API Endpoints
 * Manage prescription authority for clinicians
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { PrescriptionAuthority } from '@/types/compliance';

/**
 * GET /api/prescription-authority
 * Get prescription authority for current user or specified user (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const userRole = user.user_metadata?.role;

    // If requesting another user's authority, must be admin
    if (userId && userId !== user.id) {
      if (!['platform_admin', 'super_admin', 'compliance_officer'].includes(userRole)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const targetUserId = userId || user.id;

    const { data: authority, error } = await supabase
      .from('prescription_authority')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching prescription authority:', error);
      return NextResponse.json(
        { error: 'Failed to fetch prescription authority' },
        { status: 500 }
      );
    }

    if (!authority) {
      return NextResponse.json(
        { error: 'No prescription authority found', has_authority: false },
        { status: 404 }
      );
    }

    // Fetch supervising physician if exists
    let supervisingPhysician = null;
    if (authority.supervising_physician_id) {
      const { data: physician } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('id', authority.supervising_physician_id)
        .single();
      supervisingPhysician = physician;
    }

    // Check if authority is still valid
    const isValid = !authority.valid_until || new Date(authority.valid_until) > new Date();

    return NextResponse.json({
      authority: {
        ...authority,
        supervising_physician: supervisingPhysician,
      },
      is_valid: isValid,
      has_authority: true,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/prescription-authority
 * Grant prescription authority (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can grant prescription authority
    const userRole = user.user_metadata?.role;
    if (!['platform_admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Only administrators can grant prescription authority' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      user_id,
      role,
      can_prescribe,
      controlled_substances,
      max_dea_schedule,
      jurisdiction,
      requires_supervision,
      supervising_physician_id,
      valid_until,
    } = body;

    // Validate required fields
    if (!user_id || !role || !jurisdiction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role-specific rules
    if (role === 'nurse' || role === 'midwife') {
      // Nurses and midwives typically require supervision
      if (!supervising_physician_id) {
        return NextResponse.json(
          { error: 'Nurse/midwife prescribers must have a supervising physician' },
          { status: 400 }
        );
      }
    }

    // Create authority record
    const authorityRecord: Partial<PrescriptionAuthority> = {
      user_id,
      role,
      can_prescribe: can_prescribe ?? false,
      controlled_substances: controlled_substances ?? false,
      max_dea_schedule,
      jurisdiction,
      requires_supervision: requires_supervision ?? (role === 'nurse' || role === 'midwife'),
      supervising_physician_id,
      valid_until,
    };

    const { data: authority, error } = await supabase
      .from('prescription_authority')
      .insert([authorityRecord])
      .select()
      .single();

    if (error) {
      console.error('Error creating prescription authority:', error);
      return NextResponse.json(
        { error: 'Failed to create prescription authority' },
        { status: 500 }
      );
    }

    return NextResponse.json({ authority }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/prescription-authority
 * Update prescription authority (admin only)
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update prescription authority
    const userRole = user.user_metadata?.role;
    if (!['platform_admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Only administrators can update prescription authority' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { authority_id, ...updates } = body;

    if (!authority_id) {
      return NextResponse.json(
        { error: 'authority_id is required' },
        { status: 400 }
      );
    }

    const { data: authority, error } = await supabase
      .from('prescription_authority')
      .update(updates)
      .eq('id', authority_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prescription authority:', error);
      return NextResponse.json(
        { error: 'Failed to update prescription authority' },
        { status: 500 }
      );
    }

    return NextResponse.json({ authority });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
