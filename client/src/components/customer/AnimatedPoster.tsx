import { useEffect, useRef, useState } from "react";

interface AnimatedPosterProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  dark?: boolean;
}

const AnimatedPoster = ({
  eyebrow,
  title,
  description,
  image,
  buttonText,
  buttonLink,
  dark = false,
}: AnimatedPosterProps) => {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (posterRef.current) {
      observer.observe(posterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-5">
      <div className="container py-3">
        <div
          ref={posterRef}
          className={`rounded-5 overflow-hidden shadow-lg ${
            visible ? "poster-visible" : ""
          }`}
          style={{
            backgroundColor: dark ? "#1f2428" : "#eef1f3",
            color: dark ? "#fff" : "#1f2428",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0)"
              : "translateY(70px)",
            transition:
              "opacity .8s ease, transform .8s ease",
          }}
        >
          <div className="row align-items-center g-0">
            <div className="col-lg-6">
              <div className="p-4 p-md-5">
                <span
                  className="text-uppercase small fw-semibold"
                  style={{
                    letterSpacing: "2px",
                    opacity: 0.65,
                  }}
                >
                  {eyebrow}
                </span>

                <h2 className="display-6 fw-bold mt-2 mb-3">
                  {title}
                </h2>

                <p
                  className="mb-4"
                  style={{
                    color: dark ? "#adb5bd" : "#6c757d",
                    maxWidth: "500px",
                  }}
                >
                  {description}
                </p>

                {buttonText && buttonLink && (
                  <a
                    href={buttonLink}
                    className={`btn ${
                      dark
                        ? "btn-light"
                        : "btn-dark"
                    } px-4 py-2 rounded-3`}
                  >
                    {buttonText}
                    <i className="bi bi-arrow-right ms-2" />
                  </a>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div
                style={{
                  height: "360px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-100 h-100 poster-image"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .poster-image {
            transition: transform 1s ease;
          }

          .poster-visible .poster-image {
            transform: scale(1.02);
          }

          .poster-image:hover {
            transform: scale(1.07);
          }
        `}
      </style>
    </section>
  );
};

export default AnimatedPoster;