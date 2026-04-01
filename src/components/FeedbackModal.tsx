import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const FeedbackModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string>('feature_request');
  const [message, setMessage] = useState('');
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!user || !profile) return;

    setLoading(true);

    const { error } = await supabase.from('user_feedback').insert({
      user_id: profile.id,
      type,
      message: message.trim(),
    });

    setLoading(false);

    if (error) {
      toast({
        title: 'Error submitting feedback',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Feedback received!',
      description: 'Thank you for helping us improve.',
    });
    
    setOpen(false);
    setMessage('');
    setType('feature_request');
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl hover:shadow-primary/25 transition-all z-50 bg-primary hover:bg-primary/90"
        >
          <MessageSquarePlus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] p-4 md:p-6 max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Have a suggestion, found a bug, or need help? Let us know below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="type">What is this regarding?</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature_request">Idea / Feature Request</SelectItem>
                <SelectItem value="bug">Report a Bug</SelectItem>
                <SelectItem value="help">I Need Help</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us what's on your mind..."
              className="min-h-[120px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !message.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
