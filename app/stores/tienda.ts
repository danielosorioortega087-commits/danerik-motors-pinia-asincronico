// Los componentes independientes acceden a esta misma instancia con useTiendaStore().
export const useTiendaStore = defineStore('tienda', {
  state: () => ({
    nombreTienda: 'Danerik Motors',
    productos: [
      { id: 1, imagen: '/img/stradale-v4.jpg', descripcion: 'Stradale V4 Rosso Corsa — Superdeportiva V4 de 1.103 cc, 214 hp, quickshifter y control de tracción', valor: 189900000, descuento: 10 },
      { id: 2, imagen: '/img/fulmine-rr.jpg', descripcion: 'Fulmine RR 1000 — Superbike de 999 cc, 205 hp, alerones aerodinámicos y suspensión electrónica', valor: 165000000, descuento: 0 },
      { id: 3, imagen: '/img/imperator-1800.jpg', descripcion: 'Imperator 1800 Chrome — Crucero V-Twin de 1.800 cc, escapes cromados y asiento de cuero', valor: 142500000, descuento: 15 },
      { id: 4, imagen: '/img/bronzo-bobber.jpg', descripcion: 'Bronzo Bobber 1200 — Bobber artesanal de 1.200 cc, acabado bronce y asiento solitario', valor: 98000000, descuento: 0 },
      { id: 5, imagen: '/img/furia-s.jpg', descripcion: 'Furia S 1100 — Naked de 1.099 cc, 175 hp, chasis tubular y escape deportivo', valor: 112000000, descuento: 20 },
      { id: 6, imagen: '/img/lord-cafe.jpg', descripcion: 'Lord Café Racer 900 — Café racer clásica de 900 cc, tanque verde inglés y detalles en oro', valor: 76900000, descuento: 12 },
      { id: 7, imagen: '/img/everest-gt.jpg', descripcion: 'Everest GT Adventure — Trail de gran turismo de 1.250 cc, parabrisas alto y maletas laterales', valor: 134000000, descuento: 5 },
      { id: 8, imagen: '/img/gran-turismo.jpg', descripcion: 'Gran Turismo DM LT — Touring de lujo 1.832 cc, carenado batwing, baúl y maletas integradas', valor: 178000000, descuento: 8 },
    ],
    carrito: [] as Array<{ producto: { id: number; imagen: string; descripcion: string; valor: number; descuento: number }; cantidad: number }>,
    vista: 'catalogo', // catalogo | carrito | factura
    busqueda: '',
    aviso: '',
    numeroFactura: '',
    fechaFactura: '',
    consecutivo: 1,
  }),
  getters: {
    cantidadItems: (state) => state.carrito.reduce((total, item) => total + item.cantidad, 0),
    productosFiltrados: (state) => {
      const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      const termino = normalizar(state.busqueda.trim())
      return termino ? state.productos.filter((p) => normalizar(p.descripcion).includes(termino)) : state.productos
    },
    carritoVacio: (state) => state.carrito.length === 0,
    subtotal: (state) => state.carrito.reduce((t, i) => t + i.producto.valor * i.cantidad, 0),
    totalDescuentos: (state) => state.carrito.reduce((t, i) => t + (i.producto.valor - Math.round(i.producto.valor * (1 - i.producto.descuento / 100))) * i.cantidad, 0),
    baseGravable() { return this.subtotal - this.totalDescuentos },
    iva() { return Math.round(this.baseGravable * 0.19) },
    totalAntesIva() { return this.baseGravable },
    totalPagar() { return this.baseGravable + this.iva },
  },
  actions: {
    notificar(mensaje) { this.aviso = mensaje },
    limpiarAviso() { this.aviso = '' },
    cambiarBusqueda(texto) { this.busqueda = texto },
    mostrarCatalogo() { this.vista = 'catalogo' },
    alternarCarrito() { if (this.vista === 'factura') return; this.vista = this.vista === 'carrito' ? 'catalogo' : 'carrito' },
    agregarProducto(id) {
      const producto = this.productos.find((p) => p.id === id)
      if (!producto) return
      const existente = this.carrito.find((item) => item.producto.id === id)
      if (existente) existente.cantidad++
      else this.carrito.push({ producto, cantidad: 1 })
      this.notificar('Agregada al carrito: ' + producto.descripcion.split(' — ')[0])
    },
    incrementar(id) { const item = this.carrito.find((i) => i.producto.id === id); if (item) item.cantidad++ },
    decrementar(id) { const item = this.carrito.find((i) => i.producto.id === id); if (item && item.cantidad > 1) item.cantidad-- },
    eliminar(id) { this.carrito = this.carrito.filter((i) => i.producto.id !== id) },
    valorConDescuento(producto) { return Math.round(producto.valor * (1 - producto.descuento / 100)) },
    // ACTION ASÍNCRONA: reproduce el patrón del video (async/await).
    // La espera representa la respuesta de un servidor que confirma la compra.
    // La interfaz espera esta Promise antes de mostrar la factura.
    async finalizarCompraAsync() {
      if (this.carritoVacio) return false

      await new Promise((resolve) => setTimeout(resolve, 1000))

      this.numeroFactura = 'FV-' + String(this.consecutivo).padStart(6, '0')
      this.fechaFactura = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })
      this.vista = 'factura'
      this.notificar('¡Compra confirmada! Tu factura está lista.')
      return true
    },
    nuevaCompra() {
      this.carrito = []
      this.vista = 'catalogo'
      this.consecutivo++
      this.numeroFactura = ''
      this.fechaFactura = ''
      this.busqueda = ''
    },
  },
})
