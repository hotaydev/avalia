export default function HeaderTitle({ mb = "12" }: { mb?: string }) {
  return (
    <div
      className={`text-3xl font-semibold text-gray-800 flex flex-col text-center mb-${mb}`}
    >
      Avalia
      <sub className="text-sm font-light">
        Sistema de avaliações para feiras
      </sub>
    </div>
  );
}
