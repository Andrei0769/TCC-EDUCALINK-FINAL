
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from '@/lib/utils';

// Interface para os itens de pesquisa
interface SearchItem {
  title: string;
  description: string;
  href: string;
  keywords: string[];
  icon?: React.ReactNode;
  category: string;
  userType?: string[];
}

// Lista de itens para RESPONSÁVEIS
const responsavelItems: SearchItem[] = [
  {
    title: "Dashboard",
    description: "Visualize o desempenho escolar dos seus filhos",
    href: "/dashboard",
    keywords: ["início", "principal", "home", "dashboard"],
    category: "Páginas Principais",
    userType: ["responsavel"]
  },
  {
    title: "Boletim",
    description: "Acesse o boletim escolar completo",
    href: "/boletim",
    keywords: ["boletim", "notas", "avaliações", "resultados", "desempenho"],
    category: "Acadêmico",
    userType: ["responsavel"]
  },
  {
    title: "Progresso Acadêmico",
    description: "Acompanhe o progresso e desenvolvimento",
    href: "/progresso-academico",
    keywords: ["progresso", "desenvolvimento", "desempenho", "evolução"],
    category: "Acadêmico",
    userType: ["responsavel"]
  },
  {
    title: "Calendário",
    description: "Visualize eventos escolares",
    href: "/calendario",
    keywords: ["calendário", "agenda", "eventos", "datas", "programação"],
    category: "Organização",
    userType: ["responsavel"]
  },
  {
    title: "Atividades Pedagógicas",
    description: "Acompanhe as atividades e tarefas dos seus filhos",
    href: "/atividades-pedagogicas",
    keywords: ["atividades", "tarefas", "lição", "exercícios", "deveres"],
    category: "Acadêmico",
    userType: ["responsavel"]
  },
  {
    title: "Perfil",
    description: "Visualize suas informações pessoais",
    href: "/perfil",
    keywords: ["perfil", "conta", "usuário", "dados", "informações"],
    category: "Configurações",
    userType: ["responsavel"]
  },
  {
    title: "Configurações",
    description: "Ajuste as configurações da plataforma",
    href: "/configuracoes",
    keywords: ["configurações", "ajustes", "preferências", "opções"],
    category: "Configurações",
    userType: ["responsavel"]
  },
];

// Lista de itens para PROFESSORES
const professorItems: SearchItem[] = [
  {
    title: "Dashboard Professor",
    description: "Visualize suas turmas e atividades",
    href: "/dashboard-professor",
    keywords: ["início", "principal", "home", "dashboard"],
    category: "Páginas Principais",
    userType: ["professor"]
  },
  {
    title: "Gerenciar Notas",
    description: "Lançar e editar notas dos alunos",
    href: "/gerenciar-notas",
    keywords: ["notas", "avaliações", "provas", "resultados", "lançar"],
    category: "Acadêmico",
    userType: ["professor"]
  },
  {
    title: "Calendário Escolar",
    description: "Gerencie eventos e aulas",
    href: "/calendario-professor",
    keywords: ["calendário", "agenda", "eventos", "aulas", "programação"],
    category: "Organização",
    userType: ["professor"]
  },
  {
    title: "Alunos",
    description: "Visualize e gerencie informações dos alunos",
    href: "/alunos",
    keywords: ["alunos", "estudantes", "turmas", "lista"],
    category: "Gestão",
    userType: ["professor"]
  },
  {
    title: "Atividades Pedagógicas",
    description: "Crie e gerencie atividades para suas turmas",
    href: "/atividades-pedagogicas",
    keywords: ["atividades", "tarefas", "exercícios", "lição"],
    category: "Acadêmico",
    userType: ["professor"]
  },
  {
    title: "Perfil",
    description: "Visualize e edite suas informações pessoais",
    href: "/perfil",
    keywords: ["perfil", "conta", "usuário", "dados", "informações"],
    category: "Configurações",
    userType: ["professor"]
  },
  {
    title: "Configurações",
    description: "Ajuste as configurações da plataforma",
    href: "/configuracoes",
    keywords: ["configurações", "ajustes", "preferências", "opções"],
    category: "Configurações",
    userType: ["professor"]
  },
];

const SearchBar = ({ className, mobileView = false }: { className?: string, mobileView?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState<string>('responsavel');
  const navigate = useNavigate();
  
  // Detectar tipo de usuário
  useEffect(() => {
    const storedUser = localStorage.getItem('educalink-current-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserType(user.userType || 'responsavel');
    }
  }, []);
  
  // Selecionar itens baseado no tipo de usuário
  const searchItems = userType === 'professor' ? professorItems : responsavelItems;
  
  // Função para navegar para a página selecionada
  const handleSelect = (href: string) => {
    navigate(href);
    setOpen(false);
    setSearchQuery("");
  };
  
  // Filtrar itens com base na pesquisa
  const filteredItems = searchQuery.length > 0
    ? searchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : searchItems;
  
  // Agrupar itens por categoria
  const groupedItems: Record<string, SearchItem[]> = {};
  filteredItems.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex items-center justify-between",
            mobileView ? "w-full" : "w-60 lg:w-80",
            className
          )}
        >
          {searchQuery || "Pesquisar..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0",
          mobileView ? "w-[calc(100vw-2rem)]" : "w-[300px] lg:w-[400px]"
        )}
        align="start"
      >
        <Command>
          <CommandInput 
            placeholder="Pesquise por páginas, funcionalidades..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            {Object.entries(groupedItems).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map(item => (
                  <CommandItem 
                    key={item.href}
                    onSelect={() => handleSelect(item.href)}
                    className="flex flex-col items-start"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
