import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitTicket } from "@/lib/api";
import Layout from "@/components/Layout";

const schema = z.object({
  titulo: z.string().trim().min(5, "Título é obrigatório (mínimo 5 caracteres)").max(150),
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  email: z.string().trim().min(1, "E-mail ou ramal é obrigatório").max(255),
  setor: z.string().optional(),
  tipo: z.string().optional(),
  descricao: z.string().trim().min(10, "Mínimo de 10 caracteres").max(2000),
});

type FormData = z.infer<typeof schema>;

const SETORES = ["TI", "Financeiro", "RH", "Enfermagem", "Administrativo"];
const TIPOS = ["Sistema", "Rede", "Hardware", "Acesso", "Outro"];

const NewTicket = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id?: string } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { titulo: "", nome: "", email: "", setor: "", tipo: "", descricao: "" },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const generatedId = `VSA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
      const payload = {
        id: generatedId,
        titulo: data.titulo,
        nome: data.nome,
        email: data.email,
        setor: data.setor,
        tipo: data.tipo,
        descricao: data.descricao,
        data_abertura: new Date().toISOString(),
      };
      
      // Wait for fetch, in max 2 seconds webhook happens
      await submitTicket(payload);
      
      setSuccess({ id: generatedId });
      form.reset();
    } catch {
      setSuccess(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-10 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Abrir Chamado</h2>
          <p className="text-sm text-muted-foreground mt-1">Preencha os dados abaixo para registrar sua solicitação.</p>
        </div>

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Chamado enviado com sucesso!</p>
              <p className="text-xs text-muted-foreground mt-0.5">Nossa equipe já foi notificada.</p>
              {success.id && (
                <p className="text-xs text-primary font-mono mt-1">ID: #{success.id}</p>
              )}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField control={form.control} name="titulo" render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Título do Problema</FormLabel>
                  <FormControl><Input placeholder="Ex: Sistema ERP fora do ar" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ou Ramal</FormLabel>
                  <FormControl><Input placeholder="email@empresa.com ou ramal" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="setor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {SETORES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="tipo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Problema</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="descricao" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do Problema</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva detalhadamente o problema..." className="min-h-[140px] resize-y" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Enviar Chamado</>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default NewTicket;
