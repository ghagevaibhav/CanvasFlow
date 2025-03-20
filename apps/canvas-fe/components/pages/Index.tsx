"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
// import Canvas from "@/components/Canvas/Canvas";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";

const Index = () => {
  // Testimonial data
  const testimonials = [
    {
      quote: "CanvasFlow transformed how our team collaborates on design projects. It's simple yet powerful.",
      author: "Sarah Chen",
      title: "Product Designer, Acme Inc",
      rating: 5
    },
    {
      quote: "The best whiteboarding tool we've used. Perfect for our remote design sprints.",
      author: "Michael Torres",
      title: "UX Lead, Innovate Studio",
      rating: 5
    },
    {
      quote: "I use CanvasFlow daily for client presentations. It's intuitive and makes my workflow seamless.",
      author: "Jamie Wilson",
      title: "Creative Director, Wilson Design",
      rating: 5
    }
  ];

  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || isPaused) return;
    
    const interval = setInterval(() => {
      if (api && !isPaused) {
        api.scrollNext();
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, [api, isPaused]);

  return (
    <Layout>
      <Hero />
      <Features />
      {/* <Canvas /> */}
      
      {/* Testimonials as auto-scrolling carousel */}
      <section className="py-20 md:py-32 bg-background relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">What Our Users Say</h2>
            <p className="text-muted-foreground mt-2">Hear from designers and teams around the world</p>
          </div>
          
          <div className="relative">
            {/* Left fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            
            <Carousel
              ref={carouselRef}
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
                containScroll: false,
                axis: "x",
                dragThreshold: 1,
                watchDrag: !isPaused, // Disable drag when paused
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="w-full"
            >
              <CarouselContent className="py-4">
                {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3 pl-4">
                    <div 
                      className="relative p-6 rounded-xl h-full bg-secondary/30 backdrop-blur-sm border overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <Quote className="absolute top-3 left-3 text-primary/20 h-10 w-10" />
                      
                      <div className="flex mb-3 justify-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      
                      <blockquote className="relative z-10 text-lg font-medium text-center mb-4 italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      
                      <div className="flex flex-col items-center">
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                      
                      <div className="absolute -z-10 -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/5"></div>
                      <div className="absolute -z-10 -top-6 -left-6 h-20 w-20 rounded-full bg-primary/10"></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {/* Right fade effect */}
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-12 md:py-16 bg-primary/5 rounded-2xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
              Ready to elevate your creative process?
            </h2>
            <p className="text-muted-foreground max-w-[600px]">
              Join thousands of designers and teams who use CanvasFlow daily.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                size="lg" 
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href="/signup">Create Free Account</a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
              >
                <a href="#demo">Try the Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
