import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProps {
  title: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ title, image }) => {
  return (
    <Link
      href={"/services"}
      className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all"
    >
      <div className="w-full h-48 relative">
        <Image
          src={image}
          alt={title}
          width={400} // Fixed width
          height={200} // Fixed height
          objectFit="cover" // Ensure the image covers the area without distortion
          className="rounded-t-lg"
        />
      </div>

      <h3 className="p-4 text-xl font-semibold text-primary mb-2">{title}</h3>
    </Link>
  );
};

export default Card;
