
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Check } from 'lucide-react';

type UserData = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  userType: string;
  password: string;
  filhos?: Array<{ nome: string; serie: string }>;
  materia?: string;
  turmas?: string[];
  formacao?: string;
  [key: string]: any; // For additional fields that might be added later
};

const PerfilEditar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    materia: '',
    formacao: '',
  });

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('educalink-current-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        materia: user.materia || '',
        formacao: user.formacao || '',
      });

      // If user is not a professor, redirect back to profile
      if (user.userType !== 'professor') {
        navigate('/perfil');
        toast({
          title: "Acesso restrito",
          description: "Apenas professores podem editar o perfil.",
          variant: "destructive"
        });
      }
    }
  }, [navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      toast({
        title: "Erro",
        description: "Dados do usuário não encontrados.",
        variant: "destructive"
      });
      return;
    }

    // Verify user is a professor
    if (userData.userType !== 'professor') {
      toast({
        title: "Acesso restrito",
        description: "Apenas professores podem editar o perfil.",
        variant: "destructive"
      });
      navigate('/perfil');
      return;
    }

    // Update the user data
    const updatedUser = {
      ...userData,
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      materia: formData.materia,
      formacao: formData.formacao,
    };

    // Update in localStorage (both current user and in the users array)
    localStorage.setItem('educalink-current-user', JSON.stringify(updatedUser));
    
    // Update in the users array
    const users = JSON.parse(localStorage.getItem('educalink-users') || '[]');
    const updatedUsers = users.map((user: UserData) => 
      user.id === userData.id ? updatedUser : user
    );
    localStorage.setItem('educalink-users', JSON.stringify(updatedUsers));
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
    
    navigate('/perfil');
  };

  if (!userData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando dados do usuário...</p>
        </div>
      </MainLayout>
    );
  }

  // If user is not a professor, show access denied
  if (userData.userType !== 'professor') {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto mt-8">
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertTitle>Acesso restrito</AlertTitle>
            <AlertDescription>
              Apenas professores podem editar o perfil. Você será redirecionado para a página de perfil.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={() => navigate('/perfil')}>Voltar ao Perfil</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold tracking-tight">Editar Perfil</h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => navigate('/perfil')}>Cancelar</Button>
          </div>
        </div>

        <form id="profile-form" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais e de contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userType">Tipo de Usuário</Label>
                  <Input
                    id="userType"
                    value={userData.userType === 'professor' ? 'Professor' : 'Responsável'}
                    readOnly
                    disabled
                  />
                </div>
                
                {userData.userType === 'professor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="materia">Matéria</Label>
                      <Select 
                        name="materia"
                        value={formData.materia} 
                        onValueChange={(value) => handleSelectChange('materia', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua matéria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matemática">Matemática</SelectItem>
                          <SelectItem value="Português">Português</SelectItem>
                          <SelectItem value="Ciências">Ciências</SelectItem>
                          <SelectItem value="História">História</SelectItem>
                          <SelectItem value="Geografia">Geografia</SelectItem>
                          <SelectItem value="Física">Física</SelectItem>
                          <SelectItem value="Química">Química</SelectItem>
                          <SelectItem value="Biologia">Biologia</SelectItem>
                          <SelectItem value="Artes">Artes</SelectItem>
                          <SelectItem value="Educação Física">Educação Física</SelectItem>
                          <SelectItem value="Inglês">Inglês</SelectItem>
                          <SelectItem value="Espanhol">Espanhol</SelectItem>
                          <SelectItem value="Filosofia">Filosofia</SelectItem>
                          <SelectItem value="Sociologia">Sociologia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="formacao">Formação Acadêmica</Label>
                      <Input
                        id="formacao"
                        name="formacao"
                        value={formData.formacao}
                        onChange={handleChange}
                        placeholder="Ex: Licenciatura em Matemática"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-black hover:bg-black/90 text-white flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirmar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
};

export default PerfilEditar;
