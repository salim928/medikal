// Cookie-backed browser client (@supabase/ssr) so the session is readable by the
// server (middleware + route handlers). Re-exported here to keep existing imports working.
export { supabase } from "./supabase/client";
import { supabase } from "./supabase/client";

// Sign up function
export async function signUp(
  email: string,
  password: string,
  role: string,
  fullName?: string,
  additionalMetadata?: Record<string, any>
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName || email.split("@")[0],
        name: fullName || email.split("@")[0],
        ...additionalMetadata, // Merge additional metadata (license numbers, specializations, etc.)
      },
    },
  });

  if (error) {
    throw error;
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    throw new Error(
      "Please check your email to confirm your account before logging in."
    );
  }

  return data;
}

// Sign in function
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error("No session created. Please try again.");
  }

  return data;
}

export async function signInWithWeb3(address: string, signature: string, message: string) {
  // Actually verify the signature: recover the signer from (message, signature) and
  // confirm it matches the claimed address. The previous version skipped this entirely
  // and just used the signature string as a password, which proved nothing.
  const { verifyMessage } = await import("ethers");

  let recovered: string;
  try {
    recovered = verifyMessage(message, signature);
  } catch {
    throw new Error("Invalid Web3 signature");
  }

  if (recovered.toLowerCase() !== address.toLowerCase()) {
    throw new Error("Web3 signature does not match address");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${address.toLowerCase()}@web3.local`,
    password: signature,
  });

  if (error) throw new Error("Web3 authentication failed");
  return data;
}

// Sign out function
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}