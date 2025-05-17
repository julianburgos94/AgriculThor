const form = document.getElementById('formProducto');
const lista = document.getElementById('listaProductos');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const precioBase = document.getElementById('precioBase').value;
  await fetch('http://localhost:3000/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, precioBase })
  });
  form.reset();
  cargarProductos();
});

async function cargarProductos() {
  const res = await fetch('http://localhost:3000/productos');
  const productos = await res.json();
  lista.innerHTML = '';
  productos.forEach(p => {
    lista.innerHTML += `
  <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
    <h3>${p.nombre} - $${p.precioBase}</h3>
    ${p.vendidoA ? `<p style="color:green;"><strong>Vendido a:</strong> ${p.vendidoA}</p>` : `
      <form onsubmit="hacerOferta(event, ${p.id})">
        <input type="number" name="oferta" placeholder="Tu oferta" required />
        <input type="text" name="nombre" placeholder="Tu nombre" required />
        <button type="submit">Ofertar</button>
      </form>
    `}
    <ul>
      ${p.ofertas.map(o => `
        <li>${o.nombre}: $${o.oferta}
          ${!p.vendidoA ? `<button onclick="seleccionarGanador(${p.id}, '${o.nombre}')">Seleccionar ganador</button>` : ''}
        </li>
      `).join('')}
    </ul>
  </div>
`;

  });
}

async function hacerOferta(e, id) {
  e.preventDefault();
  const oferta = e.target.oferta.value;
  const nombre = e.target.nombre.value;
  await fetch(`http://localhost:3000/ofertar/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oferta, nombre })
  });
  cargarProductos();
}

cargarProductos();
async function seleccionarGanador(productoId, nombre) {
  await fetch(`http://localhost:3000/ganador/${productoId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
  cargarProductos();
}
