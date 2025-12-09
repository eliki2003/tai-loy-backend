const User = require('../models/userModel');  // Importamos el modelo de usuario
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Generar token JWT
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, 'secreta_clave', { expiresIn: '1h' });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,  // Devolvemos el token para autenticación
      user: { name, email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Iniciar sesión de un usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, 'secreta_clave', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,  // Devolvemos el token
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

// Obtener los datos del usuario autenticado
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos del usuario', error });
  }
};

// Actualizar los datos del usuario
const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: 'Usuario actualizado con éxito', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserData,
  updateUser
};
