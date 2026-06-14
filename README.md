# BioRare

Plataforma (conceptual) de **estandarización global de datos en enfermedades
raras**: unifica información clínica, genética y de biobancos bajo un mismo
estándar para acelerar la cooperación y la investigación. Proyecto académico.

Construido con [Astro](https://astro.build) · paleta cálida (corales + ámbar) ·
**100% estático**, sin backend ni login, pensado para **GitHub Pages**.

> MVP interactivo: el buscador funciona de verdad entre varias enfermedades, las
> fichas se generan una por enfermedad, y las métricas/agregados se calculan
> desde una capa de datos común.

## Pantallas

| Ruta              | Pantalla                                                                       |
| ----------------- | ------------------------------------------------------------------------------ |
| `/`               | **Landing** — propuesta de valor, problema, números de impacto, flujo           |
| `/buscador`       | **Buscador** — filtro real por nombre, ORPHA, ICD-10, cromosoma o categoría      |
| `/ficha/[slug]`   | **Ficha de enfermedad** — una por enfermedad, 5 pestañas (resumen, diagnóstico, sourcing, muestras, literatura) |
| `/dashboard`      | **Dashboard** — métricas y gráfico de distribución derivados del dataset         |
| `/biobanco`       | **Biobanco** — muestras agregadas por institución                               |
| `/alertas`        | **Alertas** — incidencias de trazabilidad (resolubles en sesión)                |
| `/cooperacion`    | **Cooperación** — mensajería y solicitudes de intercambio interactivas           |

La búsqueda del topbar (⌘K / Ctrl+K) navega a `/buscador?q=…` y preaplica el filtro.

## Capa de datos

Toda la información vive en `src/data/diseases.ts` (fuente de verdad única y
tipada). Las pantallas no llevan datos inline: el buscador y las fichas la
recorren, y el dashboard/biobanco derivan de ahí sus métricas y agregados.
Añadir una enfermedad nueva = añadir un objeto a ese array; su ficha y su
tarjeta de buscador se generan solas.

> Los datos (enfermedades, variantes, muestras, proveedores, mensajes) son de
> **demostración** y no representan información clínica real.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:4321/BioRare
```

```bash
npm run build    # genera dist/
npm run preview  # previsualiza el build
```

## Publicar en GitHub Pages

1. Edita `astro.config.mjs`:
   - `site`: `https://TU-USUARIO.github.io`
   - `base`: el nombre del repositorio (por defecto `/BioRare`).
     - Si usas un repo `TU-USUARIO.github.io` o un dominio propio, pon `base: '/'`.
2. Sube el código a la rama `main` de GitHub.
3. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. El workflow `.github/workflows/deploy.yml` construye y publica en cada `push` a `main`.

## Estructura

```
src/
  components/   Logo, SiteNav, Footer, AppShell (sidebar + topbar + ⌘K)
  data/         diseases.ts — capa de datos tipada (fuente de verdad)
  layouts/      Layout base (head, tipografías, a11y)
  pages/        index, buscador, dashboard, biobanco, alertas, cooperacion,
                ficha/[slug] (ruta dinámica por enfermedad)
  styles/       global.css (sistema de diseño + tokens)
```
