"use client";

import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="px-[5%] py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">Terms of Service</h1>
            <p className="font-inter text-xl text-black/80">
              These terms govern your use of Luckstrology. By using our service, you agree to these terms.
            </p>
            <p className="font-inter text-sm text-black/60 mt-4">Last updated: December 6, 2024</p>
          </div>
        </section>

        {/* Quick Summary */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-12" style={{ backgroundColor: '#f0e3ff' }}>
            <div>
              <h2 className="font-space-grotesk text-3xl font-bold text-black mb-6 text-center">Terms Summary</h2>
              <p className="font-inter text-black/80 mb-8 text-center">
                We want to keep things simple and fair. Here&apos;s what you need to know:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
                <div className="flex items-start space-x-3 p-6 border-r border-b border-black bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">Free to Use</h3>
                    <p className="font-inter text-sm text-black/70">Core features are always free</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-6 border-b border-black bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">Be Respectful</h3>
                    <p className="font-inter text-sm text-black/70">Treat others kindly in our community</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-6 border-r border-black bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">Entertainment Only</h3>
                    <p className="font-inter text-sm text-black/70">Astrology is for guidance, not life decisions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-6 bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">Your Data is Safe</h3>
                    <p className="font-inter text-sm text-black/70">We protect your privacy and information</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Main Content */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-12">
            <div className="space-y-12">
            {/* Acceptance of Terms */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">1. Acceptance of Terms</h2>
              <div className="space-y-4 font-inter text-black/80">
                <p>
                  By accessing or using Luckstrology (&quot;the Service&quot;), you agree to be bound by these Terms of Service 
                  and our Privacy Policy. If you do not agree to these terms, please do not use our service.
                </p>
                <p>
                  We may update these terms from time to time. Continued use of the service after changes 
                  constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">2. Description of Service</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Luckstrology is a web-based platform that provides:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Natal chart generation based on birth data</li>
                  <li>Astrological interpretations and insights</li>
                  <li>Community discussion forums</li>
                  <li>Educational resources about astrology</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Important Disclaimer</h3>
                      <p className="text-sm text-gray-700">
                        Our service is provided for entertainment and educational purposes only. 
                        Astrological information should not be used as a substitute for professional advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">3. User Responsibilities</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Keep your login credentials secure if you create an account</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>You are responsible for all activities under your account</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Guidelines</h3>
                  <p className="text-gray-600 mb-3">When participating in discussions, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Be respectful and kind to other users</li>
                    <li>Not post harmful, offensive, or illegal content</li>
                    <li>Not spam or send unsolicited messages</li>
                    <li>Respect others&apos; privacy and personal information</li>
                    <li>Not impersonate others or create fake accounts</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Uses</h3>
                  <p className="text-gray-600 mb-3">You may not use our service to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Violate any laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Distribute malware or harmful code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use automated tools to scrape or harvest data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">4. Privacy and Data</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand 
                  how we collect, use, and protect your information.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Key Privacy Points:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Birth data is stored locally in your browser when possible</li>
                    <li>We never sell your personal information</li>
                    <li>You can delete your data at any time</li>
                    <li>We use industry-standard security measures</li>
                  </ul>
                </div>
                <p>
                  By using our service, you consent to the collection and use of information 
                  as described in our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">5. Disclaimers and Limitations</h2>
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">⚠️ Important Disclaimers</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Entertainment Purpose:</strong> Luckstrology is provided for entertainment 
                      and educational purposes only. Astrological information should not be considered 
                      factual or used for making important life decisions.
                    </p>
                    <p>
                      <strong>No Professional Advice:</strong> Our service does not provide medical, 
                      legal, financial, or professional advice. Consult qualified professionals for 
                      such matters.
                    </p>
                    <p>
                      <strong>Accuracy:</strong> While we strive for accuracy in our calculations, 
                      we cannot guarantee the completeness or accuracy of all information provided.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Availability</h3>
                  <p className="text-gray-600">
                    We strive to keep our service available 24/7, but we cannot guarantee uninterrupted 
                    access. We may temporarily suspend the service for maintenance, updates, or due to 
                    circumstances beyond our control.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                  <p className="text-gray-600">
                    To the fullest extent permitted by law, Luckstrology shall not be liable for any 
                    indirect, incidental, special, or consequential damages arising from your use of 
                    our service.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">6. Intellectual Property</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The Luckstrology platform, including its design, code, content, and features, 
                  is owned by us and protected by copyright, trademark, and other intellectual 
                  property laws.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">What You Can Do:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                      <li>Use our service for personal purposes</li>
                      <li>Share your own chart interpretations</li>
                      <li>Participate in community discussions</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">What You Cannot Do:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                      <li>Copy or redistribute our platform</li>
                      <li>Reverse engineer our code</li>
                      <li>Use our content commercially without permission</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">7. Termination</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  You may stop using our service at any time. If you have an account, you can 
                  delete it and all associated data through your profile settings.
                </p>
                <p>
                  We reserve the right to suspend or terminate access to our service for users 
                  who violate these terms or engage in harmful behavior.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Upon Termination:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Your access to the service will be revoked</li>
                    <li>Your data will be deleted according to our privacy policy</li>
                    <li>These terms will no longer apply to you</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            </div>
          </section>
        </div>
        
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-16" style={{ backgroundColor: '#f0e3ff' }}>
            <div className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">8. Contact Us</h2>
              <p className="font-inter text-black/80 mb-6">
                If you have questions about these terms or need to report a violation, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 border-2 border-black font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Form</span>
                </a>
                <a 
                  href="mailto:legal@luckstrology.com" 
                  className="inline-flex items-center space-x-2 bg-transparent text-black px-8 py-4 border-2 border-black font-semibold transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span>legal@luckstrology.com</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}