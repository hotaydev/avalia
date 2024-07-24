export const getLastTime = (key: string) => {
  const value = localStorage.getItem("evaluatorsListLastUpdated");
  if (!value) return "0 minutos";

  const timeDifference = Date.now() - (Number.parseInt(value) ?? 0);
  const minutes = Math.floor(timeDifference / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 24) {
    return "mais de 24 horas";
  }
  if (hours > 1) {
    return `${hours} hora${hours === 1 ? "" : "s"}`;
  }
  return `${minutes} minuto${minutes === 1 ? "" : "s"}`;
};
