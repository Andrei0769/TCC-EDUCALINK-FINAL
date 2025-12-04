
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, Phone, BookOpen, GraduationCap, Plus, Trash, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { CadastroFormValues } from '@/schemas/cadastroSchema';
import { TermosInfo } from './TermosInfo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CadastroFormProps {
  form: UseFormReturn<CadastroFormValues>;
  onSubmit: (data: CadastroFormValues) => void;
  userType: string;
}

export const CadastroForm: React.FC<CadastroFormProps> = ({ form, onSubmit, userType }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const addChild = () => {
    const currentFilhos = form.getValues('filhos') || [];
    form.setValue('filhos', [...currentFilhos, { idAluno: '', nome: '', serie: '' }]);
  };

  const removeChild = (index: number) => {
    const currentFilhos = form.getValues('filhos') || [];
    form.setValue('filhos', currentFilhos.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                  <Input
                    placeholder="Seu nome completo"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                  <Input
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                  <Input
                    placeholder="(00) 00000-0000"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {userType === 'professor' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel>Matérias que leciona</FormLabel>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const currentMaterias = form.getValues('materia') || [];
                  if (currentMaterias.length < 14) {
                    form.setValue('materia', [...currentMaterias, '']);
                  }
                }}
                className="flex items-center gap-1"
                disabled={(form.watch('materia') || []).length >= 14}
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar Matéria
              </Button>
            </div>
            
            {(form.watch('materia') || []).length === 0 && (
              <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                Adicione pelo menos uma matéria
              </div>
            )}
            
            {(form.watch('materia') || []).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-foreground z-10" />
                  <FormField
                    control={form.control}
                    name={`materia.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Selecione a matéria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Matemática">Matemática</SelectItem>
                            <SelectItem value="Português">Português</SelectItem>
                            <SelectItem value="Ciências">Ciências</SelectItem>
                            <SelectItem value="História">História</SelectItem>
                            <SelectItem value="Geografia">Geografia</SelectItem>
                            <SelectItem value="Física">Física</SelectItem>
                            <SelectItem value="Química">Química</SelectItem>
                            <SelectItem value="Biologia">Biologia</SelectItem>
                            <SelectItem value="Artes">Artes</SelectItem>
                            <SelectItem value="Educação Física">Educação Física</SelectItem>
                            <SelectItem value="Inglês">Inglês</SelectItem>
                            <SelectItem value="Espanhol">Espanhol</SelectItem>
                            <SelectItem value="Filosofia">Filosofia</SelectItem>
                            <SelectItem value="Sociologia">Sociologia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const currentMaterias = form.getValues('materia') || [];
                    form.setValue('materia', currentMaterias.filter((_, i) => i !== index));
                  }}
                  className="h-10 w-10 p-0 text-red-500"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {userType === 'responsavel' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filhos</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addChild}
                className="flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar Filho
              </Button>
            </div>
            
            {form.watch('filhos')?.map((_, index) => (
              <div key={index} className="border p-3 rounded-md space-y-3 transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Filho {index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeChild(index)}
                    className="h-8 w-8 p-0 text-red-500 transition-colors duration-300"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name={`filhos.${index}.idAluno`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Acesso do Aluno (4 dígitos)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0000"
                          maxLength={4}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`filhos.${index}.nome`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do aluno</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                          <Input
                            placeholder="Nome completo do aluno"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`filhos.${index}.serie`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Série</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a série" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="animate-in fade-in-50 zoom-in-95">
                          <SelectItem value="2º ano">2º ano</SelectItem>
                          <SelectItem value="3º ano">3º ano</SelectItem>
                          <SelectItem value="4º ano">4º ano</SelectItem>
                          <SelectItem value="5º ano">5º ano</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            
            {(form.watch('filhos')?.length === 0 || !form.watch('filhos')) && (
              <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground transition-all duration-300 hover:border-primary/30">
                Adicione pelo menos um filho para continuar
              </div>
            )}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmarSenha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {userType === 'responsavel' && <TermosInfo />}
        
        <FormField
          control={form.control}
          name="aceitarTermos"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Concordo com os <Link to="/termos" className="text-purple-600 hover:underline transition-colors duration-300">termos de uso</Link> e <Link to="/privacidade" className="text-purple-600 hover:underline transition-colors duration-300">política de privacidade</Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-stone-600 text-white hover:bg-stone-700 transition-all duration-300 ease-in-out"
          disabled={userType === 'responsavel' && (!form.watch('filhos') || form.watch('filhos').length === 0)}
        >
          Criar conta
        </Button>
      </form>
    </Form>
  );
};
