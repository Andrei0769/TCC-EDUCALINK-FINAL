import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, parseISO, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, Filter, Clock, Bell, AlertCircle, X, Check, Users, BookOpen, FileText, MapPin, Lock, RotateCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Interface for the calendar event
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'aula' | 'prova' | 'evento' | 'reuniao';
  turmas: string[];
  isPublic: boolean;
  createdBy: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  recurring?: boolean;
  reminderSet?: boolean;
}

const eventTypes = [
  { value: 'aula', label: 'Aula', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'prova', label: 'Prova', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'evento', label: 'Evento', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'reuniao', label: 'Reunião', color: 'bg-purple-100 text-purple-700 border-purple-200' },
];

const turmas = ['6º Ano - Turma A', '7º Ano - Turma B', '8º Ano - Turma C', '9º Ano - Turma D'];
const locations = ['Sala 101', 'Sala 102', 'Sala 103', 'Laboratório', 'Auditório', 'Pátio', 'Biblioteca'];

// Component for displaying appropriate icon based on event type
const EventIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'aula':
      return <BookOpen className="h-4 w-4" />;
    case 'prova':
      return <FileText className="h-4 w-4" />;
    case 'evento':
      return <Bell className="h-4 w-4" />;
    case 'reuniao':
      return <Users className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const CalendarioProfessor = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showDialog, setShowDialog] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id' | 'createdBy'>>({
    title: '',
    description: '',
    date: '',
    type: 'aula',
    turmas: [],
    isPublic: true,
    startTime: '08:00',
    endTime: '09:00',
    location: '',
    recurring: false,
    reminderSet: false
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('calendar');

  // Load user data and events
  useEffect(() => {
    const storedUser = localStorage.getItem('educalink-current-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedEvents = localStorage.getItem('calendar-events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Generate sample events
      const today = new Date();
      const tomorrow = addDays(today, 1);
      const nextWeek = addDays(today, 7);

      const sampleEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Prova de Matemática',
          description: 'Avaliação sobre frações',
          date: today.toISOString(),
          type: 'prova',
          turmas: ['6º Ano - Turma A'],
          isPublic: true,
          createdBy: 'Professor Silva',
          startTime: '08:00',
          endTime: '10:00',
          location: 'Sala 101',
          recurring: false,
          reminderSet: true
        },
        {
          id: '2',
          title: 'Reunião de pais',
          description: 'Reunião bimestral com os responsáveis',
          date: tomorrow.toISOString(),
          type: 'reuniao',
          turmas: ['7º Ano - Turma B'],
          isPublic: true,
          createdBy: 'Coordenação',
          startTime: '14:00',
          endTime: '16:00',
          location: 'Auditório',
          recurring: false,
          reminderSet: true
        },
        {
          id: '3',
          title: 'Aula de História',
          description: 'Revolução Industrial',
          date: nextWeek.toISOString(),
          type: 'aula',
          turmas: ['8º Ano - Turma C'],
          isPublic: true,
          createdBy: 'Professora Ana',
          startTime: '10:00',
          endTime: '11:30',
          location: 'Sala 102',
          recurring: true,
          reminderSet: false
        }
      ];
      localStorage.setItem('calendar-events', JSON.stringify(sampleEvents));
      setEvents(sampleEvents);
    }
  }, []);

  // Function to navigate to the next month
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Function to navigate to the previous month
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setNewEvent(prev => ({
        ...prev,
        date: date.toISOString()
      }));
      setShowDialog(true);
    }
  };

  // Function to open date picker for event creation with pre-selected date
  const handleSelectDateForEvent = (date: Date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({
      ...prev,
      date: date.toISOString()
    }));
    setShowDatePicker(false);
  };

  // Function to handle event form input changes
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle event type selection
  const handleEventTypeChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, type: value as 'aula' | 'prova' | 'evento' | 'reuniao' }));
  };

  // Function to handle location selection
  const handleLocationChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, location: value }));
  };

  // Function to handle public/private toggle
  const handleToggleChange = (name: string, checked: boolean) => {
    setNewEvent(prev => ({ ...prev, [name]: checked }));
  };

  // Function to handle turma selection
  const handleTurmaSelection = (turma: string) => {
    setNewEvent(prev => {
      const turmas = prev.turmas || []; // Ensure turmas is an array
      if (turmas.includes(turma)) {
        return { ...prev, turmas: turmas.filter(t => t !== turma) };
      } else {
        return { ...prev, turmas: [...turmas, turma] };
      }
    });
  };

  // Function to delete an event
  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    
    toast({
      title: "Evento excluído",
      description: "O evento foi removido do calendário com sucesso."
    });
  };

  // Function to save a new event
  const saveEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.turmas || newEvent.turmas.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título, data e selecione pelo menos uma turma.",
        variant: "destructive"
      });
      return;
    }

    const updatedEvents = [
      ...events,
      {
        ...newEvent,
        id: Date.now().toString(),
        createdBy: currentUser?.nome || 'Professor'
      }
    ];

    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    
    setShowDialog(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      type: 'aula',
      turmas: [],
      isPublic: true,
      startTime: '08:00',
      endTime: '09:00',
      location: '',
      recurring: false,
      reminderSet: false
    });

    toast({
      title: "Evento criado",
      description: "O evento foi adicionado ao calendário com sucesso."
    });
  };

  // Filter events for the selected day
  const getEventsForDate = (date: Date) => {
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        const sameDay = isSameDay(eventDate, date);
        
        if (filterType) {
          return sameDay && event.type === filterType;
        }
        
        return sameDay;
      })
      .sort((a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return 0;
      });
  };

  // Get all events for the current month (for list view)
  const getEventsForMonth = () => {
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        return isSameMonth(eventDate, currentDate);
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Filter events for upcoming week
  const getUpcomingEvents = () => {
    const today = new Date();
    const oneWeekLater = addDays(today, 7);
    
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        return eventDate >= today && eventDate <= oneWeekLater;
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Get the events for the selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const monthEvents = getEventsForMonth();
  const upcomingEvents = getUpcomingEvents();

  // Get the color class for a specific event type
  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.color : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Format a date for displaying in the UI
  const formatEventDate = (dateString: string) => {
    return format(parseISO(dateString), "dd 'de' MMMM", { locale: ptBR });
  };

  // Check if a date has events (for highlighting in the calendar)
  const hasEventOnDate = (date: Date) => {
    return events.some(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
  };

  // Custom renderer for calendar days
  const renderDay = (date: Date) => {
    const hasEvent = hasEventOnDate(date);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`
          w-9 h-9 flex items-center justify-center rounded-full
          ${isToday(date) ? 'bg-edulink-100 text-edulink-900 font-bold' : ''}
        `}>
          {date.getDate()}
        </div>
        {hasEvent && (
          <div className="absolute bottom-1 w-1 h-1 bg-edulink-600 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendário Escolar</h1>
            <p className="text-muted-foreground">Gerencie aulas, eventos e compromissos</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Filtrar por tipo</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={!filterType ? "bg-slate-100" : ""}
                      onClick={() => setFilterType(null)}
                    >
                      Todos
                    </Button>
                    {eventTypes.map(type => (
                      <Button
                        key={type.value}
                        variant="outline"
                        size="sm"
                        className={filterType === type.value ? `${type.color} border` : ""}
                        onClick={() => setFilterType(type.value)}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Evento ao Calendário</DialogTitle>
                  <DialogDescription>
                    Crie um novo evento, aula ou avaliação no calendário escolar.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newEvent.title}
                      onChange={handleEventInputChange}
                      placeholder="Ex: Prova de Matemática"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newEvent.description}
                      onChange={handleEventInputChange}
                      placeholder="Detalhes sobre o evento"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal"
                            onClick={() => setShowDatePicker(true)}
                          >
                            {newEvent.date ? (
                              format(parseISO(newEvent.date), "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newEvent.date ? parseISO(newEvent.date) : undefined}
                            onSelect={(date) => date && handleSelectDateForEvent(date)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={newEvent.type} onValueChange={handleEventTypeChange}>
                        <SelectTrigger>
                          <SelectValue />
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
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Hora de Início</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={newEvent.startTime}
                        onChange={handleEventInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Hora de Término</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={newEvent.endTime}
                        onChange={handleEventInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Local</Label>
                    <Select 
                      value={newEvent.location} 
                      onValueChange={handleLocationChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="block mb-2">Turmas</Label>
                    <div className="flex flex-wrap gap-2">
                      {turmas.map(turma => (
                        <Button
                          key={turma}
                          type="button"
                          variant={newEvent.turmas && newEvent.turmas.includes(turma) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTurmaSelection(turma)}
                          className="mb-2"
                        >
                          {turma}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="recurring"
                          checked={newEvent.recurring}
                          onCheckedChange={(checked) => handleToggleChange('recurring', checked)}
                        />
                        <Label htmlFor="recurring">Evento recorrente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="reminderSet"
                          checked={newEvent.reminderSet}
                          onCheckedChange={(checked) => handleToggleChange('reminderSet', checked)}
                        />
                        <Label htmlFor="reminderSet">Definir lembrete</Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublic"
                        checked={newEvent.isPublic}
                        onCheckedChange={(checked) => handleToggleChange('isPublic', checked)}
                      />
                      <Label htmlFor="isPublic">
                        Visível para pais/responsáveis
                      </Label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
                  <Button onClick={saveEvent}>Salvar Evento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="list">Lista de Eventos</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={currentDate}
                    onMonthChange={setCurrentDate}
                    className="rounded-md border pointer-events-auto"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate 
                      ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) 
                      : "Eventos"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDate 
                      ? `${selectedDateEvents.length} eventos neste dia` 
                      : "Selecione uma data para ver os eventos"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    selectedDateEvents.length > 0 ? (
                      <div className="space-y-4">
                        {selectedDateEvents.map(event => (
                          <div 
                            key={event.id} 
                            className={`p-3 border rounded-md ${getEventTypeColor(event.type)}`}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge variant="outline" className="bg-white bg-opacity-50">
                                {eventTypes.find(et => et.value === event.type)?.label}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">{event.description}</p>
                            
                            <div className="mt-2 space-y-1 text-sm">
                              {event.startTime && event.endTime && (
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                  <span>{event.startTime} - {event.endTime}</span>
                                </div>
                              )}
                              
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              {event.turmas && event.turmas.map(turma => (
                                <span 
                                  key={turma} 
                                  className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded-full"
                                >
                                  {turma}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-current border-opacity-20 text-xs">
                              <span>
                                {event.isPublic ? 
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" /> Visível aos pais
                                  </span> : 
                                  <span className="flex items-center gap-1">
                                    <Lock className="h-3 w-3" /> Privado
                                  </span>
                                }
                              </span>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 px-2 text-red-600 hover:text-red-800 hover:bg-red-100"
                                onClick={() => deleteEvent(event.id)}
                              >
                                <X className="h-3.5 w-3.5 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <div className="flex flex-col items-center">
                          <CalendarIcon className="h-10 w-10 opacity-20 mb-2" />
                          <p>Não há eventos para esta data</p>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => setShowDialog(true)}
                          >
                            Adicionar evento
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <CalendarIcon className="h-10 w-10 opacity-20 mx-auto mb-2" />
                      <p>Selecione uma data no calendário</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Eventos do Mês</CardTitle>
                <CardDescription>
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monthEvents.length > 0 ? (
                  <div className="space-y-4">
                    {monthEvents.map(event => (
                      <Card key={event.id} className="overflow-hidden">
                        <div className={`h-1.5 w-full ${getEventTypeColor(event.type)}`} />
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-base">{event.title}</CardTitle>
                            <Badge variant="outline">
                              {eventTypes.find(et => et.value === event.type)?.label}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {formatEventDate(event.date)}
                            {event.startTime && <span>• {event.startTime}</span>}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm">{event.description}</p>
                          
                          {event.location && (
                            <div className="mt-2 text-sm flex items-center text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mr-1.5" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          <div className="mt-3 flex flex-wrap gap-1">
                            {event.turmas && event.turmas.map(turma => (
                              <Badge key={turma} variant="secondary" className="text-xs">
                                {turma}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0 border-t text-xs text-muted-foreground">
                          <span>Criado por: {event.createdBy}</span>
                          <div className="flex items-center gap-2">
                            {event.reminderSet && (
                              <span className="flex items-center gap-1">
                                <Bell className="h-3 w-3" /> Lembrete
                              </span>
                            )}
                            {event.recurring && (
                              <span className="flex items-center gap-1">
                                <RotateCw className="h-3 w-3" /> Recorrente
                              </span>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 opacity-20 mx-auto mb-3" />
                    <p>Nenhum evento encontrado para este mês</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setShowDialog(true);
                        setSelectedDate(new Date());
                        setNewEvent(prev => ({
                          ...prev,
                          date: new Date().toISOString()
                        }));
                      }}
                    >
                      Adicionar novo evento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Eventos dos próximos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="flex items-start p-3 border rounded-md hover:bg-slate-50 transition-colors"
                        onClick={() => {
                          setSelectedDate(parseISO(event.date));
                          setActiveTab('calendar');
                        }}
                      >
                        <div className={`p-3 rounded-md mr-3 ${getEventTypeColor(event.type)}`}>
                          <EventIcon type={event.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{event.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                            <span>{formatEventDate(event.date)}</span>
                            {event.startTime && (
                              <>
                                <span className="mx-1">•</span>
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>{event.startTime}</span>
                              </>
                            )}
                            {event.location && (
                              <>
                                <span className="mx-1">•</span>
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-2 flex items-center">
                          <Button 
                            variant="ghost"
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(parseISO(event.date));
                              setActiveTab('calendar');
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 opacity-20 mx-auto mb-3" />
                    <p>Nenhum evento nos próximos dias</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setShowDialog(true);
                        setSelectedDate(new Date());
                        setNewEvent(prev => ({
                          ...prev,
                          date: new Date().toISOString()
                        }));
                      }}
                    >
                      Adicionar novo evento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CalendarioProfessor;
