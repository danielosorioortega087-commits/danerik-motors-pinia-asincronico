<script setup lang="ts">
const tienda = useTiendaStore()
const { vista, aviso } = storeToRefs(tienda)
let timer: ReturnType<typeof setTimeout> | undefined
watch(aviso, (value) => { if (timer) clearTimeout(timer); if (value) timer = setTimeout(() => tienda.limpiarAviso(), 2200) })
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })
</script>
<template><AppHeader/><main class="contenedor"><FacturaCompra v-if="vista === 'factura'"/><CarritoCompra v-else-if="vista === 'carrito'"/><template v-else><section class="hero"><p class="hero__sobre">COLECCIÓN EXCLUSIVA</p><h2 class="hero__titulo">Potencia, elegancia y libertad.</h2><p class="hero__texto">Descubre motocicletas de alto rendimiento y diseño exclusivo. Elige la máquina que representa tu estilo.</p></section><ListaProductos/></template></main><AppFooter/><Transition name="aviso"><div v-if="aviso" class="aviso" role="status">{{ aviso }}</div></Transition></template>
