import { FaInstagram, FaWhatsapp, FaTiktok, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const handleInstagramClick = () => {
    const instagramUrl = "https://www.instagram.com/pancho.ing?igsh=MWRpNTZxNzJ2cmZrbw==";
    window.open(instagramUrl, '_blank');
  };

  const handleFacebookClick = () => {
    const facebookUrl = "https://www.facebook.com/share/1G3PLmwCSM/?mibextid=wwXIfr";
    window.open(facebookUrl, '_blank');
  };

  const handleTikTokClick = () => {
    const tiktokUrl = "https://www.tiktok.com/@panchoeling?_t=ZM-8zX8oQLPUNp&_r=1";
    window.open(tiktokUrl, '_blank');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "56945432006";
    const message = "Hola, me interesa conocer más sobre sus servicios de bordado.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer 
      className="text-gray-300 border-t-2 border-[#facc15] footer-appear" 
      style={{
        background: "linear-gradient(180deg, #000 0%, #111 50%, #000 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Columna 1 */}
          <div>
            <h2 className="text-xl font-bold footer-title">Bordados Testheb</h2>
            <p className="mt-4 text-sm">
              Calidad y precisión en cada puntada.  
              Bordados y confección con sello chileno.
            </p>
          </div>
          
          {/* Columna 2 */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contacto
            </h3>
            <p className="text-sm">Tel: +56 9 4543 2006</p>
            <p className="text-sm">Email: contacto@bordadostestheb.cl</p>
            <p className="text-sm">Maipú, Santiago - Chile</p>
            <div className="footer-icons">
              <button 
                onClick={handleInstagramClick}
                aria-label="Instagram"
                className="border-none bg-transparent p-0 cursor-pointer"
              >
                <FaInstagram className="w-16 h-16 text-white hover:scale-120 hover:rotate-5 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </button>
              
              <button 
                onClick={handleFacebookClick}
                aria-label="Facebook"
                className="border-none bg-transparent p-0 cursor-pointer"
              >
                <FaFacebook className="w-16 h-16 text-white hover:scale-120 hover:rotate-5 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </button>
              
              <button 
                onClick={handleTikTokClick}
                aria-label="TikTok"
                className="border-none bg-transparent p-0 cursor-pointer"
              >
                <FaTiktok className="w-16 h-16 text-white hover:scale-120 hover:rotate-5 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </button>
              
              <button 
                onClick={handleWhatsAppClick}
                aria-label="WhatsApp"
                className="border-none bg-transparent p-0 cursor-pointer"
              >
                <FaWhatsapp className="w-16 h-16 text-white hover:scale-120 hover:rotate-5 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Bordados Testheb. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
}