const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Obtener el token de los encabezados

  if (!token) {
    return res.status(401).json({ message: 'No token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, 'secreta_clave');  // Verificar el token usando la clave secreta
    req.user = decoded;  // Añadir la información del usuario a la solicitud
    next();  
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });  // Si el token no es válido, regresar un error
  }
};

module.exports = authenticate; 
