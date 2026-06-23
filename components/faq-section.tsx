'use client'

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FaqProps {
  title?: string
  subtitle?: string
  faqs?: { question: string; answer: string }[]
}

export default function FaqSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Got questions? We have answers.',
  faqs = [],
}: FaqProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          {subtitle && (
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h2>
          )}
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900 hover:text-indigo-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
