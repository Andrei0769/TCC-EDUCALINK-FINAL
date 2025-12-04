
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, Edit, FileText, Calendar, Users, Book, BookOpen, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeacherData {
  name: string;
  position: string;
  materia?: string;
  classes: string[];
  upcomingClasses: {
    class: string;
    subject: string;
    date: string;
    time: string;
  }[];
  pendingTasks: {
    id: number;
    task: string;
    deadline: string;
  }[];
  classesActivity: {
    class: string;
    attendance: number;
    assignments: number;
    participation: number;
  }[];
  recentStudents: {
    id: number;
    name: string;
    class: string;
    status: string;
  }[];
  insights: {
    title: string;
    description: string;
    value: string;
    change: string;
    direction: 'up' | 'down' | 'neutral';
  }[];
}

// Dados específicos por matéria
const DADOS_MATERIAS: { [key: string]: TeacherData } = {
  'Matemática': {
    name: "Professor",
    position: "Professor",
    materia: "Matemática",
    classes: ["6º Ano - Turma A", "7º Ano - Turma B", "8º Ano - Turma B"],
    upcomingClasses: [
      { class: "6º Ano - Turma A", subject: "Frações", date: "Hoje", time: "10:00" },
      { class: "7º Ano - Turma B", subject: "Equações do 1º Grau", date: "Hoje", time: "13:30" },
      { class: "8º Ano - Turma B", subject: "Geometria Plana", date: "Amanhã", time: "08:30" },
    ],
    pendingTasks: [
      { id: 1, task: "Lançar notas da prova de Matemática - 8º Ano", deadline: "Hoje" },
      { id: 2, task: "Corrigir listas de exercícios - 7º Ano", deadline: "Amanhã" },
      { id: 3, task: "Preparar material sobre geometria", deadline: "23/06" },
    ],
    classesActivity: [
      { class: "6º Ano - Turma A", attendance: 95, assignments: 85, participation: 78 },
      { class: "7º Ano - Turma B", attendance: 92, assignments: 88, participation: 82 },
      { class: "8º Ano - Turma B", attendance: 98, assignments: 92, participation: 90 },
    ],
    recentStudents: [
      { id: 1, name: "João Silva", class: "6º Ano - Turma A", status: "Dificuldade com frações" },
      { id: 2, name: "Maria Oliveira", class: "7º Ano - Turma B", status: "Excelente em álgebra" },
      { id: 3, name: "Pedro Santos", class: "8º Ano - Turma B", status: "Domina geometria" }
    ],
    insights: [
      { title: "Média de Notas", description: "Média em Matemática", value: "7.8", change: "+0.3", direction: "up" },
      { title: "Frequência", description: "Presença em aulas", value: "93%", change: "+2%", direction: "up" },
      { title: "Aproveitamento", description: "Aprovação em provas", value: "89%", change: "+1%", direction: "up" }
    ]
  },
  'Português': {
    name: "Professor",
    position: "Professor",
    materia: "Português",
    classes: ["6º Ano - Turma A", "7º Ano - Turma B"],
    upcomingClasses: [
      { class: "6º Ano - Turma A", subject: "Interpretação de Texto", date: "Hoje", time: "09:00" },
      { class: "7º Ano - Turma B", subject: "Análise Sintática", date: "Hoje", time: "14:00" },
    ],
    pendingTasks: [
      { id: 1, task: "Corrigir redações - 6º Ano", deadline: "Hoje" },
      { id: 2, task: "Preparar prova de Português - 7º Ano", deadline: "Amanhã" },
      { id: 3, task: "Elaborar material sobre literatura", deadline: "25/06" },
    ],
    classesActivity: [
      { class: "6º Ano - Turma A", attendance: 96, assignments: 87, participation: 85 },
      { class: "7º Ano - Turma B", attendance: 94, assignments: 90, participation: 88 },
    ],
    recentStudents: [
      { id: 1, name: "Ana Costa", class: "6º Ano - Turma A", status: "Escreve muito bem" },
      { id: 2, name: "Bruno Lima", class: "7º Ano - Turma B", status: "Precisa melhorar leitura" },
      { id: 3, name: "Carla Souza", class: "6º Ano - Turma A", status: "Participação exemplar" }
    ],
    insights: [
      { title: "Redações", description: "Qualidade média de textos", value: "8.2", change: "+0.5", direction: "up" },
      { title: "Leitura", description: "Compreensão de textos", value: "85%", change: "+3%", direction: "up" },
      { title: "Participação", description: "Engajamento em aula", value: "86%", change: "+4%", direction: "up" }
    ]
  },
  'Ciências': {
    name: "Professor",
    position: "Professor",
    materia: "Ciências",
    classes: ["6º Ano - Turma A", "7º Ano - Turma B", "8º Ano - Turma C"],
    upcomingClasses: [
      { class: "6º Ano - Turma A", subject: "Corpo Humano", date: "Hoje", time: "11:00" },
      { class: "7º Ano - Turma B", subject: "Reprodução em Animais", date: "Hoje", time: "15:00" },
      { class: "8º Ano - Turma C", subject: "Química Orgânica", date: "Amanhã", time: "10:00" },
    ],
    pendingTasks: [
      { id: 1, task: "Preparar experimento - 6º Ano", deadline: "Hoje" },
      { id: 2, task: "Corrigir relatórios de laboratório", deadline: "Amanhã" },
      { id: 3, task: "Lançar notas de prova", deadline: "22/06" },
    ],
    classesActivity: [
      { class: "6º Ano - Turma A", attendance: 97, assignments: 88, participation: 92 },
      { class: "7º Ano - Turma B", attendance: 93, assignments: 85, participation: 80 },
      { class: "8º Ano - Turma C", attendance: 95, assignments: 90, participation: 87 },
    ],
    recentStudents: [
      { id: 1, name: "Diego Silva", class: "6º Ano - Turma A", status: "Faz bons experimentos" },
      { id: 2, name: "Elena Santos", class: "7º Ano - Turma B", status: "Entende biologia" },
      { id: 3, name: "Felipe Oliveira", class: "8º Ano - Turma C", status: "Precisa estudar mais" }
    ],
    insights: [
      { title: "Experimentos", description: "Sucesso em práticas", value: "91%", change: "+2%", direction: "up" },
      { title: "Compreensão", description: "Entendimento de conceitos", value: "86%", change: "+1%", direction: "up" },
      { title: "Engajamento", description: "Interesse nos temas", value: "88%", change: "+5%", direction: "up" }
    ]
  }
};

