import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Lightbulb, Code2, Rocket, CheckCircle } from 'lucide-react';

interface ProcessStep {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
}

const steps: ProcessStep[] = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Discovery',
    description: 'We discuss your vision, goals, and requirements to understand exactly what you need.'
  },
  {
    icon: Lightbulb,
    number: '02',
    title: 'Planning',
    description: 'I create a detailed roadmap with milestones, tech stack decisions, and timeline.'
  },
  {
    icon: Code2,
    number: '03',
    title: 'Development',
    description: 'Building your solution with clean code, regular updates, and iterative feedback.'
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Launch',
    description: 'Thorough testing, deployment, and handover with documentation and support.'
  }
];

const ProcessNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-indigo-950 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-teal-300 font-jakarta text-sm tracking-widest uppercase mb-4 block">
            How I Work
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white font-jakarta mb-6">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
              Process
            </span>
          </h2>
          <p className="text-white/50 font-jakarta font-light text-lg max-w-2xl mx-auto">
            A streamlined approach to delivering exceptional results, from initial concept to final launch.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-teal-300/30 to-transparent z-0" />
              )}

              <div className="relative">
                {/* Number badge */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-teal-300/10 border border-teal-300/30 flex items-center justify-center">
                  <span className="text-teal-300 text-xs font-jakarta font-medium">{step.number}</span>
                </div>

                {/* Card */}
                <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-teal-300/30 transition-all duration-500 h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-300/20 to-teal-300/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-7 h-7 text-teal-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-jakarta font-medium text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/50 font-jakarta font-light text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-teal-300/10 border border-teal-300/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-teal-300" />
            <span className="text-white/70 font-jakarta text-sm">
              Transparent communication at every step
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessNew;
