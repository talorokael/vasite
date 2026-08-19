import { Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Consulting | VerdeAfrique',
  description:
    'Practical business, enterprise, sustainability and sector-focused consulting to help organisations identify opportunities, navigate challenges and develop sustainable growth strategies.',
};

export default function ConsultingPage() {
  const services = [
    {
      title: 'Business & Enterprise Development',
      description: 'Strategic guidance to help businesses grow, scale, and thrive in competitive markets.',
    },
    {
      title: 'Training & Skills Development',
      description: 'Practical learning programmes that convert knowledge into usable skills and enterprise opportunities.',
    },
    {
      title: 'Conferences, Summits & Events',
      description: 'Professional platforms connecting government, business, industry, academia, experts, practitioners and communities.',
    },
    {
      title: 'Sustainability & Green Economy',
      description: 'Helping organisations adopt sustainable practices and transition to a green economy.',
    },
    {
      title: 'Agro-Processing & Value Addition',
      description: 'From farm to market – integrated agro-processing solutions for sustainable growth.',
    },
    {
      title: 'Disability, Wellness & Inclusive Workplaces',
      description: 'Creating inclusive environments that support wellness and accessibility for all.',
    },
    {
      title: 'Cannabis & Hemp Consulting',
      description: 'Expert guidance on regulatory compliance, cultivation, processing, and market entry.',
    },
  ];

  return (
    <main>
      {/* Main content */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-8 h-8 text-primary" />
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Consulting & Professional Services</h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Practical business, enterprise, sustainability and sector-focused consulting designed to
            help organisations identify opportunities, navigate challenges and develop sustainable
            growth strategies.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </main>
  );
}