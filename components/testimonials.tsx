'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"



interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: any[];
}

export default function Testimonials({ title, subtitle, testimonials = [] }: TestimonialsProps) {
  // Chunk testimonials into groups of 4 for the 2x2 grid
  const chunkedTestimonials = [];
  for (let i = 0; i < testimonials.length; i += 4) {
    chunkedTestimonials.push(testimonials.slice(i, i + 4));
  }

  return (
    <section className="px-6 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {subtitle || 'Success Stories'}
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {title || 'What Scholars Say'}
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          <div className="absolute top-0 right-0 hidden sm:flex gap-2">
            <CarouselPrevious className="static translate-x-0 translate-y-0 h-10 w-10 bg-transparent text-primary hover:bg-primary/10 border-primary/20" />
            <CarouselNext className="static translate-x-0 translate-y-0 h-10 w-10 bg-transparent text-primary hover:bg-primary/10 border-primary/20" />
          </div>
          <CarouselContent className="-ml-4">
            {chunkedTestimonials.map((group, groupIdx) => (
              <CarouselItem key={groupIdx} className="pl-4 w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {group.map((testimonial) => (
                    <div key={testimonial.id} className="rounded-xl border border-border bg-white shadow-sm p-6 sm:p-8 flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="mb-4 flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 sm:h-5 sm:w-5 fill-accent text-accent"
                          />
                        ))}
                      </div>
                      <p className="text-base sm:text-lg text-foreground/80 flex-grow italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        {testimonial.image ? (
                          <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border border-border">
                            <Image src={testimonial.image} alt={testimonial.author} fill sizes="48px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                            <span className="text-primary font-bold text-lg">{testimonial.author.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.author}</p>
                          <p className="text-sm text-foreground/60">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-6 sm:hidden">
            <CarouselPrevious className="static translate-x-0 translate-y-0 h-10 w-10 bg-transparent text-primary hover:bg-primary/10 border-primary/20" />
            <CarouselNext className="static translate-x-0 translate-y-0 h-10 w-10 bg-transparent text-primary hover:bg-primary/10 border-primary/20" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
