import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about the ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-bold">About the Lab</h1>
      <div className="prose prose-lg mt-8 max-w-none text-muted-foreground">
        <p>
          The {siteConfig.name} is dedicated to advancing the frontiers of civil engineering through
          rigorous research, innovative problem-solving, and collaboration with industry and
          government partners.
        </p>
        <p>
          Our team comprises professors, researchers, graduate students, and industry collaborators
          working across six major domains: structural, geotechnical, transportation, hydraulic,
          materials, and environmental engineering.
        </p>
        <p>
          We are committed to producing high-impact publications, developing novel engineering
          solutions, and training the next generation of civil engineers.
        </p>
      </div>
    </div>
  );
}
