# Danerik Motors — Nuxt 4 + Pinia

Tienda reconstruida siguiendo la estructura y el patrón Options Store del proyecto `ejemplopinia` y su video.

## Patrón aplicado
- `app/stores/tienda.ts`: `defineStore('tienda', { state, getters, actions })`.
- Los componentes obtienen la misma instancia con `useTiendaStore()`.
- `storeToRefs(tienda)` se utiliza para extraer estado y getters sin perder reactividad.
- Los componentes son independientes: no se pasan datos por props ni se notifican acciones por emits.
- `finalizarCompra()` es una action asíncrona con `async/await`.
- Pinia mantiene el estado compartido durante la navegación dentro de la aplicación.

## Ejecutar
```bash
npm install
npm run dev
```

## Estructura
```text
app/
  app.vue
  assets/main.css
  components/
    AppHeader.vue
    ListaProductos.vue
    CarritoCompra.vue
    FacturaCompra.vue
    AppFooter.vue
  pages/index.vue
  stores/tienda.ts
public/
  logo-danerik.jpeg
  img/
nuxt.config.ts
package.json
```


## Action asíncrona (como en el video)

- En `app/stores/tienda.ts`, `finalizarCompraAsync()` es una action `async` que espera una Promise con `await` durante 1 segundo (simula la respuesta de un servidor), genera la factura y cambia la vista.
- En `app/components/CarritoCompra.vue`, `confirmarCompra()` usa un `ref` local (`esperando`), llama `await tienda.finalizarCompraAsync()` y libera el estado de carga con `finally`.
- El botón **Finalizar compra** se deshabilita y muestra **Confirmando compra…** mientras se resuelve la Promise.

Este es el mismo flujo didáctico del ejemplo: componente → `await store.actionAsync()` → la action espera → modifica el state → la interfaz reactiva se actualiza. La espera es una simulación local; no se conecta a una pasarela de pago ni a un servidor real.
