import { join } from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: join(__dirname, 'docs'),
  title: 'Avalia Docs',
  description: 'Documentação da Plataforma Avalia',
  icon: '/icon.png',
  logo: "/icon-small.png",
  logoText: "Avalia",
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
  locales: [
    {
      lang: "pt-BR",
      label: "Português",
      title: 'Avalia Docs',
      description: 'Documentação da Plataforma Avalia',
    },
    {
      lang: "en-US",
      label: "English",
      title: 'Avalia Docs',
      description: 'Avalia Platform Documentation',
    }
  ],
});
