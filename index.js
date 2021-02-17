const express = require('express');
const conectarDB = require('./config/db'); //jala la funcion para conectar
const cors = require('cors');

//Conecta a la base de datos
conectarDB();



//crear el servidor
const app = express();

//Habilitar cors
app.use(cors());

//puerto de la app
const port = process.env.PORT || 4000;

app.use(express.json({extended: true}));

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));



//arrancar la app o el servidor
app.listen(port, '0.0.0.0',  () => {
    console.log(`El servidor esta corriendo por el puerto ${port}`);
});
