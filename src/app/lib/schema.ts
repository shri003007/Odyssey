import * as z from 'zod'

export const blogFormSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  medium: z.string().default('blog'),
  audience: z.array(z.string()).max(10, 'Maximum 10 audience tags').optional(),
  outline: z.string().optional(),
  language: z.string().optional(),
  additionalInfo: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  profile: z.string().optional(),
  profile_content_prompt: z.string().optional(),
  contentTypeId: z.number().optional()
})

export type BlogFormValues = z.infer<typeof blogFormSchema>

