import React from "react";
import Image from "next/image";

interface Service {
  title: string;
  image: string;
  description: string;
}

const translations = {
  services: {
    title: "Services",
    details:
      "We offer a variety of professional health and massage services aimed at improving your physical function, relieving stress, and providing relaxation and rejuvenation for the body and mind.",
    serviceList: [
      {
        title: "Massage",
        description:
          "Using professional techniques to relieve muscle tension, promote blood circulation, and help the body regain vitality and relax the mind and body.",
        image: "/service1.webp",
      },
      {
        title: "Gua Sha",
        description:
          "Using specific tools and techniques to promote blood circulation, relieve muscle soreness, and improve immunity.",
        image: "/service2.jpeg",
      },
      {
        title: "Cupping",
        description:
          "Using cupping therapy to help eliminate internal moisture and cold, reduce muscle pain, and improve overall health.",
        image: "/service3.jpg",
      },
      {
        title: "Herbal Steam",
        description:
          "Combining traditional herbal medicine with steam therapy to promote detoxification, relieve muscle tension, and enhance body function.",
        image: "/service4.jpg",
      },
    ],
  },
};

export default function Page() {
  return (
    <div className="max-w-screen-lg mx-auto my-12 px-4">
      <div className="relative rounded-lg mb-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="relative z-10 flex justify-center items-center h-32 rounded-lg">
          <h3 className="text-primary text-[48px] uppercase tracking-wide">
            {translations?.services?.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-primary text-lg mb-4 text-center leading-relaxed">
        {translations?.services?.details}
      </p>

      <hr className="my-3 border-gray-300" />

      {/* Service List */}
      <div className="space-y-8 bg-white ">
        {translations?.services?.serviceList?.map(
          (service: Service, index: number) => (
            <div
              key={service.title}
              id={service.title}
              className={`flex ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } justify-between items-center space-x-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              {/* Image */}
              <div className="w-1/2 h-64 relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>

              {/* Description */}
              <div className="w-1/2 p-4">
                <h4 className="text-secondary font-semibold text-xl mb-2 text-center">
                  {service.title}
                </h4>
                <p className="text-primary text-lg leading-relaxed text-center">
                  {service.description}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
