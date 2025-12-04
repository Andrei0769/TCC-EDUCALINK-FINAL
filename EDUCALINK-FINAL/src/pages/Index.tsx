
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, GraduationCap, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: "Acompanhamento Acadêmico",
    description: "Visualize o progresso escolar, notas e frequência do seu filho em tempo real.",
    icon: GraduationCap,
    color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    title: "Relatórios Detalhados",
    description: "Acesse relatórios completos com gráficos e análises do desempenho acadêmico.",
    icon: PieChart,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    title: "Controle Financeiro",
    description: "Acesse faturas, histórico de pagamentos e planeje gastos educacionais.",
    icon: PieChart,
    color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    title: "Conteúdo Pedagógico",
    description: "Acompanhe o currículo, materiais didáticos e atividades complementares.",
    icon: Book,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
];

// Animações e interações para o tema escolar
const schoolAnimations = [
  { text: "Acompanhamento escolar em tempo real", delay: 0 },
  { text: "Relatórios detalhados e análises", delay: 3000 },
  { text: "Boletim digital sempre atualizado", delay: 6000 },
  { text: "Calendário de eventos escolares", delay: 9000 },
  { text: "Atividades pedagógicas complementares", delay: 12000 },
];

const Index = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const animationDuration = 15000; // 15 segundos para o ciclo completo

  // Efeito para ciclo de animação dos textos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % schoolAnimations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-gold py-12 md:py-20 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6 animate-slide-in [animation-delay:200ms] relative z-10">
              <div className="inline-block rounded-full bg-white/80 px-3 py-1 text-sm backdrop-blur">
                <span className="text-gray-800">Plataforma líder em educação</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                Acompanhe o desempenho escolar do seu filho em tempo real
              </h1>
              
              {/* Texto animado em looping */}
              <div className="h-16 md:h-12 overflow-hidden relative">
                {schoolAnimations.map((animation, index) => (
                  <p 
                    key={index} 
                    className={`text-lg md:text-xl text-gray-800 max-w-lg absolute transition-all duration-500 ${
                      currentAnimation === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {animation.text}
                  </p>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/cadastro">Acessar Plataforma</Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    document.getElementById('features-section')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block relative animate-scale-in [animation-delay:400ms]">
              <div className="absolute inset-0 bg-gradient-radial from-yellow-200/20 to-transparent" />
              <div className="glass rounded-xl overflow-hidden shadow-xl rotate-2 transform hover:rotate-0 transition-transform duration-500 border-yellow-100 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                  alt="Estudantes em sala de aula" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay animado quando hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 [transition-delay:200ms]">
                    <p className="font-medium text-lg drop-shadow-md">Construindo o futuro pela educação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-10 md:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
              Tudo o que você precisa em um só lugar
            </h2>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
              EducaLink conecta pais, professores e escola oferecendo transparência 
              e acompanhamento completo do processo educacional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-yellow-100 shadow-md hover-lift">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-700">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-16 bg-gradient-elegant">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
              Pronto para melhorar a comunicação com a escola?
            </h2>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-6 md:mb-8">
              Junte-se a milhares de pais e escolas que já utilizam o EducaLink para 
              acompanhar o desempenho dos estudantes e melhorar os resultados.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/cadastro">
                Comece agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
