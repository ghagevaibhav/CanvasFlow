
"use client";

import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const createNewCanvas = () => {
    toast.success('Coming soon! This feature is under development.');
  };

  return (
    <Layout>
      <div className="container px-4 py-12 md:py-16">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Canvases</h1>
              <p className="text-muted-foreground mt-1">
                Create, manage, and collaborate on your projects
              </p>
            </div>
            <Button onClick={createNewCanvas} className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Canvas
            </Button>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-12 md:py-24 border rounded-lg bg-secondary/20">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-secondary animate-pulse"></div>
              <div className="absolute inset-4 rounded-full bg-muted flex items-center justify-center">
                <PlusCircle className="h-10 w-10 text-muted-foreground/60" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">No canvases yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first canvas to get started with CanvasFlow. 
              You can create from scratch or use one of our templates.
            </p>
            <Button onClick={createNewCanvas}>Create New Canvas</Button>
          </div>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              {
                title: "Collaboration Rooms",
                description: "Create spaces where your team can work together in real-time.",
                comingSoon: true
              },
              {
                title: "Templates Gallery",
                description: "Start your projects faster with our professionally designed templates.",
                comingSoon: true
              },
              {
                title: "Advanced Export Options",
                description: "Export your designs in multiple formats for any use case.",
                comingSoon: true
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg bg-background hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
