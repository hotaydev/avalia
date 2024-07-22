export default function ConfigItem({
  text,
  soon = false,
  onClick,
}: Readonly<{ text: string; soon?: boolean; onClick?: () => void }>) {
  return (
    <>
      <div
        className={`bg-gray-100 text-gray-800 rounded-lg py-3 flex items-center justify-between ${soon ? "cursor-not-allowed pr-6 pl-2" : "hover:bg-gray-200 cursor-pointer px-6"} transition-all w-full max-w-lg group`}
        onClick={onClick}
      >
        {soon ? <span className="px-2 py-1 bg-gray-300 rounded-md font-light text-xs">Em breve</span> : <span />}
        {text}{" "}
        <span className={`ml-2 transform transition-transform ${soon ? "" : "group-hover:translate-x-2"}`}>&rarr;</span>
      </div>
    </>
  );
}
