export const getLastTime = (key: string) => {
  const value = localStorage.getItem("evaluatorsListLastUpdated");
  if (!value) return "0 minutos";

  const oldTime = new Date(Number.parseInt(value));
  const newTime = new Date();

  const seconds = Math.floor(((newTime.getTime() - oldTime.getTime()) / 1000) % 60);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 24) {
    return "mais de 24 horas";
  }
  if (hours > 1) {
    return `${hours} hora${hours === 1 ? "" : "s"}`;
  }
  return `${minutes} minuto${minutes === 1 ? "" : "s"}`;
};
