import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProps {
  title: string;
  image: string;
  link: string;
}

export default function Card({ title, image, link }: CardProps) {
  return (
    <Link href={link}>
      <div className="rounded-lg overflow-hidden bg-white hover:scale-105 transform transition-all shadow-md ease-in ">
        <div style={{ width: "400px", height: "200px", position: "relative" }}>
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <h3 className="p-4 text-xl font-semibold text-primary mb-2 text-center">
          {title}
        </h3>
      </div>
    </Link>
  );
}
