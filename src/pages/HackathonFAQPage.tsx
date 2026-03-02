import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

type FAQEntry = { id: string; question: string; answer: string; order?: number };

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function isUrl(s: string): boolean {
  return s.startsWith('http://') || s.startsWith('https://');
}

function linkifyAnswer(text: string): React.ReactNode {
  const parts = text.split(URL_REGEX);
  return (
    <>
      {parts.map((part, i) =>
        isUrl(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{question}</span>
        <ChevronDown
          className={cn(
            'text-on-dark-muted transition-transform duration-300',
            isOpen ? 'rotate-180 text-blue-400' : ''
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-on-dark-muted text-sm leading-relaxed whitespace-pre-line">
              {linkifyAnswer(answer)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HackathonFAQPage = () => {
  const [faqs, setFaqs] = useState<FAQEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: supabaseError } = await supabase
          .from('faq_items')
          .select('id, question, answer, sort_order, is_public')
          .eq('is_public', true)
          .order('sort_order', { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        const entries: FAQEntry[] =
          data?.map((row) => ({
            id: row.id,
            question: row.question ?? '',
            answer: row.answer ?? '',
            order: row.sort_order ?? undefined,
          })).filter((e) => e.question || e.answer) ?? [];

        setFaqs(entries);
      } catch (err) {
        console.error('Error fetching FAQ:', err);
        setError('Failed to load FAQ. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-32 pb-24 relative z-10">
        <Link
          to="/hackathon"
          className="inline-flex items-center gap-2 text-on-dark-muted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to hackathon
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">Hackathon FAQ</h1>
        <p className="text-on-dark-muted mb-12">Answers to common questions. We update this regularly.</p>

        {loading && (
          <div className="text-on-dark-muted">Loading FAQ…</div>
        )}

        {error && (
          <div className="text-red-400 mb-6">{error}</div>
        )}

        {!loading && !error && faqs.length === 0 && (
          <div className="text-on-dark-muted">No FAQ entries yet. Check back soon.</div>
        )}

        {!loading && faqs.length > 0 && (
          <div className="max-w-4xl rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden">
            <div className="p-6">
              {faqs.map((entry) => (
                <FAQItem key={entry.id} question={entry.question} answer={entry.answer} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonFAQPage;
