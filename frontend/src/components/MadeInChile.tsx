import {
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";

export default function MadeInChile() {
  return (
    <section id="made-in-chile" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Hecho con Orgullo en Chile
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
            Cada prenda que sale de nuestro taller es el resultado de un proceso meticuloso, 
            donde la calidad no es una opción: es el estándar. Desde el primer hilo hasta el último detalle, 
            trabajamos con precisión, pasión y compromiso. Nuestro equipo combina experiencia artesanal 
            con tecnología avanzada para lograr bordados que no solo se ven bien, sino que resisten el uso diario 
            y conservan su elegancia con el tiempo. Cada diseño es tratado como único, y cada cliente como parte 
            de nuestra historia. Porque en Bordados Testbeb, no entregamos productos: entregamos confianza, 
            identidad y excelencia hecha en Chile.
        </p>

        {/* Bloque de calidad */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center group">
            <CheckCircleIcon className="icon text-violet-500 mb-2" />
            <h3 className="text-base font-semibold text-gray-800">Control de Calidad</h3>
            <p className="text-sm text-gray-600 mt-1">
              Cada pieza es revisada manualmente para asegurar precisión y durabilidad.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <SparklesIcon className="icon text-violet-500 mb-2" />
            <h3 className="text-base font-semibold text-gray-800">Bordado de Alta Precisión</h3>
            <p className="text-sm text-gray-600 mt-1">
              Tecnología avanzada para resultados nítidos y profesionales.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <ShieldCheckIcon className="icon text-violet-500 mb-2" />
            <h3 className="text-base font-semibold text-gray-800">Garantía de Satisfacción</h3>
            <p className="text-sm text-gray-600 mt-1">
              Comprometidos con tu confianza. Si no te encanta, lo resolvemos.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <GlobeAltIcon className="icon text-violet-500 mb-2" />
            <h3 className="text-base font-semibold text-gray-800">Producción Local</h3>
            <p className="text-sm text-gray-600 mt-1">
              Hecho en Chile, apoyando talento nacional y procesos responsables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
