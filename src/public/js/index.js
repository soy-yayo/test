const socket = io(); // io es por convención el nombre que se le da a la instancia de socket.io
let user = '';
let chatBox = document.getElementById('chatBox');
Swal.fire({
  title: 'Bienvenido, identifícate', // Título del modal
  input: 'text', // Input de tipo texto
  text: 'Ingresa tu nombre de usuario', // Texto del modal
  inputValidator: (value) => { // Validador del input
    return !value && 'Debes ingresar un nombre de usuario'; // Mensaje de error
  },
  allowOutsideClick: false // No se puede cerrar el modal haciendo click afuera
}).then((result) => { // Se ejecuta cuando se cierra el modal
    user = result.value // Se guarda el valor del input en la variable username
});

chatBox.addEventListener('keyup', (e) => { // Se ejecuta cuando se suelta una tecla en el chatBox
  if (e.key === 'Enter') { // Si la tecla es Enter
    if(chatBox.value.trim().length > 0){
      socket.emit('message', { // Emite el evento '
        user: user, // Nombre de usuario
        message : chatBox.value
      }); 
      chatBox.value = ''; // Limpia el chatBox
    }
  }
});

socket.on('messageLogs', (data) => {
  let log = document.getElementById('messageLogs');
  let messages = "";
  data.forEach(message => {
    messages = messages + `${message.user}: ${message.message} <br>`;
  });
  log.innerHTML = messages;
}); // Se ejecuta cuando se recibe un mensaje