import React from 'react';
import { Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useEmailForm } from '../hooks/useEmailForm';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

interface ContactProps {
  id?: string;
}

const Contact: React.FC<ContactProps> = ({ id }) => {
  const { formData, isSubmitting, handleSubmit, handleChange } = useEmailForm();
  const { language } = useLanguage();
  const t = translations[language].contact;

  return (
    <section
      id="contact"
      className="py-20"
      style={{ backgroundColor: '#140F2D' }}
    >
      <Toaster position="center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div
              className="rounded-3xl p-8 shadow-xl"
              style={{ backgroundColor: '#29E7CD' }}
            >
              <h2 className="text-5xl font-bold text-slate-900 mb-8 font-jakarta font-normal">{t.title}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder={t.form.name}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-slate-800 focus:outline-none focus:border-slate-900 p-2 placeholder-slate-800"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={t.form.email}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-slate-800 focus:outline-none focus:border-slate-900 p-2 placeholder-slate-800"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t.form.message}
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-transparent border-b border-slate-800 focus:outline-none focus:border-slate-900 p-2 placeholder-slate-800"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between font-jakarta">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-2 text-slate-900 rounded-full border-2 border-slate-900 hover:bg-slate-900 hover:text-teal-200 transition-colors duration-300 font-jakarta font-normal"
                  >
                    {isSubmitting ? t.form.sending : t.form.submit}
                    <ArrowUpRight className="ml-2" size={16} />
                  </button>
                  <p className="text-sm text-slate-800 text-right font-jakarta">
                    {t.form.privacy.text} <br /> {t.form.privacy.to}{' '}
                    <a href="#/privacy-policy" className="underline font-jakarta">
                      {t.form.privacy.policy}
                    </a>.
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-20 text-white">
            <div>
              <h3 className="text-teal-200 text-xl font-jakarta">{t.info.mail}</h3>
              <p>aeonofshreds@gmail.com</p>
            </div>

            <div>
              <h3 className="text-teal-200 text-xl font-jakarta">{t.info.phone}</h3>
              <p>+48 733 433 230</p>
            </div>

            <div>
              <h3 className="text-teal-200 text-xl font-jakarta">{t.info.location}</h3>
              <p>Wrocław, Poland</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
