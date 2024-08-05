import { join } from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: join(__dirname, 'docs'),
  title: 'Avalia Docs',
  description: 'Documentação da Plataforma Avalia',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/hotaydev/avalia' },
    ],
  },
  outDir: "../public/docs",
  base: "/docs/",
  builderConfig: {
    output: {
      cleanDistPath: true,
    },
  },
  lang: "pt-BR",
  locales: [{
    lang: "pt-BR",
    label: "Português",
    title: 'Avalia Docs',
    description: 'Documentação da Plataforma Avalia',
  }],
});
