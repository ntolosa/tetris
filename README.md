# Tetris

Un clásico juego de Tetris construido con **React** y **JavaScript**. 

## Tecnologías Utilizadas

- **React** (v18.3.0)
- **CSS / SASS**
- **Webpack** y configuración de construcción personalizada (ejected Create React App)
- **Jest** y **React Testing Library** para pruebas

## Requisitos Previos

- **Node.js** (versiones LTS recomendadas)
- **npm** o **yarn**

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone git@github.com:ntolosa/tetris.git
cd tetris
npm install
```

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run start`

Inicia la aplicación en modo de desarrollo.
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador. La página se recargará si haces modificaciones en el código.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`. Empaqueta correctamente React en modo de producción y optimiza la compilación para obtener el mejor rendimiento.

### `npm run test`

Inicia el entorno de pruebas usando Jest de forma interactiva.

## Estructura del proyecto

El código fuente principal y los componentes (como el tablero y la lógica del Tetris) se encuentran dentro del directorio `src/`.
