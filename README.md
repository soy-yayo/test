# Programación Backend I: Clase 11

## Objetivos 

- Desarrollar una **aplicación chat con websockets** 
- Comprender el uso de **Sweetalert** como sistema de autenticación intermedio. 
- Hacer Deploy de nuestra primera aplicación utilizando **Glitch.com**

## Glosario

- **Websocket**: Protocolo de comunicación que permite una sesión activa entre cliente y servidor

- **Hanshake** : Acuerdo entre cliente y servidor que permite establecer una conexión abierta entre ambos puntos.

- **socket.on** : Listener de eventos que involucren a los sockets. El listener debe escuchar un evento de nombre idéntico al emitido por el otro punto

- **socket.emit**: Emisor de eventos tanto para cliente como para servidor. El emisor debe emitir un evento de nombre idéntico al que se está escuchando del otro lado.

- **socketServer.emit**: Emisor de eventos del servidor para todos los clientes. 

- **socket.broadcast.emit** :   Emisor de eventos del servidor para todos los clientes, a excepción del socket raíz del cual se llama el evento.



## Aplicación chat con Websockets


Nuestro chat comunitario contará con:

- Una vista que cuente con un formulario para poder identificarse. El usuario podrá elegir el nombre de usuario con el cual aparecerá en el chat. 
- Un cuadro de input sobre el cual el usuario podrá escribir el mensaje.
- Un panel donde todos los usuarios conectados podrán visualizar los mensajes en tiempo real
- Una vez desarrollada esta aplicación, subiremos nuestro código a glitch.com, para que todos puedan utilizarlo.

1. Tener listo un servidor Express

Para poder trabajar con websockets en Express, necesitamos un servidor para que trabajen en conjunto

2.  Realizar las instalaciones

Una vez que tenemos la estructura de carpetas inicial, realizamos la instalación de nuestros elementos cruciales para trabajar con websockets.

- **express**: Nuestro servidor principal.
- **express-handlebars**: Para las plantillas donde colocaremos el socket de lado de cliente.
- **socket.io**: Para trabajar con websockets, tanto para cliente como para servidor.

```
npm install express express-handlebars socket.io
```

3. Configurando nuestro servidor express con Handlebars + socket.io : app.js
```
import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './views.router.js';
import { Server } from 'socket.io';

const PORT = 8080;

const app = express();
const httpServer = app.listen(PORT, () => console.log(`Server started in port: ${PORT}`));

const io = new Server(httpServer); // Socket.io

// Configuración de handlebars
app.engine('handlebars', handlebars.engine()); // Establece el motor de renderizado
app.set('views', __dirname + '/views'); // Establece la carpeta de las vistas
app.set('view engine', 'handlebars'); // Establece el motor de renderizado
app.use(express.static(__dirname + '/public')); // Establece la carpeta de los recursos estáticos
app.use('/', viewsRouter); // Establece el router de las vistas


```

3. Configurando nuestro servidor express con Handlebars + socket.io : utils.js

Solo válido si trabajamos con type: module.

```
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
```

3. Configurando nuestro servidor express con Handlebars + socket.io: views.router.js

```
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {}); // Renderiza la vista index
});
```

3. Configurando nuestro servidor express con Handlebars + socket.io: index.handlebars

```
<div>
  <h1>Hi :)</h1>
</div>  
```

4. Agregar js a la carpeta public y a nuestro index.handlebars
5. Levantar nuestro socket del lado del cliente en index.js

```
const socket = io(); // io es por convención el nombre que se le da a la instancia de socket.io
```

## Sweetalert2

**Sweetalert2** nos permitirá utilizar alertas más estéticas y con más funcionalidades. En este caso la utilizaremos para dos cosas particulares:

- Para bloquear la pantalla del chat hasta que el usuario se identifique
- Para notificar a los usuarios cuando alguien se conecte al chat

1. Instalamos Sweetalert en la nuestra vista “index.handlebars”

```
<div>
  <h1>Hi :)</h1>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="/socket.io/socket.io.js"></script>
<script src="/js/index.js"></script>
```

2. Utilizamos el objeto “Swal” en nuestro index.js

```
const socket = io(); // io es por convención el nombre que se le da a la instancia de socket.io

Swal.fire({
  title: 'Bienvenido',
  text: 'Alerta de prueba',
  icon: "success"
});
```

### Vista de autenticación con Sweetalert2

Configuramos nuestro archivo index.handlebars para que esta vez no nos salude solamente. Colocaremos un mensaje de bienvenida, pero colocaremos dos etiquetas adicionales.

```
<h1>Holap</h1>
<div>
  <input id="chatBox">  
</div>
<div>
  <p id="messageLogs"></p>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="/socket.io/socket.io.js"></script>
<script src="/js/index.js"></script>
```

#### Reestructuramos nuestro index.js para un sistema de autenticación con Sweetalert2

```
const socket = io(); // io es por convención el nombre que se le da a la instancia de socket.io
let username = '';
let chatBox = document.getElementById('chatBox');
Swal.fire({
  title: 'Bienvenido, identifícate', // Título del modal
  input: 'text', // Input de tipo texto
  text: 'Ingresa tu nombre de usuario', // Texto del modal
  inputValidator: (value) => { // Validador del input
    if (!value) return 'Debes ingresar un nombre de usuario'; // Si no hay valor, se muestra el mensaje
  },
  allowOutsideClick: false, // No se puede cerrar el modal haciendo click afuera
}).then((result) => { // Se ejecuta cuando se cierra el modal
  if (result.isConfirmed) { // Si se confirmó el modal
    username = result.value; // Se guarda el valor del input en la variable username
  }
});

chatBox.addEventListener('keyup', (e) => { // Se ejecuta cuando se suelta una tecla en el chatBox
  if (e.key === 'Enter') { // Si la tecla es Enter
    if(chatBox.value.trim().lenght > 0){
      socket.emit('message', { // Emite el evento '
        username: username, // Nombre de usuario
        message : chatBox.value
      });
      chatBox.value = ''; // Limpia el chatBox
    }
  }
});
```

Agregamos a nuestro chatBox el evento de socket

#### Configuramos nuestro app.js para escuchar el evento “app.js”

```
io.on('connection', (socket) => { // Se ejecuta cuando un cliente se conecta
  console.log('Nueva conección'); // Muestra el id del socket

  socket.on('message', data => {
    messages.push(data); // Agrega el mensaje al array
    io.sockets.emit('message', data); // Emite el evento 'message' a todos los clientes
  });

});

```

#### Configuramos nuevamente index.js para agregar el Listener del evento “messageLogs” y mostrarlo en la página

```
socket.on ('messageLogs', (data) => {
  let logs = document.getElementById('messageLogs');
  let messages = '';
  data.forEach(message => {
    messages = message + `${message.username}: ${message.message} <br>`;
  });
  logs.innerHTML = messages;
}); // Se ejecuta cuando se recibe un mensaje
```