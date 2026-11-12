require('dotenv').config();


const db = require('.\\config\\database');
const bcrypt = require('bcryptjs');


async function crearUsuarioPrueba() {
    const email = 'admin@turnos.com';
    const password = 'AdminTurnos2026!';


    try {
        // Comprobar si el usuario ya existe
        const [usuarios] = await db.execute(
            'SELECT id_usuario FROM usuario WHERE email = ?',
            [email]
        );


        if (usuarios.length > 0) {
            console.log('El usuario de prueba ya existe.');
            return;
        }


        // Encriptar la contraseña antes de guardarla
        const passwordHash = await bcrypt.hash(password, 10);


        // Crear el usuario con rol ADMIN
        await db.execute(
            `INSERT INTO usuario (email, password_hash, id_rol, activo)
             VALUES (?, ?, ?, ?)`,
            [email, passwordHash, 1, 1]
        );


        console.log('Usuario de prueba creado correctamente.');
        console.log('Email:', email);
        console.log('Contraseña:', password);


    } catch (error) {
        console.error('Error al crear el usuario:', error.message);
    } finally {
        await db.end();
    }
}



