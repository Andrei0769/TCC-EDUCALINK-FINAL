
import { z } from 'zod';

// Define the child schema
const childSchema = z.object({
  idAluno: z.string()
    .length(4, { message: 'ID deve ter exatamente 4 dígitos' })
    .regex(/^\d{4}$/, { message: 'ID deve conter apenas números' }),
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  serie: z.string({ required_error: 'Selecione a série' }),
});

export const cadastroSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  telefone: z.string().min(10, { message: 'Digite um telefone válido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmarSenha: z.string(),
  materia: z.array(z.string()).optional().default([]),
  filhos: z.array(childSchema).optional().default([]),
  aceitarTermos: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
}).refine(data => data.password === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export type Child = z.infer<typeof childSchema>;
export type CadastroFormValues = z.infer<typeof cadastroSchema>;
