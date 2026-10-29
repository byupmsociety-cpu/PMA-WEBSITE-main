import { supabase } from "@/integrations/supabase/client";

export async function submitRating({
  rating,
  message,
  page,
  profileId,
}: {
  rating: number;
  message: string;
  page: string;
  profileId?: string;
}) {
  const { error } = await supabase.from("user_feedback").insert({
    type: "rating",
    rating,
    message: message.trim().slice(0, 2000),
    page,
    user_id: profileId ?? null,
  });
  if (error) throw error;
}
