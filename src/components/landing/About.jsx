import useScrollAnimation from "../../hooks/useScrollAnimation";

const AboutSection = () => {
  const [aboutRef, aboutVisible] = useScrollAnimation(0.1);
  const [visiMisiRef, visiMisiVisible] = useScrollAnimation(0.1);
  const [kebijakanRef, kebijakanVisible] = useScrollAnimation(0.1);
  const [kelebihanRef, kelebihanVisible] = useScrollAnimation(0.1);

  const policies = [
    {
      icon: "💬",
      text: "Membangun komunikasi yang baik di dalam maupun di luar struktural organisasi.",
    },
    {
      icon: "👥",
      text: "Menjamin pegawai yang ditempatkan sudah sesuai dengan yang dibutuhkan oleh pihak pengguna, dan telah melalui proses penerimaan pegawai yang benar dan telah diadakan training sebelum adanya penempatan.",
    },
    {
      icon: "🤝",
      text: "Selalu peduli dan memberikan pelayanan yang terbaik untuk para pelanggan.",
    },
    {
      icon: "🔗",
      text: "Selalu menjalin hubungan yang harmonis antara pegawai staff dengan pegawai outsourcing yang kita sediakan kepada pengguna jasa kita.",
    },
    {
      icon: "😊",
      text: "Kepuasan konsumen merupakan kebahagiaan kami.",
    },
    {
      icon: "🏆",
      text: "Keterbukaan dan kerja sama team merupakan keunggulan kompetitif bagi kami.",
    },
  ];

  const benefits = [
    {
      title: "Safety First",
      icon: "🦺",
      items: [
        "Safety Shoes",
        "Helmet",
        "Topi Pelindung Rambut (Topi Pet)",
        "Masker",
      ],
    },
    {
      title: "Transportasi",
      icon: "🚌",
      description:
        "Kami menyediakan angkutan Transportasi kepada pekerja outsourcing PT. Surya Tamado Mandiri yang mengalami sakit atau kecelakaan kerja di dalam perusahaan.",
    },
    {
      title: "Seragam Kerja",
      icon: "👔",
      items: [
        "Kami memberikan seragam kerja kepada pekerja outsourcing PT. Surya Tamado Mandiri",
        "Menyediakan tas transparan",
      ],
    },
    {
      title: "Bebas Administrasi",
      icon: "📋",
      description:
        "PT. Surya Tamado Mandiri tidak membebani biaya administrasi terhadap calon pekerja.",
    },
    {
      title: "Disiplin Waktu",
      icon: "⏰",
      description:
        "Pekerja wajib berada di area kerja 15 menit sebelum pekerjaan dimulai.",
    },
    {
      title: "Asuransi Kesehatan",
      icon: "🏥",
      description: "Setiap pekerja diberikan asuransi kesehatan berupa BPJS.",
    },
    {
      title: "Sistem Pembayaran Upah",
      icon: "💳",
      description: "Pekerja melalui Via Bank guna terciptanya transparansi.",
    },
    {
      title: "Pelatihan Kerja",
      icon: "📚",
      description:
        "Melakukan pelatihan kerja setiap per 3 bulan dengan Lembaga Pelatihan Pekerja (LPK) yang memiliki lisensi.",
    },
  ];

  return (
    <>
      <section
        id="tentang"
        ref={aboutRef}
        className="bg-blue-600 py-12 text-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl font-semibold text-center mb-10 transition-all duration-700 ${
              aboutVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            Tentang Kami
          </h2>{" "}
          <div className="flex flex-col md:flex-row items-start gap-16">
            <div
              className={`flex gap-6 transition-all duration-700 delay-200 ${
                aboutVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600"
                alt="Office"
                className="w-55 h-75 object-cover rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600"
                alt="Meeting"
                className="w-55 h-75 object-cover rounded-3xl shadow-xl mt-16 hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p
              className={`max-w-xl leading-relaxed text-lg text-justify transition-all duration-700 delay-300 ${
                aboutVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }`}
            >
              PT. Surya Tamado Mandiri adalah salah satu perusahaan swasta
              nasional berbentuk perseroan terbatas yang bergerak di bidang jasa
              outsourcing atau alih daya manajemen sumber daya manusia.
              Didirikan tahun 2024, berdasarkan Akta Pendirian no. 06 tanggal 24
              Juni 2024. PT. Surya Tamado Mandiri Terus-menerus melakukan
              inovasi pelayanan untuk memperkuat posisi sebagai perusahaan jasa
              terbaik yang mengutamakan kualitas, demi kepuasan customernya.
            </p>
          </div>
        </div>
      </section>

      {/* Section Visi & Misi */}
      <section
        id="visi-misi"
        ref={visiMisiRef}
        className="py-16 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl md:text-4xl font-semibold text-center text-primary mb-12 transition-all duration-700 ${
              visiMisiVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            Visi & Misi
          </h2>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Vision */}
            <div
              className={`bg-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                visiMisiVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }`}
              style={{ transitionDelay: visiMisiVisible ? "200ms" : "0ms" }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-600 rounded-full p-3 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-600">VISI</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">
                Dengan Visi menjadi perusahaan yang selalu mengerti dan memahami
                kemauan dari para pelanggannya, maka PT. SURYA TAMADO MANDIRI
                memperkuat komunikasi dengan pelanggan dan selalu menjaga
                kualitas jasa yang diberikan.
              </p>
            </div>

            {/* Mission */}
            <div
              className={`bg-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                visiMisiVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }`}
              style={{ transitionDelay: visiMisiVisible ? "400ms" : "0ms" }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-600 rounded-full p-3 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-600">MISI</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">
                Misi dari PT. SURYA TAMADO MANDIRI adalah melakukan komunikasi
                yang baik dan berkesinambungan pada customer atau pemakai jasa
                untuk memperoleh hasil yang sesuai dengan apa yang mereka
                harapkan sehingga tercipta kepuasan pelanggan. Hal tersebut yang
                memotivasi PT. SURYA TAMADO MANDIRI untuk selalu menjaga
                kualitas yang diberikan kepada klien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Kebijakan Mutu */}
      <section
        id="kebijakan-mutu"
        ref={kebijakanRef}
        className="py-16 bg-gradient-to-br from-blue-50 to-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl md:text-4xl font-semibold text-center text-primary mb-4 transition-all duration-700 ${
              kebijakanVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            Kebijakan Mutu
          </h2>
          <p
            className={`text-center text-gray-600 mb-12 max-w-3xl mx-auto transition-all duration-700 delay-100 ${
              kebijakanVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            Komitmen kami dalam memberikan layanan terbaik kepada setiap
            pelanggan
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {policies.map((policy, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-300 hover:-translate-y-1 ${
                  kebijakanVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: kebijakanVisible
                    ? `${(index + 1) * 100}ms`
                    : "0ms",
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0 animate-bounce-slow">
                    {policy.icon}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{policy.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Kelebihan */}
      <section
        id="kelebihan"
        ref={kelebihanRef}
        className="py-16 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl md:text-4xl font-semibold text-center text-primary mb-4 transition-all duration-700 ${
              kelebihanVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            Kelebihan PT. Surya Tamado Mandiri
          </h2>
          <p
            className={`text-center text-gray-600 mb-12 max-w-3xl mx-auto transition-all duration-700 delay-100 ${
              kelebihanVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            Fasilitas dan keuntungan yang kami berikan untuk setiap pekerja
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-300 hover:-translate-y-2 hover:scale-105 ${
                  kelebihanVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: kelebihanVisible
                    ? `${(index + 1) * 100}ms`
                    : "0ms",
                }}
              >
                <div className="text-4xl mb-4 animate-bounce-slow">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  {benefit.title}
                </h3>
                {benefit.description && (
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {benefit.description}
                  </p>
                )}
                {benefit.items && (
                  <ul className="space-y-2">
                    {benefit.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-gray-700 text-sm flex items-start gap-2"
                      >
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
