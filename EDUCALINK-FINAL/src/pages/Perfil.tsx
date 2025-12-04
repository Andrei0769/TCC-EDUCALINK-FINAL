
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, FileText, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type UserData = {
  nome: string;
  email: string;
  telefone: string;
  userType: string;
  filhos?: Array<{ nome: string; serie: string }>;
  materia?: string;
  formacao?: string;
};

const Perfil = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('educalink-current-user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  if (!userData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Você precisa estar logado para acessar esta página. <Link to="/login" className="text-edulink-600">Entrar</Link></p>
        </div>
      </MainLayout>
    );
  }

  // Get first letter of first name and last name for avatar
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Check if the user is a professor (only professors can edit)
  const canEdit = userData.userType === 'professor';

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold tracking-tight">Perfil do Usuário</h1>
          {canEdit && (
            <Button asChild>
              <Link to="/perfil/editar">Editar Perfil</Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src="/avatar-placeholder.jpg" alt={userData.nome} />
                <AvatarFallback className="text-xl bg-edulink-100 text-edulink-600">
                  {getInitials(userData.nome)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{userData.nome}</CardTitle>
              <CardDescription>
                {userData.userType === 'responsavel' ? 'Responsável' : 'Professor'}
                {userData.userType === 'professor' && userData.materia && ` - ${userData.materia}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-slate-500" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-slate-500" />
                  <span className="text-sm">{userData.telefone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Seus dados pessoais e de contato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Nome Completo</h3>
                    <p>{userData.nome}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Email</h3>
                    <p>{userData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Telefone</h3>
                    <p>{userData.telefone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Tipo de Usuário</h3>
                    <p>{userData.userType === 'responsavel' ? 'Responsável' : 'Professor'}</p>
                  </div>
                  {userData.userType === 'professor' && userData.materia && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Matéria</h3>
                      <p>{userData.materia}</p>
                    </div>
                  )}
                  {userData.userType === 'professor' && userData.formacao && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Formação Acadêmica</h3>
                      <p>{userData.formacao}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {userData.userType === 'responsavel' && userData.filhos && userData.filhos.length > 0 && (
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Estudantes Vinculados</CardTitle>
                <CardDescription>Estudantes sob sua responsabilidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.filhos.map((filho, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarFallback className="bg-edulink-100 text-edulink-600">
                          {getInitials(filho.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{filho.nome}</h3>
                        <p className="text-sm text-slate-500">{filho.serie}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Perfil;
