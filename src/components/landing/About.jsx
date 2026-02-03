const AboutSection = () => {
  return (
    <section id="tentang" className="bg-blue-600 py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Tentang Kami
        </h2>
        ={" "}
        <div className="flex flex-col md:flex-row items-start gap-16">
          <div className="flex gap-6">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600"
              alt="Office"
              className="w-65 h-85 object-cover rounded-3xl shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600"
              alt="Meeting"
              className="w-65 h-85 object-cover rounded-3xl shadow-xl mt-16"
            />
          </div>
          <p className="max-w-xl leading-relaxed text-lg text-justify">
            eksekusi yang sukses, layanan pelanggan yang luar biasa, dan dampak
            strategis yang langgeng di mulai dengan fokus mengartikulasikan visi
            yang jelas tentang dimana perusahaan pemegang saham, dan karyawan.
            kami bekerja dengan perusahaan untuk mengembangkan tujuan dan
            strategi yang akan membawa mereka ke visi itu dan menyelaraskan
            mereka dengan pekerjaan sehari hari perusahaan. dan kami bekerja
            bersama untuk memfokuskan visi, menelaraskan tindakan, proses,
            teknologi dan melibatkan orang untuk memberikan keunggulan yang
            berkelanjutan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
