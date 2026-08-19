import { Users } from 'lucide-react';

export const metadata = {
  title: 'Conferences & Summits | VerdeAfrique',
  description:
    'Professional platforms connecting government, business, industry, academia, experts, practitioners and communities around important economic, social, environmental and technical issues.',
};

export default function ConferencesPage() {
  return (
    <main className="container mx-auto px-4 py-16 lg:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Conferences &amp; Summits</h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Professional platforms connecting government, business, industry, academia, experts,
          practitioners and communities around important economic, social, environmental and
          technical issues.
        </p>
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold text-foreground mb-2">Join the Conversation</h2>
          <p className="text-muted-foreground">
            Our events bring together diverse stakeholders to foster dialogue, share knowledge, and
            co-create solutions for a sustainable future.
          </p>
        </div>
      </div>
    </main>
  );
}
