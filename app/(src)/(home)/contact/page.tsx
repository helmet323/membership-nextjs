import Image from "next/image";

const translations = {
  contact: {
    title: "Contact Us",
    contactInfo: "Contact Information",
    address: {
      title: "Address",
      description: "123 Baicao Street, Wellness City, Country",
    },
    phone: {
      title: "Phone",
      description: "(647)285-8211",
    },
    email: {
      title: "Email",
      description: "baicaowellness@gmail.com",
    },
    visitUs: {
      title: "Visit Us Today!",
      description:
        "We are open from 9:00 AM to 7:00 PM every day. Whether you're looking for a relaxing massage or professional steaming therapy, our team is here to serve you. Come visit us at our wellness center and experience rejuvenation like never before.",
    },
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
            {translations?.contact?.title}
          </h1>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-4">
        <h2 className="text-primary text-2xl font-semibold mb-6 underline">
          {translations?.contact?.contactInfo}
        </h2>

        <p className="text-gray-800 text-lg mb-4">
          <strong>{translations?.contact?.address.title}:</strong>{" "}
          {translations?.contact?.address.description}
        </p>

        <p className="text-gray-800 text-lg mb-4">
          <strong>{translations?.contact?.phone.title}:</strong>{" "}
          {translations?.contact?.phone.description}
        </p>

        <p className="text-gray-800 text-lg mb-6">
          <strong>{translations?.contact?.email.title}:</strong>{" "}
          {translations?.contact?.email.description}
        </p>

        <hr className="my-6 border-t-2 border-gray-300" />
      </div>

      {/* Visit Us Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-secondary text-xl font-semibold text-center mb-4">
          {translations?.contact?.visitUs.title}
        </h3>

        <p className="text-gray-600 text-center text-lg leading-relaxed">
          {translations?.contact?.visitUs.description}
        </p>
      </div>
    </div>
  );
}
