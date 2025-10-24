import React, { useState, useEffect, useRef, useMemo } from 'react';
import { parseLstFile } from '../fileParser';
import { Upload, ShieldCheck, AlertTriangle, Info, CheckCircle, X, Save, Trash2, FileText, Search, GripVertical, Key, Link2, Move } from 'lucide-react';

// --- Constantes ---
const HISTORY_STORAGE_KEY = 'inspecionados-historico';
const CRM_STORAGE_KEY = 'crm-info';

// --- Componentes de UI reutilizáveis ---

const Badge = ({ text, className, icon: Icon }) => (
  <div className={`absolute top-2 right-2 flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${className}`}>
    {Icon && <Icon className="w-3 h-3 mr-1" />}
    {text}
  </div>
);

const ConfirmationModal = ({ items, onConfirm, onCancel }) => {
  if (items.length === 0) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 animate-fade-in-up">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center"><ShieldCheck className="mr-3 text-blue-500" />Confirmar Inspeção</h2>
          <p className="text-slate-400 mt-1">Os {items.length} itens a seguir serão marcados como "Inspecionados".</p>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <ul className="divide-y divide-slate-700">
            {items.map(item => (
              <li key={item.id} className="py-3 px-2 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{item.descricao}</p>
                  <p className="text-sm text-slate-400">
                    AR: <span className="font-semibold text-blue-400">{item.numAviso}</span> |
                    Item: <span className="font-semibold text-blue-400">{item.item}</span> |
                    Qtd: <span className="font-semibold text-blue-400">{item.qtdRecebida}</span>
                  </p>
                </div>
                <CheckCircle className="text-green-500 w-5 h-5" />
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-slate-900/50 rounded-b-xl flex justify-end space-x-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all duration-300">Cancelar</button>
          <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all duration-300 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Confirmar Inspeção
          </button>
        </div>
      </div>
    </div>
  );
};

const TokenModal = ({ isOpen, onSave, onCancel }) => {
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url);
    setUrl('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700 animate-fade-in-up">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center"><Key className="mr-3 text-amber-400" />Atualizar Token do CRM</h2>
          <p className="text-slate-400 mt-1">Cole a URL completa do CRM para extrair o token.</p>
        </div>
        <div className="p-6">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://192.168.1.47/crm/index.php?route=..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6 bg-slate-900/50 rounded-b-xl flex justify-end space-x-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all duration-300">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all duration-300 flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type, onDismiss }) => {
  const icons = { success: <CheckCircle />, error: <AlertTriangle />, info: <Info /> };
  const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`fixed bottom-5 right-5 flex items-center p-4 rounded-xl shadow-lg text-white font-bold ${colors[type]} animate-fade-in-up`}>
      {React.cloneElement(icons[type], { className: 'w-5 h-5 mr-3' })}
      {message}
      <button onClick={onDismiss} className="ml-4 p-1 rounded-full hover:bg-white/20">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const DraggableFab = ({ onClick }) => {
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const [isDragging, setIsDragging] = useState(false);
    const fabRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (fabRef.current) {
            const rect = fabRef.current.getBoundingClientRect();
            offset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            setIsDragging(true);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y,
            });
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={fabRef}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            className={`fixed z-40 flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg text-white cursor-grab transition-transform duration-200 ${isDragging ? 'cursor-grabbing scale-110' : ''}`}
            onMouseDown={handleMouseDown}
        >
             <div className="group relative flex items-center justify-center w-full h-full">
                <Key className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" onClick={onClick} />
                <Move className="w-4 h-4 absolute top-1 right-1 text-white/50" />
            </div>
        </div>
    );
};

