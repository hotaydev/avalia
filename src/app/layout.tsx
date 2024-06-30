export const metadata = {
  title: "Avalia | Sistema de avaliações para feiras",
  description:
    "Sistema de avaliações para feiras de iniciação científica do Brasil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
