/**
 * Returns a user-friendly error message for admin Supabase operations.
 * Handles common RLS, permission, and network errors.
 */
export function getAdminErrorMessage(error: { message?: string; code?: string }): string {
  const msg = (error?.message ?? "").toLowerCase();
  const code = error?.code ?? "";

  if (msg.includes("row level security") || msg.includes("rls") || msg.includes("policy")) {
    return "Permission denied. You may not have access to this resource.";
  }
  if (msg.includes("jwt") || msg.includes("token") || msg.includes("session")) {
    return "Session expired. Please sign out and sign in again.";
  }
  if (msg.includes("network") || msg.includes("fetch") || msg.includes("failed to fetch")) {
    return "Network error. Check your connection and try again.";
  }
  if (code === "PGRST301" || msg.includes("permission denied")) {
    return "Permission denied. You may not have access to perform this action.";
  }
  if (msg.includes("timeout") || msg.includes("timed out")) {
    return "Request timed out. Please try again.";
  }

  return error?.message ?? "An unexpected error occurred.";
}
