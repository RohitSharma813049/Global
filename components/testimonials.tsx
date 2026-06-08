'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    quote: 'Global Scholar transformed how I share my research. The platform is intuitive and reaches scholars worldwide.',
    author: 'Dr. Sarah Johnson',
    role: 'Neuroscience Researcher',
    rating: 5,
  },
  {
    id: 2,
    quote: 'I&apos;ve discovered breakthrough papers I would have never found otherwise. This platform is invaluable for my work.',
    author: 'Prof. Michael Chen',
    role: 'Environmental Scientist',
    rating: 5,
  },
  {
    id: 3,
    quote: 'The community here is incredible. Collaborating with peers from different countries has expanded my research horizons.',
    author: 'Dr. Emily Roberts',
    role: 'Quantum Physics',
    rating: 5,
  },
  {
    id: 4,
    quote: 'Publishing my thesis was seamless. Global Scholar made it easy to share my work with the academic community.',
    author: 'James Wilson',
    role: 'PhD Candidate',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Success Stories
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            What Scholars Say
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
              <div className="mt-6">
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-foreground/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
