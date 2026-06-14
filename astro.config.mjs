import { defineConfig } from 'astro/config';

// IMPORTANTE para GitHub Pages:
//  - `site`: cámbialo por https://TU-USUARIO.github.io
//  - `base`: debe coincidir con el nombre del repositorio (aquí "BioRare").
//    Si publicas en un repo distinto, ajústalo. Si usas un dominio propio
//    o un repo tipo TU-USUARIO.github.io, pon base: '/'.
export default defineConfig({
  site: 'https://TU-USUARIO.github.io',
  base: '/BioRare',
});
