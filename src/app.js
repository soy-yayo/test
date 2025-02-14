import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
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

let messages = []; // Array de mensajes
io.on('connection', (socket) => { // Se ejecuta cuando un cliente se conecta
  console.log('Nueva conección'); // Muestra el id del socket

  socket.on('message', data => {
    messages.push(data); // Agrega el mensaje al array
    io.emit('messageLogs', messages); // Emite el evento 'message' a todos los clientes
  });

});

