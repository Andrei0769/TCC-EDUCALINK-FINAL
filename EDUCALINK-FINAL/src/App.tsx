
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardProfessor from "./pages/DashboardProfessor";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";
import GerenciarNotas from "./pages/GerenciarNotas";
import Calendario from "./pages/Calendario";
import CalendarioProfessor from "./pages/CalendarioProfessor";
import Alunos from "./pages/Alunos";
import Perfil from "./pages/Perfil";
import PerfilEditar from "./pages/PerfilEditar";
import Configuracoes from "./pages/Configuracoes";
import RecuperarSenha from "./pages/RecuperarSenha";
import AtividadesPedagogicas from "./pages/AtividadesPedagogicas";
import Boletim from "./pages/Boletim";
import ProgressoAcademico from "./pages/ProgressoAcademico";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-professor" element={<DashboardProfessor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/progresso-academico" element={<ProgressoAcademico />} />
          <Route path="/gerenciar-notas" element={<GerenciarNotas />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/calendario-professor" element={<CalendarioProfessor />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/atividades-pedagogicas" element={<AtividadesPedagogicas />} />
          <Route path="/boletim" element={<Boletim />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/editar" element={<PerfilEditar />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          
          {/* Redirecionar rotas antigas para as novas */}
          <Route path="/notas" element={<Navigate to="/gerenciar-notas" replace />} />
          <Route path="/academico" element={<Navigate to="/progresso-academico" replace />} />
          <Route path="/atividades" element={<Navigate to="/atividades-pedagogicas" replace />} />
          <Route path="/materiais" element={<Navigate to="/atividades-pedagogicas" replace />} />
          <Route path="/cursos" element={<Navigate to="/atividades-pedagogicas" replace />} />
          <Route path="/relatorios" element={<Navigate to="/progresso-academico" replace />} />
          
          {/* Rota 404 para qualquer outra URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
