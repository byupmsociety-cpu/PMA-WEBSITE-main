import QRCode from "react-qr-code";
import { ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDO_URL = "https://app.sli.do/event/gkTW5AtctkcmiRKUXhNEy8";

const AskPage = () => (
  <main className="container mx-auto px-4 pt-32 pb-20">
    <div className="max-w-xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 mb-5">
        <MessageSquare className="w-4 h-4" />
        <span className="text-xs font-semibold tracking-widest uppercase">Live Q&amp;A</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Have a question?</h1>
      <p className="mt-4 text-muted-foreground">
        Scan the QR code or tap the button below to submit a question and vote on others.
      </p>

      <div className="mt-10 mx-auto w-full max-w-[360px] rounded-2xl bg-white p-6 border shadow-sm">
        <QRCode value={SLIDO_URL} size={320} level="M" className="w-full h-auto" />
      </div>

      <Button asChild size="lg" className="mt-10">
        <a href={SLIDO_URL} target="_blank" rel="noopener noreferrer">
          Click here to submit a question
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </Button>
    </div>
  </main>
);

export default AskPage;
