const AboutSection = () => {
  const aboutImg1 =
    "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg";
  const aboutImg2 =
    "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg";
  const aboutImg3 =
    "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg";

  return (
    <div className="py-20 bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B4360] mb-3">
            About Our Hospital
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src={aboutImg1}
              alt="Medical team"
              className="rounded-xl shadow-md h-40 w-full object-cover"
            />
            <img
              src={aboutImg2}
              alt="Hospital corridor"
              className="rounded-xl shadow-md h-40 w-full object-cover mt-6"
            />
            <img
              src={aboutImg3}
              alt="Healthcare consultation"
              className="rounded-xl shadow-md h-40 w-full object-cover col-span-2"
            />
          </div>

          {/* Content */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1B4360] mb-4">
              Excellence in Healthcare
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Our hospital is dedicated to providing world-class medical care with 
              compassion, innovation, and a patient-first approach. We combine state-
              of-the-art facilities with a highly skilled team of professionals to 
              ensure your well-being.
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              We focus on continuous improvement, advanced technology, and community 
              engagement to bring you quality healthcare that you can trust.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-[#1B4360]">Patient-Centric Care</h4>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-[#1B4360]">Expert Medical Team</h4>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-[#1B4360]">24/7 Emergency Support</h4>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-[#1B4360]">Advanced Technology</h4>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutSection;