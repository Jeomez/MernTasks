const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs'); 
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array() });
    }    

    //extraer el email y password del request
    const { email, password } = req.body;

    try {
        //Revisar que existe el usuario
        let usuario = await Usuario.findOne({email});
        if(!usuario) {
            res.status(400).json({msg: 'El usuario no existe'});
        }
        //Revisar el password que sea correcto
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto) {
            res.status(400).json({msg: 'El password no coincide'});
        }

        //si todo es correcto crear el JWT
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
    }
}

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await (await Usuario.findById(req.usuario.id));
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.json({msg: 'Hubo un error'});
    }
}