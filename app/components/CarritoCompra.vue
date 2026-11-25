<script setup lang="ts">
const tienda = useTiendaStore()
const { carrito, carritoVacio, subtotal, totalDescuentos, totalAntesIva } = storeToRefs(tienda)
const esperando = ref(false)

// Igual que sumarDespues() del ejemplo: estado local de carga + await de una action del store.
async function confirmarCompra() {
  if (esperando.value || carritoVacio.value) return
  esperando.value = true
  try {
    await tienda.finalizarCompraAsync()
  } finally {
    esperando.value = false
  }
}
const nombre = (p) => p.descripcion.split(' — ')[0]
const unitario = (p) => tienda.valorConDescuento(p)
const totalLinea = (i) => unitario(i.producto) * i.cantidad
const formatear = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
</script>
<template><section class="carrito" aria-labelledby="titulo-carrito"><h2 id="titulo-carrito" class="titulo-seccion">Tu carrito</h2>
<div v-if="carritoVacio" class="vacio"><p>Tu carrito está vacío. Elige la moto de tus sueños en el catálogo.</p></div>
<table v-else class="tabla"><thead><tr><th>Imagen</th><th>Descripción</th><th>Precio</th><th>Cantidad</th><th>Total</th><th><span class="visualmente-oculto">Quitar</span></th></tr></thead><tbody>
<tr v-for="item in carrito" :key="item.producto.id"><td data-label="Imagen"><img class="mini" :src="item.producto.imagen" :alt="nombre(item.producto)"/></td><td data-label="Descripción"><div class="col-desc"><strong>{{ nombre(item.producto) }}</strong><small v-if="item.producto.descuento" class="chip">-{{ item.producto.descuento }}%</small></div></td>
<td data-label="Precio"><span v-if="item.producto.descuento" class="precio-tachado">{{ formatear(item.producto.valor) }}</span>{{ formatear(unitario(item.producto)) }}</td>
<td data-label="Cantidad"><div class="cantidad"><button type="button" aria-label="Disminuir cantidad" :disabled="item.cantidad <= 1" @click="tienda.decrementar(item.producto.id)">−</button><span>{{ item.cantidad }}</span><button type="button" aria-label="Aumentar cantidad" @click="tienda.incrementar(item.producto.id)">+</button></div></td>
<td data-label="Total"><strong>{{ formatear(totalLinea(item)) }}</strong></td><td class="col-quitar"><button type="button" class="boton-texto" @click="tienda.eliminar(item.producto.id)">Eliminar</button></td></tr></tbody></table>
<div class="resumen"><dl v-if="!carritoVacio" class="resumen__datos"><div><dt>Subtotal</dt><dd>{{ formatear(subtotal) }}</dd></div><div><dt>Descuentos</dt><dd class="negativo">− {{ formatear(totalDescuentos) }}</dd></div><div class="resumen__total"><dt>Total (antes de IVA)</dt><dd>{{ formatear(totalAntesIva) }}</dd></div></dl>
<div class="resumen__acciones"><button type="button" class="boton boton--secundario" @click="tienda.mostrarCatalogo()">Seguir comprando</button><button type="button" class="boton" :disabled="carritoVacio || esperando" @click="confirmarCompra">{{ esperando ? 'Confirmando compra…' : 'Finalizar compra' }}</button></div></div></section></template>
<style scoped>

.tabla { width: 100%; border-collapse: collapse; background: var(--panel); border: 1px solid var(--borde); border-radius: 12px; overflow: hidden; }
th { text-align: left; padding: 0.9rem 1rem; background: #0e0e11; color: var(--oro); font-family: var(--fuente-titulo); letter-spacing: 0.06em; border-bottom: 2px solid var(--oro); }
td { padding: 0.9rem 1rem; border-bottom: 1px solid var(--borde); vertical-align: middle; }
.mini { width: 110px; aspect-ratio: 3 / 2; object-fit: cover; border-radius: 6px; display: block; }
.col-desc { display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-start; }
.chip { background: var(--rojo); color: #fff; padding: 0.1rem 0.5rem; border-radius: 999px; font-weight: 700; }
.precio-tachado { display: block; color: var(--gris); text-decoration: line-through; font-size: 0.85rem; }
.cantidad { display: inline-flex; align-items: center; gap: 0.7rem; border: 1px solid var(--borde); border-radius: 8px; padding: 0.2rem 0.5rem; }
.cantidad button { width: 30px; height: 30px; border: 0; border-radius: 6px; background: transparent; color: var(--oro-claro); font-size: 1.3rem; cursor: pointer; }
.cantidad button:hover:not(:disabled) { background: rgba(201, 162, 75, 0.2); }
.cantidad button:disabled { opacity: 0.3; cursor: not-allowed; }
.boton-texto { background: none; border: 0; color: #e0786f; cursor: pointer; text-decoration: underline; font: inherit; }
.resumen { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: flex-end; gap: 1.5rem; margin-top: 1.5rem; }
.resumen__datos { min-width: 280px; display: grid; gap: 0.5rem; }
.resumen__datos div { display: flex; justify-content: space-between; gap: 2rem; }
.resumen__datos dt { color: var(--gris); }
.negativo { color: #7fd69a; }
.resumen__total { padding-top: 0.6rem; border-top: 1px solid var(--oro); font-size: 1.25rem; font-weight: 700; }
.resumen__total dt { color: var(--texto); }
.resumen__acciones { display: flex; gap: 0.8rem; flex-wrap: wrap; }

@media (max-width: 760px) {
  thead { display: none; }
  .tabla, tbody, tr, td { display: block; width: 100%; }
  tr { padding: 0.8rem; border-bottom: 2px solid var(--borde); }
  td { display: flex; justify-content: space-between; align-items: center; gap: 1rem; border: 0; padding: 0.4rem 0.2rem; }
  td::before { content: attr(data-label); color: var(--gris); font-size: 0.85rem; }
  .col-desc { flex-direction: row; align-items: center; justify-content: flex-end; }
  .col-quitar { justify-content: flex-end; }
  .col-quitar::before { content: none; }
  .resumen { justify-content: stretch; }
  .resumen__datos { width: 100%; }
}

</style>