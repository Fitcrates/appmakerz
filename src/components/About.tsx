import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const About = () => {
  const { language } = useLanguage();
  const t = translations[language].about;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const Accordion = ({ content }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-right text-white rounded-lg flex  font-jakarta py-2 hover:bg-teal-300/70 transition-colors"
      >
        <span>{t.viewMore}</span>
        <span className="ml-2">{isOpen ? '-' : '+'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden mt-2"
          >
            <div className="text-sm text-white tracking-wide text-justify font-jakarta p-4 backdrop-blur-sm rounded">
              <p>{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



  const cards = [
    {
      id: '01',
      title: t.cards.development.title,
      description: t.cards.development.description,
      bgColor: 'bg-red-500',
      accordionContent: t.cards.development.more,
    },
    {
      id: '02',
      title: t.cards.design.title,
      description: t.cards.design.description,
      bgColor: 'bg-teal-500',
      accordionContent: t.cards.design.more,
    },
    {
      id: '03',
      title: t.cards.strategy.title,
      description: t.cards.strategy.description,
      bgColor: 'bg-purple-500',
      accordionContent: t.cards.strategy.more,
    },
  ];

  return (
    <section id="about" className="py-10" style={{ backgroundColor: '#140F2D' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-left text-4xl sm:text-6xl mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="text-white font-medium font-jakarta">{t.heading.part1}</span>{' '}
          <span className="text-teal-300 animated-word font-medium font-jakarta">{t.heading.part2}</span>{' '}
          <span className="text-white font-medium font-jakarta">{t.heading.part3}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-36 mb-16">
          {cards.map((card) => (
            <div key={card.id} className="flex flex-col space-y-4  lg:pb-0">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-lg min-h-96 relative"
              >
                <span className="absolute top-0 left-0 text-white text-sm font-jakarta">
                  {card.id}
                </span>
                
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-56 h-28">
                  <div className={`w-full h-3/4 ${card.bgColor} rounded-full blur-2xl transform -rotate-[2deg]`} />
                </div>

                <div className="mt-[16rem]">
                  <h3 className="text-2xl text-white font-jakarta font-medium">
                    {card.title}
                  </h3>
                  <p className="text-white mt-8 font-jakarta tracking-wide">
                    {card.description}
                  </p>
                </div>
              </motion.div>

              <Accordion content={card.accordionContent} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
