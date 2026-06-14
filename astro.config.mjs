import { defineConfig } from 'astro/config';

// GitHub Pages (usuario JStewardGT · repo BioRare):
//  - `site`: origen de GitHub Pages del usuario (en minúsculas).
//  - `base`: debe coincidir con el nombre del repositorio.
//    Si migras a un repo tipo usuario.github.io o dominio propio, pon base: '/'.
export default defineConfig({
  site: 'https://jstewardgt.github.io',
  base: '/BioRare',
});
