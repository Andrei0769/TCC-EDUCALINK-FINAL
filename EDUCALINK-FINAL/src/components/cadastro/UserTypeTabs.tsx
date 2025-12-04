
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Users } from 'lucide-react';

interface UserTypeTabsProps {
  userType: string;
  setUserType: (value: string) => void;
  children: React.ReactNode;
}

export const UserTypeTabs: React.FC<UserTypeTabsProps> = ({ userType, setUserType, children }) => {
  return (
    <Tabs defaultValue="responsavel" className="w-full" onValueChange={setUserType}>
      <TabsList className="grid grid-cols-2 mb-4 mx-6 bg-slate-100">
        <TabsTrigger value="responsavel" className="flex items-center gap-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
          <UserCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Responsável</span>
        </TabsTrigger>
        <TabsTrigger value="professor" className="flex items-center gap-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Professor</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={userType}>
        {children}
      </TabsContent>
    </Tabs>
  );
};
