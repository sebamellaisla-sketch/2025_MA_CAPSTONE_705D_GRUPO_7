import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
// Importa tus imágenes desde /src/assets/catalogo/
import bordado1 from "../assets/catalogo/bordado1.jpg";
import bordado2 from "../assets/catalogo/bordado2.jpg";
import bordado3 from "../assets/catalogo/bordado3.jpg";
import bordado4 from "../assets/catalogo/bordado4.jpg";

export default function Categories() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const items = [
    { title: "Bordados Personalizados", image: bordado1, link: "/categorias/bordados-personalizados" },
    { title: "Uniformes & Ropa Laboral", image: bordado2, link: "/categorias/uniformes" },
    { title: "Regalos Bordados", image: bordado3, link: "/categorias/regalos" },
    { title: "Decoración Textil", image: bordado4, link: "/categorias/decoracion-textil" },
  ];


  return (
    <section className="py-12 bg-gray-100">
      <h2
        style={{ fontFamily: '"Playfair Display", serif' }}
        className="text-3xl text-center mb-8 text-gray-800 drop-shadow-sm"
      >
        Categorías
      </h2>
      <div className="max-w-6xl mx-auto px-4">
        <Slider {...settings}>
          {items.map((item, index) => (
            <div key={index} className="px-4">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="carousel-image"
                />
              </div>
              <h3
                style={{ fontFamily: '"Playfair Display", serif' }}
                className="text-xl text-center mt-4 text-gray-700 font-semibold"
              >
                <Link to={item.link} className="hover:text-blue-600 transition-colors">
                  {item.title}
                </Link>
              </h3>
            </div>

          ))}
        </Slider>
      </div>
    </section>
  );
}
