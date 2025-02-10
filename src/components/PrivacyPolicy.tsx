import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Header from './Header';

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Effective Date: January 1, 2025',
      content: `
        At AppCrates, accessible from https://appcrates.netlify.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AppCrates and how we use it.

         <h1>1. Information We Collect</h1>
        When you use our contact form, we may collect the following personal information:
        - **Name**: To address you appropriately.
        - **Email Address**: To respond to your inquiries.

        Additionally, we use Google Analytics to collect anonymous data about your interactions with our website. This includes:
        - IP Address
        - Browser Type
        - Operating System
        - Pages Visited
        - Time Spent on Pages

        <h1> 2. How We Use Your Information</h1>
        We use the information we collect in various ways, including to:
        - Respond to your inquiries submitted through the contact form.
        - Improve, personalize, and expand our website.
        - Understand and analyze how you use our website.
        - Develop new products, services, features, and functionality.

       <h1>  3. Google Analytics</h1>
        Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our website. This data is shared with other Google services. For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page: https://policies.google.com/privacy.

      <h1>   4. Data Security</h1>
        We implement a variety of security measures to maintain the safety of your personal information when you submit your personal information.

      <h1>   5. Changes to This Privacy Policy</h1>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.

        <h1> 6. Contact Us</h1>
        If you have any questions about this Privacy Policy, please contact us at: https://appcrates.netlify.app/#/#contact
      `,
    },
    pl: {
      title: 'Polityka Prywatności',
      lastUpdated: 'Data wejścia w życie: 1 stycznia 2025',
      content: `
        W AppCrates, dostępnym pod adresem https://appcrates.netlify.app, jednym z naszych głównych priorytetów jest prywatność naszych odwiedzających. Ten dokument Polityki Prywatności zawiera rodzaje informacji, które są zbierane i rejestrowane przez AppCrates oraz sposób ich wykorzystania.

         <h1>1. Informacje, które zbieramy</h1>
        Gdy korzystasz z naszego formularza kontaktowego, możemy zbierać następujące dane osobowe:
        - **Imię**: Aby zwracać się do Ciebie odpowiednio.
        - **Adres e-mail**: Aby odpowiadać na Twoje zapytania.

        Dodatkowo, używamy Google Analytics do zbierania anonimowych danych o Twoich interakcjach z naszą stroną. Obejmuje to:
        - Adres IP
        - Typ przeglądarki
        - System operacyjny
        - Odwiedzone strony
        - Czas spędzony na stronach

         <h1>2. Jak wykorzystujemy Twoje informacje</h1>
        Wykorzystujemy zebrane informacje na różne sposoby, w tym do:
        - Odpowiadania na zapytania przesłane przez formularz kontaktowy.
        - Ulepszania, personalizacji i rozszerzania naszej strony internetowej.
        - Zrozumienia i analizy sposobu korzystania z naszej strony.
        - Rozwijania nowych produktów, usług, funkcji i funkcjonalności.

         <h1>3. Google Analytics</h1>
        Google Analytics to usługa analizy sieci oferowana przez Google, która śledzi i raportuje ruch na stronie internetowej. Google wykorzystuje zebrane dane do śledzenia i monitorowania korzystania z naszej strony. Dane te są udostępniane innym usługom Google. Więcej informacji na temat praktyk prywatności Google można znaleźć na stronie Prywatność i warunki Google: https://policies.google.com/privacy.

         <h1>4. Bezpieczeństwo danych</h1>
        Wdrażamy różnorodne środki bezpieczeństwa w celu zachowania bezpieczeństwa Twoich danych osobowych podczas ich przesyłania.

        <h1> 5. Zmiany w Polityce Prywatności</h1>
        Możemy aktualizować naszą Politykę Prywatności od czasu do czasu. Powiadomimy Cię o wszelkich zmianach, publikując nową Politykę Prywatności na tej stronie. Zalecamy okresowe przeglądanie tej Polityki Prywatności pod kątem ewentualnych zmian.

       <h1>  6. Kontakt z nami</h1>
        Jeśli masz jakiekolwiek pytania dotyczące tej Polityki Prywatności, skontaktuj się z nami pod adresem: https://appcrates.netlify.app/#/#contact
      `,
    },
  };

  return (
    <div className="min-h-screen bg-[#140F2D]">
      <Header />
      <main>
        <div className="container mx-auto px-2 md:px-12 lg:px-24 py-8">
          <h1 className="text-5xl text-center text-white font-bold text-slate-900 mb-8 font-jakarta mt-48">
            {content[language].title}
          </h1>
          <div className="max-w-4xl mx-auto text-white p-8 rounded-lg">
            <p className="text-white mb-8">{content[language].lastUpdated}</p>
            <div className="prose dark:prose-invert max-w-none">
              {content[language].content.split('\n\n').map((paragraph, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: paragraph.replace(/\n/g, '<br />'),
                  }}
                  className="mb-4"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-[#140F2D] text-xs text-white py-8 text-jakarta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Portfolio of Arkadiusz Wawrzyniak.
            <br /> Graphic design by Weronika Grzesiowska
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
