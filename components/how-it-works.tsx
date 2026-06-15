'use client'

import { UserPlus, Compass, BookMarked, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Create your account in seconds and join our global community of scholars.',
    icon: UserPlus,
  },
  {
    number: 2,
    title: 'Explore or Apply',
    description: 'Browse thousands of research papers, thesis, and publications or apply to become a publisher.',
    icon: Compass,
  },
  {
    number: 3,
    title: 'Publish & Read',
    description: 'Share your research with the world or read groundbreaking publications from peers.',
    icon: BookMarked,
  },
]

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
}

export default function HowItWorks({ title, subtitle }: HowItWorksProps) {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {subtitle || 'Simple Process'}
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {title || 'How It Works'}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                <div className="rounded-lg border border-border bg-white p-8 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-6 w-6 text-primary/30" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
