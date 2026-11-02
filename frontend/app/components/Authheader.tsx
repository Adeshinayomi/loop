import Image from "next/image";

export function AuthHeader() {
  return (
    <header className="bg-surface text-white p-4">
        <Image src="/Loop-brand.svg" alt="Logo" width={100} height={100} loading="lazy" className="w-auto h-auto"/>
    </header>
  );
}