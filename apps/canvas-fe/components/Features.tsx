
"use client";

import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  History, 
  Download, 
  Layers, 
  LucideIcon,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className }: FeatureCardProps) => (
  <div className={cn(
    "relative group p-6 rounded-xl overflow-hidden border bg-background hover:shadow-md transition-all duration-300",
    className
  )}>
    <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/5 to-transparent rounded-xl transition-opacity duration-300"></div>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: LayoutGrid,
      title: "Intuitive Canvas",
      description: "A simple and powerful drawing surface that responds to your every movement."
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time. See changes as they happen."
    },
    {
      icon: Layers,
      title: "Layer Management",
      description: "Organize your work with layers to create complex visuals with ease."
    },
    {
      icon: History,
      title: "Version History",
      description: "Track changes and revert to previous versions whenever needed."
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your designs with a simple link or export them in multiple formats."
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Export your artwork in various formats including PNG, SVG, and PDF."
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Powerful Features</h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            CanvasFlow makes creative collaboration simple with powerful tools designed for teams.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;