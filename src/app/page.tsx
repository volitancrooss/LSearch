'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, BookOpen, Github, RefreshCw, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { CommandCard } from '@/components/CommandCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import CommandEditor from '@/components/CommandEditor';
import type { Command, Category } from '@/lib/types';

// Datos de ejemplo - serán reemplazados por datos de Supabase
const sampleCommands: Command[] = [
  {
    id: '1',
    command: 'ls',
    description: 'Listar contenido del directorio',
    category: 'files',
    examples: [
      { code: 'ls -la', description: 'Listar todos los archivos incluyendo ocultos' },
      { code: 'ls -lh', description: 'Listar con tamaños legibles' },
    ],
    tags: ['directorio', 'listar', 'básico'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    command: 'grep',
    description: 'Buscar patrones de texto en archivos',
    category: 'text',
    examples: [
      { code: 'grep -r "patrón" .', description: 'Búsqueda recursiva' },
      { code: 'grep -i "patrón" archivo.txt', description: 'Búsqueda sin distinción' },
    ],
    tags: ['buscar', 'texto', 'patrón', 'regex'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    command: 'nmap',
    description: 'Exploración de red y auditoría de seguridad',
    category: 'security',
    examples: [
      { code: 'nmap -sV objetivo', description: 'Escaneo de detección de versiones' },
      { code: 'nmap -sS -p 1-1000 objetivo', description: 'Escaneo sigiloso SYN' },
    ],
    tags: ['seguridad', 'escaneo', 'puertos', 'red', 'pentesting'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Tipo para el conteo de uso de comandos
interface CommandUsage {
  command: string;
  count: number;
  lastUsed: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [commands, setCommands] = useState<Command[]>(sampleCommands);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // Estados reactivos para historial y uso
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandUsage, setCommandUsage] = useState<CommandUsage[]>([]);
  const [editorInput, setEditorInput] = useState<{ value: string; timestamp: number }>({ value: '', timestamp: 0 });

  // Cargar historial y uso desde localStorage (con limpieza de datos inválidos)
  useEffect(() => {
    const savedHistory = localStorage.getItem('lsearch-command-history');
    const savedUsage = localStorage.getItem('lsearch-command-usage');

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as string[];
        // Limpiar historial de comandos inválidos
        const cleanedHistory = parsed.filter(cmd => {
          // Debe tener al menos comando + argumento
          const parts = cmd.trim().split(/\s+/);
          if (parts.length < 2) return false;
          // No debe terminar en guión suelto
          if (cmd.endsWith('-') || cmd.endsWith('- ')) return false;
          return true;
        });
        // También eliminar duplicados y subconjuntos
        const deduped = cleanedHistory.reduce((acc: string[], curr) => {
          // Verificar si ya existe una versión más larga o es un subconjunto
          const isDuplicate = acc.some(existing =>
            existing.startsWith(curr) || curr.startsWith(existing)
          );
          if (!isDuplicate) {
            acc.push(curr);
          } else {
            // Si el actual es más largo, reemplazar
            const existingIndex = acc.findIndex(e => curr.startsWith(e));
            if (existingIndex !== -1 && curr.length > acc[existingIndex].length) {
              acc[existingIndex] = curr;
            }
          }
          return acc;
        }, []);
        setCommandHistory(deduped);
      } catch (e) {
        console.log('Error parsing history');
      }
    }

    if (savedUsage) {
      try {
        setCommandUsage(JSON.parse(savedUsage));
      } catch (e) {
        console.log('Error parsing usage');
      }
    }
  }, []);

  // Guardar historial en localStorage cuando cambia
  useEffect(() => {
    if (commandHistory.length > 0) {
      localStorage.setItem('lsearch-command-history', JSON.stringify(commandHistory));
    }
  }, [commandHistory]);

  // Guardar uso en localStorage cuando cambia
  useEffect(() => {
    if (commandUsage.length > 0) {
      localStorage.setItem('lsearch-command-usage', JSON.stringify(commandUsage));
    }
  }, [commandUsage]);

  // Callback cuando cambia el comando en el editor
  const handleCommandChange = useCallback((command: string, fullInput: string) => {
    // Validar que el comando no esté incompleto
    // No guardar si termina en un guión suelto (argumento sin terminar)
    if (fullInput.endsWith('-') || fullInput.endsWith('- ')) {
      return; // No guardar comandos incompletos
    }

    // No guardar si solo es el comando base sin argumentos significativos
    const parts = fullInput.trim().split(/\s+/);
    if (parts.length < 2) {
      return; // Esperar a que tenga al menos un argumento
    }

    // Actualizar historial de forma inteligente
    setCommandHistory(prev => {
      // Filtrar versiones anteriores del mismo comando base
      // Esto evita tener "cat -n" y "cat -n -E" al mismo tiempo
      const filteredHistory = prev.filter(h => {
        const historyBase = h.trim().split(/\s+/)[0]?.toLowerCase();
        // Si es el mismo comando base, verificar si el nuevo es una extensión
        if (historyBase === command) {
          // Si el nuevo input contiene al historial anterior, eliminar el anterior
          if (fullInput.startsWith(h) || h.startsWith(fullInput)) {
            return false; // Eliminar versiones anteriores/subconjuntos
          }
        }
        return h !== fullInput; // Eliminar duplicados exactos
      });

      // Añadir al principio, máximo 10 entradas
      return [fullInput, ...filteredHistory].slice(0, 10);
    });

    // Actualizar conteo de uso (solo contar el comando base, no cada variación)
    setCommandUsage(prev => {
      const existing = prev.find(u => u.command === command);
      if (existing) {
        return prev.map(u =>
          u.command === command
            ? { ...u, count: u.count + 1, lastUsed: new Date().toISOString() }
            : u
        ).sort((a, b) => b.count - a.count);
      } else {
        return [...prev, { command, count: 1, lastUsed: new Date().toISOString() }]
          .sort((a, b) => b.count - a.count);
      }
    });
  }, []);

  // Insertar comando desde historial
  const insertFromHistory = useCallback((cmd: string) => {
    setEditorInput({ value: cmd, timestamp: Date.now() });
  }, []);

  // Abrir comando en el Editor de Comandos (desde las tarjetas)
  const openInEditor = useCallback((commandText: string) => {
    console.log('HomePage: openInEditor called with:', commandText);
    // 1. Abrir el desplegable del Editor si no está abierto
    setShowEditor(true);
    // 2. Poner el comando en el editor con timestamp para forzar actualización
    const newInput = { value: commandText, timestamp: Date.now() };
    console.log('HomePage: setting editorInput to:', newInput);
    setEditorInput(newInput);
    // 3. Scroll suave hacia el editor
    setTimeout(() => {
      const editorSection = document.querySelector('[data-editor-section]');
      console.log('HomePage: scrolling to editor section:', editorSection);
      editorSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);

  // Top 5 comandos más usados con datos de la BD
  const topUsedCommands = useMemo(() => {
    return commandUsage
      .slice(0, 5)
      .map(usage => {
        const cmdData = commands.find(c => c.command.toLowerCase() === usage.command);
        return {
          ...usage,
          description: cmdData?.description || 'Comando del sistema'
        };
      });
  }, [commandUsage, commands]);

  // Filtrar comandos basado en búsqueda y categoría
  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesCategory = !selectedCategory || cmd.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [commands, searchQuery, selectedCategory]);

  // Calcular conteos por categoría
  const categoryCounts = useMemo(() => {
    return commands.reduce((acc, cmd) => {
      acc[cmd.category] = (acc[cmd.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [commands]);

  // Cargar comandos de Supabase al montar
  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/commands');
      if (res.ok) {
        const data = await res.json();
        if (data.commands && data.commands.length > 0) {
          setCommands(data.commands);
          setIsSupabaseConnected(true);
        }
      }
    } catch (error) {
      console.log('Usando datos de ejemplo - Supabase no configurado');
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {/* Cabecera */}
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Terminal className="w-12 h-12 text-[#00ff88]" />
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-bold">
            <span className="text-white">L</span>
            <span className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              Search
            </span>
          </h1>
        </div>
        <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
          Tu buscador definitivo de <span className="text-[#00d4ff]">comandos Linux</span> y{' '}
          <span className="text-[#a855f7]">herramientas de ciberseguridad</span>.
          Impulsado por la inteligencia de NotebookLM.
        </p>

        {/* Indicadores de estado */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-[#00ff88]' : 'bg-[#fbbf24]'}`} />
            <span className="text-[#64748b]">
              {isSupabaseConnected ? 'Supabase Conectado' : 'Usando Datos de Ejemplo'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Database className="w-3 h-3 text-[#64748b]" />
            <span className="text-[#64748b]">{commands.length} comandos</span>
          </div>
          <button
            onClick={fetchCommands}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#00ff88] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </motion.header>

      {/* Búsqueda */}
      <section className="max-w-4xl mx-auto mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar cualquier comando..."
        />
      </section>

      {/* Command Editor Toggle */}
      <section className="max-w-7xl mx-auto mb-8" data-editor-section>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#111827] to-[#0f172a] border border-[#1e293b] rounded-xl hover:border-[#00ff88]/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00ff88]/10 rounded-lg">
              <Terminal className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-[#e2e8f0] group-hover:text-[#00ff88] transition-colors">
                Editor de Comandos Inteligente
              </h3>
              <p className="text-xs text-[#64748b]">
                Autocompletado con explicación de cada argumento
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showEditor ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-[#64748b] group-hover:text-[#00ff88]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              {/* Layout con paneles laterales */}
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4">

                {/* Panel Izquierdo - Historial y Atajos */}
                <div className="hidden lg:flex flex-col gap-4">
                  {/* Historial Reciente */}
                  <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-[#a855f7]/10 rounded-lg">
                        <svg className="w-4 h-4 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-[#e2e8f0]">Historial Reciente</h3>
                    </div>
                    <div className="space-y-2">
                      {commandHistory.length > 0 ? (
                        commandHistory.slice(0, 5).map((cmd, i) => (
                          <motion.button
                            key={`${cmd}-${i}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => insertFromHistory(cmd)}
                            className="w-full text-left px-3 py-2 bg-[#0a0f1a] hover:bg-[#1e293b] rounded-lg text-xs font-mono text-[#94a3b8] hover:text-[#00ff88] transition-colors truncate"
                            title={cmd}
                          >
                            <span className="text-[#00ff88] mr-2">$</span>{cmd}
                          </motion.button>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-[11px] text-[#475569]">Empieza a escribir comandos</p>
                          <p className="text-[10px] text-[#334155] mt-1">El historial aparecerá aquí</p>
                        </div>
                      )}
                    </div>
                    {commandHistory.length > 0 && (
                      <p className="text-[10px] text-[#475569] mt-3 text-center">
                        Haz clic para insertar
                      </p>
                    )}
                  </div>

                  {/* Atajos de Teclado */}
                  <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-[#00d4ff]/10 rounded-lg">
                        <svg className="w-4 h-4 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-[#e2e8f0]">Atajos de Teclado</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { keys: ['↑', '↓'], action: 'Navegar sugerencias' },
                        { keys: ['Tab'], action: 'Autocompletar' },
                        { keys: ['Enter'], action: 'Seleccionar' },
                        { keys: ['Esc'], action: 'Cerrar panel' },
                        { keys: ['Ctrl', 'C'], action: 'Copiar comando' },
                      ].map((shortcut, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-[#94a3b8]">{shortcut.action}</span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, j) => (
                              <kbd key={j} className="px-1.5 py-0.5 bg-[#1e293b] border border-[#334155] rounded text-[10px] text-[#64748b] font-mono">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-[#00ff88]/5 to-[#00d4ff]/5 border border-[#00ff88]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h3 className="text-xs font-medium text-[#00ff88]">Tip del día</h3>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                      Usa <code className="px-1 py-0.5 bg-[#1e293b] rounded text-[#00d4ff]">nmap -sV</code> para detectar versiones de servicios y encontrar vulnerabilidades conocidas.
                    </p>
                  </div>
                </div>

                {/* Panel Central - Editor */}
                <div className="min-w-0">
                  <CommandEditor
                    onCommandChange={handleCommandChange}
                    externalInput={editorInput}
                  />
                </div>

                {/* Panel Derecho - Estadísticas y Populares */}
                <div className="hidden lg:flex flex-col gap-4">
                  {/* Estadísticas */}
                  <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-[#fbbf24]/10 rounded-lg">
                        <svg className="w-4 h-4 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-[#e2e8f0]">Estadísticas</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0a0f1a] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#00ff88]">{commands.length}</div>
                        <div className="text-[10px] text-[#64748b]">Comandos</div>
                      </div>
                      <div className="bg-[#0a0f1a] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#a855f7]">{Object.keys(categoryCounts).length}</div>
                        <div className="text-[10px] text-[#64748b]">Categorías</div>
                      </div>
                      <div className="bg-[#0a0f1a] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#00d4ff]">{categoryCounts['security'] || 0}</div>
                        <div className="text-[10px] text-[#64748b]">Seguridad</div>
                      </div>
                      <div className="bg-[#0a0f1a] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#fbbf24]">{categoryCounts['networking'] || 0}</div>
                        <div className="text-[10px] text-[#64748b]">Redes</div>
                      </div>
                    </div>
                  </div>

                  {/* Comandos Populares */}
                  <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-[#ef4444]/10 rounded-lg">
                        <svg className="w-4 h-4 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-[#e2e8f0]">Más Usados</h3>
                    </div>
                    <div className="space-y-2">
                      {topUsedCommands.length > 0 ? (
                        topUsedCommands.map((usage, i) => (
                          <motion.div
                            key={usage.command}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <span className="w-5 h-5 flex items-center justify-center bg-[#1e293b] rounded text-[10px] font-bold text-[#64748b]">
                              {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-[#00ff88] truncate">{usage.command}</span>
                                <span className="px-1.5 py-0.5 bg-[#ef4444]/20 rounded text-[9px] text-[#ef4444] font-bold">
                                  {usage.count}x
                                </span>
                              </div>
                              <div className="text-[10px] text-[#475569] truncate">{usage.description}</div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-[11px] text-[#475569]">Sin estadísticas aún</p>
                          <p className="text-[10px] text-[#334155] mt-1">Usa comandos para ver el ranking</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Categorías Rápidas */}
                  <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-[#06b6d4]/10 rounded-lg">
                        <svg className="w-4 h-4 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-[#e2e8f0]">Categorías</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(categoryCounts).slice(0, 8).map(([cat, count]) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat as Category)}
                          className="px-2 py-1 bg-[#1e293b] hover:bg-[#334155] rounded-lg text-[10px] text-[#94a3b8] hover:text-[#00ff88] transition-colors"
                        >
                          {cat} <span className="text-[#475569]">({count})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Filtro de Categorías */}
      <section className="max-w-4xl mx-auto mb-10">
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
          counts={categoryCounts}
        />
      </section>

      {/* Resultados */}
      <section className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.p
            className="text-[#64748b] text-sm"
            key={filteredCommands.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Mostrando {filteredCommands.length} comando{filteredCommands.length !== 1 ? 's' : ''}
            {searchQuery && <span> para &quot;{searchQuery}&quot;</span>}
          </motion.p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command, index) => (
                <CommandCard
                  key={command.id}
                  command={command}
                  index={index}
                  onOpenInEditor={openInEditor}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Terminal className="w-16 h-16 text-[#334155] mx-auto mb-4" />
                <p className="text-[#64748b] text-lg">No se encontraron comandos</p>
                <p className="text-[#475569] text-sm mt-2">
                  Intenta ajustar tu búsqueda o filtros
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Pie de página */}
      <motion.footer
        className="mt-20 text-center text-[#475569] text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-6 mb-4">
          <a
            href="/admin"
            className="flex items-center gap-2 hover:text-[#00ff88] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Panel Admin
          </a>
          <a
            href="/admin"
            className="flex items-center gap-2 hover:text-[#00ff88] transition-colors"
          >
            <Zap className="w-4 h-4" />
            Sincronizar
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#00ff88] transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
        <p>Construido con Next.js, Supabase y NotebookLM MCP</p>
      </motion.footer>
    </main>
  );
}