// --- Componente Principal ---
const InspectionModule = () => {
  const [records, setRecords] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [inspectedHistory, setInspectedHistory] = useState(new Set());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [crmInfo, setCrmInfo] = useState({ baseUrl: '', token: '' });
  const fileInputRef = useRef(null);

  // Efeitos de carregamento e salvamento
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      const storedCrmInfo = localStorage.getItem(CRM_STORAGE_KEY);
      if (storedHistory) setInspectedHistory(new Set(JSON.parse(storedHistory)));
      if (storedCrmInfo) setCrmInfo(JSON.parse(storedCrmInfo));
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      showToast('Falha ao carregar dados salvos.', 'error');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(Array.from(inspectedHistory)));
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(crmInfo));
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
      showToast('Falha ao salvar dados.', 'error');
    }
  }, [inspectedHistory, crmInfo]);

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };
  
  // Handlers de Ações
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedRecords = parseLstFile(e.target.result);
        setRecords(prev => {
          const existingIds = new Set(prev.map(r => r.id));
          const newRecords = parsedRecords.filter(r => !existingIds.has(r.id));
          if(newRecords.length > 0) showToast(`${newRecords.length} novos registros adicionados.`, 'success');
          else showToast('Nenhum registro novo encontrado no arquivo.', 'info');
          return [...prev, ...newRecords];
        });
      } catch (error) { showToast('Erro ao processar o arquivo .lst.', 'error'); }
    };
    reader.onerror = () => showToast('Não foi possível ler o arquivo.', 'error');
    reader.readAsText(file, 'ISO-8859-1');
    event.target.value = null;
  };

  const handleTokenSave = (url) => {
    try {
      const urlObject = new URL(url);
      const token = urlObject.searchParams.get('token');
      if (!token) {
        showToast('Token não encontrado na URL fornecida.', 'error');
        return;
      }
      const baseUrl = `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`;
      setCrmInfo({ baseUrl, token });
      showToast('Token do CRM atualizado com sucesso!', 'success');
    } catch (error) {
      showToast('URL inválida. Por favor, insira a URL completa.', 'error');
    }
    setIsTokenModalOpen(false);
  };

  const handleOpenDrawing = (itemCode) => {
    if (!crmInfo.baseUrl || !crmInfo.token) {
      showToast('URL ou Token do CRM não configurado. Use o botão de chave.', 'error');
      setIsTokenModalOpen(true);
      return;
    }
    const url = `${crmInfo.baseUrl}?route=engenharia/produto/update&token=${crmInfo.token}&cod_item=${itemCode}&filter_cod=${itemCode.toLowerCase()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInspectToggle = (id) => {
    setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }
  const handleRemoveAlreadyInspected = (id) => { setRecords(prev => prev.filter(r => r.id !== id)); showToast('Registro removido da lista.', 'info'); };
  const handleSaveInspected = () => {
    if (selectedIds.size > 0) setIsConfirmModalOpen(true);
  };
  
  const handleConfirmInspection = () => {
    const newHistory = new Set(inspectedHistory);
    selectedIds.forEach(id => {
      const record = records.find(r => r.id === id);
      if (record) newHistory.add(`${record.numAviso}-${record.item}-${record.qtdRecebida}`);
    });
    setInspectedHistory(newHistory);
    setRecords(prev => prev.filter(r => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
    setIsConfirmModalOpen(false);
    showToast(`${selectedIds.size} itens marcados como inspecionados!`, 'success');
  };

  const enrichedRecords = useMemo(() => records.map(record => ({
    ...record,
    isInspected: inspectedHistory.has(`${record.numAviso}-${record.item}-${record.qtdRecebida}`),
    isSelected: selectedIds.has(record.id),
  })), [records, inspectedHistory, selectedIds]);

  const selectedItems = enrichedRecords.filter(r => r.isSelected);

  // --- Renderização ---
  return (
    <div>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
      {isConfirmModalOpen && <ConfirmationModal items={selectedItems} onConfirm={handleConfirmInspection} onCancel={() => setIsConfirmModalOpen(false)} />}
      <TokenModal isOpen={isTokenModalOpen} onSave={handleTokenSave} onCancel={() => setIsTokenModalOpen(false)} />
      <DraggableFab onClick={() => setIsTokenModalOpen(true)} />

      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Módulo de Inspeção</h1>
          <p className="text-slate-400">Importe, inspecione e gerencie os registros de A.R.</p>
        </div>
        <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300">
          <Upload className="w-5 h-5" />
          Importar .lst
        </button>
        <input type="file" accept=".lst" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      </header>

      <div className="my-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <p className="font-semibold">Adicione seu CRM Link clicando no ícone de chave</p>
        </div>
        <button onClick={handleSaveInspected} disabled={selectedIds.size === 0} className="flex items-center gap-2 px-6 py-3 font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none">
          <Save className="w-5 h-5" />
          Salvar Inspecionados
          {selectedIds.size > 0 && <span className="flex justify-center items-center w-6 h-6 text-xs font-bold text-green-800 bg-white rounded-full">{selectedIds.size}</span>}
        </button>
      </div>

      <main>
        {enrichedRecords.length === 0 ? (
          <div className="text-center py-20 px-6 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl">
            <FileText className="mx-auto w-12 h-12 text-slate-500" />
            <h3 className="mt-4 text-xl font-semibold text-white">Nenhum registro para inspecionar</h3>
            <p className="mt-1 text-slate-400">Importe um arquivo .lst para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {enrichedRecords.map(record => (
              <div key={record.id} className={`relative p-5 rounded-xl border bg-slate-800/50 backdrop-blur-sm transition-all duration-300 ${record.isSelected ? 'shadow-lg shadow-green-500/20 border-green-500 bg-green-900/30' : record.isInspected ? 'border-purple-500 bg-purple-900/30' : 'border-slate-700'}`}>
                {record.isSelected && <Badge text="Selecionado" className="bg-green-500 text-white animate-pulse" icon={CheckCircle} />}
                {record.isInspected && <Badge text="Já Inspecionado" className="bg-purple-500 text-white" icon={ShieldCheck} />}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 ${record.isSelected ? 'bg-green-500' : 'bg-transparent'}`}></div>
                
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

                <div className="mt-5 pt-4 border-t border-slate-700 flex gap-2">
                  {record.isInspected ? (
                    <button onClick={() => handleRemoveAlreadyInspected(record.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-red-600/80 rounded-lg hover:bg-red-600 transition-all duration-300"><Trash2 className="w-4 h-4" /> Remover</button>
                  ) : (
                    <>
                      <button onClick={() => handleInspectToggle(record.id)} className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 ${record.isSelected ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                        {record.isSelected ? <><X className="w-4 h-4" />Cancelar</> : <><CheckCircle className="w-4 h-4" />Inspecionar</>}
                      </button>
                      <button onClick={() => handleOpenDrawing(record.item)} className="flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all duration-300">
                        <Search className="w-4 h-4" /> Desenho
                      </button>
                    </>
                  )}
                </div>
                <div className="mt-2 text-center text-xs text-slate-500">
                  Status: {record.isInspected ? <span className="font-bold text-purple-400">Já Inspecionado</span> : (record.isSelected ? <span className="font-bold text-green-400">Selecionado</span> : <span className="text-slate-400">Pendente</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InspectionModule;