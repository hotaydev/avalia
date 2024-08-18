import Image from "next/image";
import Link from "next/link";

export default function Footer({ fixed = true }: { fixed?: boolean }) {
  return (
    <div
      className={`z-10 text-gray-500 text-center flex items-center justify-center py-4 w-full font-light relative ${
        fixed ? "md:fixed md:bottom-2" : ""
      }`}
    >
      Desenvolvido gratuitamente pela{" "}
      <Link href="https://www.hotay.dev" target="_blank">
        <Image
          className="ml-2"
          src="https://www.hotay.dev/assets/imgs/logo.svg"
          alt="Logo da Hotay"
          width={70}
          height={23}
        />
      </Link>
    </div>
  );
}
