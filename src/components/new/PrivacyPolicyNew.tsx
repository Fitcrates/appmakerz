import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import HeaderNew from './HeaderNew';
import FooterNew from './FooterNew';

const PrivacyPolicyNew: React.FC = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Effective Date: January 1, 2025',
      sections: [
        {
          title: '1. Information We Collect',
          content: `When you use our contact form, we may collect the following personal information:
          
• **Name**: To address you appropriately
• **Email Address**: To respond to your inquiries

When you subscribe to our newsletter:

• **Email Address**: To send you notifications about new posts and updates

Additionally, we use Google Analytics to collect anonymous data about your interactions with our website, including IP Address, Browser Type, Operating System, Pages Visited, and Time Spent on Pages.`
        },
        {
          title: '2. How We Use Your Information',
          content: `We use the information we collect in various ways, including to:

• Respond to your inquiries submitted through the contact form
• Send you newsletter communications about new posts and updates
• Improve, personalize, and expand our website
• Understand and analyze how you use our website
• Develop new products, services, features, and functionality`
        },
        {
          title: '3. Newsletter Subscription',
          content: `Our newsletter service allows you to stay updated with our latest posts and updates. Please note:

• Subscription is voluntary and you can unsubscribe at any time
• We only use your email address for sending newsletter communications
• Each newsletter includes an unsubscribe link at the bottom
• We do not share your email address with third parties for marketing purposes`
        },
        {
          title: '4. Google Analytics',
          content: `Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our website. This data is shared with other Google services. For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page.`
        },
        {
          title: '5. Data Security',
          content: `We implement a variety of security measures to maintain the safety of your personal information when you submit your personal information or newsletter subscription.`
        },
        {
          title: '6. Changes to This Privacy Policy',
          content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.`
        },
        {
          title: '7. Contact Us',
          content: `If you have any questions about this Privacy Policy, please contact us through the contact form or directly at: aeonofshreds@gmail.com`
        }
      ]
    },
    pl: {
      title: 'Polityka Prywatności',
      lastUpdated: 'Data wejścia w życie: 1 stycznia 2025',
      sections: [
        {
          title: '1. Informacje, które zbieramy',
          content: `Gdy korzystasz z naszego formularza kontaktowego, możemy zbierać następujące dane osobowe:

• **Imię**: Aby zwracać się do Ciebie odpowiednio
• **Adres e-mail**: Aby odpowiadać na Twoje zapytania

Gdy zapisujesz się do naszego newslettera:

• **Adres e-mail**: Aby wysyłać Ci powiadomienia o nowych wpisach i aktualizacjach

Dodatkowo, używamy Google Analytics do zbierania anonimowych danych o Twoich interakcjach z naszą stroną, w tym Adres IP, Typ przeglądarki, System operacyjny, Odwiedzone strony i Czas spędzony na stronach.`
        },
        {
          title: '2. Jak wykorzystujemy Twoje informacje',
          content: `Wykorzystujemy zebrane informacje na różne sposoby, w tym do:

• Odpowiadania na zapytania przesłane przez formularz kontaktowy
• Wysyłania komunikacji newsletterowej o nowych wpisach i aktualizacjach
• Ulepszania, personalizacji i rozbudowy naszej strony internetowej
• Zrozumienia i analizy sposobu, w jaki korzystasz z naszej strony
• Rozwijania nowych produktów, usług, funkcji i funkcjonalności`
        },
        {
          title: '3. Subskrypcja Newslettera',
          content: `Nasza usługa newslettera pozwala Ci być na bieżąco z naszymi najnowszymi wpisami i aktualizacjami. Pamiętaj, że:

• Subskrypcja jest dobrowolna i możesz się wypisać w dowolnym momencie
• Używamy Twojego adresu e-mail wyłącznie do wysyłania komunikacji newsletterowej
• Każdy newsletter zawiera link do wypisania się na dole wiadomości
• Nie udostępniamy Twojego adresu e-mail osobom trzecim w celach marketingowych`
        },
        {
          title: '4. Google Analytics',
          content: `Google Analytics to usługa analizy sieci oferowana przez Google, która śledzi i raportuje ruch na stronie internetowej. Google wykorzystuje zebrane dane do śledzenia i monitorowania korzystania z naszej strony. Te dane są udostępniane innym usługom Google. Więcej informacji na temat praktyk prywatności Google można znaleźć na stronie Polityka prywatności i warunki Google.`
        },
        {
          title: '5. Bezpieczeństwo danych',
          content: `Wdrażamy różnorodne środki bezpieczeństwa, aby zapewnić ochronę Twoich danych osobowych podczas przesyłania danych osobowych lub subskrypcji newslettera.`
        },
        {
          title: '6. Zmiany w Polityce Prywatności',
          content: `Możemy od czasu do czasu aktualizować naszą Politykę Prywatności. Poinformujemy Cię o wszelkich zmianach, publikując nową Politykę Prywatności na tej stronie. Zalecamy okresowe przeglądanie tej Polityki Prywatności pod kątem ewentualnych zmian.`
        },
        {
          title: '7. Kontakt',
          content: `Jeśli masz jakiekolwiek pytania dotyczące tej Polityki Prywatności, skontaktuj się z nami przez formularz kontaktowy lub bezpośrednio na email: aeonofshreds@gmail.com`
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-indigo-950">
      <HeaderNew />
      
      <main className="pt-32 pb-24">
        <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center text-white/40 hover:text-teal-300 transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-jakarta text-sm">Back to Home</span>
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-300/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal-300" />
              </div>
              <span className="text-xs text-white/30 font-jakarta tracking-widest uppercase">
                Legal
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white font-jakarta mb-4">
              {t.title}
            </h1>
            <p className="text-white/40 font-jakarta">
              {t.lastUpdated}
            </p>
          </motion.div>

          {/* Content sections */}
          <div className="space-y-12">
            {t.sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                <h2 className="text-xl sm:text-2xl font-light text-white font-jakarta mb-4">
                  {section.title}
                </h2>
                <div className="text-white/60 font-jakarta leading-relaxed whitespace-pre-line">
                  {section.content.split('**').map((part, i) => 
                    i % 2 === 1 ? (
                      <strong key={i} className="text-white font-medium">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left"
          />
        </div>
      </main>

      <FooterNew />
    </div>
  );
};

export default PrivacyPolicyNew;
