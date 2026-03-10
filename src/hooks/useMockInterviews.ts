import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

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
    mutationFn: async ({ startTime, endTime }: { startTime: string, endTime: string }) => {
      if (!userId) throw new Error("Not logged in");
      const { data, error } = await supabase
        .from("mock_interview_slots")
        .insert({
          user_id: userId,
          start_time: startTime,
          end_time: endTime,
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
    mutationFn: async ({ slotId, interviewerId }: { slotId: string, interviewerId: string }) => {
      if (!userId) throw new Error("Not logged in");
      
      // We must do this in two steps or use a Postgres function due to RLS, but for MVP:
      // Since the user is not the slot owner, they can only UPDATE is_booked IF it's FALSE.
      const { error: updateError } = await supabase
        .from("mock_interview_slots")
        .update({ is_booked: true })
        .eq("id", slotId)
        .eq("is_booked", false);
      
      if (updateError) throw updateError;

      const { data, error } = await supabase
        .from("mock_interviews")
        .insert({
          slot_id: slotId,
          interviewer_id: interviewerId,
          interviewee_id: userId,
          status: "scheduled"
        })
        .select()
        .single();

      if (error) {
        // Rollback (best effort, ideally a database function handles atomic booking)
        await supabase.from("mock_interview_slots").update({ is_booked: false }).eq("id", slotId);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock_interview_slots"] });
      queryClient.invalidateQueries({ queryKey: ["mock_interviews"] });
      toast({ title: "Interview booked successfully! 🎉" });
    },
    onError: (error) => {
      toast({ title: "Error booking interview", description: error.message, variant: "destructive" });
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

  return {
    openSlots,
    mySlots,
    myInterviews,
    isLoading: loadingSlots || loadingMySlots || loadingInterviews,
    createSlot: createSlotMutation.mutateAsync,
    deleteSlot: deleteSlotMutation.mutateAsync,
    bookInterview: bookInterviewMutation.mutateAsync,
    updateInterview: updateInterviewMutation.mutateAsync,
  };
};
