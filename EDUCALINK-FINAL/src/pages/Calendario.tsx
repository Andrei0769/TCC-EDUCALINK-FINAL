
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Child } from '@/schemas/cadastroSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tipo para eventos do calendário
interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: string; // Alterado de tipo específico para string para permitir tipos personalizados
  customType?: string; // Campo opcional para tipo personalizado
  createdBy: string;
  childName?: string; // Optional field to associate events with specific children
}

// Lista expandida de tipos de eventos
const eventTypes = [
  { value: "aula", label: "Aula" },
  { value: "prova", label: "Prova" },
  { value: "evento", label: "Evento Escolar" },
  { value: "feriado", label: "Feriado" },
  { value: "reuniao", label: "Reunião" },
  { value: "excursao", label: "Excursão" },
  { value: "atividade", label: "Atividade Extracurricular" },
  { value: "esporte", label: "Evento Esportivo" },
  { value: "arte", label: "Evento Artístico/Cultural" }, 
  { value: "custom", label: "Personalizado" }
];

const CalendarioPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventType, setNewEventType] = useState<string>('evento');
  const [customEventType, setCustomEventType] = useState('');
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [filhos, setFilhos] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('todos');
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load user data and initialize events
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('educalink-current-user') || '{}');
    
    if (userData && userData.filhos && userData.filhos.length > 0) {
      setFilhos(userData.filhos);
      
      // Initialize events from localStorage or create default events for each child
      const storedEvents = localStorage.getItem('calendar-events');
      
      if (storedEvents) {
        // Parse dates from JSON
        const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      } else {
        const initialEvents: CalendarEvent[] = [];
        
        // Create events for each child
        userData.filhos.forEach((child: Child) => {
          // Add some default events for each child based on their grade
          const childEvents = [
            {
              id: `${Date.now()}-${child.nome}-1`,
              date: new Date(new Date().setDate(new Date().getDate() + 3)),
              title: `Prova de Matemática - ${child.serie}`,
              description: `Avaliação para ${child.nome} - conteúdo: operações básicas`,
              type: 'prova',
              createdBy: 'Sistema',
              childName: child.nome
            },
            {
              id: `${Date.now()}-${child.nome}-2`,
              date: new Date(new Date().setDate(new Date().getDate() + 7)),
              title: `Reunião de Pais - ${child.serie}`,
              description: `Reunião para discutir o desempenho de ${child.nome}`,
              type: 'reuniao',
              createdBy: 'Coordenação',
              childName: child.nome
            }
          ];
          
          initialEvents.push(...childEvents);
        });
        
        // Add some general events
        initialEvents.push({
          id: `${Date.now()}-geral-1`,
          date: new Date(new Date().setDate(new Date().getDate() + 10)),
          title: 'Feriado Escolar',
          description: 'Não haverá aula neste dia',
          type: 'feriado',
          createdBy: 'Sistema'
        });
        
        setEvents(initialEvents);
        localStorage.setItem('calendar-events', JSON.stringify(initialEvents));
      }
    }
  }, []);

  // Função para adicionar um novo evento
  const addEvent = () => {
    if (!selectedDate || !newEventTitle) return;
    
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEventTitle,
      description: newEventDescription,
      type: newEventType === 'custom' ? 'custom' : newEventType,
      customType: newEventType === 'custom' ? customEventType : undefined,
      createdBy: 'Responsável',
      childName: selectedChild !== 'todos' ? selectedChild : undefined
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    // Save to localStorage
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents.map(event => ({
      ...event,
      date: event.date.toISOString()
    }))));
    
    setNewEventTitle('');
    setNewEventDescription('');
    setCustomEventType('');
    setIsAddingEvent(false);
    
    toast({
      title: "Evento adicionado",
      description: `O evento "${newEventTitle}" foi adicionado com sucesso para o dia ${format(selectedDate, 'dd/MM/yyyy')}.`,
    });
  };

  // Filter events for the selected date and child
  const filteredEvents = selectedDate 
    ? events.filter(event => {
        const dateMatch = isSameDay(event.date, selectedDate);
        const childMatch = selectedChild === 'todos' || 
                          !event.childName || 
                          event.childName === selectedChild;
        return dateMatch && childMatch;
      })
    : [];

  // Função para obter a cor da badge conforme o tipo do evento
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'aula':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'prova':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'evento':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'feriado':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'reuniao':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'excursao':
        return 'bg-teal-100 text-teal-800 hover:bg-teal-200';
      case 'atividade':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'esporte':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'arte':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      case 'custom':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Filter upcoming events based on selected child
  const upcomingEvents = events
    .filter(event => {
      const isUpcoming = event.date >= new Date();
      const childMatch = selectedChild === 'todos' || 
                        !event.childName || 
                        event.childName === selectedChild;
      return isUpcoming && childMatch;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Formatar o nome do tipo de evento para exibição
  const getEventTypeName = (event: CalendarEvent) => {
    if (event.type === 'custom' && event.customType) {
      return event.customType;
    }
    
    const typeObj = eventTypes.find(t => t.value === event.type);
    return typeObj ? typeObj.label : event.type;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendário Escolar</h1>
            <p className="text-gray-500">Visualize e adicione eventos importantes para seus filhos.</p>
          </div>
        </div>
        
        {filhos.length > 0 ? (
          <>
            <div className="w-full max-w-xs">
              <Label htmlFor="child-select">Filtrar por aluno</Label>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger id="child-select" className="w-full">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os alunos</SelectItem>
                  {filhos.map((filho, index) => (
                    <SelectItem key={index} value={filho.nome}>
                      {filho.nome} - {filho.serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
              {/* Calendário */}
              <Card className={`${isMobile ? '' : 'md:col-span-2'}`}>
                <CardHeader>
                  <CardTitle>Calendário</CardTitle>
                  <CardDescription>
                    Clique em uma data para visualizar ou adicionar eventos
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border pointer-events-auto mx-auto"
                    locale={ptBR}
                  />
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Hoje
                  </Button>
                  {!isAddingEvent ? (
                    <Button 
                      onClick={() => setIsAddingEvent(true)}
                      disabled={!selectedDate}
                    >
                      Adicionar Evento
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAddingEvent(false)}
                    >
                      Cancelar
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Painel lateral */}
              <Card className={`${isMobile ? '' : 'md:col-span-1'}`}>
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Selecione uma data'}
                  </CardTitle>
                  <CardDescription>
                    {selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAddingEvent ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="event-title">Título do Evento</Label>
                        <Input
                          id="event-title"
                          placeholder="Digite o título"
                          value={newEventTitle}
                          onChange={(e) => setNewEventTitle(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="event-description">Descrição</Label>
                        <Textarea
                          id="event-description"
                          placeholder="Digite uma descrição (opcional)"
                          value={newEventDescription}
                          onChange={(e) => setNewEventDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="event-type">Tipo de Evento</Label>
                        <Select
                          value={newEventType}
                          onValueChange={(value) => {
                            setNewEventType(value);
                            if (value !== 'custom') {
                              setCustomEventType('');
                            }
                          }}
                        >
                          <SelectTrigger id="event-type">
                            <SelectValue placeholder="Selecione o tipo de evento" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Campo adicional para tipo personalizado */}
                      {newEventType === 'custom' && (
                        <div>
                          <Label htmlFor="custom-event-type">Tipo Personalizado</Label>
                          <Input
                            id="custom-event-type"
                            placeholder="Digite o tipo de evento"
                            value={customEventType}
                            onChange={(e) => setCustomEventType(e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="event-child">Aluno Relacionado</Label>
                        <Select value={selectedChild} onValueChange={setSelectedChild}>
                          <SelectTrigger id="event-child">
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Geral (todos os alunos)</SelectItem>
                            {filhos.map((filho, index) => (
                              <SelectItem key={index} value={filho.nome}>
                                {filho.nome} - {filho.serie}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={addEvent}
                        disabled={!newEventTitle || (newEventType === 'custom' && !customEventType)}
                      >
                        Salvar Evento
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-3">
                        {filteredEvents.length > 0 
                          ? `${filteredEvents.length} evento(s) para esta data` 
                          : 'Não há eventos para esta data'}
                      </h3>
                      
                      {filteredEvents.length > 0 ? (
                        <ScrollArea className="h-[280px] pr-4">
                          <div className="space-y-4">
                            {filteredEvents.map((event) => (
                              <div key={event.id} className="border rounded-lg p-3 space-y-2">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                  <h4 className="font-semibold">{event.title}</h4>
                                  <Badge className={getEventBadgeColor(event.type)}>
                                    {getEventTypeName(event)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{event.description}</p>
                                {event.childName && (
                                  <p className="text-xs font-medium text-edulink-600">Aluno: {event.childName}</p>
                                )}
                                <p className="text-xs text-gray-500">Criado por: {event.createdBy}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <p>Clique em "Adicionar Evento" para criar um novo evento para esta data.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Eventos programados para os próximos dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(event => (
                      <div key={event.id} className="flex items-start space-x-4 border-b pb-3 last:border-0">
                        <div className="min-w-[60px] text-center">
                          <div className="text-2xl font-bold">{format(event.date, 'dd')}</div>
                          <div className="text-xs text-gray-500">{format(event.date, 'MMM', { locale: ptBR })}</div>
                        </div>
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <Badge className={getEventBadgeColor(event.type)}>
                              {getEventTypeName(event)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          {event.childName && (
                            <p className="text-xs font-medium text-edulink-600 mt-1">Aluno: {event.childName}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">Criado por: {event.createdBy}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>Não há eventos programados para os próximos dias.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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

export default CalendarioPage;
