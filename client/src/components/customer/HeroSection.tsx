import { Link } from "react-router-dom";

const slides = [
  {
    eyebrow: "NEW SEASON",
    title: "Everything you need.",
    highlight: "One beautiful place.",
    description:
      "Discover premium products, exclusive deals and a shopping experience designed around you.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85",
  },
  {
    eyebrow: "SMART SHOPPING",
    title: "Upgrade your",
    highlight: "everyday lifestyle.",
    description:
      "From modern technology to everyday essentials, find products worth bringing home.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=85",
  },
  {
    eyebrow: "LIMITED COLLECTION",
    title: "Premium products.",
    highlight: "Better prices.",
    description:
      "Explore our curated collection and discover something made for your lifestyle.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85",
  },
];

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div
        id="homeHero"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#homeHero"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              className={`carousel-item ${
                index === 0 ? "active" : ""
              }`}
              key={slide.title}
            >
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `linear-gradient(
                    90deg,
                    rgba(10,12,15,0.96) 0%,
                    rgba(10,12,15,0.82) 42%,
                    rgba(10,12,15,0.25) 100%
                  ), url("${slide.image}")`,
                }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7">
                      <div className="hero-content">
                        <span className="hero-eyebrow">
                          {slide.eyebrow}
                        </span>

                        <h1>
                          {slide.title}
                          <br />
                          <span>{slide.highlight}</span>
                        </h1>

                        <p>{slide.description}</p>

                        <div className="d-flex flex-wrap gap-3 mt-4">
                          <Link
                            to="/shop"
                            className="btn btn-light btn-lg px-4 rounded-pill"
                          >
                            Shop Collection
                            <i className="bi bi-arrow-up-right ms-2" />
                          </Link>

                          <Link
                            to="/shop"
                            className="btn btn-outline-light btn-lg px-4 rounded-pill"
                          >
                            Explore
                          </Link>
                        </div>

                        <div className="hero-trust mt-5">
                          <div>
                            <strong>500+</strong>
                            <span>Products</span>
                          </div>

                          <div>
                            <strong>4.9</strong>
                            <span>Customer Rating</span>
                          </div>

                          <div>
                            <strong>24/7</strong>
                            <span>Support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeHero"
          data-bs-slide="prev"
        >
          <span className="hero-control">
            <i className="bi bi-arrow-left" />
          </span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeHero"
          data-bs-slide="next"
        >
          <span className="hero-control">
            <i className="bi bi-arrow-right" />
          </span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;