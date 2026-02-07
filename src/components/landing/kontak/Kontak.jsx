import {
  Mail,
  User,
  Building2,
  MessageSquare,
  Send,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import api from "../../../services/api";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import { showError, succesError } from "../../../utils/notify";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    perusahaan: "",
    subjek: "",
    isi: "",
  });

  const companyInfo = {
    name: "PT Suryatama Domandiri",
    address:
      "Jalan Sultan Serdang Psr.8 Tanjung Morawa Deli Serdang, Sumatera Utara - Indonesia 20362",
    phone: "+62 895 1917 2315",
    whatsapp: "+62 812 6363 3179",
    email: "tamadomandiriptsurya@gmail.com",
    workingHours: "Senin - Jumat: 08.00 - 17.00 WIB",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.22499862203!2d98.78045890978748!3d3.5354595506432287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30313974b95a5daf%3A0xad09ed33c9c86b59!2sPT.%20SURYA%20TAMADO%20MANDIRI!5e0!3m2!1sen!2sid!4v1770404918571!5m2!1sen!2sid",
    socialMedia: {
      facebook: "https://facebook.com/suryatamadomandiri",
      instagram: "https://www.instagram.com/pt._surya_tamado_mandiri/",
      linkedin: "https://linkedin.com/company/suryatamadomandiri",
      twitter: "https://twitter.com/suryatamadom",
      youtube: "https://youtube.com/@suryatamadomandiri",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nama ||
      !formData.email ||
      !formData.subjek ||
      !formData.isi
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/kontak", formData);
      console.log(response.data);

      setFormData({
        nama: "",
        email: "",
        perusahaan: "",
        subjek: "",
        isi: "",
      });
      setSuccess(true);
      succesError("Pesan berhasil dikirim!");
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Gagal mengirim pesan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 bg-linear-to-br from-cyan-50 via-blue-50 to-purple-50 py-12 ">
        <div className="bg-linear-to-r from-cyan-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Hubungi Kami
              </h1>
              <p className="text-lg md:text-xl text-cyan-100">
                Kami siap membantu Anda. Jangan ragu untuk menghubungi kami
                melalui form atau informasi kontak di bawah ini.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informasi Kontak
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-100 p-3 rounded-lg">
                      <MapPin className="text-cyan-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Alamat
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {companyInfo.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Phone className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Telepon
                      </h3>
                      <a
                        href={`tel:${companyInfo.phone}`}
                        className="text-cyan-600 hover:text-cyan-700 text-sm block"
                      >
                        {companyInfo.phone}
                      </a>
                      <a
                        href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 text-sm block mt-1"
                      >
                        WhatsApp: {companyInfo.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h3>
                      <a
                        href={`mailto:${companyInfo.email}`}
                        className="text-cyan-600 hover:text-cyan-700 text-sm"
                      >
                        {companyInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Clock className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Jam Operasional
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {companyInfo.workingHours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Ikuti Kami
                </h2>
                <div className="flex items-center justify-around gap-3">
                  <a
                    href={companyInfo.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    title="Facebook"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href={companyInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    title="Instagram"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href={companyInfo.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    title="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href={companyInfo.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    title="Twitter"
                  >
                    <Twitter size={24} />
                  </a>
                  <a
                    href={companyInfo.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    title="YouTube"
                  >
                    <Youtube size={24} />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <iframe
                  src={companyInfo.mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                  className="w-full"
                ></iframe>
              </div>
            </div>

            <div className="lg:col-span-2">
              {success && (
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-md animate-fade-in">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold">Pesan berhasil dikirim!</p>
                      <p className="text-sm">
                        Tim kami akan segera menghubungi Anda.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Kirim Pesan
                  </h2>
                  <p className="text-gray-600">
                    Isi form di bawah ini dan kami akan merespons secepat
                    mungkin
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          disabled={loading}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@email.com"
                          required
                          disabled={loading}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Perusahaan (Opsional)
                    </label>
                    <div className="relative">
                      <Building2
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="perusahaan"
                        value={formData.perusahaan}
                        onChange={handleChange}
                        placeholder="PT Nama Perusahaan"
                        disabled={loading}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subjek <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="subjek"
                        value={formData.subjek}
                        onChange={handleChange}
                        placeholder="Perihal pesan Anda"
                        required
                        disabled={loading}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="isi"
                      value={formData.isi}
                      onChange={handleChange}
                      placeholder="Tuliskan pesan Anda di sini..."
                      required
                      disabled={loading}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <ClipLoader color="#ffffff" size={20} />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
