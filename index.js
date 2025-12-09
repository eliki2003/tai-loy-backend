const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');  // Asegúrate de que este archivo esté correctamente importado
const path = require('path');
const app = express();
const port = process.env.PORT || 3002;  // Si no está definido en .env, usa el puerto 3002 por defecto.
const cors = require('cors');
require('dotenv').config();  // Cargar las variables desde el archivo .env

app.use(cors());  // Permitir solicitudes desde cualquier origen

mongoose.connect(process.env.MONGO_CNN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Base de Datos Online');
})
.catch((error) => {
  console.error('Error de conexión a BD:', error);
});

app.use(express.json());  // Middleware para procesar JSON
app.use('/uploads', express.static('public/uploads'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Usar las rutas de usuario con el prefijo '/api/user'
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);  // Asegúrate de que este esté bien configurado

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
