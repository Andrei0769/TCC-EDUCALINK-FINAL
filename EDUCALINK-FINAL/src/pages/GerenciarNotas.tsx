import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowUpDown, 
  Download, 
  Pencil, 
  Search, 
  X,
  CheckCircle,
  Lock,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Gera nomes de estudantes para cada turma específica
const generateStudents = (turma: string) => {
  // Diferentes conjuntos de nomes para diferentes turmas
  const studentsMap = {
    '6º Ano - Turma A': [
      'Ana Silva', 'Pedro Santos', 'Maria Oliveira', 'João Souza', 
      'Lucas Ferreira', 'Isabela Costa', 'Gabriel Alves', 'Sophia Ribeiro',
      'Miguel Lima', 'Laura Gomes', 'Arthur Pereira', 'Julia Martins', 
      'Davi Carvalho', 'Manuela Almeida', 'Bernardo Lopes', 'Helena Castro'
    ],
    '7º Ano - Turma B': [
      'Rafael Nunes', 'Carolina Dias', 'Gustavo Mendes', 'Beatriz Cardoso', 
      'Enzo Correia', 'Valentina Barbosa', 'Leonardo Nascimento', 'Luiza Fernandes',
      'Felipe Moreira', 'Alice Pinto', 'Bruno Teixeira', 'Mariana Campos', 
      'Daniel Duarte', 'Gabriela Vieira', 'Samuel Rocha', 'Cecília Miranda'
    ],
    '8º Ano - Turma C': [
      'Matheus Andrade', 'Larissa Freitas', 'Pedro Henrique Monteiro', 'Bianca Sousa', 
      'Diego Barros', 'Amanda Rezende', 'Eduardo Ramos', 'Vitória Melo',
      'Vitor Azevedo', 'Camila Torres', 'Thiago Carneiro', 'Letícia Silveira', 
      'Caio Rodrigues', 'Fernanda Machado', 'Henrique Oliveira', 'Isadora Lima'
    ],
    '9º Ano - Turma D': [
      'Guilherme Aguiar', 'Lívia Moraes', 'Nicolas Fonseca', 'Yasmin Cardoso', 
      'Lucca Peixoto', 'Stella Nogueira', 'Ryan Ferreira', 'Luna Miranda',
      'Murilo Xavier', 'Sofia Araujo', 'Benjamin Castro', 'Nina Cavalcanti', 
      'Joaquim Sampaio', 'Clara Martins', 'Antônio Vasconcelos', 'Olívia Braga'
    ]
  };
  
  return (studentsMap[turma as keyof typeof studentsMap] || []).map((name, index) => ({
    id: index + 1,
    name,
    turma: turma
  }));
};

interface Student {
  id: number;
  name: string;
  turma: string;
}

interface GradeEntry {
  studentId: number;
  studentName: string;
  grades: {
    [subject: string]: {
      [evaluationType: string]: number | null;
    };
  };
}

// Constantes fora do componente para evitar recriação
const ASSESSMENT_TYPES = ['Prova 1', 'Prova 2', 'Trabalho', 'Participação', 'Média'];

const SUBJECTS = [
  'Matemática',
  'Português',
  'Ciências',
  'História',
  'Geografia',
  'Física',
  'Química',
  'Biologia',
  'Artes',
  'Educação Física',
  'Inglês',
  'Espanhol',
  'Filosofia',
  'Sociologia'
];

const TURMAS = [
  '6º Ano - Turma A',
  '7º Ano - Turma B',
  '8º Ano - Turma C',
  '9º Ano - Turma D'
];

