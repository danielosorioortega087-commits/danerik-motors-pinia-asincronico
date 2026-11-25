<script setup lang="ts">
const tienda = useTiendaStore()
const { carrito, numeroFactura, fechaFactura, subtotal, totalDescuentos, baseGravable, iva, totalPagar } = storeToRefs(tienda)
const porcentajeIva = 19
const nombre = (p) => p.descripcion.split(' — ')[0]
const valorDesc = (p) => tienda.valorConDescuento(p)
const subtotalLinea = (i) => valorDesc(i.producto) * i.cantidad
const formatear = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
const imprimir = () => window.print()
</script>
<template><section class="factura" aria-labelledby="titulo-factura"><header class="factura__cabecera"><div><p class="hero__sobre">Gracias por tu compra</p><h2 id="titulo-factura" class="titulo-seccion">Factura de venta</h2></div><dl class="factura__meta"><div><dt>N.º</dt><dd>{{ numeroFactura }}</dd></div><div><dt>Fecha</dt><dd>{{ fechaFactura }}</dd></div></dl></header>
<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Descripción</th><th class="num">Cant.</th><th class="num">Valor unitario</th><th class="num">Descuento</th><th class="num">Valor con descuento</th><th class="num">Subtotal</th></tr></thead><tbody><tr v-for="item in carrito" :key="item.producto.id"><td>{{ nombre(item.producto) }}</td><td class="num">{{ item.cantidad }}</td><td class="num">{{ formatear(item.producto.valor) }}</td><td class="num">{{ item.producto.descuento }}%</td><td class="num">{{ formatear(valorDesc(item.producto)) }}</td><td class="num">{{ formatear(subtotalLinea(item)) }}</td></tr></tbody></table></div>
<dl class="totales"><div><dt>Valor bruto</dt><dd>{{ formatear(subtotal) }}</dd></div><div><dt>Total descuentos</dt><dd class="negativo">− {{ formatear(totalDescuentos) }}</dd></div><div><dt>Base gravable</dt><dd>{{ formatear(baseGravable) }}</dd></div><div><dt>IVA ({{ porcentajeIva }} %)</dt><dd>{{ formatear(iva) }}</dd></div><div class="totales__pagar"><dt>Total a pagar</dt><dd>{{ formatear(totalPagar) }}</dd></div></dl>
<div class="factura__acciones"><button type="button" class="boton boton--secundario" @click="imprimir">Imprimir</button><button type="button" class="boton" @click="tienda.nuevaCompra()">Nueva compra</button></div></section></template>
<style scoped>

.factura { background: var(--panel); border: 1px solid var(--oro); border-radius: 14px; padding: clamp(1rem, 3vw, 2.2rem); }
.factura__cabecera { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
.factura__meta { display: grid; gap: 0.3rem; text-align: right; }
.factura__meta div { display: flex; gap: 0.8rem; justify-content: flex-end; }
.factura__meta dt { color: var(--gris); }
.factura__meta dd { font-weight: 700; }
.tabla-scroll { overflow-x: auto; }
.tabla { width: 100%; min-width: 640px; border-collapse: collapse; }
th { text-align: left; padding: 0.7rem 0.8rem; color: var(--oro); border-bottom: 2px solid var(--oro); font-family: var(--fuente-titulo); }
td { padding: 0.7rem 0.8rem; border-bottom: 1px solid var(--borde); }
.num { text-align: right; white-space: nowrap; }
.totales { margin: 1.5rem 0 0 auto; max-width: 380px; display: grid; gap: 0.5rem; }
.totales div { display: flex; justify-content: space-between; gap: 2rem; }
.totales dt { color: var(--gris); }
.negativo { color: #7fd69a; }
.totales__pagar { margin-top: 0.4rem; padding-top: 0.7rem; border-top: 2px solid var(--oro); font-size: 1.4rem; font-weight: 700; }
.totales__pagar dt { color: var(--oro-claro); }
.factura__acciones { display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 2rem; flex-wrap: wrap; }

@media print {
  .factura__acciones { display: none; }
}

</style>