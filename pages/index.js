import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Link href="/login">
        <button className="p-3 rounded-md py-1.5 block bg-blue-600">
          Login
        </button>
        </Link>
      </a>
    </main>
  );
}
