
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const recuperarSchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido' }),
});

const verificarCodigoSchema = z.object({
  codigo: z.string().length(6, { message: 'O código deve ter 6 dígitos' }),
  novaSenha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmarSenha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não conferem",
  path: ["confirmarSenha"],
});

type RecuperarFormValues = z.infer<typeof recuperarSchema>;
type VerificarCodigoFormValues = z.infer<typeof verificarCodigoSchema>;

const RecuperarSenha = () => {
  const [step, setStep] = useState<'enviar' | 'verificar'>('enviar');
  const [userEmail, setUserEmail] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RecuperarFormValues>({
    resolver: zodResolver(recuperarSchema),
    defaultValues: {
      email: '',
    },
  });

  const formVerificar = useForm<VerificarCodigoFormValues>({
    resolver: zodResolver(verificarCodigoSchema),
    defaultValues: {
      codigo: '',
      novaSenha: '',
      confirmarSenha: '',
    },
  });

  const onSubmit = (data: RecuperarFormValues) => {
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('educalink-users') || '[]');
    
    // Find user with matching email
    const user = users.find((u: any) => u.email === data.email);
    
    if (user) {
      // Generate a random 6-digit code
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      setCodigoEnviado(codigo);
      setUserEmail(data.email);
      
      toast({
        title: "Código enviado!",
        description: `Um código de recuperação foi enviado para ${data.email}.`,
      });

      // In a real app, we would send an email.
      // For demo purposes, show the code in a dialog
      setOpenDialog(true);
      
      // Move to verification step
      setStep('verificar');
    } else {
      toast({
        title: "Email não encontrado",
        description: "Não encontramos uma conta com este email.",
        variant: "destructive"
      });
    }
  };

  const onVerificarCodigo = (data: VerificarCodigoFormValues) => {
    if (data.codigo === codigoEnviado) {
      // Get registered users from localStorage
      const users = JSON.parse(localStorage.getItem('educalink-users') || '[]');
      
      // Update user password
      const updatedUsers = users.map((u: any) => {
        if (u.email === userEmail) {
          return { ...u, password: data.novaSenha };
        }
        return u;
      });
      
      // Save updated users to localStorage
      localStorage.setItem('educalink-users', JSON.stringify(updatedUsers));
      
      toast({
        title: "Senha alterada com sucesso!",
        description: "Você já pode fazer login com sua nova senha.",
      });
      
      // Redirect to login page
      navigate('/login');
    } else {
      toast({
        title: "Código inválido",
        description: "O código informado não corresponde ao enviado.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-blue-700 font-bold text-lg">E</div>
            <span className="text-2xl font-bold text-white">EducaLink</span>
          </div>
          <p className="text-white/80">Plataforma de comunicação escola-família</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              {step === 'enviar' 
                ? 'Digite seu email para receber um código de recuperação'
                : 'Digite o código recebido e sua nova senha'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'enviar' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="seu@email.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    Enviar Código
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...formVerificar}>
                <form onSubmit={formVerificar.handleSubmit(onVerificarCodigo)} className="space-y-4">
                  <FormField
                    control={formVerificar.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de verificação</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Check className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="123456"
                              className="pl-10"
                              maxLength={6}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formVerificar.control}
                    name="novaSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formVerificar.control}
                    name="confirmarSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    Alterar Senha
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-center w-full border-t pt-4 mt-2">
              <p className="text-sm text-muted-foreground">
                Lembrou sua senha?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Voltar ao login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Dialog to show the verification code (for demo purposes) */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Código de verificação</DialogTitle>
            <DialogDescription>
              Em um ambiente de produção, este código seria enviado por email.
              Para fins de demonstração, seu código é:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-xl tracking-widest">
              {codigoEnviado}
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Use este código para redefinir sua senha.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecuperarSenha;
