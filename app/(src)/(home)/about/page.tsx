import React from "react";
import Image from "next/image";

const translations = {
  about: {
    title: "About",
    introText:
      "At Baicao Wellness Centre, we are committed to providing a relaxing and rejuvenating experience for all our customers. Here, you can find detailed information about our range of services, including steaming, massage, scraping, cupping, and other therapeutic treatments.",
    valuesText:
      "We take pride in our team of professional technicians, ensuring that each customer receives high-quality services tailored to their needs. Our approach is rooted in the concept of 'Health First' and 'Customer First,' as we aim to deliver an exceptional wellness experience that prioritizes your well-being.",
    valuesTitle: "Our Values",
    valuesList: [
      "Commitment to Health First",
      "Customer Satisfaction is Our Priority",
      "High-Quality Services by Professional Technicians",
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
          <h1 className="text-primary text-[48px] uppercase tracking-wide">
            {translations?.about?.title}
          </h1>
        </div>
      </div>

      {/* Intro Text */}
      <p className="text-gray-800 leading-relaxed mb-8 text-lg">
        {translations?.about?.introText}
      </p>

      {/* Values Text */}
      <p className="text-gray-800 leading-relaxed mb-12 text-lg">
        {translations?.about?.valuesText}
      </p>

      {/* Values Section */}
      <div>
        <h2 className="text-xl font-bold text-secondary mb-4">
          {translations?.about?.valuesTitle}
        </h2>

        <div className="bg-white shadow-xl rounded-lg p-6">
          {translations?.about?.valuesList.map((value, index) => (
            <div key={index}>
              <div className="py-2 text-lg text-gray-800">{value}</div>
              {index < translations?.about?.valuesList.length - 1 && (
                <hr className="my-2 border-t border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
