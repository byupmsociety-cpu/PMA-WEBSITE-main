import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ArrowLeft, MessageSquare } from "lucide-react";

interface FeedbackItem {
  id: string;
  user_id: string;
  type: string;
  message: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const TYPE_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  bug: "destructive",
  feature_request: "default",
  general: "secondary",
  help: "outline",
};



const AdminFeedbackPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void loadFeedback();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadFeedback = async () => {
    setLoadingFeedback(true);
    const { data, error } = await supabase
      .from("user_feedback")
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading feedback", error);
      toast({
        title: "Error loading feedback",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      setFeedbacks((data as unknown as FeedbackItem[]) ?? []);
    }
    setLoadingFeedback(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("user_feedback")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating status",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({ title: "Status updated" });
      setFeedbacks((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6" /> User Feedback
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Review and triage feedback submitted by platform users.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingFeedback ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted/50 rounded-md animate-pulse" />
                ))}
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No feedback submissions yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(item.created_at), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.profiles?.full_name || "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.profiles?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={TYPE_COLORS[item.type] || "default"}>
                          {item.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[400px]">
                        <p className="whitespace-pre-wrap text-sm">{item.message}</p>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(val) => updateStatus(item.id, val)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
