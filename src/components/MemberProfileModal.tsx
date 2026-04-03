import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Linkedin,
  GraduationCap,
  Briefcase,
  Coffee,
  Building2,
  Copy,
  Check,
  Mail,
} from "lucide-react";
import { useState } from "react";

interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  school_year: string | null;
  recruiting_stage: string | null;
  target_roles: string[] | null;
  linkedin_url: string | null;
  bio: string | null;
  is_alumni: boolean | null;
  open_to_coffee_chats: boolean | null;
  current_company: string | null;
  email: string | null;
  role: string | null;
}

interface MemberProfileModalProps {
  member: MemberProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberProfileModal({ member, isOpen, onClose }: MemberProfileModalProps) {
  const [copied, setCopied] = useState(false);

  if (!member) return null;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (member.email) {
      navigator.clipboard.writeText(member.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-background">
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 h-24 w-full relative">
          {member.open_to_coffee_chats && (
            <Badge className="absolute top-4 right-4 bg-primary/20 text-primary hover:bg-primary/30 border-transparent">
              <Coffee className="w-3 h-3 mr-1" />
              Open to chats
            </Badge>
          )}
        </div>
        
        <div className="px-6 pb-6 relative">
          <Avatar className="w-20 h-20 border-4 border-background absolute -top-10 outline outline-1 outline-border">
            <AvatarImage src={member.avatar_url || ""} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {member.full_name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>

          <div className="mt-12">
            <div className="flex justify-between items-start gap-4">
              <div>
                <DialogTitle className="text-2xl font-bold">{member.full_name || "Anonymous"}</DialogTitle>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  {member.is_alumni && (
                    <Badge variant="outline" className="text-xs font-normal">Alumni</Badge>
                  )}
                  {member.role === 'admin' && (
                    <Badge variant="default" className="text-[10px] uppercase font-bold py-0 h-4">Admin</Badge>
                  )}
                </div>
              </div>

              {member.linkedin_url && (
                <Button variant="outline" size="icon" asChild className="rounded-full shrink-0">
                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  </a>
                </Button>
              )}
            </div>

            <div className="space-y-4 mt-6">
              {member.email && (
                <div 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors group"
                  onClick={handleCopyEmail}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate">{member.email}</span>
                  </div>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {member.school_year && (
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wider">Year</span>
                    </div>
                    <span className="text-sm font-medium">{member.school_year}</span>
                  </div>
                )}
                {member.current_company && (
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wider">Company</span>
                    </div>
                    <span className="text-sm font-medium">{member.current_company}</span>
                  </div>
                )}
              </div>

              {member.target_roles && member.target_roles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground px-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Target Roles</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.target_roles.map((role, idx) => (
                      <Badge key={idx} variant="secondary" className="font-normal border-transparent">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {member.bio && (
                <div className="space-y-2 pt-2 border-t">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">About</span>
                  <p className="text-sm text-foreground/90 leading-relaxed px-1">
                    {member.bio}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
