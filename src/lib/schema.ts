import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(5).max(150),
  date: z.date(),
  isCompleted: z.boolean().optional(),
  isImportant: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
});

export const editTaskFormSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(5).max(150),
  date: z.date(),
});
