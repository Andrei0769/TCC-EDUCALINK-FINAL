
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Configuracoes = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-gray-500">Gerencie suas preferências e configurações de conta.</p>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Sessão e Segurança</CardTitle>
              <CardDescription>Gerencie suas sessões e segurança da conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="security-2fa">Autenticação de dois fatores</Label>
                <Switch id="security-2fa" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="security-session">Sessão persistente</Label>
                <Switch id="security-session" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="security-alerts">Alertas de login</Label>
                <Switch id="security-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
