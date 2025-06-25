"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="px-[5%] py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">Get in Touch</h1>
            <p className="font-inter text-xl text-black/80">
              Have questions about astrology or need help with our platform? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black">
              {/* Contact Form */}
              <div className="p-10 border-r border-black" style={{ backgroundColor: '#6bdbff' }}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-black flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="font-space-grotesk text-2xl font-bold text-black">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="astrology">Astrology Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 px-8 border-2 border-black font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Message</span>
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="p-10" style={{ backgroundColor: '#f2e356' }}>
                <div className="space-y-8">
                  {/* Quick Contact */}
                  <div>
                    <h3 className="font-space-grotesk text-2xl font-bold text-black mb-6">Quick Contact</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-black flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-inter font-semibold text-black">Email Support</h4>
                          <p className="font-inter text-black/80">hello@luckstrology.com</p>
                          <p className="font-inter text-sm text-black/60">We typically respond within 24 hours</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-black flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-inter font-semibold text-black">Community Forum</h4>
                          <p className="font-inter text-black/80">Join our discussions</p>
                          <Link href="/discussions" className="font-inter text-sm text-black hover:text-black/70 font-medium">
                            Visit Discussions →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-white border border-black p-6">
                    <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Quick Answers</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-inter font-semibold text-black text-sm mb-1">Is Luckstrology free to use?</h4>
                        <p className="font-inter text-xs text-black/70">Yes! Our core features including natal chart generation are completely free.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-inter font-semibold text-black text-sm mb-1">How accurate are the calculations?</h4>
                        <p className="font-inter text-xs text-black/70">We use astronomy-engine for professional-grade precision (±1 arcminute).</p>
                      </div>
                      
                      <div>
                        <h4 className="font-inter font-semibold text-black text-sm mb-1">Do I need to create an account?</h4>
                        <p className="font-inter text-xs text-black/70">No account required! Your data is automatically saved in your browser.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}