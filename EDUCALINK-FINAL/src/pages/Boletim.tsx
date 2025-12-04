
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Child } from '@/schemas/cadastroSchema';
import { BarChart, Calendar, FileText } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Nota {
  id: number;
  disciplina: string;
  nota1: number;
  nota2: number;
  nota3: number;
  media: number;
  frequencia: number;
  observacoes?: string;
  status: 'aprovado' | 'recuperacao' | 'reprovado';
}

interface Aluno {
  id: number;
  nome: string;
  turma: string;
  ano: string;
  notas: Nota[];
}

const Boletim = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filhos, setFilhos] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedAnoLetivo, setSelectedAnoLetivo] = useState('2024');
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [selectedTrimestre, setSelectedTrimestre] = useState('todos');
  const [anosLetivos] = useState(['2023', '2024']);
  const [turmas, setTurmas] = useState<string[]>([]);
  const [dadosBoletim, setDadosBoletim] = useState<Aluno[]>([]);
  const [alunoAtual, setAlunoAtual] = useState<Aluno | null>(null);

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
        
        // Extrair turmas dos filhos
        const turmasUnicas = [...new Set(user.filhos.map((filho: Child) => filho.serie))];
        // Fix: Explicitly type the turmas array as string[]
        setTurmas(turmasUnicas as string[]);
        if (turmasUnicas.length > 0) {
          // Fix: Ensure we're setting a string
          setSelectedTurma(turmasUnicas[0] as string);
        }
      }
      
      // Gerar dados de exemplo para o boletim
      gerarDadosExemplo(user);
    } else {
      setIsAuthenticated(false);
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar o boletim escolar.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Gerar dados de exemplo para o boletim
  const gerarDadosExemplo = (user: any) => {
    if (!user.filhos || user.filhos.length === 0) return;
    
    const dadosGerados: Aluno[] = user.filhos.map((filho: Child, index: number) => {
      // Criar notas aleatórias para cada disciplina
      const disciplinas = ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física', 'Inglês'];
      
      const notasDisciplinas = disciplinas.map((disc, i) => {
        const nota1 = parseFloat((Math.random() * 4 + 6).toFixed(1));
        const nota2 = parseFloat((Math.random() * 4 + 6).toFixed(1));
        const nota3 = parseFloat((Math.random() * 4 + 6).toFixed(1));
        const media = parseFloat(((nota1 + nota2 + nota3) / 3).toFixed(1));
        const frequencia = Math.floor(Math.random() * 15 + 85);
        
        let status: 'aprovado' | 'recuperacao' | 'reprovado';
        if (media >= 7) {
          status = 'aprovado';
        } else if (media >= 5) {
          status = 'recuperacao';
        } else {
          status = 'reprovado';
        }
        
        const observacoes = i % 3 === 0 
          ? 'Aluno demonstra interesse e participação ativa nas aulas.' 
          : i % 3 === 1 
            ? 'Precisa melhorar a organização e entrega de trabalhos.'
            : undefined;
        
        return {
          id: i + 1,
          disciplina: disc,
          nota1,
          nota2,
          nota3,
          media,
          frequencia,
          observacoes,
          status
        };
      });
      
      return {
        id: index + 1,
        nome: filho.nome,
        turma: filho.serie,
        ano: '2024',
        notas: notasDisciplinas
      };
    });
    
    setDadosBoletim(dadosGerados);
    if (dadosGerados.length > 0) {
      setAlunoAtual(dadosGerados[0]);
    }
  };

  // Atualizar aluno atual quando mudar a seleção do filho
  useEffect(() => {
    if (selectedChild && dadosBoletim.length > 0) {
      const aluno = dadosBoletim.find(a => a.nome === selectedChild);
      if (aluno) {
        setAlunoAtual(aluno);
        const turmaDoAluno = aluno.turma;
        if (turmaDoAluno && !selectedTurma) {
          setSelectedTurma(turmaDoAluno);
        }
      }
    }
  }, [selectedChild, dadosBoletim, selectedTurma]);

  // Preparar dados para o gráfico de desempenho
  const prepararDadosGrafico = () => {
    if (!alunoAtual) return [];
    
    return alunoAtual.notas.map(nota => ({
      name: nota.disciplina,
      'Trimestre 1': nota.nota1,
      'Trimestre 2': nota.nota2,
      'Trimestre 3': nota.nota3,
      'Média': nota.media
    }));
  };

  // Filtrar notas pelo trimestre selecionado
  const getNota = (nota: Nota, trimestre: string) => {
    if (trimestre === 'todos') return nota.media;
    if (trimestre === '1') return nota.nota1;
    if (trimestre === '2') return nota.nota2;
    if (trimestre === '3') return nota.nota3;
    return nota.media;
  };

  // Obter média geral do aluno no trimestre selecionado
  const getMediaGeral = () => {
    if (!alunoAtual) return 0;
    
    const notas = alunoAtual.notas.map(nota => {
      if (selectedTrimestre === 'todos') return nota.media;
      if (selectedTrimestre === '1') return nota.nota1;
      if (selectedTrimestre === '2') return nota.nota2;
      if (selectedTrimestre === '3') return nota.nota3;
      return nota.media;
    });
    
    const soma = notas.reduce((acc, nota) => acc + nota, 0);
    return parseFloat((soma / notas.length).toFixed(1));
  };

  // Obter a cor do status com base na nota
  const getStatusColor = (nota: number): string => {
    if (nota >= 7) return 'bg-green-100 text-green-800';
    if (nota >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Obter o texto do status com base na nota
  const getStatusText = (nota: number): string => {
    if (nota >= 7) return 'Aprovado';
    if (nota >= 5) return 'Recuperação';
    return 'Reprovado';
  };

  // Renderizar tabela de notas para tela maior
  const renderTabelaNotas = () => {
    if (!alunoAtual) return null;
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Disciplina</TableHead>
            {selectedTrimestre === 'todos' && (
              <>
                <TableHead>1º Tri</TableHead>
                <TableHead>2º Tri</TableHead>
                <TableHead>3º Tri</TableHead>
              </>
            )}
            <TableHead>{selectedTrimestre === 'todos' ? 'Média Final' : `Nota ${selectedTrimestre}º Tri`}</TableHead>
            <TableHead>Freq.</TableHead>
            <TableHead>Situação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunoAtual.notas.map((nota) => {
            const notaExibida = getNota(nota, selectedTrimestre);
            return (
              <TableRow key={nota.id}>
                <TableCell className="font-medium">{nota.disciplina}</TableCell>
                {selectedTrimestre === 'todos' && (
                  <>
                    <TableCell>{nota.nota1.toFixed(1)}</TableCell>
                    <TableCell>{nota.nota2.toFixed(1)}</TableCell>
                    <TableCell>{nota.nota3.toFixed(1)}</TableCell>
                  </>
                )}
                <TableCell>{notaExibida.toFixed(1)}</TableCell>
                <TableCell>{nota.frequencia}%</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(notaExibida)}>
                    {getStatusText(notaExibida)}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  // Renderizar cards de notas para mobile
  const renderCardsNotas = () => {
    if (!alunoAtual) return null;
    
    return (
      <div className="space-y-4">
        {alunoAtual.notas.map((nota) => {
          const notaExibida = getNota(nota, selectedTrimestre);
          return (
            <Card key={nota.id} className="border-l-4" style={{ borderLeftColor: notaExibida >= 7 ? '#4ade80' : notaExibida >= 5 ? '#facc15' : '#f87171' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{nota.disciplina}</CardTitle>
                <div className="flex justify-between items-center">
                  <Badge className={getStatusColor(notaExibida)}>
                    {getStatusText(notaExibida)}
                  </Badge>
                  <span className="text-sm font-medium">Freq: {nota.frequencia}%</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {selectedTrimestre === 'todos' ? (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-slate-500">1º Tri</div>
                      <div className="font-semibold">{nota.nota1.toFixed(1)}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-slate-500">2º Tri</div>
                      <div className="font-semibold">{nota.nota2.toFixed(1)}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-slate-500">3º Tri</div>
                      <div className="font-semibold">{nota.nota3.toFixed(1)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="py-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Nota {selectedTrimestre}º Trimestre:</span>
                      <span className="font-medium">{notaExibida.toFixed(1)}</span>
                    </div>
                    <Progress value={notaExibida * 10} className="h-2" />
                  </div>
                )}
                
                {selectedTrimestre === 'todos' && (
                  <div className="py-1 mt-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Média Final:</span>
                      <span className="font-medium">{nota.media.toFixed(1)}</span>
                    </div>
                    <Progress value={nota.media * 10} className="h-2" />
                  </div>
                )}
              </CardContent>
              {nota.observacoes && (
                <CardFooter className="pt-0 text-xs text-slate-600">
                  <p><strong>Observações:</strong> {nota.observacoes}</p>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Acesso Restrito</CardTitle>
              <CardDescription>Faça login para visualizar o boletim escolar</CardDescription>
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
            <h1 className="text-2xl font-bold tracking-tight">Boletim Escolar</h1>
            <p className="text-muted-foreground">Acompanhe o desempenho acadêmico.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {filhos.length > 1 && (
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
            
            <Select value={selectedAnoLetivo} onValueChange={setSelectedAnoLetivo}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Ano letivo" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((ano) => (
                  <SelectItem key={ano} value={ano}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Informações do aluno e filtros */}
        {alunoAtual && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>{alunoAtual.nome}</CardTitle>
                  <CardDescription>{alunoAtual.turma} • Ano Letivo {alunoAtual.ano}</CardDescription>
                </div>

                <Tabs value={selectedTrimestre} onValueChange={setSelectedTrimestre} className="w-full sm:w-auto">
                  <TabsList className={isMobile ? "grid grid-cols-2 gap-1 w-full" : "flex flex-row"}>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="1">1º Tri</TabsTrigger>
                    <TabsTrigger value="2">2º Tri</TabsTrigger>
                    <TabsTrigger value="3">3º Tri</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent>
              {/* Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Média Geral
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getMediaGeral().toFixed(1)}</div>
                    <Progress value={getMediaGeral() * 10} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Em {selectedTrimestre === 'todos' ? 'todos os trimestres' : `${selectedTrimestre}º trimestre`}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Frequência
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {alunoAtual.notas.reduce((acc, n) => acc + n.frequencia, 0) / alunoAtual.notas.length}%
                    </div>
                    <Progress 
                      value={alunoAtual.notas.reduce((acc, n) => acc + n.frequencia, 0) / alunoAtual.notas.length} 
                      className="h-2 mt-2" 
                    />
                    <p className="text-xs text-muted-foreground mt-2">Presença média nas aulas</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart className="h-4 w-4" /> Situação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-600">
                          {alunoAtual.notas.filter(n => n.media >= 7).length}
                        </div>
                        <p className="text-xs">Aprovado</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-yellow-600">
                          {alunoAtual.notas.filter(n => n.media >= 5 && n.media < 7).length}
                        </div>
                        <p className="text-xs">Recuperação</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-600">
                          {alunoAtual.notas.filter(n => n.media < 5).length}
                        </div>
                        <p className="text-xs">Reprovado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de notas (desktop) ou Cards (mobile) */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Notas por Disciplina</h3>
                {isMobile ? renderCardsNotas() : renderTabelaNotas()}
              </div>

              {/* Gráfico de evolução */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Evolução do Desempenho</h3>
                <div className={isMobile ? "h-[300px]" : "h-[400px]"}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={prepararDadosGrafico()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fontSize: isMobile ? 10 : 12 }} 
                      />
                      <YAxis domain={[0, 10]} />
                      <RechartsTooltip />
                      <Legend />
                      {selectedTrimestre === 'todos' || selectedTrimestre === '1' ? (
                        <Bar dataKey="Trimestre 1" fill="#9b87f5" />
                      ) : null}
                      {selectedTrimestre === 'todos' || selectedTrimestre === '2' ? (
                        <Bar dataKey="Trimestre 2" fill="#7E69AB" />
                      ) : null}
                      {selectedTrimestre === 'todos' || selectedTrimestre === '3' ? (
                        <Bar dataKey="Trimestre 3" fill="#D6BCFA" />
                      ) : null}
                      {selectedTrimestre === 'todos' && (
                        <Bar dataKey="Média" fill="#1A1F2C" />
                      )}
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legenda */}
              <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t">
                <Badge className="bg-green-100 text-green-800">Aprovado: Nota maior ou igual a 7.0</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Recuperação: Nota entre 5.0 e 7.0</Badge>
                <Badge className="bg-red-100 text-red-800">Reprovado: Nota menor que 5.0</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Boletim;
