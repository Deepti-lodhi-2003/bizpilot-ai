import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const PromoSection = () => {
  return (
    <section className="promo-section py-5">
      <div className="container py-lg-5">

        <ScrollReveal>
          <div className="promo-card">

            <div className="promo-content">
              <span className="section-label text-white-50">
                LIMITED TIME
              </span>

              <h2>
                Upgrade your
                <br />
                everyday.
              </h2>

              <p>
                Discover selected products with
                exclusive prices available for a
                limited time.
              </p>

              <Link
                to="/shop"
                className="btn btn-light rounded-pill px-4"
              >
                Explore Deals
                <i className="bi bi-arrow-up-right ms-2" />
              </Link>
            </div>

            <div className="promo-image">
              <img
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=85"
                alt="Premium products"
              />
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default PromoSection;