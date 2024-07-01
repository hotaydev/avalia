export default function HeaderTitle({ mb = "14" }: { mb?: string }) {
  return (
    <span
      className={`text-3xl font-semibold text-gray-800 flex flex-col text-center mb-${mb}`}
    >
      Avalia
      <sub className="text-sm font-light">
        Sistema de avaliações para feiras
      </sub>
    </span>
  );
}
