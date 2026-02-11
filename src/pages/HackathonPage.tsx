import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Users, Briefcase, Calendar, Zap, Layout, Target, Trophy } from 'lucide-react';
import { cn } from "@/lib/utils";

// Custom TechCard Component
const TechCard = ({ className, children, delay = 0 }: { className?: string, children: React.ReactNode, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={cn(
        "relative group bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300",
        "hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="p-6 relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4 tracking-tight"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-slate-400 mb-6"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      className="h-1 w-24 bg-blue-500 mx-auto rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
    />
  </div>
);

const HackathonPage = () => {
  // Load Luma checkout script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.lu.ma/checkout-button.js';
    script.id = 'luma-checkout';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('luma-checkout');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            {/* Presented By */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-4 mb-8 px-6 py-0 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors"
            >
              <span className="text-slate-300 text-xs font-mono tracking-widest uppercase">Presented by</span>
              <img src="/img/byu-logo-transparent.png" alt="BYU Logo" className="h-12 md:h-16 w-auto py-1" />
              <span className="text-slate-300 text-lg font-bold">×</span>
              <img src="/img/utah-pma-icon.png" alt="Utah PMA" className="h-12 md:h-16 w-auto py-1" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tighter px-2 md:px-0 break-words"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                AI PRODUCT
              </span>
              <br />
              <span className="text-white relative drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                HACKATHON
              </span>
            </motion.h1>

            {/* Stats / Details */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-6 text-lg md:text-xl font-light">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <Calendar className="text-white" />
                <span>Feb 9th - 13th</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="flex -space-x-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-black" />
                  <div className="w-8 h-8 rounded-full bg-white/20 border border-black" />
                  <div className="w-8 h-8 rounded-full bg-white/30 border border-black" />
                </div>
                <span>Teams of 2-5</span>
              </motion.div>
            </div>

            {/* Hackathon underway */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-blue-300 text-sm md:text-base font-medium mb-6"
            >
              The hackathon is underway. View details below or see the <Link to="/hackathon/faq" className="text-white underline hover:no-underline">FAQ</Link> if you have questions.
            </motion.p>

            {/* Cash Prizes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="relative inline-block mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/15 via-yellow-400/15 to-yellow-500/15 rounded-xl blur-xl" />
                <div className="relative bg-gradient-to-br from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 rounded-xl px-8 py-3 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-mono tracking-widest uppercase">Cash Prizes</span>
                    </div>
                    <div className="h-6 w-px bg-yellow-500/30" />
                    <div className="flex items-center gap-2">
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                        $1,000
                      </span>
                      <span className="text-yellow-400/70 text-sm font-light leading-none">for the first place team</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Supporters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-3 mb-8"
            >
              <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Supported By</span>
              {(() => {
                const supporters = [
                  { name: "BYU PMA", logo: "/img/pma-logo-white.png", className: "w-full h-full object-contain", link: "https://product.byu.edu/" },
                  { name: "Figma", logo: "/img/figma-logo.png", className: "w-3/4 h-3/4 object-contain", link: "https://www.figma.com/" },
                  { name: "Utah PMA", logo: "/img/utah-pma-icon.png", className: "w-full h-full object-contain", link: "https://www.linkedin.com/company/the-product-management-association/" },
                  { name: "Verso AI", logo: "/img/verso-ai-logo.png", className: "w-full h-full object-contain", link: "https://www.versomusic.ai/" },
                  { name: "BYU UX Design Association", logo: "/img/byu-uxd-logo.png", className: "w-full h-full object-cover", link: "https://uxd.byu.edu/" },
                  { name: "AI in Business Society", logo: "/img/ai-business-logo.png", className: "w-full h-full object-cover", link: "https://www.aiinbusinesssociety.org/" },
                  { name: "Entrata", logo: "/img/entrata-logo.png", className: "w-full h-full object-contain", link: "https://www.entrata.com/" },
                  { name: "Shoreline", logo: "/img/shoreline-logo.jpeg", className: "w-full h-full object-contain", link: "https://shoreline.health/" },
                ];

                const Logo = ({ supporter, idx }: { supporter: typeof supporters[number]; idx: number }) => (
                  <div key={idx} className="relative group shrink-0 w-14 h-14 md:w-20 md:h-20">
                    <a
                      href={supporter.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors cursor-pointer overflow-hidden"
                    >
                      <img
                        src={supporter.logo}
                        alt={supporter.name}
                        className={cn("opacity-80 group-hover:opacity-100 transition-opacity", supporter.className)}
                      />
                    </a>

                    {/* Tooltip (desktop only) */}
                    <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {supporter.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
                    </div>
                  </div>
                );

                return (
                  <>
                    {/* Mobile: auto-scrolling marquee (still clickable) */}
                    <div className="w-full md:hidden overflow-hidden">
                      <div className="supporters-marquee-track flex w-max">
                        <div className="flex items-center gap-4 pr-4">
                          {supporters.map((supporter, i) => (
                            <Logo key={`${supporter.name}-${i}`} supporter={supporter} idx={i} />
                          ))}
                        </div>
                        <div className="flex items-center gap-4 pr-4" aria-hidden="true">
                          {supporters.map((supporter, i) => (
                            <Logo key={`dup-${supporter.name}-${i}`} supporter={supporter} idx={i} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop: static row */}
                    <div className="hidden md:flex items-center justify-center gap-4">
                      {supporters.map((supporter, i) => (
                        <Logo key={supporter.name} supporter={supporter} idx={i} />
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/hackathon/faq"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all duration-300"
              >
                View event details & FAQ
                <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://lu.ma/event/evt-26S8mILGH5NJMVJ"
                className="text-blue-300 hover:text-white underline text-sm"
              >
                Register on Luma (late signup)
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-6 pb-32 space-y-32">

        {/* Why Compete Grid */}
        <section>
          <SectionHeader title="WHY COMPETE?" subtitle={undefined} />

          <TechCard className="max-w-5xl mx-auto mb-8">
            <div className="space-y-4">
              <p className="text-base md:text-lg text-white leading-relaxed">
                <span className="font-bold">Do you want to practice a real PM Big Tech case interview question?</span>{" "}
                This hackathon gives you hands-on experience working in a product trio where you'll do actual PM work
                like customer discovery, validating problems, and designing solutions.
              </p>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                You'll tackle real challenges directly modeled after actual case interviews from companies like{" "}
                <span className="font-semibold text-white">Google</span>,{" "}
                <span className="font-semibold text-white">Meta</span>, and{" "}
                <span className="font-semibold text-white">Amazon</span>. Best part? You'll build hands-on experience you
                can immediately add to your resume and have concrete stories ready when interviewers ask,{" "}
                <span className="italic text-white">
                  &quot;Tell me about a time you led a cross-functional team.&quot;
                </span>
              </p>
              <div className="pt-2 border-t border-white/10">
                <p className="text-sm md:text-base text-blue-200 font-semibold">
                  This isn't just learning—it's real experience that gets you hired.
                </p>
              </div>
            </div>
          </TechCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TechCard delay={0}>
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-white">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Cross-Functional</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Learn to work cross-functionally. Collaborate with designers, PMs, and engineers.
              </p>
            </TechCard>

            <TechCard delay={1}>
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-white">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Build Your Resume</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Build a 0 to 1 project. Perfect experience for your portfolio and interviews.
              </p>
            </TechCard>

            <TechCard delay={2}>
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-white">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Solve Real Problems</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tackle actual challenges. Create viable solutions that matter.
              </p>
            </TechCard>

            <TechCard delay={3}>
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-white">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Win Prizes</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Compete for a prize pool of $1,000 for the first place team. Show off your skills and win big.
              </p>
            </TechCard>
          </div>
        </section>

        {/* Format Section */}
        <section>
          <SectionHeader title="THE FORMAT" subtitle={undefined} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard>
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="text-blue-400" size={20} /> Teams
                </h3>
                <ul className="space-y-3 text-gray-400 flex-1 mb-4">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>2-5 Members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Rec: PM + UXD + ENG</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 italic border-t border-white/10 pt-3">
                  No team? Register alone and we'll group you.
                </p>
              </div>
            </TechCard>

            <TechCard>
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-purple-400" size={20} /> Duration
                </h3>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-5xl font-mono font-bold text-white mb-2">5<span className="text-lg text-gray-500 ml-2">DAYS</span></div>
                  <p className="text-gray-400 text-sm">Mon-Fri Intense Sprint</p>
                </div>
              </div>
            </TechCard>

            <TechCard className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layout className="text-emerald-400" size={20} /> Deliverables
                </h3>
                <ul className="space-y-3 text-gray-400 flex-1">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Working Prototype</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Live Demo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Product Strategy Slide Deck</span>
                  </li>
                </ul>
              </div>
            </TechCard>
          </div>
        </section>

        {/* Schedule */}
        <section className="max-w-4xl mx-auto">
          <SectionHeader title="SCHEDULE" subtitle={undefined} />
          <div className="space-y-4">
            <TechCard className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="min-w-[120px] text-center md:text-left">
                <div className="text-sm text-white font-bold uppercase tracking-wider">Day 1</div>
                <div className="text-2xl font-bold">Feb 9</div>
              </div>
              <div className="h-px w-full md:w-px md:h-12 bg-white/10" />
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-bold">Kickoff (Virtual)</h4>
                <p className="text-gray-400 text-sm">
                  Kickoff was Monday 6–7 PM. If you missed it, check Luma for the recording or event updates. Still want to join?{" "}
                  <a
                    href="https://lu.ma/event/evt-26S8mILGH5NJMVJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    Register on Luma
                  </a>
                  .
                </p>
              </div>
            </TechCard>

            <TechCard className="flex flex-col md:flex-row gap-6 md:items-center border-white/5 bg-white/5">
              <div className="min-w-[120px] text-center md:text-left">
                <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Days 2-4</div>
                <div className="text-2xl font-bold text-gray-400">Build</div>
              </div>
              <div className="h-px w-full md:w-px md:h-12 bg-white/10" />
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-bold text-gray-300">Async Hacking</h4>
                <p className="text-gray-500 text-sm">Everything due 9:00 AM Friday.</p>
              </div>
            </TechCard>

            <TechCard className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="min-w-[120px] text-center md:text-left">
                <div className="text-sm text-white font-bold uppercase tracking-wider">Day 5</div>
                <div className="text-2xl font-bold">Feb 13</div>
              </div>
              <div className="h-px w-full md:w-px md:h-12 bg-white/10" />
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-bold">Presentations & Awards (In Person)</h4>
                <p className="text-gray-400 text-sm">
                  Friday 2–5 PM at the{" "}
                  <a
                    href="https://maps.app.goo.gl/JXtXjyco5ayW6tcs7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    Kiln.
                  </a>
                  {" "}Food will be provided.
                </p>
              </div>
            </TechCard>
          </div>
        </section>

        {/* Judges Section */}
        <section>
          <SectionHeader title="JUDGES" subtitle={undefined} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Jonathan Bernal", position: "Co-Founder", company: "Verso AI (ex-Google)", photo: "/img/judge-jonathan.jpeg", linkedin: "https://www.linkedin.com/in/jonathan-ray-bernal/" },
              { name: "Jacob Draper", position: "Sr. Product Manager", company: "Adobe", photo: "/img/judge-jacob.jpeg", linkedin: "https://www.linkedin.com/in/jakerdraper/" },
              { name: "Stephen Dangerfield", position: "Sr. Director of Product", company: "Entrata", photo: "/img/judge-stephen.jpeg", linkedin: "https://www.linkedin.com/in/stephen-dangerfield/" },
              { name: "Claire McGregor", position: "Digital Product Designer", company: "Vivint", photo: "/img/judge-claire.jpeg", linkedin: "https://www.linkedin.com/in/claire-mcgregor-1913aa247/" },
              { name: "Alex Hui", position: "Head of Consumer Product", company: "Airbnb", photo: "/img/judge-alec.jpeg", linkedin: "https://www.linkedin.com/in/alexghui/" },
              { name: "Aaron Davis", position: "Customer Engineer, AI/ML", company: "Google", photo: "/img/judge-aaron.jpeg", linkedin: "https://www.linkedin.com/in/airin/" },
            ].map((judge, idx) => (
              <TechCard key={idx} delay={idx}>
                <a href={judge.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-white/10 border border-white/10 overflow-hidden mb-4">
                    {judge.photo ? (
                      <img src={judge.photo} alt={judge.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{judge.name}</h3>
                  <p className="text-sm text-blue-400">{judge.position}</p>
                  <p className="text-sm text-white/80 font-semibold">{judge.company}</p>
                </a>
              </TechCard>
            ))}
          </div>
        </section>

        {/* Register Section */}
        <section className="max-w-4xl mx-auto">
          <SectionHeader title="REGISTER" subtitle={undefined} />
          <div className="w-full">
            <iframe
              src="https://lu.ma/embed/event/evt-26S8mILGH5NJMVJ/simple"
              width="100%"
              height="450"
              frameBorder="0"
              style={{ border: '1px solid #bfcbda88', borderRadius: '12px' }}
              allow="fullscreen; payment"
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </section>

        {/* FAQ link */}


        {/* Footer CTA */}
        <section className="text-center pt-20">
          <h2 className="text-3xl font-bold mb-8">Ready to ship?</h2>
          <Link
            to="/hackathon/faq"
            className="inline-block bg-white text-black hover:bg-gray-200 text-lg px-12 py-5 font-bold rounded-full transition-colors"
          >
            View event details & FAQ
          </Link>
        </section>

      </div>
    </div>
  );
};

export default HackathonPage;
