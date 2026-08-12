import ScrollReveal from "./ScrollReveal";

const Newsletter = () => {
  return (
    <section className="newsletter-section py-5">
      <div className="container py-lg-5">

        <ScrollReveal>
          <div className="newsletter-card">

            <div>
              <span className="section-label text-white-50">
                STAY IN THE LOOP
              </span>

              <h2>
                Get the good
                <br />
                stuff first.
              </h2>

              <p>
                New arrivals, special offers and
                exclusive deals — straight to your inbox.
              </p>
            </div>

            <div className="newsletter-form">
              <input
                type="email"
                className="form-control"
                placeholder="Your email address"
              />

              <button className="btn btn-light">
                Subscribe
                <i className="bi bi-arrow-right ms-2" />
              </button>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default Newsletter;