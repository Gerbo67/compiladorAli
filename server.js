const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos de la carpeta dist (generada por Vite)
app.use(express.static(path.join(__dirname, 'dist')));

// Para SPA - redireccionar todas las solicitudes a index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});