export const metadata = {
  title: "Avalia | Sistema de avaliações para feiras",
  description: "Sistema de avaliações para feiras de iniciação científica do Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
