import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

const InspectedPage = () => {
  const [inspectedRecords, setInspectedRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInspectedRecords = async () => {
      try {
        const response = await fetch('/api/records/inspected');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const inspected = await response.json();
        setInspectedRecords(inspected);
      } catch (error) {
        console.error("Failed to fetch inspected records:", error);
        setError('Erro ao carregar os registros inspecionados.');
      }
    };
    fetchInspectedRecords();
  }, []);

  const groupedRecords = useMemo(() => {
    const groups = inspectedRecords.reduce((acc, record) => {
      const { numAviso } = record;
      if (!acc[numAviso]) {
        acc[numAviso] = [];
      }
      acc[numAviso].push(record);
      return acc;
    }, {});
    return Object.entries(groups).map(([numAviso, records]) => ({ numAviso, records }));
  }, [inspectedRecords]);

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <ShieldCheck className="mr-3 text-green-500" />
            Itens Inspecionados
          </h1>
          <p className="text-slate-400">Histórico de todos os itens marcados como inspecionados.</p>
        </div>
      </header>

      {error && <div className="text-red-500 bg-red-900/30 p-4 rounded-lg mb-4">{error}</div>}

      <main>
        {groupedRecords.length === 0 && !error ? (
          <div className="text-center py-20 px-6 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl">
            <FileText className="mx-auto w-12 h-12 text-slate-500" />
            <h3 className="mt-4 text-xl font-semibold text-white">Nenhum item inspecionado</h3>
            <p className="mt-1 text-slate-400">Nenhum item foi marcado como inspecionado ainda.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedRecords.map(({ numAviso, records }) => (
              <div key={numAviso}>
                <h2 className="text-xl font-bold text-white mb-4">Aviso de Recebimento: {numAviso}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {records.map(record => (
                    <div key={record.id} className="relative p-5 rounded-xl border bg-slate-800/50 backdrop-blur-sm border-green-500 bg-green-900/30">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-lg text-white pr-16">{record.descricao}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Item:</span> <span className="font-mono text-blue-300">{record.item}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Aviso Receb.:</span> <span className="font-mono text-blue-300">{record.numAviso}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Quantidade:</span> <span className="font-mono text-blue-300">{record.qtdRecebida}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Data Entrada:</span> <span className="font-mono text-blue-300">{record.dataEntrada}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">OC:</span> <span className="font-mono text-blue-300">{record.oc}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Fornecedor:</span> <span className="font-mono text-blue-300 truncate max-w-[150px]">{record.fornecedor}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InspectedPage;
