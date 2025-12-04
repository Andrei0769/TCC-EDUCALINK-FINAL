
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserCheck, Users, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [userType, setUserType] = useState('responsavel');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('educalink-users') || '[]');
    
    // Find user with matching email, password and userType
    const user = users.find((u: any) => 
      u.email === data.email && 
      u.password === data.password &&
      u.userType === userType
    );
    
    if (user) {
      // Save current user data
      localStorage.setItem('educalink-current-user', JSON.stringify(user));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta, ${user.nome}.`,
      });
      
      // Redirect based on user type
      if (userType === 'professor') {
        navigate('/dashboard-professor', { state: { fadeIn: true } });
      } else {
        navigate('/dashboard', { state: { fadeIn: true } });
      }
    } else {
      // Check if the email exists but with a different user type
      const emailExists = users.some((u: any) => 
        u.email === data.email && u.userType !== userType
      );
      
      if (emailExists) {
        toast({
          title: "Tipo de usuário incorreto",
          description: `Este email está cadastrado como ${userType === 'professor' ? 'responsável' : 'professor'}. Por favor, selecione o tipo de usuário correto.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 to-yellow-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-yellow-600 font-bold text-lg">E</div>
            <span className="text-2xl font-bold text-yellow-800">EducaLink</span>
          </div>
          <p className="text-black font-medium">Plataforma de comunicação escola-família</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl text-yellow-800">Acesso à Plataforma</CardTitle>
            <CardDescription className="text-center text-yellow-700">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="responsavel" className="w-full" onValueChange={setUserType}>
            <TabsList className="grid grid-cols-2 mb-4 mx-6 bg-yellow-50">
              <TabsTrigger value="responsavel" className="flex items-center gap-1 text-gray-900 data-[state=active]:bg-yellow-200 data-[state=active]:text-gray-900">
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Responsável</span>
              </TabsTrigger>
              <TabsTrigger value="professor" className="flex items-center gap-1 text-gray-900 data-[state=active]:bg-yellow-200 data-[state=active]:text-gray-900">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Professor</span>
              </TabsTrigger>
            </TabsList>

            {/* Login form for all user types */}
            <TabsContent value={userType}>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-yellow-800">E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                              <Input
                                placeholder="seu@email.com"
                                className="pl-10 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-yellow-800">Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-yellow-600 hover:text-yellow-700 transition-colors"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300">
                      Entrar
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-center w-full border-t border-yellow-100 pt-4 mt-2">
              <p className="text-sm text-yellow-700">
                Ainda não tem uma conta?{' '}
                <Link to="/cadastro" className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-300">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
