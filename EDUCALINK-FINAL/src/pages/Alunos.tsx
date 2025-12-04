
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit2, Check, X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Generate realistic student data for grades 2-5
const generateStudents = () => {
  const firstNames = [
    'Ana', 'Pedro', 'Maria', 'João', 'Lucas', 'Isabela', 'Gabriel', 'Sophia',
    'Miguel', 'Laura', 'Arthur', 'Julia', 'Davi', 'Manuela', 'Bernardo', 'Helena',
    'Heitor', 'Valentina', 'Rafael', 'Alice', 'Lorenzo', 'Mariana', 'Enzo', 'Livia',
    'Guilherme', 'Lara', 'Gustavo', 'Beatriz', 'Murilo', 'Giovanna'
  ];
  
  const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
    'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
    'Araujo', 'Monteiro', 'Barros', 'Mendes', 'Freitas', 'Barbosa', 'Moreira', 'Dias',
    'Cardoso', 'Teixeira', 'Vieira', 'Fernandes', 'Ramos', 'Nascimento'
  ];
  
  const students = [];
  let id = 1;
  
  const grades = ['2º ano', '3º ano', '4º ano', '5º ano'];
  
  grades.forEach(grade => {
    for (let i = 0; i < 30; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      
      // Generate random age based on grade
      let age;
      switch (grade) {
        case '2º ano': age = Math.floor(Math.random() * 2) + 7; break;
        case '3º ano': age = Math.floor(Math.random() * 2) + 8; break;
        case '4º ano': age = Math.floor(Math.random() * 2) + 9; break;
        case '5º ano': age = Math.floor(Math.random() * 2) + 10; break;
        default: age = 8;
      }
      
      // Generate random attendance between 40-100%
      const attendance = Math.floor(Math.random() * 61) + 40;
      
      // Determine status based on attendance
      let status;
      if (attendance >= 65) {
        status = 'Regular';
      } else if (attendance >= 45) {
        status = 'Atenção';
      } else {
        status = 'Extrema Atenção';
      }
      
      students.push({
        id: id++,
        name,
        grade,
        age,
        parentName: `Resp. ${lastName}`,
        attendance,
        status
      });
    }
  });
  
  return students;
};

// Initial students data
const initialStudentsData = generateStudents();

const Alunos = () => {
  const [activeTab, setActiveTab] = useState('2º ano');
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [studentsData, setStudentsData] = useState(initialStudentsData);
  const [editFormData, setEditFormData] = useState({
    name: '',
    age: '',
    parentName: '',
    attendance: '',
    status: ''
  });
  const { toast } = useToast();

  // Update status based on attendance
  const updateStatus = (attendance: number) => {
    if (attendance >= 65) return 'Regular';
    if (attendance >= 45) return 'Atenção';
    return 'Extrema Atenção';
  };

  useEffect(() => {
    // Get students from localStorage if available
    const storedStudents = localStorage.getItem('educalink-students');
    if (storedStudents) {
      setStudentsData(JSON.parse(storedStudents));
    } else {
      localStorage.setItem('educalink-students', JSON.stringify(initialStudentsData));
    }
  }, []);

  // Filter students by grade and search term
  const filteredStudents = studentsData.filter(student => 
    student.grade === activeTab && 
    (searchTerm === '' || 
     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (student: any) => {
    setCurrentStudent(student);
    setEditFormData({
      name: student.name,
      age: student.age.toString(),
      parentName: student.parentName,
      attendance: student.attendance.toString(),
      status: student.status
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update status automatically when attendance changes
    if (name === 'attendance') {
      const attendanceValue = parseInt(value, 10);
      if (!isNaN(attendanceValue)) {
        const newStatus = updateStatus(attendanceValue);
        setEditFormData({
          ...editFormData,
          [name]: value,
          status: newStatus
        });
      } else {
        setEditFormData({
          ...editFormData,
          [name]: value
        });
      }
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  const handleSubmitEdit = () => {
    if (!currentStudent) return;
    
    const updatedStudents = studentsData.map(student => {
      if (student.id === currentStudent.id) {
        return {
          ...student,
          name: editFormData.name,
          age: parseInt(editFormData.age),
          parentName: editFormData.parentName,
          attendance: parseInt(editFormData.attendance),
          status: editFormData.status
        };
      }
      return student;
    });
    
    setStudentsData(updatedStudents);
    localStorage.setItem('educalink-students', JSON.stringify(updatedStudents));
    
    toast({
      title: "Informações atualizadas",
      description: `As informações de ${editFormData.name} foram atualizadas com sucesso.`,
    });
    setEditDialogOpen(false);
  };

  // Helper function to get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Regular':
        return 'text-green-600 font-medium';
      case 'Atenção':
        return 'text-amber-600 font-medium';
      case 'Extrema Atenção':
        return 'text-red-600 font-medium';
      default:
        return 'text-green-600 font-medium';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
        <p className="text-muted-foreground">Gerencie os alunos e visualize suas informações.</p>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno por nome..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="2º ano" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="2º ano">2º ano</TabsTrigger>
              <TabsTrigger value="3º ano">3º ano</TabsTrigger>
              <TabsTrigger value="4º ano">4º ano</TabsTrigger>
              <TabsTrigger value="5º ano">5º ano</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{activeTab} - Lista de Alunos</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {filteredStudents.length > 0 ? (
                    <div className="min-w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Idade</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead>Frequência</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.age} anos</TableCell>
                              <TableCell>{student.parentName}</TableCell>
                              <TableCell>{student.attendance}%</TableCell>
                              <TableCell>
                                <span className={getStatusColor(student.status)}>
                                  {student.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditClick(student)}
                                  className="whitespace-nowrap"
                                >
                                  <Edit2 className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p>Nenhum aluno encontrado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar informações do aluno</DialogTitle>
            <DialogDescription>
              Atualize as informações do aluno. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Idade
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="5"
                max="18"
                value={editFormData.age}
                onChange={handleEditFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentName" className="text-right">
                Responsável
              </Label>
              <Input
                id="parentName"
                name="parentName"
                value={editFormData.parentName}
                onChange={handleEditFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendance" className="text-right">
                Frequência (%)
              </Label>
              <Input
                id="attendance"
                name="attendance"
                type="number"
                min="0"
                max="100"
                value={editFormData.attendance}
                onChange={handleEditFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                name="status"
                value={editFormData.status}
                onChange={handleEditFormChange}
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
              >
                <option value="Regular">Regular</option>
                <option value="Atenção">Atenção</option>
                <option value="Extrema Atenção">Extrema Atenção</option>
              </select>
              <p className="col-span-4 text-xs text-right text-slate-500 mt-1">
                Status é atualizado automaticamente com base na frequência
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmitEdit}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Alunos;