const DashboardProfessor = () => {
  const [selectedMateria, setSelectedMateria] = useState('Matemática');
  const [userMateries, setUserMateries] = useState<string[]>(['Matemática', 'Português', 'Ciências']);
  const [teacherData, setTeacherData] = useState<TeacherData>(DADOS_MATERIAS['Matemática']);

  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('educalink-current-user') || '{}');
    
    if (userData && userData.nome) {
      // Se o professor tem matérias definidas
      if (userData.materia) {
        let materias = Array.isArray(userData.materia) ? userData.materia : [userData.materia];
        setUserMateries(materias);
        setSelectedMateria(materias[0]);
        setTeacherData(DADOS_MATERIAS[materias[0]] || DADOS_MATERIAS['Matemática']);
      }
    }
  }, []);

  // Atualizar dados quando matéria é alterada
  useEffect(() => {
    const newData = DADOS_MATERIAS[selectedMateria];
    if (newData) {
      setTeacherData(newData);
    }
  }, [selectedMateria]);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-edulink-50 flex items-center justify-center">
              <GraduationCap 
                size={48} 
                className="text-edulink-600 opacity-80"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Painel do Professor</h1>
              <p className="text-muted-foreground">
                Gerencie suas turmas, notas e comunicações com os responsáveis.
              </p>
              <p className="text-sm mt-1 text-muted-foreground">{currentDate}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            {userMateries.length > 1 && (
              <div className="w-56">
                <Select value={selectedMateria} onValueChange={setSelectedMateria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {userMateries.map(materia => (
                      <SelectItem key={materia} value={materia}>
                        {materia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium">{teacherData.name}</p>
                <p className="text-sm text-muted-foreground">{teacherData.position}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-edulink-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-edulink-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {teacherData.insights.map((insight, index) => (
            <Card key={index} className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                {insight.direction === 'up' ? (
                  <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-0 w-0 border-x-4 border-x-transparent border-b-[6px] border-b-green-500"></div>
                  </div>
                ) : insight.direction === 'down' ? (
                  <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                    <div className="h-0 w-0 border-x-4 border-x-transparent border-t-[6px] border-t-red-500"></div>
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="h-1 w-2 bg-gray-500"></div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insight.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
                <p className={`text-xs mt-2 ${
                  insight.direction === 'up' 
                    ? 'text-green-600' 
                    : insight.direction === 'down' 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                }`}>
                  {insight.change} desde o último mês
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Turmas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherData.classes.length}</div>
              <Progress value={teacherData.classes.length * 33} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Turmas ativas neste semestre
              </p>
              <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                <Link to="/alunos">Ver alunos</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherData.pendingTasks.length}</div>
              <Progress value={teacherData.pendingTasks.length * 33} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Tarefas a serem concluídas
              </p>
              <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                <Link to="/gerenciar-notas">Gerenciar notas</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Próximas Aulas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <Progress value={67} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Aulas hoje
              </p>
              <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                <Link to="/calendario-professor">Ver calendário</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atividades</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <Progress value={75} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Atividades criadas este mês
              </p>
              <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
                <Link to="/atividades-pedagogicas">Ver atividades</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <div className="md:col-span-5 space-y-4">
            <Tabs defaultValue="proximasAulas" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="proximasAulas">Próximas Aulas</TabsTrigger>
                <TabsTrigger value="alunos">Alunos Recentes</TabsTrigger>
                <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
              </TabsList>
              
              <TabsContent value="proximasAulas">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Próximas Aulas</CardTitle>
                      <CardDescription>Agenda de aulas para os próximos dias</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/calendario-professor">
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver calendário completo
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teacherData.upcomingClasses.map((cls, index) => (
                        <div 
                          key={index} 
                          className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-edulink-100 dark:bg-edulink-900/20 flex items-center justify-center">
                            <Book className="h-5 w-5 text-edulink-600 dark:text-edulink-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{cls.class}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{cls.subject}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm font-medium">{cls.date}</div>
                            <div className="text-sm text-slate-500">{cls.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="alunos">
                <Card>
                  <CardHeader>
                    <CardTitle>Alunos Recentes</CardTitle>
                    <CardDescription>Alunos que precisam de atenção ou acompanhamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teacherData.recentStudents.map((student) => (
                        <div 
                          key={student.id} 
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-edulink-100 text-edulink-600">
                                {student.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-xs text-slate-500">{student.class}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              student.status.includes('Excelente') 
                                ? 'bg-green-100 text-green-700' 
                                : student.status.includes('Faltou') 
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {student.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/alunos">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Ver todos os alunos
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="desempenho">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Desempenho das Turmas</CardTitle>
                      <CardDescription>Acompanhamento de frequência e participação</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/gerenciar-notas">
                        <FileText className="mr-2 h-4 w-4" />
                        Relatório completo
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {teacherData.classesActivity.map((cls, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{cls.class}</h4>
                            <Link 
                              to="/gerenciar-notas" 
                              className="text-xs text-edulink-600 hover:underline"
                            >
                              Gerenciar notas
                            </Link>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Frequência</span>
                                <span className="font-medium">{cls.attendance}%</span>
                              </div>
                              <Progress value={cls.attendance} className="h-1" />
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Entrega de tarefas</span>
                                <span className="font-medium">{cls.assignments}%</span>
                              </div>
                              <Progress value={cls.assignments} className="h-1" />
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Participação em aula</span>
                                <span className="font-medium">{cls.participation}%</span>
                              </div>
                              <Progress value={cls.participation} className="h-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas avaliações e atividades cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Prova Bimestral de Matemática</h4>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Prova</span>
                      </div>
                      <p className="text-sm text-slate-500">6º Ano - Turma A</p>
                    </div>
                    <div className="text-xs text-slate-500">Ontem</div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Lista de Exercícios - Equações</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Tarefa</span>
                      </div>
                      <p className="text-sm text-slate-500">7º Ano - Turma B</p>
                    </div>
                    <div className="text-xs text-slate-500">3 dias</div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Projeto de Geometria</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Projeto</span>
                      </div>
                      <p className="text-sm text-slate-500">8º Ano - Turma B</p>
                    </div>
                    <div className="text-xs text-slate-500">1 semana</div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/calendario-professor">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver todas as atividades
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Tarefas Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherData.pendingTasks.map((task) => (
                    <div key={task.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{task.task}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.deadline === 'Hoje' 
                            ? 'bg-red-100 text-red-700' 
                            : task.deadline === 'Amanhã' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-purple-100 text-purple-700 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                      25/06
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Conselho de Classe</h4>
                      <p className="text-xs text-slate-500">14h - Sala de Reuniões</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="bg-green-100 text-green-700 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                      30/06
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Reunião de Pais</h4>
                      <p className="text-xs text-slate-500">18h - Auditório</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-100 text-blue-700 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                      05/07
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Encerramento do Bimestre</h4>
                      <p className="text-xs text-slate-500">Prazo final para notas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Links Rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to="/calendario-professor" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                    Calendário Escolar
                  </Link>
                  <Link to="/gerenciar-notas" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                    Gerenciar Notas
                  </Link>
                  <Link to="/gerenciar-notas" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                    Boletins
                  </Link>
                  <Link to="/alunos" className="block p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                    Alunos
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-edulink-50 text-edulink-800 border-edulink-200">
              <Bell className="h-4 w-4" />
              <AlertTitle>Conselho de Classe</AlertTitle>
              <AlertDescription>
                Lembre-se do conselho de classe no dia 25/06 às 14h.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardProfessor;
