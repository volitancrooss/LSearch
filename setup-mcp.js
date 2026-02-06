const { spawn } = require('child_process');

const NOTEBOOK_ID = '03df5b37-f1ea-40d5-b9c2-79a20a047a43';

async function setup() {
    console.log('Iniciando configuración de NotebookLM MCP...');

    // Lanzar el servidor MCP
    const proc = spawn('npx', ['-y', 'notebooklm-mcp'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
    });

    let buffer = '';
    let initialized = false;

    proc.stdout.on('data', (chunk) => {
        const text = chunk.toString();
        // console.log('[MCP OUT]', text); // Descomentar para debug total
        buffer += text;

        const lines = buffer.split('\n');
        buffer = lines.pop(); // Guardar el fragmento incompleto

        for (const line of lines) {
            if (!line.trim()) continue;
            try {
                const msg = JSON.parse(line);

                // 1. Responder al saludo inicial
                if (msg.id === 1 && !initialized) {
                    console.log('Servidor inicializado. Enviando handshake...');
                    initialized = true;
                    // Enviar 'initialized'
                    proc.stdin.write(JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'notifications/initialized',
                        params: {}
                    }) + '\n');

                    // 2. Añadir el cuaderno inmediatamente después
                    console.log(`Añadiendo cuaderno ${NOTEBOOK_ID}...`);
                    setTimeout(() => {
                        proc.stdin.write(JSON.stringify({
                            jsonrpc: '2.0',
                            id: 2,
                            method: 'tools/call',
                            params: {
                                name: 'add_notebook',
                                arguments: {
                                    notebook_id: NOTEBOOK_ID
                                }
                            }
                        }) + '\n');
                    }, 1000);
                }

                // 3. Verificar resultado de añadir
                if (msg.id === 2) {
                    if (msg.error) {
                        console.error('Error al añadir cuaderno:', msg.error);
                    } else {
                        console.log('¡Cuaderno añadido con éxito!', msg.result);
                    }
                    console.log('Cerrando configuración...');
                    proc.kill();
                    process.exit(0);
                }

            } catch (e) {
                // Ignorar líneas que no son JSON (logs del servidor)
            }
        }
    });

    // Enviar solicitud de Initialize para arrancar el protocolo
    // Esperamos un poco para que el servidor arranque
    setTimeout(() => {
        console.log('Enviando solicitud de inicialización...');
        proc.stdin.write(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'setup-script', version: '1.0' }
            }
        }) + '\n');
    }, 2000);
}

setup();
