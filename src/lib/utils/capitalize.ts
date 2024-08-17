export default function capitalizeFirstLetters(text: string | undefined | number) {
  if (!text || typeof text === "number") {
    return text;
  }

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
