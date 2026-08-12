import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const categories = [
  {
    name: "Electronics",
    description: "Smart tech for modern living",
    icon: "bi-cpu",
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Accessories",
    description: "Small details. Big difference.",
    icon: "bi-watch",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Lifestyle",
    description: "Things that make life better",
    icon: "bi-house-heart",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Essentials",
    description: "Everyday products, elevated",
    icon: "bi-bag-heart",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=85",
  },
];

const CategorySection = () => {
  return (
    <section className="category-section py-5 bg-dark">
      <div className="container py-lg-5">

        <ScrollReveal>
          <div className="section-heading mb-4 mb-lg-5">
            <div>
              <span className="section-label">
                SHOP BY CATEGORY
              </span>

              <h2 className="text-light">
                Find what fits
                <br />
                <span>your lifestyle.</span>
              </h2>
            </div>

            <Link
              to="/shop"
              className="btn btn-outline-light rounded-pill px-4 "
            >
              View all
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="row g-4">
          {categories.map((category, index) => (
            <div
              className="col-12 col-sm-6 col-lg-3"
              key={category.name}
            >
              <ScrollReveal delay={index * 100}>
                <Link
                  to="/shop"
                  className="category-card"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                  />

                  <div className="category-overlay" />

                  <div className="category-content">
                    <div className="category-icon">
                      <i className={`bi ${category.icon}`} />
                    </div>

                    <div>
                      <h5>{category.name}</h5>
                      <p>{category.description}</p>
                    </div>

                    <span className="category-arrow">
                      <i className="bi bi-arrow-up-right" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          ))}
        </div>

      </div>

      <style>
        {`
          .category-card {
            position: relative;
          }
          .category-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at 50% 40%,
              rgba(255, 255, 255, 0.22),
              transparent 65%
            );
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none;
          }
          .category-card:hover::after {
            opacity: 1;
          }

          @media (prefers-reduced-motion: reduce) {
            .category-card::after {
              transition: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default CategorySection;