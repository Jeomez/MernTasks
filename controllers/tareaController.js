const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array() });
    }

    //Extraer el proyecto y comprobar si existe
    const { proyecto } = req.body;
    try {
        const existeproyecto = await Proyecto.findById(proyecto);
        if(!existeproyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeproyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');

    }

}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    const { proyecto } = req.query;
    try {
        const existeproyecto = await Proyecto.findById(proyecto);
        if(!existeproyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeproyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });

    }catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');

    }
}

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    const { proyecto, nombre, estado } = req.body;
    try {
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'})
        }

        const existeproyecto = await Proyecto.findById(proyecto);
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeproyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        

        //actualizamos la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

//Elimina una tarea
exports.eliminarTarea = async (req, res) => {
    const { proyecto } = req.query;

    console.log(req.query);
    try {
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'})
        }

        const existeproyecto = await Proyecto.findById(proyecto);
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeproyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

        //Eliminar tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

