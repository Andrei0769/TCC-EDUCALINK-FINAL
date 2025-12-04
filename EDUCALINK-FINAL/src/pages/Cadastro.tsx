import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CadastroForm } from '@/components/cadastro/CadastroForm';
import { UserTypeTabs } from '@/components/cadastro/UserTypeTabs';
import { Logo } from '@/components/cadastro/Logo';
import { Lectern } from 'lucide-react';
import { cadastroSchema, CadastroFormValues } from '@/schemas/cadastroSchema';

const Cadastro = () => {
  const [userType, setUserType] = useState('responsavel');
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      password: '',
      confirmarSenha: '',
      materia: [],
      filhos: [],
      aceitarTermos: false,
    },
  });

  useEffect(() => {
    if (userType === 'responsavel') {
      form.setValue('materia', []);
    } else {
      form.setValue('filhos', []);
    }
  }, [userType, form]);

  const onSubmit = (data: CadastroFormValues) => {
    if (userType === 'responsavel' && (!data.filhos || data.filhos.length === 0)) {
      toast({
        title: "Erro de validação",
        description: "É necessário adicionar pelo menos um filho",
        variant: "destructive"
      });
      return;
    }
    
    const userData = {
      ...data,
      userType,
      id: Date.now()
    };
    
    const existingUsers = JSON.parse(localStorage.getItem('educalink-users') || '[]');
    
    // Check if email already exists for the specific user type
    const emailExists = existingUsers.some((user: any) => 
      user.email === data.email && user.userType === userType
    );
    
    if (emailExists) {
      toast({
        title: "Email já cadastrado",
        description: `Este email já está sendo usado por outro ${userType === 'professor' ? 'professor' : 'responsável'}.`,
        variant: "destructive"
      });
      return;
    }
    
    existingUsers.push(userData);
    
    localStorage.setItem('educalink-users', JSON.stringify(existingUsers));
    
    localStorage.setItem('educalink-current-user', JSON.stringify(userData));
    
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Bem-vindo(a) à plataforma EducaLink. Você já pode acessar sua conta.",
    });
    
    if (userType === 'professor') {
      navigate('/dashboard-professor', { state: { fadeIn: true } });
    } else {
      navigate('/dashboard', { state: { fadeIn: true } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-gold p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Logo />

        <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="relative">
            <CardTitle className="text-center text-xl">Criar sua conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>

          <UserTypeTabs userType={userType} setUserType={setUserType}>
            <CardContent>
              <CadastroForm 
                form={form} 
                onSubmit={onSubmit} 
                userType={userType} 
              />
            </CardContent>
          </UserTypeTabs>

          <CardFooter className="flex flex-col pt-0">
            <div className="text-center w-full border-t pt-4 mt-2">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-primary hover:text-primary/90 font-medium transition-colors duration-300">
                  Faça login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
