'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'



interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: any[];
}

export default function Testimonials({ title, subtitle, testimonials = [] }: TestimonialsProps) {
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

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg border border-border bg-white p-8"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="text-lg text-foreground/80">
                "{testimonial.quote}"
              </p>
              <div className="mt-6 flex items-center gap-4">
                {testimonial.image && (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                    <Image src={testimonial.image} alt={testimonial.author} fill sizes="48px" className="object-cover" />
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
      </div>
    </section>
  )
}
