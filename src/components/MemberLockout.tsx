import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail, CheckCircle2 } from "lucide-react";

interface MemberLockoutProps {
  title?: string;
  description?: string;
  features?: string[];
  previewUrl?: string;
}

const MemberLockout = ({ 
  title = "PMA Members Only", 
  description = "This feature is exclusively available to verified PMA members.",
  features,
  previewUrl
}: MemberLockoutProps) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
      <div className={`w-full ${features || previewUrl ? 'max-w-4xl' : 'max-w-md'}`}>
        <Card className="border-amber-500/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className={`flex flex-col ${features || previewUrl ? 'md:flex-row' : ''}`}>
            
            <CardContent className={`pt-10 pb-8 px-8 flex flex-col items-center justify-center text-center relative z-10 ${features || previewUrl ? 'md:w-1/2 border-b md:border-b-0 md:border-r border-border/50 bg-muted/10' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 shadow-sm">
                <Lock className="w-8 h-8 text-amber-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                {description} To access the member directory, job boards, and premium tools, please join PMA.
              </p>
              
              <div className="w-full space-y-3 max-w-sm">
                <Button 
                  onClick={() => window.open("https://clubs.byu.edu/link/club/18295873486206095", "_blank")}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm font-semibold"
                  size="lg"
                >
                  Join PMA (Pay Dues)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full font-medium" 
                  asChild
                >
                  <Link to="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 w-full text-left max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-background border border-border/50 p-1.5 rounded-lg shrink-0 shadow-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Already paid?</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We process approvals in batches. If it's been a few days, please email <a href="mailto:byupmsociety@gmail.com" className="font-semibold text-primary/80 underline hover:text-primary transition-colors">byupmsociety@gmail.com</a>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            {(features || previewUrl) && (
              <CardContent className="pt-10 pb-8 px-8 flex flex-col justify-center relative z-10 md:w-1/2 bg-card">
                <h4 className="font-semibold text-lg tracking-tight mb-6">What you're missing out on:</h4>
                
                {features && features.length > 0 && (
                  <ul className="space-y-4 mb-8">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-sm font-medium text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {previewUrl && (
                  <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm relative group">
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10 hidden group-hover:flex items-center justify-center transition-all">
                      <Lock className="w-8 h-8 text-foreground/50 drop-shadow-md" />
                    </div>
                    <img src={previewUrl} alt="Feature preview" className="w-full h-auto object-cover opacity-80" />
                  </div>
                )}
                
                {!previewUrl && features && (
                  <div className="mt-auto pt-6 border-t border-border/50">
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
                      <p className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                        Join hundreds of other BYU students who are actively using these tools to land their dream product management roles.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
            
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MemberLockout;
