"use client";

import Link from "next/link";
import Card from "../ui/home/card";
import { useEffect, useState } from "react";
import Carousel from "../ui/home/carousel";

const translations = {
  homepage: {
    heroTitle: "Welcome to Baicao Wellness Centre",
    heroDetails: "Discover relaxation and rejuvenation",
    exploreServices: "Explore Our Services",
    exploreAbout: "Learn More About Us",
    servicesTitle: "Our Services",
    contactBanner: "Ready to Rejuvenate? Visit Us Today!",
    contactButton: "Contact Us",
    customerCommentsTitle: "What Our Customers Say",
    customerComments: [
      {
        text: "The steaming therapy was incredibly relaxing, and the massage left me feeling rejuvenated. Highly recommend this wellness center!",
        author: "John Doe",
      },
      {
        text: "A truly professional experience. The staff is attentive, and the ambiance is peaceful. I'll definitely be back for more treatments.",
        author: "Jane Smith",
      },
      {
        text: "Best massage experience ever! The therapists are skilled and made sure I felt comfortable the entire time.",
        author: "Alice Brown",
      },
    ],
  },
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
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  // Rotate through comments every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommentIndex((prevIndex) =>
        prevIndex === translations.homepage.customerComments.length - 1
          ? 0
          : prevIndex + 1
      );
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to go to the next comment
  const handleNextComment = () => {
    setCurrentCommentIndex((prevIndex) =>
      prevIndex === translations.homepage.customerComments.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  // Function to go to the previous comment
  const handlePrevComment = () => {
    setCurrentCommentIndex((prevIndex) =>
      prevIndex === 0
        ? translations.homepage.customerComments.length - 1
        : prevIndex - 1
    );
  };

  return (
    <main>
      {/* Hero section */}
      <section
        className="bg-cover h-[65vh] bg-center text-white flex items-center justify-center flex-col"
        style={{ backgroundImage: "url(/hero.jpg)" }}
      >
        <h2 className="text-[56px] font-bold tracking-wide mb-6 text-primary drop-shadow-md text-center">
          {translations.homepage.heroTitle}
        </h2>
        <h5 className="mb-8 text-[24px] text-primary drop-shadow-md">
          {translations.homepage.heroDetails}
        </h5>
        <div className="flex justify-center gap-4">
          <Link href="/services">
            <div className="px-8 py-3 text-primary border font-bold border-primary rounded-full hover:bg-primary hover:text-white hover:border-transparent transition-all">
              {translations.homepage.exploreServices}
            </div>
          </Link>
          <Link href="/about">
            <div className="px-8 py-3 text-primary border font-bold border-primary rounded-full hover:bg-primary hover:text-white hover:border-transparent transition-all">
              {translations.homepage.exploreAbout}
            </div>
          </Link>
        </div>
      </section>

      {/* Services section */}
      <section className="container mx-auto py-12 max-w-screen-lg">
        <h4 className="text-3xl font-bold text-center text-primary mb-8">
          {translations.homepage.servicesTitle}
        </h4>

        <div className="flex flex-wrap justify-center gap-8">
          {translations.services.serviceList.map((service) => (
            <div key={service.title}>
              <Card
                title={service.title}
                image={service.image}
                link={`/services#${service.title}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Comment section */}
      <section className="container mx-auto py-12 pb-20">
        <h4 className="text-3xl font-bold text-center text-primary mb-8">
          {translations.homepage.customerCommentsTitle}
        </h4>
        <Carousel
          comments={translations.homepage.customerComments}
          currentCommentIndex={currentCommentIndex}
          handleNextComment={handleNextComment}
          handlePrevComment={handlePrevComment}
        />
      </section>
    </main>
  );
}
