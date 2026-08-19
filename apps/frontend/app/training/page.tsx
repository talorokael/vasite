import { GraduationCap } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Training & Skills Development | VerdeAfrique',
  description:
    'Practical learning programmes that convert knowledge into usable skills and enterprise opportunities.',
};

export default function TrainingPage() {
  return (
    <main>
      

      {/* Event Banner – full width, matches homepage */}
      <section className="w-full bg-primary">
        <div className="relative w-full" style={{ aspectRatio: '16/18' }}>
          <Image
            src="/images/training1.jpg"
            alt="Agro-Processing Africa Summit 2026"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      
    </main>
  );
}