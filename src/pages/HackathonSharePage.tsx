import { motion } from "framer-motion";
import { Copy, QrCode, Share2 } from "lucide-react";
import { useMemo, useState } from "react";

const HackathonSharePage = () => {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://product.byu.edu/hackathon";
    return `${window.location.origin}/hackathon`;
  }, []);

  const qrImageUrl = useMemo(() => {
    if (typeof window === "undefined") return "/img/hackathon-qr-code.png";
    return `${window.location.origin}/img/hackathon-qr-code.png`;
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // If clipboard API fails, fall back to selecting text (not critical)
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-5">
              <Share2 className="w-4 h-4 text-blue-300" />
              <span className="text-xs font-mono tracking-widest uppercase text-slate-200/90">
                Share the Hackathon
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Invite your friends in 10 seconds
            </h1>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
              Copy the link or pull up the QR code on your phone—then send it in a group chat.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Share link card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
              className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Copy className="w-4 h-4 text-blue-300" />
                  <h2 className="font-bold text-lg">Send this link</h2>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4 font-mono text-sm break-all text-slate-200">
                  {shareUrl}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors font-semibold"
                  >
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                  <a
                    href="/hackathon"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-semibold"
                  >
                    View hackathon page
                  </a>
                </div>
              </div>
            </motion.div>

            {/* QR card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="w-4 h-4 text-blue-300" />
                  <h2 className="font-bold text-lg">Show this QR code</h2>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-white/10 flex items-center justify-center">
                  <img
                    src="/img/hackathon-qr-code.png"
                    alt="Hackathon QR code"
                    className="w-full max-w-[320px] h-auto"
                    loading="eager"
                  />
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href="/img/hackathon-qr-code.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-semibold"
                  >
                    Open QR image
                  </a>
                  <a
                    href={qrImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-semibold"
                  >
                    Copy image URL
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-center text-sm text-slate-400"
          >
            Tip: posting in class/slack? Paste the link and add “Teams of 2–5, all majors welcome.”
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default HackathonSharePage;
