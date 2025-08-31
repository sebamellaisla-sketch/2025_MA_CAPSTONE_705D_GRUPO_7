import instagramIcon from "../assets/icons/instagram.png";
import whatsappIcon from "../assets/icons/whatsapp.png";

export default function Footer() {
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
              Enlaces
            </h3>
            <ul className="space-y-2">
              {["Inicio", "Productos", "Servicio de Bordado", "Confección", "Cotizar"].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="footer-link">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contacto
            </h3>
            <p className="text-sm">Tel: +56 9 3379 7489</p>
            <p className="text-sm">Email: contacto@bordadostestheb.cl</p>
            <p className="text-sm">Maipú, Santiago - Chile</p>
            <div className="footer-icons">
              <a href="#" aria-label="Instagram">
                <img src={instagramIcon} alt="Instagram" className="footer-icon-img" />
              </a>
              <a href="#" aria-label="WhatsApp">
                <img src={whatsappIcon} alt="WhatsApp" className="footer-icon-img" />
              </a>
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