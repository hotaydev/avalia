import { useRouter } from "next/router";

export default function ArrowBack() {
  const router = useRouter();
  return (
    <div className="fixed top-6 left-6">
      <span
        className="px-6 py-2 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 transition-all text-gray-800"
        onClick={() => router.back()}
      >
        &larr;
      </span>
    </div>
  );
}
