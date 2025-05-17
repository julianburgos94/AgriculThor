const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let productos = []; // Lista temporal

// Agregar producto
app.post('/productos', (req, res) => {
  const nuevoProducto = {
    id: Date.now(),
    ...req.body,
    ofertas: [],
    vendidoA: null // 👈 nuevo campo
  };
  productos.push(nuevoProducto);
  res.json(nuevoProducto);
});


// Ver productos
app.get('/productos', (req, res) => {
  res.json(productos);
});

// Hacer oferta
app.post('/ofertar/:id', (req, res) => {
  const producto = productos.find(p => p.id == req.params.id);
  if (producto) {
    producto.ofertas.push(req.body);
    res.json({ mensaje: "Oferta registrada", producto });
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));
app.post('/ganador/:id', (req, res) => {
  const producto = productos.find(p => p.id == req.params.id);
  if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

  const { nombre } = req.body;
  const ofertaGanadora = producto.ofertas.find(o => o.nombre === nombre);

  if (!ofertaGanadora) return res.status(404).json({ mensaje: "Oferta no encontrada para ese nombre" });

  producto.vendidoA = nombre;
  res.json({ mensaje: `Producto vendido a ${nombre}`, producto });
});
