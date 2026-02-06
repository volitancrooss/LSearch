'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Info, Copy, Check, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import {
    COMMAND_KNOWLEDGE,
    getArgSuggestions,
    type ArgInfo,
    type CommandKnowledge
} from '@/lib/commandKnowledge';

// Tipo para comandos de la BD
interface DBCommand {
    id: string;
    command: string;
    description: string;
    category: string;
    examples: Array<{ code: string; description: string }>;
    tags: string[];
}

// Tipo para sugerencias
type Suggestion = {
    flag: string;
    name: string;
    description: string;
    requiresValue?: boolean;
    valueHint?: string;
    category?: string;
};

// Tipo para las partes analizadas del comando
interface CommandPart {
    text: string;
    type: 'command' | 'flag' | 'value' | 'path' | 'unknown';
    explanation?: string;
}

// Props del componente
interface CommandEditorProps {
    onCommandChange?: (command: string, fullInput: string) => void;
    externalInput?: { value: string; timestamp: number };
}

export default function CommandEditor({ onCommandChange, externalInput }: CommandEditorProps) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [dbCommands, setDbCommands] = useState<DBCommand[]>([]);
    const [isLoadingCommands, setIsLoadingCommands] = useState(true);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const lastReportedCommand = useRef<string>('');
    const lastExternalTimestamp = useRef<number>(0);

    // Sincronizar externalInput cuando cambia desde padre (ej: clic en tarjeta o historial)
    useEffect(() => {
        if (externalInput && externalInput.timestamp > lastExternalTimestamp.current) {
            lastExternalTimestamp.current = externalInput.timestamp;
            setInput(externalInput.value);
            // Focus con un pequeño delay para asegurar que el editor esté visible
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);
        }
    }, [externalInput]);

    useEffect(() => {
        const loadCommands = async () => {
            try {
                const res = await fetch('/api/commands');
                if (res.ok) {
                    const data = await res.json();
                    if (data.commands) {
                        setDbCommands(data.commands);
                    }
                }
            } catch (error) {
                console.log('Error cargando comandos desde BD');
            } finally {
                setIsLoadingCommands(false);
            }
        };
        loadCommands();
    }, []);

    // Crear mapa de comandos fusionando BD + conocimiento estático
    const allCommands = useMemo(() => {
        const commandMap = new Map<string, {
            command: string;
            description: string;
            category?: string;
            examples?: Array<{ code: string; description: string }>;
            args?: ArgInfo[];
            synopsis?: string;
            tags?: string[];
            fromDB: boolean;
        }>();

        // Primero añadir comandos de la BD
        dbCommands.forEach(cmd => {
            commandMap.set(cmd.command.toLowerCase(), {
                command: cmd.command,
                description: cmd.description,
                category: cmd.category,
                examples: cmd.examples,
                tags: cmd.tags,
                fromDB: true
            });
        });

        // Luego enriquecer con conocimiento estático (si existe)
        Object.entries(COMMAND_KNOWLEDGE).forEach(([key, knowledge]) => {
            const existing = commandMap.get(key);
            if (existing) {
                // Fusionar: mantener datos de BD pero añadir args del conocimiento estático
                commandMap.set(key, {
                    ...existing,
                    args: knowledge.args,
                    synopsis: knowledge.synopsis,
                    fromDB: true
                });
            } else {
                // Añadir solo del conocimiento estático
                commandMap.set(key, {
                    command: knowledge.command,
                    description: knowledge.description,
                    synopsis: knowledge.synopsis,
                    args: knowledge.args,
                    fromDB: false
                });
            }
        });

        return commandMap;
    }, [dbCommands]);

    // Obtener el comando base del input
    const baseCommand = useMemo(() => {
        const firstWord = input.trim().split(/\s+/)[0]?.toLowerCase() || '';
        return allCommands.get(firstWord) || null;
    }, [input, allCommands]);

    // Notificar cambios de comando al padre con debounce para capturar argumentos
    useEffect(() => {
        const currentCommand = input.trim().split(/\s+/)[0]?.toLowerCase() || '';
        const trimmedInput = input.trim();

        // Solo procesar si hay un comando válido
        if (!currentCommand || !allCommands.has(currentCommand)) {
            return;
        }

        // Usar debounce para esperar a que el usuario termine de escribir argumentos
        const timeoutId = setTimeout(() => {
            // Solo notificar si el input actual es diferente al último reportado
            // Esto permite capturar el comando completo con argumentos
            if (trimmedInput !== lastReportedCommand.current && trimmedInput.length > 0) {
                lastReportedCommand.current = trimmedInput;
                onCommandChange?.(currentCommand, trimmedInput);
            }
        }, 800); // Esperar 800ms después de que el usuario deje de escribir

        return () => clearTimeout(timeoutId);
    }, [input, allCommands, onCommandChange]);


    // Obtener sugerencias (comandos o argumentos)
    const suggestions = useMemo((): Suggestion[] => {
        const parts = input.trim().split(/\s+/);
        const firstWord = parts[0]?.toLowerCase() || '';

        if (!input.trim()) {
            // Sin input: sugerir todos los comandos disponibles
            const allSuggestions: Suggestion[] = [];
            allCommands.forEach((cmd, key) => {
                allSuggestions.push({
                    flag: cmd.command,
                    name: cmd.description,
                    description: cmd.synopsis || `Comando de ${cmd.category || 'sistema'}`,
                    category: cmd.category
                });
            });
            return allSuggestions.slice(0, 20); // Limitar para rendimiento
        }

        // Si el comando existe, obtener sugerencias de argumentos
        const cmdInfo = allCommands.get(firstWord);
        if (cmdInfo?.args) {
            // Tiene argumentos detallados - usar la función existente
            return getArgSuggestions(input);
        }

        // Si no hay argumentos detallados pero es un comando conocido
        if (cmdInfo && parts.length === 1) {
            // Sugerir comandos que empiecen con lo escrito
            const matching: Suggestion[] = [];
            allCommands.forEach((cmd, key) => {
                if (key.startsWith(firstWord) && key !== firstWord) {
                    matching.push({
                        flag: cmd.command,
                        name: cmd.description,
                        description: cmd.synopsis || `Comando de ${cmd.category || 'sistema'}`,
                        category: cmd.category
                    });
                }
            });
            return matching;
        }

        // Comando no reconocido: buscar coincidencias parciales
        if (!cmdInfo && parts.length === 1) {
            const matching: Suggestion[] = [];
            allCommands.forEach((cmd, key) => {
                if (key.includes(firstWord) || cmd.description.toLowerCase().includes(firstWord)) {
                    matching.push({
                        flag: cmd.command,
                        name: cmd.description,
                        description: cmd.synopsis || `Comando de ${cmd.category || 'sistema'}`,
                        category: cmd.category
                    });
                }
            });
            return matching.slice(0, 15);
        }

        return [];
    }, [input, allCommands]);

    // Analizar el comando actual dinámicamente
    const commandParts = useMemo((): CommandPart[] => {
        const parts: CommandPart[] = [];
        const tokens = input.trim().split(/\s+/);

        if (tokens.length === 0 || !tokens[0]) return parts;

        const command = tokens[0].toLowerCase();
        const cmdInfo = allCommands.get(command);

        // Primer token es el comando
        parts.push({
            text: tokens[0],
            type: 'command',
            explanation: cmdInfo?.description || 'Comando no reconocido en la base de datos'
        });

        // Analizar el resto de tokens
        for (let i = 1; i < tokens.length; i++) {
            const token = tokens[i];

            if (token.startsWith('-')) {
                // Es un flag - buscar en args si existen
                const argInfo = cmdInfo?.args?.find(a => a.flag === token || token.startsWith(a.flag));
                parts.push({
                    text: token,
                    type: 'flag',
                    explanation: argInfo?.description || `Argumento del comando ${command}`
                });

                // Si el argumento requiere valor y hay siguiente token
                if (argInfo?.requiresValue && i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
                    i++;
                    parts.push({
                        text: tokens[i],
                        type: 'value',
                        explanation: `Valor para ${argInfo.name}`
                    });
                }
            } else if (token.includes('/') || token.includes('.') || token.includes('~')) {
                // Parece una ruta o archivo
                parts.push({
                    text: token,
                    type: 'path',
                    explanation: 'Ruta o archivo objetivo'
                });
            } else {
                parts.push({
                    text: token,
                    type: 'unknown',
                    explanation: 'Argumento, valor u objetivo del comando'
                });
            }
        }

        return parts;
    }, [input, allCommands]);

    // Manejar teclas especiales
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Tab':
            case 'Enter':
                if (showSuggestions && suggestions[selectedSuggestionIndex]) {
                    e.preventDefault();
                    insertSuggestion(suggestions[selectedSuggestionIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    }, [showSuggestions, suggestions, selectedSuggestionIndex]);

    // Insertar sugerencia seleccionada
    const insertSuggestion = (suggestion: Suggestion) => {
        const parts = input.trim().split(/\s+/);
        const lastPart = parts[parts.length - 1] || '';

        let newInput: string;

        if (!input.trim()) {
            // Sin input, insertar comando
            newInput = suggestion.flag + ' ';
        } else if (lastPart.startsWith('-')) {
            // Reemplazar el argumento parcial
            parts[parts.length - 1] = suggestion.flag;
            newInput = parts.join(' ') + (suggestion.requiresValue ? ' ' : ' ');
        } else if (parts.length === 1 && !allCommands.has(parts[0].toLowerCase())) {
            // Reemplazar comando parcial
            newInput = suggestion.flag + ' ';
        } else {
            // Añadir nuevo argumento
            newInput = input.trimEnd() + ' ' + suggestion.flag + (suggestion.requiresValue ? ' ' : ' ');
        }

        setInput(newInput);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(0);
        inputRef.current?.focus();
    };

    // Copiar comando al portapapeles
    const copyToClipboard = async () => {
        if (!input.trim()) return;
        await navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Mostrar sugerencias cuando se escribe
    useEffect(() => {
        if (isActive && (input.trim() === '' || suggestions.length > 0)) {
            setShowSuggestions(true);
            setSelectedSuggestionIndex(0);
        } else {
            setShowSuggestions(false);
        }
    }, [input, isActive, suggestions.length]);

    // Scroll a la sugerencia seleccionada
    useEffect(() => {
        if (suggestionsRef.current && showSuggestions) {
            const selectedElement = suggestionsRef.current.children[selectedSuggestionIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedSuggestionIndex, showSuggestions]);

    // Obtener color de categoría
    const getCategoryColor = (category?: string) => {
        const colors: Record<string, string> = {
            security: '#a855f7',
            networking: '#00d4ff',
            files: '#00ff88',
            system: '#fbbf24',
            text: '#06b6d4',
            process: '#ef4444',
            permissions: '#f97316',
            disk: '#64748b',
            users: '#ec4899',
        };
        return colors[category || ''] || '#64748b';
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header del Editor */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00ff88]/20 to-[#00d4ff]/20 rounded-lg border border-[#00ff88]/30">
                    <Terminal className="w-4 h-4 text-[#00ff88]" />
                    <span className="text-sm font-medium text-[#00ff88]">Command Editor</span>
                    <Sparkles className="w-3 h-3 text-[#00d4ff]" />
                </div>
                <span className="text-xs text-[#64748b]">
                    {isLoadingCommands ? (
                        <span className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Cargando comandos...
                        </span>
                    ) : (
                        `${allCommands.size} comandos disponibles`
                    )}
                </span>
            </div>

            {/* Contenedor principal del editor */}
            <div className="relative">
                {/* Terminal Input */}
                <div
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${isActive
                        ? 'ring-2 ring-[#00ff88]/50 shadow-lg shadow-[#00ff88]/10'
                        : 'ring-1 ring-[#1e293b]'
                        }`}
                >
                    {/* Barra de título estilo terminal */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] border-b border-[#1e293b]">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-[#00ff88]" />
                            <div className="w-px h-4 bg-[#334155]" />
                        </div>
                        <span className="text-xs text-[#64748b]">
                            {baseCommand ? (
                                <span className="flex items-center gap-2">
                                    <span className="text-[#e2e8f0]">{baseCommand.command}</span>
                                    <span>—</span>
                                    <span>{baseCommand.description}</span>
                                    {baseCommand.category && (
                                        <span
                                            className="px-1.5 py-0.5 rounded text-[10px] uppercase"
                                            style={{
                                                backgroundColor: `${getCategoryColor(baseCommand.category)}20`,
                                                color: getCategoryColor(baseCommand.category)
                                            }}
                                        >
                                            {baseCommand.category}
                                        </span>
                                    )}
                                </span>
                            ) : (
                                'Terminal Interactivo'
                            )}
                        </span>
                    </div>

                    {/* Área de input */}
                    <div className="bg-[#0a0f1a] p-4">
                        <div className="flex items-start gap-2">
                            <span className="text-[#00ff88] font-mono select-none mt-1">$</span>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsActive(true)}
                                onBlur={() => setTimeout(() => setIsActive(false), 200)}
                                placeholder="Escribe un comando (ej: nmap, aircrack, grep, find...)"
                                className="flex-1 bg-transparent text-[#e2e8f0] font-mono text-sm resize-none outline-none placeholder:text-[#475569] min-h-[60px]"
                                spellCheck={false}
                                autoComplete="off"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="p-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] transition-colors"
                                title="Copiar comando"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-[#00ff88]" />
                                ) : (
                                    <Copy className="w-4 h-4 text-[#64748b]" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Panel de Sugerencias */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            ref={suggestionsRef}
                            className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-[#111827] border border-[#1e293b] rounded-xl shadow-xl z-50"
                        >
                            {suggestions.slice(0, 12).map((suggestion, index) => (
                                <button
                                    key={`${suggestion.flag}-${index}`}
                                    onClick={() => insertSuggestion(suggestion)}
                                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${index === selectedSuggestionIndex
                                        ? 'bg-[#00ff88]/10 border-l-2 border-l-[#00ff88]'
                                        : 'hover:bg-[#1e293b] border-l-2 border-l-transparent'
                                        }`}
                                >
                                    <code className="px-2 py-0.5 bg-[#1e293b] rounded text-[#00ff88] font-mono text-sm shrink-0">
                                        {suggestion.flag}
                                    </code>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#e2e8f0] text-sm font-medium">
                                                {suggestion.name}
                                            </span>
                                            {suggestion.category && (
                                                <span
                                                    className="px-1.5 py-0.5 rounded text-[10px] uppercase"
                                                    style={{
                                                        backgroundColor: `${getCategoryColor(suggestion.category)}20`,
                                                        color: getCategoryColor(suggestion.category)
                                                    }}
                                                >
                                                    {suggestion.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[#64748b] text-xs mt-0.5 line-clamp-2">
                                            {suggestion.description}
                                        </div>
                                        {suggestion.requiresValue && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 bg-[#a855f7]/20 text-[#a855f7] rounded">
                                                    Requiere valor
                                                </span>
                                                {suggestion.valueHint && (
                                                    <span className="text-[10px] text-[#64748b]">
                                                        ej: {suggestion.valueHint}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#475569] shrink-0 mt-1" />
                                </button>
                            ))}
                            <div className="px-4 py-2 border-t border-[#1e293b] bg-[#0f172a]">
                                <span className="text-[10px] text-[#64748b]">
                                    ↑↓ para navegar • Tab/Enter para seleccionar • Esc para cerrar
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Panel de Análisis del Comando */}
            <AnimatePresence>
                {commandParts.length > 0 && input.trim() && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                    >
                        <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Info className="w-4 h-4 text-[#00d4ff]" />
                                <span className="text-sm font-medium text-[#00d4ff]">
                                    Análisis del Comando
                                </span>
                                {baseCommand?.fromDB && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-[#00ff88]/20 text-[#00ff88] rounded">
                                        Desde NotebookLM
                                    </span>
                                )}
                            </div>

                            {/* Visualización del comando con colores */}
                            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#0a0f1a] rounded-lg font-mono text-sm">
                                {commandParts.map((part, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 rounded ${part.type === 'command' ? 'bg-[#00ff88]/20 text-[#00ff88]' :
                                            part.type === 'flag' ? 'bg-[#a855f7]/20 text-[#a855f7]' :
                                                part.type === 'value' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' :
                                                    part.type === 'path' ? 'bg-[#fbbf24]/20 text-[#fbbf24]' :
                                                        'bg-[#64748b]/20 text-[#94a3b8]'
                                            }`}
                                    >
                                        {part.text}
                                    </span>
                                ))}
                            </div>

                            {/* Explicaciones detalladas */}
                            <div className="space-y-2">
                                {commandParts.map((part, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 text-sm"
                                    >
                                        <code className={`shrink-0 px-2 py-0.5 rounded font-mono text-xs ${part.type === 'command' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                                            part.type === 'flag' ? 'bg-[#a855f7]/10 text-[#a855f7]' :
                                                part.type === 'value' ? 'bg-[#00d4ff]/10 text-[#00d4ff]' :
                                                    part.type === 'path' ? 'bg-[#fbbf24]/10 text-[#fbbf24]' :
                                                        'bg-[#64748b]/10 text-[#94a3b8]'
                                            }`}>
                                            {part.text}
                                        </code>
                                        <span className="text-[#94a3b8]">
                                            {part.explanation}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Ejemplos del comando (desde BD) */}
                            {baseCommand?.examples && baseCommand.examples.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-[#1e293b]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-3 h-3 text-[#fbbf24]" />
                                        <span className="text-xs font-medium text-[#fbbf24]">
                                            Ejemplos de uso
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {baseCommand.examples.slice(0, 4).map((example, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setInput(example.code)}
                                                className="w-full flex items-start gap-3 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] rounded-lg text-left transition-colors"
                                            >
                                                <code className="text-xs font-mono text-[#00ff88] shrink-0">
                                                    {example.code}
                                                </code>
                                                <span className="text-xs text-[#94a3b8]">
                                                    {example.description}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags del comando */}
                            {baseCommand?.tags && baseCommand.tags.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-[#1e293b]">
                                    <div className="flex flex-wrap gap-1">
                                        {baseCommand.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-0.5 bg-[#1e293b] rounded text-[10px] text-[#64748b]"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Tips */}
            {!input.trim() && !isLoadingCommands && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs text-[#64748b]">Prueba:</span>
                    {['aircrack', 'nmap -sV', 'grep -rni', 'find . -name', 'hydra'].map((example) => (
                        <button
                            key={example}
                            onClick={() => setInput(example)}
                            className="px-2 py-1 bg-[#1e293b] hover:bg-[#334155] rounded text-xs font-mono text-[#64748b] hover:text-[#00ff88] transition-colors"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
