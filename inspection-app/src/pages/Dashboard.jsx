import React from 'react';
import { FileText } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl">
      <FileText className="mx-auto w-16 h-16 text-slate-500" />
      <h1 className="mt-6 text-3xl font-bold text-white">Bem-vindo ao Dashboard</h1>
      <p className="mt-2 text-lg text-slate-400">Selecione um módulo no menu lateral para começar.</p>
    </div>
  );
};

export default Dashboard;
