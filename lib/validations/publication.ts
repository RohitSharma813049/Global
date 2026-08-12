import { z } from 'zod'

export const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  abstract: z.string().min(10, "Abstract must be at least 10 characters").max(5000, "Abstract must be less than 5000 characters"),
  content_type: z.enum(['thesis', 'article', 'ebook', 'magazine']),
  category_id: z.string().min(1, "Category is required"),
  author_name: z.string().min(2, "Author name must be at least 2 characters").max(100, "Author name must be less than 100 characters"),
  email_address: z.string().email("Invalid email address"),
  institution: z.string().min(2, "Institution must be at least 2 characters").max(200, "Institution must be less than 200 characters"),
  doi: z.string().max(100, "DOI must be less than 100 characters").optional().nullable(),
  originality_declaration: z.boolean().refine(val => val === true, "You must declare originality"),
  copyright_declaration: z.boolean().refine(val => val === true, "You must agree to copyright terms"),
  terms_acceptance: z.boolean().refine(val => val === true, "You must accept terms and conditions"),
})

export const updatePublicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters").optional(),
  abstract: z.string().min(10, "Abstract must be at least 10 characters").max(5000, "Abstract must be less than 5000 characters").optional(),
  content_type: z.enum(['thesis', 'article', 'ebook', 'magazine']).optional(),
  category_id: z.string().optional().nullable(),
  author_name: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  email_address: z.string().email("Invalid email address").optional().nullable().or(z.literal('')),
  doi: z.string().optional().nullable(),
  serial_number: z.string().optional().nullable(),
  status: z.string().optional(),
  file_url: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  banner_image: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  originality_declaration: z.boolean().optional().nullable(),
  copyright_declaration: z.boolean().optional().nullable(),
  terms_acceptance: z.boolean().optional().nullable(),
})
