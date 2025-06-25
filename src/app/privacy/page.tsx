"use client";

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-20 py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">Privacy Policy</h1>
            <p className="font-inter text-xl text-black/80">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="font-inter text-sm text-black/60 mt-4">Last updated: December 6, 2024</p>
          </div>
        </section>

        {/* Quick Overview */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-12" style={{ backgroundColor: '#f0e3ff' }}>
            <div>
              <h2 className="font-space-grotesk text-3xl font-bold text-black mb-8 text-center">Privacy at a Glance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
                <div className="flex items-start space-x-3 p-6 border-r border-b border-black bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">No Account Required</h3>
                    <p className="font-inter text-sm text-black/70">Use our service without creating an account</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-6 border-b border-black bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">Local Storage First</h3>
                    <p className="font-inter text-sm text-black/70">Your data stays in your browser when possible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-6 border-r border-black bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">You Control Your Data</h3>
                    <p className="font-inter text-sm text-black/70">Delete your information anytime</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-6 bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-black">No Selling of Data</h3>
                    <p className="font-inter text-sm text-black/70">We never sell your personal information</p>
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
            {/* Information We Collect */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-inter text-lg font-semibold text-black mb-3">Birth Data</h3>
                  <p className="font-inter text-black/80 mb-3">
                    To generate your natal chart, we collect:
                  </p>
                  <ul className="list-disc list-inside font-inter text-black/80 space-y-1 ml-4">
                    <li>Date of birth</li>
                    <li>Time of birth</li>
                    <li>Location of birth (city/coordinates)</li>
                  </ul>
                  <p className="font-inter text-sm text-black/60 mt-3">
                    This information is stored locally in your browser&apos;s IndexedDB and only transmitted to our servers for chart calculation.
                  </p>
                </div>

                <div>
                  <h3 className="font-inter text-lg font-semibold text-black mb-3">Optional Information</h3>
                  <p className="font-inter text-black/80 mb-3">
                    If you choose to sign in with Google, we may collect:
                  </p>
                  <ul className="list-disc list-inside font-inter text-black/80 space-y-1 ml-4">
                    <li>Email address</li>
                    <li>Name</li>
                    <li>Profile picture</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-inter text-lg font-semibold text-black mb-3">Technical Information</h3>
                  <p className="font-inter text-black/80 mb-3">
                    We automatically collect certain technical information:
                  </p>
                  <ul className="list-disc list-inside font-inter text-black/80 space-y-1 ml-4">
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>IP address (anonymized)</li>
                    <li>Usage patterns (anonymized)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">How We Use Your Information</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-inter font-semibold text-black">Chart Generation</h3>
                  <p className="font-inter text-black/80">Your birth data is used solely to calculate and generate your astrological charts using astronomy-engine.</p>
                </div>
                
                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-inter font-semibold text-black">Service Improvement</h3>
                  <p className="font-inter text-black/80">Anonymized usage data helps us improve our platform and add new features.</p>
                </div>
                
                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-inter font-semibold text-black">Communication</h3>
                  <p className="font-inter text-black/80">If you contact us, we use your email to respond to your inquiries.</p>
                </div>
                
                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-inter font-semibold text-black">Legal Compliance</h3>
                  <p className="font-inter text-black/80">We may process data to comply with legal obligations or protect our rights.</p>
                </div>
              </div>
            </section>

            {/* Data Storage and Security */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">Data Storage and Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-inter text-lg font-semibold text-black mb-3">Where Your Data Lives</h3>
                  <ul className="space-y-2 font-inter text-black/80">
                    <li className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Primarily:</strong> Your browser&apos;s local storage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Temporarily:</strong> Our servers for chart calculation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Optional:</strong> Our database (if you create an account)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-inter text-lg font-semibold text-black mb-3">Security Measures</h3>
                  <ul className="space-y-2 font-inter text-black/80">
                    <li className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>HTTPS encryption for all communications</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Encrypted database storage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Regular security audits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Limited access controls</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">Your Rights and Choices</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="space-y-0">
                  <div className="p-6 border border-black" style={{ backgroundColor: '#6bdbff' }}>
                    <h3 className="font-inter font-semibold text-black mb-2">Access Your Data</h3>
                    <p className="font-inter text-sm text-black/80">View all information we have about you at any time through your profile page.</p>
                  </div>
                  
                  <div className="p-6 border-l border-r border-b border-black" style={{ backgroundColor: '#51bd94' }}>
                    <h3 className="font-inter font-semibold text-black mb-2">Update Information</h3>
                    <p className="font-inter text-sm text-black/80">Correct or update your birth data and personal information directly in the app.</p>
                  </div>
                </div>
                
                <div className="space-y-0">
                  <div className="p-6 border-t border-r border-b border-black" style={{ backgroundColor: '#ff91e9' }}>
                    <h3 className="font-inter font-semibold text-black mb-2">Delete Your Data</h3>
                    <p className="font-inter text-sm text-black/80">Remove all your information from our systems permanently at any time.</p>
                  </div>
                  
                  <div className="p-6 border-r border-b border-black" style={{ backgroundColor: '#f2e356' }}>
                    <h3 className="font-inter font-semibold text-black mb-2">Data Portability</h3>
                    <p className="font-inter text-sm text-black/80">Export your data in a machine-readable format to use elsewhere.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            </div>
          </section>
        </div>
        
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-16" style={{ backgroundColor: '#f0e3ff' }}>
            <div className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">Questions About Privacy?</h2>
              <p className="font-inter text-black/80 mb-6">
                If you have any questions about this privacy policy or how we handle your data, 
                please don&apos;t hesitate to reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 border-2 border-black font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Us</span>
                </a>
                <a 
                  href="mailto:privacy@luckstrology.com" 
                  className="inline-flex items-center space-x-2 bg-transparent text-black px-8 py-4 border-2 border-black font-semibold transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span>privacy@luckstrology.com</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}