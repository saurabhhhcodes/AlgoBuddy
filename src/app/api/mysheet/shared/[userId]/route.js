import { getAuthenticatedUser } from "@/lib/auth";
import {
  canViewPrivateSheetNotes,
  mapSharedSheetItems,
} from "@/lib/mysheetSharing";
import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    if (!userId) return jsonResponse({ error: "userId is required" }, 400);

    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      if (authResult.type === "CONFIG_ERROR") {
        return jsonResponse({ error: "Auth server is not configured." }, 500);
      }
      if (authResult.type === "AUTH_PROVIDER_ERROR") {
        return jsonResponse({ error: "Authentication provider error" }, 500);
      }
    }

    const includePrivateNotes = canViewPrivateSheetNotes(authResult, userId);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("my_sheet")
      .select("problem_id, added_at, note")
      .eq("user_id", userId);

    if (error) return jsonResponse({ error: error.message }, 500);

    return jsonResponse({
      items: mapSharedSheetItems(data, { includePrivateNotes }),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
