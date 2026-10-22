/* ============================================================
   Dulces y Delicias — script.js (compartido por las 4 pestañas)
   Cada bloque se autodetecta: si el elemento no existe en la
   página, el bloque simplemente no se ejecuta.
   ============================================================ */
"use strict";
document.addEventListener("DOMContentLoaded", () => {

  /* =========== 1. CONFIGURACIÓN Y DATOS =========== */
  const TELEFONO = "51987654321"; // Número de WhatsApp de la tienda (sin + ni espacios)
  const CLAVE_PEDIDO = "dd_pedido"; // Clave usada en localStorage para guardar el pedido

  const PRODUCTOS = [
    /* ---- Pasteles ---- */
    { id: "torta-fresas",     nombre: "Torta de fresas",      categoria: "pasteles",  precio: 130, destacado: true,  img: "img/torta-fresas.svg",      detalle: "Bizcocho de vainilla con fresas frescas y chantilly suave." },
    { id: "pastel-chocolate", nombre: "Pastel de chocolate",  categoria: "pasteles",  precio: 55,  destacado: true,  img: "img/pastel-chocolate.svg",  detalle: "Esponjoso pastel de ganache con crema de vainilla." },
    { id: "tres-leches",      nombre: "Torta tres leches",    categoria: "pasteles",  precio: 68,  destacado: true,  img: "img/tres-leches.svg",       detalle: "Esponjosa y bañada en tres leches, cubierta con granillado." },
    { id: "torta-helada",     nombre: "Torta helada",         categoria: "pasteles",  precio: 75,  destacado: false, img: "img/torta-helada.svg",      detalle: "Capas de helado de vainilla y fresa con glaseado rosado." },
    /* ---- Cupcakes ---- */
    { id: "cupcake",          nombre: "Cupcakes surtidos",    categoria: "cupcakes",  precio: 28,  destacado: true,  img: "img/cupcake-vainilla.svg",  detalle: "Caja de 6 cupcakes decorados con cariño." },
    { id: "cupcake-chocolate",nombre: "Cupcake de chocolate", categoria: "cupcakes",  precio: 5,   destacado: false, img: "img/cupcake-chocolate.svg", detalle: "Unidad: cacao puro con crema de chocolate y chispas." },
    /* ---- Galletas ---- */
    { id: "galletas",         nombre: "Galletas con chispas", categoria: "galletas",  precio: 12,  destacado: false, img: "img/galletas.svg",          detalle: "Docena crocante por fuera, suaves por dentro." },
    { id: "alfajores",        nombre: "Alfajores (x6)",       categoria: "galletas",  precio: 15,  destacado: false, img: "img/alfajores.svg",         detalle: "Galletas de maicena con manjar blanco casero." },
    { id: "brownies",         nombre: "Brownie con nueces",   categoria: "galletas",  precio: 9,   destacado: false, img: "img/brownies.svg",          detalle: "Denso, húmedo y con nuez tostada. Por unidad." },
    /* ---- Postres ---- */
    { id: "macarons",         nombre: "Macarons (x6)",        categoria: "postres",   precio: 30,  destacado: false, img: "img/macarons.svg",          detalle: "Fresa, limón y caramelo: tres sabores en una caja." },
    { id: "cheesecake",       nombre: "Cheesecake de fresa",  categoria: "postres",   precio: 65,  destacado: false, img: "img/cheesecake.svg",        detalle: "Queso crema sobre costra de galleta y fresas frescas." },
    { id: "pie-limon",        nombre: "Pie de limón",         categoria: "postres",   precio: 38,  destacado: false, img: "img/pie-limon.svg",         detalle: "Crema de limón y galleta molida, con toque de jengibre." },
    { id: "suspiro-limeno",   nombre: "Suspiro limeño",       categoria: "postres",   precio: 9,   destacado: false, img: "img/suspiro-limeno.svg",    detalle: "Manjar blanco bajo un merengue cremoso. Por unidad." },
  ];
  const porId = (id) => PRODUCTOS.find((p) => p.id === id);
  const soles = (n) => "S/ " + n.toFixed(2);
  /* Convierte texto a HTML seguro: si un dato llevara < o ", se muestra como
     texto y no rompe el marcado generado con template strings. */
  const escapeHtml = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* =========== 2. PEDIDO (carrito) =========== */
  let pedido = {};
  try { pedido = JSON.parse(localStorage.getItem(CLAVE_PEDIDO) || "{}"); } catch (e) { pedido = {}; }

  const guardarPedido = () => {
    try { localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido)); }
    catch { /* Modo incógnito o almacenamiento lleno: la página sigue funcionando,
               solo que el pedido no persistirá al cerrar. */ }
  };
  const contarItems  = () => Object.values(pedido).reduce((a, b) => a + b, 0);
  const totalPedido  = () => Object.entries(pedido).reduce((t, [id, c]) => t + (porId(id)?.precio || 0) * c, 0);

  function agregar(id) {
    pedido[id] = (pedido[id] || 0) + 1;
    guardarPedido(); actualizarBadge(); pingBadge();
    const p = porId(id);
    celebrar(`${p ? p.nombre : "Producto"} agregado al pedido 🍓`);
  }
  function cambiarCantidad(id, delta) {
    if (!pedido[id]) return;
    pedido[id] += delta;
    if (pedido[id] <= 0) delete pedido[id];
    guardarPedido(); actualizarBadge(); pintarCarro();
  }
  function vaciar() {
    pedido = {}; guardarPedido(); actualizarBadge(); pintarCarro();
    celebrar("Pedido vaciado. ¡Empieza uno nuevo! 🧺", false);
  }

  /* Badge en la barra de navegación */
  const badge = document.getElementById("badge-carrito");
  function actualizarBadge() {
    const n = contarItems();
    if (!badge) return;
    badge.textContent = n;
    badge.hidden = n === 0;
  }
  function pingBadge() {
    if (!badge || badge.hidden) return;
    badge.classList.remove("ping"); void badge.offsetWidth; badge.classList.add("ping");
  }

  /* Notificaciones (toasts) */
  let toastHost = document.getElementById("toast-host");
  function celebrar(texto, html = true) {
    if (!toastHost) { toastHost = document.createElement("div"); toastHost.id = "toast-host"; document.body.appendChild(toastHost); }
    const aviso = document.createElement("p");
    aviso.className = "aviso";
    aviso.textContent = texto; aviso.role = "status";
    toastHost.appendChild(aviso);
    setTimeout(() => {
      aviso.classList.add("aviso--fuera");
      setTimeout(() => aviso.remove(), 320);
    }, 2600);
    if (html) { /* reserva: por si luego metemos HTML rico */ }
  }

  /* Inyectar UNA VEZ el panel flotante del pedido */
  let panelCarrito = null, veloCarrito = null, listaCarro = null, totalCarro = null, linkWA = null;
  function asegurarPanel() {
    if (panelCarrito) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div id="velo-carrito"></div>
      <aside id="panel-carrito" aria-label="Mi pedido">
        <header>
          <h2>Tu pedido 🧺</h2>
          <button class="btn btn--icono" data-accion="cerrar-carrito" aria-label="Cerrar pedido">✕</button>
        </header>
        <div class="carro-lista" id="lista-carro"></div>
        <footer>
          <div class="fila-total"><span>Total:</span><span id="total-carro">S/ 0.00</span></div>
          <a id="link-whatsapp" class="btn btn--whatsapp" target="_blank" rel="noopener">Pedir por WhatsApp</a>
          <button class="btn btn--mini btn--contorno" data-accion="vaciar">Vaciar pedido</button>
        </footer>
      </aside>`);
    panelCarrito = document.getElementById("panel-carrito");
    veloCarrito  = document.getElementById("velo-carrito");
    listaCarro   = document.getElementById("lista-carro");
    totalCarro   = document.getElementById("total-carro");
    linkWA       = document.getElementById("link-whatsapp");
    veloCarrito.addEventListener("click", cerrarCarrito);
    /* Accesibilidad: la tecla Esc también cierra el panel del pedido */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrarCarrito();
    });
  }
  const abrirCarrito  = () => {
    asegurarPanel(); pintarCarro();
    panelCarrito.classList.add("activo"); veloCarrito.classList.add("activo");
    /* Mover el foco al botón cerrar: navegación con teclado coherente */
    const btnCerrar = panelCarrito.querySelector("button");
    if (btnCerrar) btnCerrar.focus();
  };
  const cerrarCarrito = () => {
    if (!panelCarrito) return;
    panelCarrito.classList.remove("activo"); veloCarrito.classList.remove("activo");
    /* Devolver el foco al botón que abrió el panel */
    if (btnCarrito) btnCarrito.focus();
  };

  function pintarCarro() {
    if (!listaCarro) return;
    const items = Object.entries(pedido);
    if (items.length === 0) {
      listaCarro.innerHTML = `<div class="carro-vacio"><p class="emoji">🧁</p><p>Tu pedido está vacío.<br>¡Explora el catálogo y endulza tu día!</p></div>`;
    } else {
      listaCarro.innerHTML = items.map(([id, cant]) => {
        const p = porId(id); if (!p) return "";
        return `<div class="carro-fila">
          <img src="${escapeHtml(p.img)}" alt="" width="56" height="56">
          <div>
            <strong>${escapeHtml(p.nombre)}</strong>
            <p class="precio-mini">${soles(p.precio)} × ${cant}</p>
            <div class="carro-cantidades">
              <button data-accion="menos" data-id="${escapeHtml(p.id)}" aria-label="Quitar uno">−</button>
              <span>${cant}</span>
              <button data-accion="mas" data-id="${escapeHtml(p.id)}" aria-label="Agregar uno">+</button>
            </div>
          </div>
          <button class="btn-quitar" data-accion="quitar" data-id="${escapeHtml(p.id)}" aria-label="Eliminar ${escapeHtml(p.nombre)} del pedido">🗑️</button>
        </div>`;
      }).join("");
    }
    if (totalCarro) totalCarro.textContent = soles(totalPedido());
    if (linkWA) {
      const lineas = items.map(([id, c]) => { const p = porId(id); return "• " + c + " × " + p.nombre + " (" + soles(p.precio * c) + ")"; });
      const texto = "¡Hola Dulces y Delicias! 🧁 Quiero hacer este pedido:\n" +
        lineas.join("\n") + "\nTotal: " + soles(totalPedido());
      linkWA.href = "https://wa.me/" + TELEFONO + "?text=" + encodeURIComponent(texto);
    }
  }

  /* Botón de carrito (existe en la barra de TODAS las páginas) */
  const btnCarrito = document.getElementById("btn-carrito");
  if (btnCarrito) btnCarrito.addEventListener("click", abrirCarrito);

  /* Un solo oyente global para TODOS los botones dinámicos (delegación) */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-accion]");
    if (!btn) return;
    const acc = btn.dataset.accion, id = btn.dataset.id;
    if (acc === "agregar") agregar(id);
    else if (acc === "mas") cambiarCantidad(id, +1);
    else if (acc === "menos") cambiarCantidad(id, -1);
    else if (acc === "quitar") { delete pedido[id]; guardarPedido(); actualizarBadge(); pintarCarro(); }
    else if (acc === "vaciar") vaciar();
    else if (acc === "cerrar-carrito") cerrarCarrito();
  });

  /* =========== 3. CATÁLOGO (se dibuja con JS) =========== */
  function tarjeta(p) {
    return `<article class="tarjeta" data-categoria="${escapeHtml(p.categoria)}">
      <img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.nombre)}" width="118" height="118" loading="lazy" decoding="async">
      <h3>${escapeHtml(p.nombre)}</h3>
      <p>${escapeHtml(p.detalle)}</p>
      <div class="tarjeta__pie">
        <span class="precio">${soles(p.precio)}</span>
        <button class="btn btn--mini btn--primario" data-accion="agregar" data-id="${escapeHtml(p.id)}">＋ Añadir</button>
      </div>
    </article>`;
  }

  const gridDestacados = document.getElementById("grid-destacados");
  if (gridDestacados) gridDestacados.innerHTML = PRODUCTOS.filter(p => p.destacado).map(tarjeta).join("");

  const gridProductos = document.getElementById("grid-productos");
  if (gridProductos) {
    const sinResultados = document.getElementById("sin-resultados");
    gridProductos.innerHTML = PRODUCTOS.map(tarjeta).join("");

    /* Filtros por categoría */
    const filtros = document.querySelectorAll(".filtro");
    filtros.forEach(btn => btn.addEventListener("click", () => {
      filtros.forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      const f = btn.dataset.filtro;
      let visibles = 0;
      gridProductos.querySelectorAll(".tarjeta").forEach(t => {
        const mostrar = f === "todos" || t.dataset.categoria === f;
        t.style.display = mostrar ? "" : "none";
        if (mostrar) visibles++;
      });
      if (sinResultados) sinResultados.hidden = visibles > 0;
    }));
  }

  /* =========== 4. MENÚ ACTIVO + MENÚ MÓVIL =========== */
  const pagina = document.querySelector("body")?.dataset.pagina || "";
  if (pagina) {
    document.querySelectorAll(".menu a").forEach(a => {
      if (a.getAttribute("href").startsWith(pagina)) a.classList.add("activo");
    });
  }
  const btnMenu = document.getElementById("btn-menu");
  const header = document.querySelector(".header");
  if (btnMenu && header) {
    btnMenu.addEventListener("click", () => {
      const abierto = header.classList.toggle("menu-abierto");
      btnMenu.textContent = abierto ? "✕" : "☰";
      btnMenu.setAttribute("aria-expanded", String(abierto));
    });
    document.querySelectorAll(".menu a").forEach(a => a.addEventListener("click", () => {
      header.classList.remove("menu-abierto");
      btnMenu.textContent = "☰";
      btnMenu.setAttribute("aria-expanded", "false");
    }));
  }

  /* =========== 5. REVELADO AL HACER SCROLL + MÉTRICAS =========== */
  /* Si el navegador no soporta IntersectionObserver (muy viejos),
     se muestra todo directamente en lugar de quedar invisible. */
  if ("IntersectionObserver" in window) {
    const revelar = new IntersectionObserver(entradas => {
      entradas.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("visible"); revelar.unobserve(en.target); }
      });
    }, { threshold: .15 });
    document.querySelectorAll(".aparecer").forEach(el => revelar.observe(el));
  } else {
    document.querySelectorAll(".aparecer").forEach(el => el.classList.add("visible"));
  }

  function animarNumero(el) {
    const destino = parseFloat(el.dataset.valor) || 0;
    const decimales = parseInt(el.dataset.decimales || "0", 10);
    const dur = 1300, inicio = performance.now();
    function cuadro(t) {
      const progreso = Math.min((t - inicio) / dur, 1);
      const valor = destino * (1 - Math.pow(1 - progreso, 3)); // easeOutCubic
      el.textContent = decimales > 0 ? valor.toFixed(decimales) : Math.round(valor).toLocaleString("es-PE");
      if (progreso < 1) requestAnimationFrame(cuadro);
      else el.textContent = decimales > 0 ? destino.toFixed(decimales) : destino.toLocaleString("es-PE");
    }
    requestAnimationFrame(cuadro);
  }
  document.querySelectorAll(".metrica__num").forEach(el => {
    if ("IntersectionObserver" in window) {
      const obsMetricas = new IntersectionObserver(entradas => {
        entradas.forEach(en => { if (en.isIntersecting) { animarNumero(en.target); obsMetricas.unobserve(en.target); } });
      }, { threshold: .4 });
      obsMetricas.observe(el);
    } else {
      animarNumero(el);
    }
  });

  /* =========== 6. FORMULARIO DE CONTACTO =========== */
  const form = document.getElementById("form-contacto");
  if (form) {
    const marcarError = (input, mensaje) => {
      const caja = input.closest(".campo");
      caja.querySelector(".campo-error").textContent = mensaje;
      input.setAttribute("aria-invalid", "true");
      return false;
    };
    form.querySelectorAll("input, select, textarea").forEach(el =>
      el.addEventListener("input", () => {
        el.removeAttribute("aria-invalid");
        const err = el.closest(".campo")?.querySelector(".campo-error");
        if (err) err.textContent = "";
      }));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(form));
      let ok = true;
      const nombre = form.querySelector("#nombre");
      const tel    = form.querySelector("#telefono");
      const correo = form.querySelector("#correo");
      const tema   = form.querySelector("#tema");
      const msj    = form.querySelector("#mensaje");

      if (datos.nombre.trim().length < 3) ok = marcarError(nombre, "El nombre debe tener al menos 3 letras.");
      if (!/^9\d{8}$/.test(datos.telefono.trim())) ok = marcarError(tel, "Ingresa 9 dígitos que empiecen en 9 (celular).");
      if (datos.correo && !/^\S+@\S+\.\S+$/.test(datos.correo.trim())) ok = marcarError(correo, "El correo no parece válido.");
      if (!datos.tema) ok = marcarError(tema, "Elige una opción.");
      if (datos.mensaje.trim().length < 10) ok = marcarError(msj, "Cuéntanos más (mínimo 10 caracteres).");

      if (!ok) { celebrar("Revisa los campos marcados 🙈", false); return; }

      celebrar("¡Mensaje enviado! 🎉 Te respondemos pronto.");
      form.reset();
    });
  }

  /* =========== 7. EXTRAS: año, cinta y botón subir =========== */
  document.querySelectorAll(".anio").forEach(el => el.textContent = new Date().getFullYear());

  const pista = document.getElementById("cinta-pista");
  if (pista) pista.innerHTML += pista.innerHTML; // duplica el texto para el bucle infinito

  const btnSubir = document.createElement("button");
  btnSubir.id = "btn-subir";
  btnSubir.textContent = "↑";
  btnSubir.setAttribute("aria-label", "Volver arriba");
  btnSubir.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btnSubir);
  window.addEventListener("scroll", () => {
    btnSubir.classList.toggle("activo", window.scrollY > 350);
  }, { passive: true });
});
