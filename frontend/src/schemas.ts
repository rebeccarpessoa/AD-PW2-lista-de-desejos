import { z } from 'zod';

// Formato do item devolvido pela API
export const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  isPublished: z.boolean(),
  createdAt: z.string(),
});

export const itemListSchema = z.array(itemSchema);

export type Item = z.infer<typeof itemSchema>;

// Formato do formulário de cadastro/edição
// A Vercel limita o corpo da requisição a 4,5MB, então a imagem fica abaixo disso
export const MAX_IMAGE_SIZE_MB = 4;

export const itemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome do item.')
    .max(100, 'O nome pode ter no máximo 100 caracteres.'),
  description: z
    .string()
    .trim()
    .max(500, 'A descrição pode ter no máximo 500 caracteres.'),
  isPublished: z.boolean(),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), 'O arquivo precisa ser uma imagem.')
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
      `A imagem pode ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`,
    )
    .nullable(),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;
