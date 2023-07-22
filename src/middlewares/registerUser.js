// const bcrypt = require("bcrypt")
// const {User} = require("../db")
// const registerUser = async (req, res) =>{
//     const { user, password } = req.body; //? nombre de usuario y password
//     console.log(user,password)
//     try {
//     // Verificar si el usuario ya está registrado
//         const existingUser = await User.findOne({where:{email:user} });
//         if (existingUser) {
//         return res.status(400).json({ message: 'El usuario ya está registrado' });
//         }
// console.log("paso busqueda")
//         // Crear una instancia del modelo User y guardar en la base de datos
//         const newUser = {
//         email:user,
//         password: await bcrypt.hash(password, 10), // Cifrar la contraseña
//         };
//         console.log(newUser)
//         await User.create(newUser);
//         res.status(201).json({ message: 'Registro exitoso' });

//     } catch (error) {
//       console.error('Error al registrar al usuario:', error);
//       res.status(500).json({ message: 'Error de servidor' });
//     }
// }

// module.exports = registerUser