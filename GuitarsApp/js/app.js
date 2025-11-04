import { db } from './guitarras.js';

const divContainer = document.querySelector('main div');
const carritoContainer = document.querySelector('#carrito');

let carrito = [];

// Cargar carrito desde localStorage si existe
document.addEventListener('DOMContentLoaded', () => {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
  createCart();
});

// Crear tarjeta de guitarra
const createDiv = (guitar) => {
  const div = document.createElement('div');
  div.className = 'col-md-6 col-lg-4 my-4 row align-items-center';
  div.setAttribute('data-id', guitar.id);

  div.innerHTML = `
    <div class="col-4">
      <img class="img-fluid" src="./img/${guitar.imagen}.jpg" alt="imagen guitarra">
    </div>
    <div class="col-8">
      <h3 class="text-black fs-4 fw-bold text-uppercase">${guitar.nombre}</h3>
      <p>${guitar.descripcion}</p>
      <p class="fw-black text-primary fs-3">$${guitar.precio}</p>
      <button data-id="${guitar.id}" type="button" class="btn btn-dark w-100">Agregar al Carrito</button>
    </div>
  `;
  return div;
};

// Crear vista del carrito
const createCart = () => {
  if (carrito.length === 0) {
    carritoContainer.innerHTML = '<p class="text-center">El carrito está vacío</p>';
    localStorage.removeItem('carrito'); // limpiar almacenamiento si no hay nada
    return;
  }

  let total = 0;
  let html = `
    <table class="w-100 table">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  carrito.forEach(g => {
    total += g.precio * g.cantidad;
    html += `
      <tr data-id="${g.id}">
        <td><img class="img-fluid" src="./img/${g.imagen}.jpg" alt="imagen guitarra"></td>
        <td>${g.nombre}</td>
        <td class="fw-bold">$${g.precio}</td>
        <td>
          <button type="button" class="btn btn-dark btn-restar">-</button>
          ${g.cantidad}
          <button type="button" class="btn btn-dark btn-sumar">+</button>
        </td>
        <td><button class="btn btn-danger btn-borrar" type="button">X</button></td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p class="text-end">Total pagar: <span class="fw-bold">$${total}</span></p>
    <button class="btn btn-dark w-100 mt-3 p-2 btn-vaciar">Vaciar Carrito</button>
  `;

  carritoContainer.innerHTML = html;

  // guardar carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Mostrar guitarras
db.forEach(guitar => divContainer.appendChild(createDiv(guitar)));

// Manejar clics
document.addEventListener('click', e => {
  // Agregar al carrito
  if (e.target.classList.contains('btn-dark') && e.target.textContent.includes('Agregar')) {
    const id = Number(e.target.dataset.id);
    const guitarra = db.find(g => g.id === id);
    const existente = carrito.find(g => g.id === id);

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ ...guitarra, cantidad: 1 });
    }
    createCart();
  }

  // Botón +
  if (e.target.classList.contains('btn-sumar')) {
    const id = Number(e.target.closest('tr').dataset.id);
    const item = carrito.find(g => g.id === id);
    item.cantidad++;
    createCart();
  }

  // Botón -
  if (e.target.classList.contains('btn-restar')) {
    const id = Number(e.target.closest('tr').dataset.id);
    const item = carrito.find(g => g.id === id);
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      carrito = carrito.filter(g => g.id !== id);
    }
    createCart();
  }

  // Botón X (borrar)
  if (e.target.classList.contains('btn-borrar')) {
    const id = Number(e.target.closest('tr').dataset.id);
    carrito = carrito.filter(g => g.id !== id);
    createCart();
  }

  // Vaciar carrito
  if (e.target.classList.contains('btn-vaciar')) {
    carrito = [];
    createCart();
  }
});
