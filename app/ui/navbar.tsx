import Link from "next/link";

const pages = [
  { name: "About", link: "/about" },
  { name: "Services", link: "/services" },
  { name: "Contact", link: "/contact" },
];

export default function Navbar() {
  return (
    <div className="flex w-full px-8 bg-primary items-center justify-between">
      <div className="flex items-center">
        <Link
          href="/"
          className="mr-8 flex font-mono font-bold tracking-[.3rem] text-[18px]"
        >
          Baicao
        </Link>

        <div className="flex gap-4">
          {pages?.map((page) => (
            <Link
              href={page.link}
              key={page.name}
              className="p-4 py-6 font-mono"
            >
              {page.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6 font-mono">
        <div>Language</div>
        <button className="border py-2 px-4 rounded-md hover:bg-[rgba(255,255,255,0.1)] font-mono">
          Login
        </button>
      </div>
    </div>
  );
}
