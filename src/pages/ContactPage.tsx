import React from 'react';
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
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection animation="slide-up" delay={100}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground">Email</h3>
                        <a href="mailto:pma@byu.edu" className="text-muted-foreground hover:text-primary transition-colors">pm-assoc@byu.edu</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground">Meeting Location</h3>
                        <p className="text-muted-foreground">Tanner Building, Room W310<br /></p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground">Meeting Time</h3>
                        <p className="text-muted-foreground">Wednesdays<br />5:30 PM - Food for paying members<br />6:00 PM - 7:00 PM - Meeting</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
                  <div className="flex space-x-4">
                    <a href="https://www.linkedin.com/company/byu-pma/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted/70 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="https://instagram.com/byupmassociation" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted/70 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          
            <AnimatedSection animation="slide-up" delay={200}>
              <div className="bg-card/80 border border-border rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 text-card-foreground">Send us a Message</h2>
                <form>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
                        <input 
                          type="text" 
                          id="first-name" 
                          className="block w-full bg-muted/50 border border-border rounded-md px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
                        <input 
                          type="text" 
                          id="last-name" 
                          className="block w-full bg-muted/50 border border-border rounded-md px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="block w-full bg-muted/50 border border-border rounded-md px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        placeholder="johndoe@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        className="block w-full bg-muted/50 border border-border rounded-md px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
                      <textarea 
                        id="message" 
                        rows={6} 
                        className="block w-full bg-muted/50 border border-border rounded-md px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        placeholder="Your message..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#215096] to-[#4299E1] text-white py-3 rounded-md hover:opacity-90 transition-opacity font-medium"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
