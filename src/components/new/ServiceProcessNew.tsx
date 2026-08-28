'use client';

import ServiceProcessSteps from '@/components/new/ServiceProcessSteps';

interface ServiceProcessNewProps {
  processSteps: string[];
  language: string;
}

export default function ServiceProcessNew({ processSteps, language }: ServiceProcessNewProps) {
  return <ServiceProcessSteps steps={processSteps} language={language} />;
}
