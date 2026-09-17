import AnimatedSection from '@/components/AnimatedSection';

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or want to get involved? We'd love to hear from you.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={100}>
          <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-12">
            <div className="flex items-start text-left">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">Email</h3>
                <a href="mailto:pma@byu.edu" className="text-muted-foreground hover:text-primary transition-colors">pm-assoc@byu.edu</a>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
              <div className="flex justify-center space-x-6">
                <a href="https://join.slack.com/t/byu-pma/shared_invite/zt-4a760gf8j-aObyA0ZHlvDNJbOA19Yk5A" target="_blank" rel="noopener noreferrer" aria-label="Join BYU PMA on Slack" className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted/70 transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.843 0a2.522 2.522 0 0 0-2.517 2.522 2.522 2.522 0 0 0 2.517 2.523h2.522V2.522A2.522 2.522 0 0 0 8.843 0Zm0 6.729H2.522A2.522 2.522 0 0 0 0 9.251a2.522 2.522 0 0 0 2.522 2.523h6.32a2.522 2.522 0 0 0 2.523-2.523A2.522 2.522 0 0 0 8.843 6.73Zm14.634 2.522a2.522 2.522 0 0 0-2.522-2.522 2.522 2.522 0 0 0-2.523 2.522v2.523h2.523a2.522 2.522 0 0 0 2.522-2.523Zm-6.729 0V2.522A2.522 2.522 0 0 0 14.226 0a2.522 2.522 0 0 0-2.522 2.522v6.729a2.522 2.522 0 0 0 2.522 2.523 2.522 2.522 0 0 0 2.522-2.523ZM14.226 24a2.522 2.522 0 0 0 2.522-2.523 2.522 2.522 0 0 0-2.522-2.522h-2.522v2.522A2.522 2.522 0 0 0 14.226 24Zm0-6.729h6.32a2.522 2.522 0 0 0 2.523-2.522 2.522 2.522 0 0 0-2.522-2.523h-6.32a2.522 2.522 0 0 0-2.523 2.523 2.522 2.522 0 0 0 2.522 2.522ZM0 14.749a2.522 2.522 0 0 0 2.522 2.522 2.522 2.522 0 0 0 2.523-2.522v-2.522H2.522A2.522 2.522 0 0 0 0 14.749Zm6.729 0v6.728A2.522 2.522 0 0 0 9.251 24a2.522 2.522 0 0 0 2.523-2.523v-6.728a2.522 2.522 0 0 0-2.523-2.523 2.522 2.522 0 0 0-2.522 2.523Z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/byu-pma/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="BYU PMA on LinkedIn" className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted/70 transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://instagram.com/byupmassociation" target="_blank" rel="noopener noreferrer" aria-label="BYU PMA on Instagram" className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted/70 transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ContactPage;