const GerenciarNotas = () => {
  const { toast } = useToast();
  const [turmaAtiva, setTurmaAtiva] = useState('6º Ano - Turma A');
  const [bimestre, setBimestre] = useState('1');
  const [disciplina, setDisciplina] = useState(""); // inicia vazio e só preenche no useEffect
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState<{studentId: number, type: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userSubjects, setUserSubjects] = useState<string[]>([]);

  // Atualiza disciplinas do usuário e disciplina ativa ao carregar usuário
  useEffect(() => {
    const storedUser = localStorage.getItem('educalink-current-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);

      let profSubjects: string[] = [];
      if (user.userType === 'professor' && user.materia) {
        if (Array.isArray(user.materia)) {
          profSubjects = user.materia;
        } else if (typeof user.materia === "string" && user.materia.length > 0) {
          profSubjects = [user.materia];
        }
      }
      setUserSubjects(profSubjects);

      // Para professores, obrigatoriamente seleciona a PRIMEIRA matéria disponível - nunca vazio!
      if (profSubjects.length > 0) {
        setDisciplina(profSubjects[0]);
      } else {
        setDisciplina(""); // sem matérias, disciplina vazia (dropdown mostra desabilitado)
      }
    }
  }, []);

  // Atualiza alunos e notas ao mudar turma ou disciplina
  useEffect(() => {
    // Se não houver disciplina (exemplo: professor sem nenhuma matéria), não faz nada
    if (!disciplina) {
      setStudents([]);
      setGrades([]);
      return;
    }
    // Gerar dados de alunos para a turma selecionada
    // Utilize turmaAtiva normalmente
    const generatedStudents = generateStudents(turmaAtiva);
    setStudents(generatedStudents);

    const storedGrades = localStorage.getItem(`grades-${turmaAtiva}`);
    if (storedGrades) {
      setGrades(JSON.parse(storedGrades));
    } else {
      // Gerar notas aleatórias para cada aluno
      const initialGrades: GradeEntry[] = generatedStudents.map(student => ({
        studentId: student.id,
        studentName: student.name,
        grades: SUBJECTS.reduce((acc, subject) => {
          acc[subject] = {
            'Prova 1': Math.floor(Math.random() * 5) + 6, // Nota aleatória entre 6-10
            'Prova 2': Math.floor(Math.random() * 5) + 6,
            'Trabalho': Math.floor(Math.random() * 3) + 7, // Nota aleatória entre 7-9
            'Participação': Math.floor(Math.random() * 3) + 7,
            'Média': 0,
          };
          return acc;
        }, {} as { [subject: string]: { [evaluationType: string]: number | null } })
      }));

      // Calcular médias como antes
      const gradesWithAverages = initialGrades.map(studentGrade => {
        SUBJECTS.forEach(subject => {
          const subjectGrades = studentGrade.grades[subject];
          const sum = (subjectGrades['Prova 1'] || 0) * 0.3 + 
                      (subjectGrades['Prova 2'] || 0) * 0.3 + 
                      (subjectGrades['Trabalho'] || 0) * 0.25 + 
                      (subjectGrades['Participação'] || 0) * 0.15;
          subjectGrades['Média'] = parseFloat(sum.toFixed(1));
        });
        return studentGrade;
      });
      setGrades(gradesWithAverages);
      localStorage.setItem(`grades-${turmaAtiva}`, JSON.stringify(gradesWithAverages));
    }
  }, [turmaAtiva, disciplina]);

  // Só pode editar se for professor e disciplina estiver dentre as do usuário
  const canEditSubject = () => {
    if (!currentUser) return false;
    if (userSubjects.length === 0) return false;
    return userSubjects.includes(disciplina);
  };

  // Filtrar alunos por termo de pesquisa
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manipular edição de notas
  const startEditingCell = (studentId: number, type: string, currentValue: number | null) => {
    // Se o professor não pode editar esta disciplina, mostrar um aviso
    if (!canEditSubject()) {
      toast({
        title: "Permissão negada",
        description: "Você só pode editar notas da sua própria disciplina.",
        variant: "destructive"
      });
      return;
    }
    
    setEditingCell({ studentId, type });
    setEditValue(currentValue ? currentValue.toString() : '');
  };

  const saveEditedCell = (studentId: number, type: string) => {
    if (!editingCell) return;
    
    const numericValue = parseFloat(editValue);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 10) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira uma nota entre 0 e 10.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedGrades = grades.map(grade => {
      if (grade.studentId === studentId) {
        const updatedSubjectGrades = { ...grade.grades[disciplina] };
        updatedSubjectGrades[type] = numericValue;
        
        // Recalcular a média se não estiver editando a média diretamente
        if (type !== 'Média') {
          const sum = (updatedSubjectGrades['Prova 1'] || 0) * 0.3 + 
                     (updatedSubjectGrades['Prova 2'] || 0) * 0.3 + 
                     (updatedSubjectGrades['Trabalho'] || 0) * 0.25 + 
                     (updatedSubjectGrades['Participação'] || 0) * 0.15;
          
          updatedSubjectGrades['Média'] = parseFloat(sum.toFixed(1));
        }
        
        return {
          ...grade,
          grades: {
            ...grade.grades,
            [disciplina]: updatedSubjectGrades
          }
        };
      }
      return grade;
    });
    
    setGrades(updatedGrades);
    localStorage.setItem(`grades-${turmaAtiva}`, JSON.stringify(updatedGrades));
    setEditingCell(null);
    
    toast({
      title: "Nota atualizada",
      description: "A nota foi atualizada com sucesso.",
    });
  };

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const exportToPDF = () => {
    if (!disciplina) {
      toast({
        title: "Erro ao exportar",
        description: "Selecione uma disciplina antes de exportar.",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Notas', pageWidth / 2, 20, { align: 'center' });
    
    // Informações do cabeçalho
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Turma: ${turmaAtiva}`, 14, 35);
    doc.text(`Disciplina: ${disciplina}`, 14, 42);
    doc.text(`Trimestre: ${bimestre}º`, 14, 49);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 56);
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(14, 60, pageWidth - 14, 60);
    
    let yPosition = 70;
    
    // Iterar por cada aluno
    filteredStudents.forEach((student, index) => {
      const studentGrade = grades.find(g => g.studentId === student.id);
      const subjectGrades = studentGrade?.grades[disciplina] || {};
      
      // Verificar se precisa de nova página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Nome do aluno
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${student.name}`, 14, yPosition);
      yPosition += 8;
      
      // Preparar dados da tabela de notas
      const tableData = [
        ['Prova 1', (subjectGrades['Prova 1'] ?? '-').toString()],
        ['Prova 2', (subjectGrades['Prova 2'] ?? '-').toString()],
        ['Trabalho', (subjectGrades['Trabalho'] ?? '-').toString()],
        ['Participação', (subjectGrades['Participação'] ?? '-').toString()],
        ['Média Final', (subjectGrades['Média'] ?? '-').toString()],
      ];
      
      // Tabela de notas do aluno
      autoTable(doc, {
        startY: yPosition,
        head: [['Avaliação', 'Nota']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { 
          halign: 'center',
          fontSize: 10
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80 },
          1: { cellWidth: 30 }
        },
        margin: { left: 20 },
        didParseCell: function(data) {
          // Colorir a média baseado no valor
          if (data.row.index === 4 && data.column.index === 1) {
            const media = parseFloat(data.cell.text[0]);
            if (!isNaN(media)) {
              if (media >= 7) {
                data.cell.styles.textColor = [22, 163, 74]; // verde
                data.cell.styles.fontStyle = 'bold';
              } else if (media >= 5) {
                data.cell.styles.textColor = [245, 158, 11]; // amarelo
                data.cell.styles.fontStyle = 'bold';
              } else {
                data.cell.styles.textColor = [220, 38, 38]; // vermelho
                data.cell.styles.fontStyle = 'bold';
              }
            }
          }
        }
      });
      
      // @ts-ignore - autoTable adiciona a propriedade lastAutoTable ao doc
      yPosition = doc.lastAutoTable.finalY + 12;
    });
    
    // Rodapé em todas as páginas
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Salvar o PDF
    const fileName = `Notas_${turmaAtiva.replace(/\s+/g, '_')}_${disciplina.replace(/\s+/g, '_')}_${bimestre}Tri.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF exportado com sucesso!",
      description: `O arquivo ${fileName} foi baixado.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciar Notas</h1>
            <p className="text-muted-foreground">Visualize e edite as notas dos alunos por turma e disciplina.</p>
          </div>
          
          <Button 
            className="md:self-end" 
            variant="outline"
            onClick={exportToPDF}
          >
            <Download className="mr-2 h-4 w-4" /> Exportar notas
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="turma">Turma</Label>
              <Select value={turmaAtiva} onValueChange={setTurmaAtiva}>
                <SelectTrigger id="turma">
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {TURMAS.map((turma) => (
                    <SelectItem key={turma} value={turma}>
                      {turma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trimestre">Trimestre</Label>
              <Select value={bimestre} onValueChange={setBimestre}>
                <SelectTrigger id="trimestre">
                  <SelectValue placeholder="Selecione o trimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1º Trimestre</SelectItem>
                  <SelectItem value="2">2º Trimestre</SelectItem>
                  <SelectItem value="3">3º Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="disciplina">Disciplina</Label>
              <Select
                value={disciplina}
                onValueChange={(value) => setDisciplina(value)}
                disabled={userSubjects.length <= 1}
              >
                <SelectTrigger id="disciplina">
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {userSubjects.length > 0
                    ? userSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))
                    : (
                        <SelectItem key="none" value="indisponível" disabled>
                          Nenhuma disciplina vinculada
                        </SelectItem>
                      )
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search">Buscar aluno</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome do aluno..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Notas de {disciplina} - {turmaAtiva} - {bimestre}º Bimestre
              </CardTitle>
              <CardDescription>
                {canEditSubject() 
                  ? "Clique em uma nota para editar. A média é calculada automaticamente."
                  : "Você só pode editar notas da sua própria disciplina."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] w-full rounded-md overflow-x-auto overflow-y-auto">
                <div className="min-w-max">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap sticky left-0 bg-white dark:bg-slate-950 z-10 min-w-[180px]">
                          <div className="flex items-center gap-1">
                            Aluno
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        {ASSESSMENT_TYPES.map((type) => (
                          <TableHead key={type} className="whitespace-nowrap text-center">
                            {type}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                          const studentGrade = grades.find(g => g.studentId === student.id);
                          const subjectGrades = studentGrade?.grades[disciplina] || {};
                          
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-950 z-10">
                                {student.name}
                              </TableCell>
                              {ASSESSMENT_TYPES.map((type) => {
                                const isEditing = editingCell?.studentId === student.id && editingCell?.type === type;
                                const value = subjectGrades[type] ?? null;
                                const isAverage = type === 'Média';
                                const isEditable = canEditSubject() && !isAverage;
                                
                                const getGradeColor = (grade: number | null) => {
                                  if (grade === null) return '';
                                  if (grade >= 7) return 'text-green-600 font-medium';
                                  if (grade >= 5) return 'text-amber-600 font-medium';
                                  return 'text-red-600 font-medium';
                                };
                                
                                return (
                                  <TableCell key={type} className="text-center">
                                    {isEditing ? (
                                      <div className="flex items-center justify-center space-x-1">
                                        <Input
                                          className="h-8 w-16 text-center"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          autoFocus
                                        />
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 text-green-600"
                                          onClick={() => saveEditedCell(student.id, type)}
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 text-red-600"
                                          onClick={cancelEditing}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => isEditable && startEditingCell(student.id, type, value)}
                                        className={`w-full py-1 px-2 rounded-md transition-colors 
                                          ${isEditable ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-not-allowed'} 
                                          ${getGradeColor(value)}`}
                                        disabled={!isEditable}
                                        title={
                                          isAverage ? "A média é calculada automaticamente" : 
                                          !canEditSubject() ? "Você não tem permissão para editar esta disciplina" :
                                          "Clique para editar"
                                        }
                                      >
                                        {value !== null ? value : '-'}
                                        {isEditable ? (
                                          <Pencil className="h-3 w-3 inline ml-1 opacity-50" />
                                        ) : !isAverage && !canEditSubject() ? (
                                          <Lock className="h-3 w-3 inline ml-1 opacity-50" />
                                        ) : null}
                                      </button>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={ASSESSMENT_TYPES.length + 1} className="text-center py-6">
                            Nenhum aluno encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default GerenciarNotas;
