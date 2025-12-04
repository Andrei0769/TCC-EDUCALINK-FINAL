
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, BookOpen, FileText, GraduationCap, Clock } from 'lucide-react';

const AtividadesPedagogicas = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">Atividades Pedagógicas</h1>
        <p className="text-gray-500">Acompanhe as atividades escolares e projetos educacionais.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Book className="h-5 w-5 text-purple-600" /> 
                Projetos Atuais
              </CardTitle>
              <CardDescription>Projetos em andamento na escola</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Feira de Ciências</div>
                  <div className="text-sm text-slate-500">Apresentação: 15/06/2023</div>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Leitura Compartilhada</div>
                  <div className="text-sm text-slate-500">Atividade semanal</div>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Olimpíada de Matemática</div>
                  <div className="text-sm text-slate-500">Inscrições até 30/06/2023</div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>Últimas atividades realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Redação - Tema: Meio Ambiente</div>
                  <div className="text-sm text-slate-500">Entregue: 05/05/2023</div>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Trabalho em Grupo - História</div>
                  <div className="text-sm text-slate-500">Concluído: 28/04/2023</div>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Experimento de Ciências</div>
                  <div className="text-sm text-slate-500">Apresentado: 20/04/2023</div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
                Atividades Extracurriculares
              </CardTitle>
              <CardDescription>Atividades fora do currículo padrão</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Aula de Música</div>
                  <div className="text-sm text-slate-500">Terças e Quintas, 14h-15h</div>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Clube de Xadrez</div>
                  <div className="text-sm text-slate-500">Quartas, 15h30-16h30</div>
                </li>
                <li className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">Teatro Escolar</div>
                  <div className="text-sm text-slate-500">Sextas, 15h-17h</div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              Projetos Interdisciplinares
            </CardTitle>
            <CardDescription>Projetos que integram diferentes disciplinas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-lg mb-2">Sustentabilidade e Meio Ambiente</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Projeto que integra Ciências, Geografia e Português, onde os alunos desenvolvem
                  pesquisas sobre problemas ambientais locais e propõem soluções.
                </p>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="mr-1 h-3 w-3" /> Duração: Trimestral
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium text-lg mb-2">História através da Arte</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Integração entre História e Artes, onde os alunos recriam obras famosas de diferentes períodos
                  históricos enquanto aprendem sobre o contexto da época.
                </p>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="mr-1 h-3 w-3" /> Duração: Bimestral
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Matemática na Prática</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Projeto que aplica conceitos matemáticos em situações do cotidiano, integrando
                  Matemática com outras disciplinas como Ciências e Educação Física.
                </p>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="mr-1 h-3 w-3" /> Duração: Mensal
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AtividadesPedagogicas;
