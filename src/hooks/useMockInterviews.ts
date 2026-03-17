import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

type SlotType = "peer" | "mentor";
type InterviewType = "general" | "behavioral" | "product" | "case";

export const useMockInterviews = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: openSlots, isLoading: loadingSlots } = useQuery({
    queryKey: ["mock_interview_slots", "open"],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("mock_interview_slots")
        .select(`
          *,
          profiles:user_id (id, full_name, avatar_url, school_year)
        `)
        .eq("is_booked", false)
        .gt("start_time", new Date().toISOString())
        .neq("user_id", userId)
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: mySlots, isLoading: loadingMySlots } = useQuery({
    queryKey: ["mock_interview_slots", "mine", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("mock_interview_slots")
        .select(`*`)
        .eq("user_id", userId)
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: myInterviews, isLoading: loadingInterviews } = useQuery({
    queryKey: ["mock_interviews", "mine", userId],
    queryFn: async () => {
      if (!userId) return [];
      // Fetch interviews where I am the interviewer OR the interviewee
      const { data, error } = await supabase
        .from("mock_interviews")
        .select(`
          *,
          interviewer:profiles!interviewer_id (id, full_name, avatar_url, email),
          interviewee:profiles!interviewee_id (id, full_name, avatar_url, email),
          slot:mock_interview_slots (*)
        `)
        .or(`interviewer_id.eq.${userId},interviewee_id.eq.${userId}`)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const createSlotMutation = useMutation({
    mutationFn: async ({
      startTime,
      endTime,
      slotType = "peer",
      interviewType = "general",
      durationMinutes = 60,
    }: {
      startTime: string;
      endTime: string;
      slotType?: SlotType;
      interviewType?: InterviewType;
      durationMinutes?: 30 | 45 | 60;
    }) => {
      if (!userId) throw new Error("Not logged in");
      const { data, error } = await supabase
        .from("mock_interview_slots")
        .insert({
          user_id: userId,
          start_time: startTime,
          end_time: endTime,
          slot_type: slotType,
          interview_type: interviewType,
          duration_minutes: durationMinutes,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interview_slots"] });
      toast({ title: "Availability posted!" });
    },
    onError: (error) => {
      toast({ title: "Error posting availability", description: error.message, variant: "destructive" });
    }
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: string) => {
      const { error } = await supabase
        .from("mock_interview_slots")
        .delete()
        .eq("id", slotId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interview_slots"] });
      toast({ title: "Slot removed" });
    },
    onError: (error) => {
      toast({ title: "Error sharing slot", description: error.message, variant: "destructive" });
    }
  });

  const bookInterviewMutation = useMutation({
    mutationFn: async ({ slotId }: { slotId: string }) => {
      if (!userId) throw new Error("Not logged in");

      const { data, error } = await supabase.rpc("book_mock_interview", { p_slot_id: slotId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interview_slots"] });
      queryClient.invalidateQueries({ queryKey: ["mock_interviews"] });
      toast({ title: "Interview booked successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error booking interview", description: error.message, variant: "destructive" });
    }
  });

  const cancelInterviewMutation = useMutation({
    mutationFn: async ({ interviewId, reason }: { interviewId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc("cancel_mock_interview", {
        p_interview_id: interviewId,
        p_reason: reason ?? null,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interview_slots"] });
      queryClient.invalidateQueries({ queryKey: ["mock_interviews"] });
      toast({ title: "Interview cancelled" });
    },
    onError: (error) => {
      toast({ title: "Error cancelling interview", description: error.message, variant: "destructive" });
    }
  });

  const completeInterviewMutation = useMutation({
    mutationFn: async ({ interviewId }: { interviewId: string }) => {
      const { data, error } = await supabase.rpc("complete_mock_interview", { p_interview_id: interviewId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interviews"] });
      toast({ title: "Marked as completed" });
    },
    onError: (error) => {
      toast({ title: "Error completing interview", description: error.message, variant: "destructive" });
    }
  });

  const updateInterviewMutation = useMutation({
    mutationFn: async ({ interviewId, updates }: { interviewId: string, updates: any }) => {
      const { data, error } = await supabase
        .from("mock_interviews")
        .update(updates)
        .eq("id", interviewId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interviews"] });
      toast({ title: "Interview updated!" });
    },
    onError: (error) => {
      toast({ title: "Error updating interview", description: error.message, variant: "destructive" });
    }
  });

  const { data: myFeedback, isLoading: loadingFeedback } = useQuery({
    queryKey: ["mock_interview_feedback", "mine", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("mock_interview_feedback")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const upsertFeedbackMutation = useMutation({
    mutationFn: async (payload: {
      interviewId: string;
      rubric: Record<string, any>;
      notes?: string;
      strengths?: string;
      improvements?: string;
      actionItems?: string;
    }) => {
      if (!userId) throw new Error("Not logged in");
      const { data, error } = await supabase
        .from("mock_interview_feedback")
        .upsert(
          {
            interview_id: payload.interviewId,
            reviewer_id: userId,
            rubric: payload.rubric ?? {},
            notes: payload.notes?.trim() ? payload.notes.trim() : null,
            strengths: payload.strengths?.trim() ? payload.strengths.trim() : null,
            improvements: payload.improvements?.trim() ? payload.improvements.trim() : null,
            action_items: payload.actionItems?.trim() ? payload.actionItems.trim() : null,
          },
          { onConflict: "interview_id,reviewer_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interview_feedback"] });
      toast({ title: "Feedback saved" });
    },
    onError: (error) => {
      toast({ title: "Error saving feedback", description: error.message, variant: "destructive" });
    }
  });

  return {
    openSlots,
    mySlots,
    myInterviews,
    myFeedback,
    isLoading: loadingSlots || loadingMySlots || loadingInterviews || loadingFeedback,
    createSlot: createSlotMutation.mutateAsync,
    deleteSlot: deleteSlotMutation.mutateAsync,
    bookInterview: bookInterviewMutation.mutateAsync,
    updateInterview: updateInterviewMutation.mutateAsync,
    cancelInterview: cancelInterviewMutation.mutateAsync,
    completeInterview: completeInterviewMutation.mutateAsync,
    upsertFeedback: upsertFeedbackMutation.mutateAsync,
  };
};
