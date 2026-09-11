# Mi Lista de la Compra

Aplicación web (instalable como PWA) para llevar tu lista de la compra y comparar precios
entre supermercados: **Mercadona, Dia, Consum, Lidl, Aldi, Spar, Cash Lesco y Cash Solano**.

- **Productos**: crea productos y anota el precio en cada tienda a mano. Puedes marcar una
  tienda como preferida (se mostrará siempre esa) o dejarlo en automático para que
  siempre se muestre el precio más bajo disponible.
- **Tiendas**: elige una tienda y verás solo los productos que tienen precio en esa tienda,
  ordenados de más barato a más caro.
- **Lista**: busca productos (o escribe uno libre) y añádelos a la lista de la compra, márcalos
  como comprados, ajusta cantidades y consulta el total. Arriba de la lista puedes elegir en qué
  tienda vas a comprar ("Automático" o una tienda concreta): en "Automático" ves todos los
  artículos con su precio preferido o más barato; al elegir una tienda concreta, la lista se
  filtra y solo se ven los artículos que salen más baratos justo en esa tienda (con el precio en
  verde), con el total de esa selección al final de la lista.
- Puedes añadir tus propias tiendas además de las 8 iniciales, desde "Gestionar tiendas" (en la
  pestaña Tiendas o en la Lista). Las tiendas que tú añadas también se pueden borrar; las 8
  iniciales no.
- En Productos puedes cambiar entre ver los productos en **cuadrícula** o en **lista** (el
  icono junto al buscador), y ponerle una foto a cada producto (hecha con la cámara del móvil o
  elegida de la galería) al crearlo o editarlo. La foto se guarda ya redimensionada y
  comprimida directamente en el documento del producto en Firestore, así que no hace falta
  configurar nada más en Firebase para esto.
- Buscador de productos en la pestaña Productos y en la Lista.
- Instalable en el móvil/escritorio como aplicación (icono propio incluido) gracias a PWA.
- Todos los datos se guardan en **Firebase Firestore**, así que se sincronizan entre
  dispositivos.

Construida con React + TypeScript + Vite + Tailwind CSS.

## 1. Requisitos

- [Node.js](https://nodejs.org/) 18 o superior y npm.
- Una cuenta gratuita de [Firebase](https://firebase.google.com/).
- Una cuenta de [GitHub](https://github.com/) si quieres subir el proyecto.

## 2. Crear el proyecto de Firebase (Firestore)

1. Ve a [Firebase Console](https://console.firebase.google.com/) y pulsa **Añadir proyecto**.
   Ponle el nombre que quieras (p. ej. `lista-compra`) y termina el asistente.
2. En el menú lateral entra en **Compilación > Firestore Database** y pulsa **Crear base de
   datos**. Elige la ubicación más cercana (p. ej. `eur3 (europe-west)`) y empieza en **modo de
   prueba** (luego puedes ajustar las reglas, ver el archivo `firestore.rules` de este
   repositorio como punto de partida).
3. En **Configuración del proyecto** (el icono de engranaje) > pestaña **General**, baja hasta
   "Tus apps" y pulsa el icono `</>` para **añadir una app web**. Ponle un nombre (p. ej.
   `lista-compra-web`) y no hace falta activar Firebase Hosting.
4. Firebase te mostrará un objeto `firebaseConfig` con varias claves (`apiKey`,
   `authDomain`, `projectId`, etc.). Los necesitarás en el siguiente paso.

> Esta app no lleva login: cualquiera con la URL de tu Firebase podría ver/editar los datos si
> conoce las claves. Para uso personal o familiar suele ser suficiente, pero si quieres más
> seguridad puedes activar Firebase Authentication más adelante y restringir las reglas de
> Firestore a usuarios autenticados.

## 3. Configurar el proyecto localmente

```bash
# Instalar dependencias
npm install

# Copiar el archivo de variables de entorno y rellenarlo con los datos de Firebase del paso 2
cp .env.example .env
```

Edita `.env` y rellena cada variable con el valor correspondiente del `firebaseConfig` que te
dio Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Arranca el servidor de desarrollo:

```bash
npm run dev
```

Abre la URL que te indique la terminal (normalmente `http://localhost:5173`).

## 4. Compilar para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para desplegar en cualquier hosting estático:
**Firebase Hosting, Vercel, Netlify, GitHub Pages**, etc.

Para probar el build en local antes de desplegar:

```bash
npm run preview
```

### Desplegar en Firebase Hosting (opcional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # elige "dist" como carpeta pública y "Sí" a single-page app
npm run build
firebase deploy
```

## 5. Instalar la app en el móvil (icono en la pantalla de inicio)

La app incluye un manifiesto PWA con su propio icono (`public/icons/`), así que una vez
desplegada (o mientras la usas en local desde el móvil, en la misma red):

- **Android/Chrome**: menú (⋮) > "Añadir a pantalla de inicio" / "Instalar app".
- **iPhone/Safari**: botón compartir > "Añadir a pantalla de inicio".

Aparecerá el icono personalizado de la app (una bolsa de la compra en tonos pastel) igual que
una app nativa.

## 6. Subir el proyecto a GitHub

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Primera versión de la app de lista de la compra"

# Crea un repositorio vacío en https://github.com/new (sin README, sin .gitignore)
# y luego conéctalo:
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
git push -u origin main
```

El archivo `.gitignore` ya excluye `node_modules`, `dist` y tu `.env` (con tus claves de
Firebase), así que no se subirán por error.

> Si quieres desplegar automáticamente en cada `push`, puedes añadir más adelante un workflow
> de GitHub Actions que ejecute `npm run build` y despliegue el contenido de `dist/` (por
> ejemplo con Firebase Hosting, Netlify o GitHub Pages).

## Estructura del proyecto

```
src/
  components/     Componentes reutilizables (formularios, tarjetas, modal, etc.)
  pages/          Las 3 pantallas: Lista, Productos, Tiendas
  hooks/          Acceso a Firestore (useProducts, useShoppingList)
  utils/          Lista de tiendas y cálculo del mejor precio
  firebase.ts     Configuración de Firebase a partir de las variables de entorno
design/
  icon-source.svg            Icono de la app (versión estándar)
  icon-maskable-source.svg   Icono de la app (versión "maskable" para Android)
public/icons/     Iconos PWA ya exportados en PNG en todos los tamaños necesarios
firestore.rules   Reglas de seguridad de ejemplo para Firestore
```

## Notas

- Los precios se introducen manualmente, tienda a tienda, en el formulario de cada producto.
- Si un producto tiene tienda preferida, se muestra siempre esa (aunque no sea la más barata).
  Si no tiene, se muestra automáticamente la tienda con el precio más bajo introducido.
- La búsqueda de productos filtra por nombre y categoría, tanto en la pestaña Productos como al
  añadir artículos a la lista.
