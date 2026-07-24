import { z } from 'zod'

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(200, "Slug must be less than 200 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric and can contain hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters").max(50000, "Content must be less than 50000 characters"),
  cover_image: z.string().optional().nullable(),
})

export const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(200, "Slug must be less than 200 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric and can contain hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters").max(50000, "Content must be less than 50000 characters"),
  cover_image: z.string().optional().nullable(),
})

export const testimonialSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters").max(1000, "Quote must be less than 1000 characters"),
  author: z.string().min(2, "Author must be at least 2 characters").max(100, "Author must be less than 100 characters"),
  role: z.string().min(2, "Role must be at least 2 characters").max(100, "Role must be less than 100 characters"),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  image: z.string().optional().nullable(),
})
