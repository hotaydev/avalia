import Link from "next/link";
import Image from "next/image";

export default function Footer({ fixed = false }: { fixed?: boolean }) {
  return (
    <div
      className={`z-10 text-gray-500 text-center flex items-center bottom-2 justify-center py-4 w-full font-light ${
        fixed ? "fixed bottom-2" : "relative"
      }`}
    >
      Desenvolvido pela{" "}
      <Link
        href="https://www.hotay.dev"
        target="_blank"
        className="hover:underline font-semibold"
      >
        <Image
          className="ml-2"
          src="https://www.hotay.dev/assets/images/logo.svg"
          alt="Logo da Hotay"
          width={70}
          height={23}
        />
      </Link>
    </div>
  );
}
