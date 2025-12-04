import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, BookOpen, Calendar, Clock, FileText, TrendingUp, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Child } from '@/schemas/cadastroSchema';

interface StudentData {
  name: string;
  grade: string;
  attendance: number;
  avgGrade: number;
  nextExams: Array<{
    subject: string;
    date: string;
    time: string;
  }>;
  recentGrades: Array<{
    subject: string;
    score: number;
    date: string;
  }>;
  notifications: Array<{
    id: number;
    title: string;
    desc: string;
    date: string;
  }>;
}

const generateStudentData = (name: string, grade: string): StudentData => {
  return {
    name,
    grade,
    attendance: Math.floor(Math.random() * 10) + 90,
    avgGrade: Math.floor(Math.random() * 30 + 70) / 10,
    nextExams: [
      { subject: "Matemática", date: "15/06/2023", time: "10:00" },
      { subject: "Português", date: "17/06/2023", time: "08:30" },
      { subject: "História", date: "20/06/2023", time: "13:30" },
    ],
    recentGrades: [
      { subject: "Ciências", score: Math.floor(Math.random() * 30 + 70) / 10, date: "10/05/2023" },
      { subject: "Geografia", score: Math.floor(Math.random() * 30 + 70) / 10, date: "05/05/2023" },
      { subject: "Inglês", score: Math.floor(Math.random() * 30 + 70) / 10, date: "28/04/2023" },
      { subject: "Artes", score: Math.floor(Math.random() * 30 + 70) / 10, date: "25/04/2023" },
    ],
    notifications: [
      { id: 1, title: "Reunião de Pais", desc: `Reunião de pais e mestres de ${grade} marcada para 25/06`, date: "Hoje" },
      { id: 2, title: "Prova Recuperação", desc: "Disponível prova de recuperação de Matemática", date: "Ontem" },
      { id: 3, title: "Boletim Disponível", desc: "O boletim do 2º bimestre já está disponível", date: "03/06" },
    ]
  };
};

const Dashboard = () => {
  const [filhos, setFilhos] = useState<Child[]>([]);
  const [studentsData, setStudentsData] = useState<{[key: string]: StudentData}>({});
  const [selectedChild, setSelectedChild] = useState<string>('');
  
  const [responsavelName, setResponsavelName] = useState<string>("Responsável");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('educalink-current-user') || '{}');
    
    if (userData) {
      setResponsavelName(userData.nome || "Responsável");

      if (userData.filhos && userData.filhos.length > 0) {
        setFilhos(userData.filhos);
        
        setSelectedChild(userData.filhos[0].nome);
        
        const newStudentsData: {[key: string]: StudentData} = {};
        userData.filhos.forEach((child: Child) => {
          newStudentsData[child.nome] = generateStudentData(child.nome, child.serie);
        });
        
        setStudentsData(newStudentsData);
      }
    }
  }, []);

  const currentStudentData = selectedChild ? studentsData[selectedChild] : null;

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo(a), {responsavelName}! Acompanhe o desempenho escolar {filhos.length > 1 ? 'dos seus filhos' : 'do seu filho'}.
            </p>
          </div>
          
          {filhos.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Tabs value={selectedChild} onValueChange={setSelectedChild} className="w-full">
                <TabsList className="w-full">
                  {filhos.map((filho, index) => (
                    <TabsTrigger key={index} value={filho.nome} className="flex-1">
                      {filho.nome}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {currentStudentData ? (
          <>
            <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-edulink-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-edulink-600" />
              </div>
              <div>
                <h2 className="font-medium text-lg">{currentStudentData.name}</h2>
                <p className="text-sm text-muted-foreground">{currentStudentData.grade}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStudentData.avgGrade.toFixed(1)}</div>
                  <Progress value={currentStudentData.avgGrade * 10} className="h-1 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Acima da média da turma (7.8)
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Frequência</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStudentData.attendance}%</div>
                  <Progress value={currentStudentData.attendance} className="h-1 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Total de presença em aulas
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <Progress value={30} className="h-1 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    De 10 tarefas atribuídas este mês
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Próximas Provas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <Progress value={40} className="h-1 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Próximos 7 dias
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
              <div className="md:col-span-5 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Avaliações</CardTitle>
                    <CardDescription>Agenda de avaliações para os próximos dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentStudentData.nextExams.map((exam, index) => (
                        <div 
                          key={index} 
                          className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-edulink-100 dark:bg-edulink-900/20 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-edulink-600 dark:text-edulink-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{exam.subject}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avaliação Bimestral</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center text-sm text-slate-500">
                                <Calendar className="mr-1 h-3 w-3" /> 
                                {exam.date}
                              </div>
                              <div className="flex items-center text-sm text-slate-500">
                                <Clock className="mr-1 h-3 w-3" /> 
                                {exam.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notas Recentes</CardTitle>
                    <CardDescription>Últimas avaliações realizadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentStudentData.recentGrades.map((grade, index) => (
                        <div 
                          key={index} 
                          className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-edulink-100 dark:bg-edulink-900/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-edulink-600 dark:text-edulink-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{grade.subject}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avaliação Bimestral</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                              <span className={`text-lg font-bold ${
                                grade.score >= 7 ? 'text-green-600' : grade.score >= 5 ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {grade.score.toFixed(1)}
                              </span>
                              <span className="text-xs text-slate-500">Nota</span>
                            </div>
                            <div className="text-sm text-slate-500">{grade.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notificações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentStudentData.notifications.map((notification) => (
                        <div key={notification.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">{notification.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{notification.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Links Rápidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link to="/calendario" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                        Calendário Escolar
                      </Link>
                      <Link to="/boletim" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                        Boletim Completo
                      </Link>
                      <Link to="/atividades-pedagogicas" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                        Atividades Pedagógicas
                      </Link>
                      <Link to="/gerenciar-notas" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                        Notas e Avaliações
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="bg-edulink-50 text-edulink-800 border-edulink-200">
                  <Bell className="h-4 w-4" />
                  <AlertTitle>Reunião de Pais</AlertTitle>
                  <AlertDescription>
                    Não perca a reunião de pais e mestres no dia 25/06 às 19h.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8 border rounded-lg bg-white">
            <p className="text-gray-500">Nenhum filho cadastrado. Por favor, atualize seu perfil.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
