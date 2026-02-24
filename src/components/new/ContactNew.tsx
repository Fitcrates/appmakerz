import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useEmailForm } from '../../hooks/useEmailForm';
import SpotlightText from './SpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const ContactNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { formData, isSubmitting, isSuccess, handleSubmit, handleChange } = useEmailForm();
  const { language } = useLanguage();
  const t = translations[language].contact;

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-20 lg:py-24 bg-indigo-950 overflow-hidden"
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1e1b4b',
            color: '#fff',
            border: '1px solid rgba(94, 234, 212, 0.3)',
          },
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-6 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
            {t.label}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Heading and info */}
          <div>
            {/* Main heading */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SpotlightText as="h2" className="text-4xl sm:text-5xl lg:text-7xl font-light font-jakarta leading-[1.1] pb-2 " glowSize={150}>
                  {t.heading}
                </SpotlightText>
              </motion.div>
            </div>

            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <span className="text-xs text-teal-300 font-jakarta tracking-widest uppercase block mb-2">
                  {t.info.email.label}
                </span>
                <a
                  href="mailto:aeonofshreds@gmail.com"
                  className="text-xl text-white font-jakarta hover:text-teal-300 transition-colors"
                >
                  {t.info.email.value}
                </a>
              </div>

              <div>
                <span className="text-xs text-teal-300 font-jakarta tracking-widest uppercase block mb-2">
                  {t.info.phone.label}
                </span>
                <a
                  href="tel:+48733433230"
                  className="text-xl text-white font-jakarta hover:text-teal-300 transition-colors"
                >
                  {t.info.phone.value}
                </a>
              </div>

              <div>
                <span className="text-xs text-teal-300 font-jakarta tracking-widest uppercase block mb-2">
                  {t.info.location.label}
                </span>
                <span className="text-xl text-white font-jakarta">
                  {t.info.location.value}
                </span>
              </div>

              
            </motion.div>
          </div>

          {/* Right column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="contact-name" className="block text-xs text-teal-300 font-jakarta tracking-widest uppercase mb-3">
                  {t.form.name.label} <span className="text-red-400" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                  autoComplete="name"
                  className="w-full px-0 py-4 bg-transparent border-b border-white/20 text-white caret-white text-lg font-jakarta placeholder-white/20 focus:outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-300/20 transition-colors [color-scheme:dark]"
                  placeholder={t.form.name.placeholder}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs text-teal-300 font-jakarta tracking-widest uppercase mb-3">
                  {t.form.email.label} <span className="text-red-400" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                  autoComplete="email"
                  className="w-full px-0 py-4 bg-transparent border-b border-white/20 text-white caret-white text-lg font-jakarta placeholder-white/20 focus:outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-300/20 transition-colors [color-scheme:dark]"
                  placeholder={t.form.email.placeholder}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs text-teal-300 font-jakarta tracking-widest uppercase mb-3">
                  {t.form.message.label} <span className="text-red-400" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                  rows={4}
                  className="w-full px-0 py-4 bg-transparent border-b border-white/20 text-white caret-white text-lg font-jakarta placeholder-white/20 focus:outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-300/20 transition-colors resize-none [color-scheme:dark]"
                  placeholder={t.form.message.placeholder}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-4 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 rounded"
                  aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                >
                  <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
                    {isSubmitting ? t.form.sending : t.form.submit}
                  </span>
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
                    )}
                  </div>
                </button>

                <p className="text-xs text-white/20 font-jakarta">
                  {t.form.privacy.text}{' '}
                  <a href="/privacy-policy" className="text-white/40 hover:text-teal-300 transition-colors">
                    {t.form.privacy.link}
                  </a>
                </p>
              </div>
            </form>

            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-6 border border-teal-300/30 bg-teal-300/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-300/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-jakarta text-white mb-1">{t.form.success.title}</h4>
                    <p className="text-sm text-white/50 font-jakarta">{t.form.success.message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-white/5 origin-left"
        aria-hidden="true"
      />
    </section>
  );
};

export default ContactNew;
