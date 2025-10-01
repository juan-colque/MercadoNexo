/* script.js
  - Contiene: productos de ejemplo, lógica de carrito, login simple,
    alert/confirm/prompt y funciones de renderizado.
  - Usen y comenten este archivo en el TP: getElementById, querySelector, localStorage, eventListeners.
*/

/* ========== Datos de producto (mínimo 6) ========== */
const products = [
  { id: 1, title: "Auriculares DJ", price: 1200.00, img: "Nexo.assets/producto1.jpg", desc: "Auriculares profesionales" },
  { id: 2, title: "Controlador MIDI", price: 850.00, img: "Nexo.assets/producto2.jpg", desc: "Control para producción" },
  { id: 3, title: "Placa de audio", price: 650.00, img: "Nexo.assets/producto3.jpg", desc: "Audio interface 2-in/2-out" },
  { id: 4, title: "Monitor de estudio", price: 920.00, img: "Nexo.assets/producto4.jpg", desc: "Par de monitores near-field" },
  { id: 5, title: "Cables pro", price: 60.00, img: "Nexo.assets/producto5.jpg", desc: "Pack de cables XLR y TRS" },
  { id: 6, title: "Soporte para laptop", price: 45.00, img: "Nexo.assets/producto6.jpg", desc: "Soporte ajustable" },
];

/* ========== Estado del carrito (localStorage) ========== */
let cart = JSON.parse(localStorage.getItem('mn_cart')) || [];

/* ========== Utilidades ========== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function saveCart() {
  localStorage.setItem('mn_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((s, item) => s + item.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

/* ========== Render productos destacados / lista ========== */
function renderFeatured(containerId = 'featuredProducts', limit = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  products.slice(0, limit).forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-3';
    col.innerHTML = `
      <div class="card card-product h-100">
        <img src="${p.img}" class="card-img-top product-img" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text small mb-2">${p.desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <strong>$${p.price.toFixed(2)}</strong>
            <button class="btn btn-sm btn-primary add-to-cart" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

/* Render listado completo (productos.html) */
function renderProductList() {
  const container = document.getElementById('productList');
  if (!container) return;
  container.innerHTML = '';
  products.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4';
    col.innerHTML = `
      <div class="card card-product h-100">
        <img src="../${p.img}" class="card-img-top product-img" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text small mb-2">${p.desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <strong>$${p.price.toFixed(2)}</strong>
            <button class="btn btn-sm btn-success add-to-cart" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

/* ========== Carrito: añadir, mostrar, eliminar, vaciar, checkout ========== */
function addToCart(productId) {
  const prod = products.find(p => p.id === +productId);
  if (!prod) return;
  const item = cart.find(i => i.id === prod.id);
  if (item) item.qty += 1;
  else cart.push({ id: prod.id, title: prod.title, price: prod.price, qty: 1 });
  saveCart();
  // Alert simple
  alert(`${prod.title} agregado al carrito.`);
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  if (!cartItemsEl || !cartTotalEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>El carrito está vacío.</p>';
    cartTotalEl.textContent = '0.00';
    return;
  }

  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center justify-content-between py-2 border-bottom';
    div.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <div class="small">Precio: $${item.price.toFixed(2)} · Cant: <span>${item.qty}</span></div>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary me-2 decrease" data-id="${item.id}">-</button>
        <button class="btn btn-sm btn-outline-secondary increase" data-id="${item.id}">+</button>
        <button class="btn btn-sm btn-danger ms-2 remove-item" data-id="${item.id}">Eliminar</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.textContent = total.toFixed(2);
}

/* Modificar cantidades y eliminar */
function changeQty(id, delta) {
  const item = cart.find(i => i.id === +id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== +id);
  }
  saveCart();
  renderCart();
}

/* Vaciar carrito con confirm */
function clearCart() {
  const ok = confirm('¿Querés vaciar todo el carrito?');
  if (!ok) return;
  cart = [];
  saveCart();
  renderCart();
}

/* Checkout: uso de prompt para pedir nombre y mostrar resumen (simula proceso) */
function checkout() {
  if (cart.length === 0) {
    alert('El carrito está vacío. Agregá productos primero.');
    return;
  }
  const nombre = prompt('Ingresá tu nombre para procesar la compra:');
  if (!nombre) {
    alert('Compra cancelada (no ingresaste nombre).');
    return;
  }
  // Simular pago OK con alert
  alert(`Gracias ${nombre}! Compra realizada. En breve recibirás confirmación (simulado).`);
  cart = [];
  saveCart();
  renderCart();
}

/* ========== Login simple usando prompt (NO es seguro: solo para TP) ========== */
function doLogin() {
  // Demonstrates prompt usage and a confirm
  const user = prompt('Usuario (ej: alumno):');
  if (!user) {
    alert('Login cancelado.');
    return;
  }
  const pass = prompt('Contraseña:');
  if (!pass) {
    alert('Login cancelado.');
    return;
  }

  // Demo simple: si usuario es "alumno" y pass "1234" entra
  if (user === 'alumno' && pass === '1234') {
    const ok = confirm('Login exitoso. ¿Querés permanecer logueado en este equipo?');
    if (ok) localStorage.setItem('mn_user', user);
    alert('Bienvenido, ' + user);
    // Aquí podrían habilitarse opciones para usuario logueado
  } else {
    alert('Credenciales inválidas (demo). Para probar: usuario "alumno", pass "1234".');
  }
}

/* ========== Eventos globales y delegación ========== */
document.addEventListener('DOMContentLoaded', () => {
  // Render de elementos
  renderFeatured();
  renderProductList();
  updateCartCount();

  // Set years en footers múltiples
  document.querySelectorAll('#year, #year2, #year3, #year4').forEach(el => {
    if (el) el.textContent = new Date().getFullYear();
  });

  // Delegación: botones "Agregar" (en index y productos)
  document.body.addEventListener('click', (e) => {
    // Agregar al carrito
    if (e.target.matches('.add-to-cart')) {
      const id = e.target.getAttribute('data-id');
      addToCart(id);
    }
    // Abrir carrito
    if (e.target.id === 'cartBtn') {
      const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
      renderCart();
      cartModal.show();
    }
    // Login
    if (e.target.id === 'loginBtn') {
      doLogin();
    }
    // Checkout
    if (e.target.id === 'checkoutBtn') checkout();
    // Vaciar carrito
    if (e.target.id === 'clearCartBtn') clearCart();

    // Modificar cantidades desde modal
    if (e.target.matches('.increase')) {
      changeQty(e.target.getAttribute('data-id'), +1);
      return;
    }
    if (e.target.matches('.decrease')) {
      changeQty(e.target.getAttribute('data-id'), -1);
      return;
    }
    if (e.target.matches('.remove-item')) {
      const ok = confirm('Eliminar este producto del carrito?');
      if (ok) {
        cart = cart.filter(i => i.id !== +e.target.getAttribute('data-id'));
        saveCart();
        renderCart();
      }
      return;
    }
  });

  // Formulario de contacto (validación básica y alert)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // Validar campos
      const nombre = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const msg = document.getElementById('message').value.trim();
      if (!nombre || !email || !msg) {
        alert('Por favor completa todos los campos.');
        return;
      }
      // Simula envío
      alert(`Gracias ${nombre}. Mensaje recibido: "${msg.slice(0, 80)}..."`);
      contactForm.reset();
    });
  }

});

