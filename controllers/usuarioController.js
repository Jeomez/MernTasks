const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs'); 
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array() });
    }
    const { email, password } = req.body;
   
    try {
        //Revisar si el usuario es unico
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({ msg: 'El usuario ya existe'});
        }

        //crea el nuevo usuario
        usuario = new Usuario(req.body); 

        //Hashear el password del usuario
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar el nuevo usuario
        await usuario.save();

        //crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            
            }
        }

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 3600 //1 hora
        }, (error, token) => {
            if(error) throw error;

            //respuesta de exito
            res.json({ token }); 

        });

        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }

}