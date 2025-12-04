import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Child } from '@/schemas/cadastroSchema';
import { TrendingUp, Award, Target, BookOpen, GraduationCap, School } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface HabilidadeData {
  name: string;
  value: number;
  color: string;
}

interface ProjetoData {
  nome: string;
  disciplina: string;
  concluido: number;
  dataEntrega: string;
  descricao: string;
}

interface AtividadeData {
  nome: string;
  data: string;
  concluida: boolean;
  disciplina: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#9b87f5', '#D6BCFA'];

const ProgressoAcademico = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filhos, setFilhos] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedAnoLetivo, setSelectedAnoLetivo] = useState('2024');
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [progressData, setProgressData] = useState<any[]>([]);
  const [habilidadesData, setHabilidadesData] = useState<HabilidadeData[]>([]);
  const [projetosData, setProjetosData] = useState<ProjetoData[]>([]);
  const [atividadesData, setAtividadesData] = useState<AtividadeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const userData = localStorage.getItem('educalink-current-user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      // Se tiver filhos, carregue-os
      if (user.filhos && user.filhos.length > 0) {
        setFilhos(user.filhos);
        setSelectedChild(user.filhos[0].nome);
        
        // Gerar dados simulados para demonstração
        gerarDadosDemo(user.filhos[0].nome);
      }
      
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar o progresso acadêmico.",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [toast]);

  // Gerar dados simulados quando o filho selecionado mudar
  useEffect(() => {
    if (selectedChild) {
      gerarDadosDemo(selectedChild);
    }
  }, [selectedChild]);

  // Gerar dados simulados para demonstração
  const gerarDadosDemo = (childName: string) => {
    // Dados de progresso por disciplina ao longo do tempo
    const disciplinas = ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Artes'];
    const progressoTemp = [];
    
    for (let mes = 1; mes <= 6; mes++) {
      const data: any = { name: `${mes}º Mês` };
      
      disciplinas.forEach(disc => {
        // Gera um valor entre 50 e 100, com tendência de aumento ao longo dos meses
        const baseValue = Math.floor(Math.random() * 30) + 50;
        const improvement = Math.floor(Math.random() * 5) * mes;
        data[disc] = Math.min(100, baseValue + improvement);
      });
      
      progressoTemp.push(data);
    }
    
    setProgressData(progressoTemp);

    // Dados de habilidades
    const habilidades: HabilidadeData[] = [
      { name: 'Leitura', value: Math.floor(Math.random() * 30) + 70, color: COLORS[0] },
      { name: 'Escrita', value: Math.floor(Math.random() * 30) + 70, color: COLORS[1] },
      { name: 'Raciocínio Lógico', value: Math.floor(Math.random() * 30) + 70, color: COLORS[2] },
      { name: 'Trabalho em Equipe', value: Math.floor(Math.random() * 30) + 70, color: COLORS[3] },
      { name: 'Criatividade', value: Math.floor(Math.random() * 30) + 70, color: COLORS[4] },
      { name: 'Resolução de Problemas', value: Math.floor(Math.random() * 30) + 70, color: COLORS[5] },
    ];
    
    setHabilidadesData(habilidades);

    // Dados de projetos
    const projetos: ProjetoData[] = [
      { 
        nome: 'Projeto de História Local',
        disciplina: 'História',
        concluido: 100,
        dataEntrega: '10/04/2024',
        descricao: 'Pesquisa sobre a história do bairro e apresentação para a turma.'
      },
      { 
        nome: 'Feira de Ciências',
        disciplina: 'Ciências',
        concluido: 80,
        dataEntrega: '20/05/2024',
        descricao: 'Desenvolvimento de experimento demonstrando conceitos de física.'
      },
      { 
        nome: 'Redação Argumentativa',
        disciplina: 'Português',
        concluido: 70,
        dataEntrega: '15/05/2024',
        descricao: 'Produção de texto dissertativo sobre tema atual.'
      },
      { 
        nome: 'Maquete Geográfica',
        disciplina: 'Geografia',
        concluido: 30,
        dataEntrega: '30/05/2024',
        descricao: 'Construção de maquete representando relevo e vegetação.'
      },
      { 
        nome: 'Olimpíada de Matemática',
        disciplina: 'Matemática',
        concluido: 50,
        dataEntrega: '05/06/2024',
        descricao: 'Preparação para prova de olimpíada escolar de matemática.'
      },
    ];
    
    setProjetosData(projetos);

    // Dados de atividades
    const hoje = new Date();
    const atividades: AtividadeData[] = [
      { 
        nome: 'Exercícios de Interpretação de Texto',
        disciplina: 'Português',
        data: formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2)),
        concluida: true
      },
      { 
        nome: 'Lista de Exercícios de Equações',
        disciplina: 'Matemática',
        data: formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1)),
        concluida: true 
      },
      { 
        nome: 'Questionário sobre Sistema Solar',
        disciplina: 'Ciências',
        data: formatarData(hoje),
        concluida: false 
      },
      { 
        nome: 'Pesquisa sobre Revolução Industrial',
        disciplina: 'História',
        data: formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2)),
        concluida: false 
      },
      { 
        nome: 'Desenho de Mapa Mundi',
        disciplina: 'Geografia',
        data: formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 5)),
        concluida: false 
      },
    ];
    
    setAtividadesData(atividades);
  };

  // Formatar data para exibição
  const formatarData = (data: Date): string => {
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth()+1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  };

  // Determinar cor com base no valor de progresso
  const getProgressColor = (value: number): string => {
    if (value >= 80) return 'bg-green-600';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Calcular média de crescimento das habilidades
  const calcularMediaCrescimento = (): number => {
    if (!progressData || progressData.length < 2) return 0;
    
    const primeiro = progressData[0];
    const ultimo = progressData[progressData.length - 1];
    let somaCrescimento = 0;
    let contDisciplinas = 0;
    
    Object.keys(ultimo).forEach(key => {
      if (key !== 'name' && primeiro[key]) {
        somaCrescimento += ((ultimo[key] - primeiro[key]) / primeiro[key]) * 100;
        contDisciplinas++;
      }
    });
    
    return contDisciplinas > 0 ? somaCrescimento / contDisciplinas : 0;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Carregando dados de progresso...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Acesso Restrito</CardTitle>
              <CardDescription>Faça login para visualizar o progresso acadêmico</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center">Você precisa estar logado para acessar esta página.</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Progresso Acadêmico</h1>
            <p className="text-muted-foreground">Acompanhe o desenvolvimento educacional em detalhes.</p>
          </div>
          
          <div className="w-full md:w-auto">
            {filhos.length > 1 && (
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {filhos.map((filho, i) => (
                    <SelectItem key={i} value={filho.nome}>
                      {filho.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {filhos.length > 0 && selectedChild && (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
                <TabsTrigger value="projetos">Projetos</TabsTrigger>
              </TabsList>

              <TabsContent value="visao-geral">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" /> Crescimento Médio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-edulink-800">
                        {calcularMediaCrescimento().toFixed(1)}%
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Crescimento médio nas disciplinas nos últimos 6 meses
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-4 w-4" /> Competências Desenvolvidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-edulink-800">
                        {habilidadesData.filter(h => h.value >= 80).length}/{habilidadesData.length}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Habilidades com alto nível de desenvolvimento
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4" /> Projetos Concluídos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-edulink-800">
                        {projetosData.filter(p => p.concluido >= 90).length}/{projetosData.length}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Projetos já finalizados no período atual
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Evolução por Disciplina</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={progressData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="Português" stroke="#0088FE" strokeWidth={2} />
                          <Line type="monotone" dataKey="Matemática" stroke="#00C49F" strokeWidth={2} />
                          <Line type="monotone" dataKey="Ciências" stroke="#FFBB28" strokeWidth={2} />
                          <Line type="monotone" dataKey="História" stroke="#FF8042" strokeWidth={2} />
                          <Line type="monotone" dataKey="Geografia" stroke="#8884D8" strokeWidth={2} />
                          <Line type="monotone" dataKey="Artes" stroke="#9b87f5" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Próximas Atividades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {atividadesData
                          .filter(a => !a.concluida)
                          .slice(0, 3)
                          .map((atividade, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-slate-50">
                              <div>
                                <h4 className="font-medium text-sm">{atividade.nome}</h4>
                                <div className="flex space-x-2 items-center mt-1">
                                  <Badge variant="outline">{atividade.disciplina}</Badge>
                                  <span className="text-xs text-slate-500">{atividade.data}</span>
                                </div>
                              </div>
                              <Badge variant="secondary">Pendente</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Projetos em Andamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projetosData
                          .filter(p => p.concluido < 100)
                          .slice(0, 3)
                          .map((projeto, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-sm">{projeto.nome}</h4>
                                <Badge>{projeto.disciplina}</Badge>
                              </div>
                              <Progress 
                                value={projeto.concluido} 
                                className="h-2"
                              />
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{projeto.concluido}% concluído</span>
                                <span>Entrega: {projeto.dataEntrega}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="habilidades">
                <Card>
                  <CardHeader>
                    <CardTitle>Desenvolvimento de Habilidades</CardTitle>
                    <CardDescription>
                      Visão detalhada do desenvolvimento em diferentes áreas de conhecimento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="10%" 
                            outerRadius="80%" 
                            barSize={20} 
                            data={habilidadesData}
                          >
                            <RadialBar
                              background
                              dataKey="value"
                              label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                            >
                              {habilidadesData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color} 
                                />
                              ))}
                            </RadialBar>
                            <Legend 
                              iconSize={10} 
                              layout="vertical" 
                              verticalAlign="middle" 
                              align="right"
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                    
                      <div className="space-y-4">
                        {habilidadesData.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <Label>{item.name}</Label>
                              <span className="text-sm font-medium">{item.value}%</span>
                            </div>
                            <Progress value={item.value} className="h-2" />
                            <div className="text-xs text-slate-500">
                              {item.value >= 80 ? (
                                <span className="text-green-600">Excelente desenvolvimento</span>
                              ) : item.value >= 60 ? (
                                <span className="text-amber-600">Bom desenvolvimento</span>
                              ) : (
                                <span className="text-red-600">Precisa de atenção</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Recomendações Personalizadas</h3>
                      <div className="space-y-4">
                        {habilidadesData
                          .filter(h => h.value < 80)
                          .map((habilidade, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" /> Desenvolver {habilidade.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-slate-600">
                                  {habilidade.name === 'Leitura' && 
                                    'Recomendamos a leitura diária de 30 minutos com materiais de diferentes gêneros textuais para melhorar a compreensão e fluência.'}
                                  {habilidade.name === 'Escrita' && 
                                    'Praticar a escrita com exercícios de redação e diário pessoal, com foco em coerência e desenvolvimento de ideias.'}
                                  {habilidade.name === 'Raciocínio Lógico' && 
                                    'Resolver problemas matemáticos e jogos de lógica pode ajudar a desenvolver o pensamento analítico.'}
                                  {habilidade.name === 'Trabalho em Equipe' && 
                                    'Participar de atividades coletivas e projetos em grupo ajudará a desenvolver habilidades de colaboração.'}
                                  {habilidade.name === 'Criatividade' && 
                                    'Estimular atividades artísticas e de expressão livre para desenvolver o pensamento criativo.'}
                                  {habilidade.name === 'Resolução de Problemas' && 
                                    'Exercícios de solução de problemas complexos, com múltiplas abordagens possíveis.'}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projetos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Projetos e Atividades</CardTitle>
                      <CardDescription>Status de todos os projetos e atividades do período</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {projetosData.map((projeto, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-slate-50">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">{projeto.nome}</h3>
                                <Badge className="mt-1">{projeto.disciplina}</Badge>
                              </div>
                              <Badge 
                                className={
                                  projeto.concluido === 100 
                                    ? "bg-green-100 text-green-800" 
                                    : projeto.concluido >= 50 
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {projeto.concluido === 100 
                                  ? "Concluído" 
                                  : projeto.concluido >= 50 
                                    ? "Em andamento" 
                                    : "Iniciando"}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{projeto.descricao}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Progresso</span>
                                <span>{projeto.concluido}%</span>
                              </div>
                              <Progress value={projeto.concluido} className="h-2" />
                              <div className="text-right text-xs text-slate-500">
                                Entrega: {projeto.dataEntrega}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribuição por Disciplinas</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={
                                Array.from(
                                  new Set(projetosData.map(p => p.disciplina))
                                ).map((disciplina, index) => ({
                                  name: disciplina,
                                  value: projetosData.filter(p => p.disciplina === disciplina).length,
                                  color: COLORS[index % COLORS.length]
                                }))
                              }
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {Array.from(
                                new Set(projetosData.map(p => p.disciplina))
                              ).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend />
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Cronograma de Atividades</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {atividadesData.map((atividade, index) => (
                            <div 
                              key={index} 
                              className={`flex justify-between items-center p-3 rounded-lg border ${
                                atividade.concluida 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">{atividade.nome}</p>
                                <div className="flex space-x-2 items-center mt-1">
                                  <Badge variant="outline" className="text-xs">{atividade.disciplina}</Badge>
                                  <span className="text-xs text-slate-500">{atividade.data}</span>
                                </div>
                              </div>
                              <Badge 
                                variant={atividade.concluida ? "secondary" : "outline"}
                                className={atividade.concluida ? "bg-green-100 text-green-800" : ""}
                              >
                                {atividade.concluida ? "Concluída" : "Pendente"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ProgressoAcademico;
