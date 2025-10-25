import { motion } from 'motion/react';
import { Linkedin, Github, Mail, Twitter } from 'lucide-react';
import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/server/contact`;
      console.log('🔵 Sending contact form to:', url);
      console.log('📦 Form data:', formData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📬 Contact response:', response.status, response.statusText);
      
      let data;
      try {
        data = await response.json();
        console.log('📄 Contact response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse contact response:', parseError);
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      if (response.ok && data.success) {
        console.log('✅ Contact form sent successfully');
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        console.error('❌ Failed to send message:', data.error);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen py-24 md:py-40 px-4 md:px-8 flex items-center justify-center">
      <div className="w-full max-w-[720px]">
        {/* Title */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-16 md:mb-32">
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full"></div>
          <h2 className="text-[32px] md:text-[42px] font-['Solway'] text-[#474747] whitespace-nowrap">Let's talk</h2>
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-16 md:space-y-28"
        >
          {/* Email and Socials */}
          <div className="text-center space-y-6">
            <a 
              href="mailto:gahimaaristote1@gmail.com"
              className="font-['Gaegu'] text-[24px] md:text-[38px] text-[#474747] leading-[1.5] hover:underline block break-all"
            >
              gahimaaristote1@gmail.com
            </a>
            
            <div className="flex justify-center gap-4">
              {[
                { icon: Linkedin, href: 'https://www.linkedin.com/in/gahima-aristote/' },
                { icon: Github, href: 'https://github.com/Aristote-code' },
                { icon: Mail, href: 'mailto:gahimaaristote1@gmail.com' },
                { icon: Twitter, href: 'https://x.com/GAristote' }
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl border-2 border-[#474747] flex items-center justify-center hover:bg-[#474747] hover:text-white transition-all duration-300 group"
                >
                  <link.icon className="w-5 h-5 text-[#474747] group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                  required
                  className="w-full px-4 py-3 h-[50px] border-2 border-[#474747] rounded-2xl focus:outline-none focus:border-[#8774ff] font-['Gaegu'] text-[18px] md:text-[20px] text-[#474747] placeholder:text-[#b8bbd2] transition-colors"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={100}
                  required
                  className="w-full px-4 py-3 h-[50px] border-2 border-[#474747] rounded-2xl focus:outline-none focus:border-[#8774ff] font-['Gaegu'] text-[18px] md:text-[20px] text-[#474747] placeholder:text-[#b8bbd2] transition-colors"
                />
              </div>
            </div>
            
            <div className="relative">
              <textarea
                placeholder="Message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                maxLength={2000}
                required
                className="w-full px-4 py-3 border-2 border-[#474747] rounded-2xl focus:outline-none focus:border-[#8774ff] resize-none font-['Gaegu'] text-[18px] md:text-[20px] text-[#474747] placeholder:text-[#b8bbd2] transition-colors"
              ></textarea>
            </div>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border-2 border-green-200 rounded-2xl px-4 py-3 text-center"
              >
                <p className="font-['Gaegu'] text-[18px] text-green-700">
                  ✨ Message sent successfully! I'll get back to you soon.
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 text-center"
              >
                <p className="font-['Gaegu'] text-[18px] text-red-700">
                  ❌ Failed to send message. Please try again or email me directly.
                </p>
              </motion.div>
            )}
            
            <div className="relative">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                className="w-full bg-[#474747] text-white h-[40px] rounded-2xl hover:bg-[#5a5a5a] disabled:bg-[#d0d0d0] disabled:cursor-not-allowed transition-colors font-['Gaegu'] text-[18px] md:text-[20px] leading-[28px] flex items-center justify-center"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center pt-12 md:pt-16">
            <p className="font-['Gaegu'] text-[20px] md:text-[24px] text-[#474747] leading-[1.6]">
              ©2025 <a href="#" className="text-[#8774ff] underline hover:text-[#6b5ce7] transition-colors">Aristote</a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
