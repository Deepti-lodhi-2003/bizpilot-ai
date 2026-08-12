import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    text: "The shopping experience feels incredibly smooth. Everything is clean, simple and easy to find.",
    name: "Aarav Sharma",
    role: "Verified Customer",
  },
  {
    text: "Loved the product quality and how quickly my order arrived. Definitely coming back.",
    name: "Priya Verma",
    role: "Verified Customer",
  },
  {
    text: "Finally an online store that doesn't feel cluttered. The whole experience feels premium.",
    name: "Rohan Mehta",
    role: "Verified Customer",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonial-section py-5">
      <div className="container py-lg-5">

        <ScrollReveal>
          <div className="text-center mb-5">
            <span className="section-label">
              CUSTOMER LOVE
            </span>

            <h2 className="mt-2">
              What our customers
              <br />
              <span>say about us.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="row g-4">
          {testimonials.map((item, index) => (
            <div
              className="col-12 col-lg-4"
              key={item.name}
            >
              <ScrollReveal delay={index * 100}>
                <div className="testimonial-card">

                  <div className="stars">
                    ★★★★★
                  </div>

                  <p>
                    “{item.text}”
                  </p>

                  <div className="testimonial-user">
                    <div className="avatar">
                      {item.name.charAt(0)}
                    </div>

                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.role}</small>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;