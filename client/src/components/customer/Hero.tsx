import { useEffect, useRef, useState } from "react";

const slides = [
  {
    title: "Everything you need.",
    highlight: "All in one place.",
    description:
      "Discover quality products and manage your shopping experience with BizPilot.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Shop smarter.",
    highlight: "Live better.",
    description:
      "Explore products, manage your cart and keep track of your orders effortlessly.",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Your shopping.",
    highlight: "Simplified.",
    description:
      "A clean and modern shopping experience designed around you.",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1800&q=85",
  },
];

const SLIDE_DURATION = 5000;

/** Splits text into words, each wrapped in a mask so it can slide up into view. */
const RevealWords = ({
  text,
  startDelay = 0,
  className = "",
}: {
  text: string;
  startDelay?: number;
  className?: string;
}) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span className="hero-word-mask" key={`${word}-${i}`}>
          <span
            className={`hero-word-inner ${className}`}
            style={{ animationDelay: `${startDelay + i * 70}ms` }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </>
  );
};

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1
      );
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [activeSlide]);

  const slide = slides[activeSlide];

  // cursor-follow spotlight — driven via CSS vars on the ref, no re-renders
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
    el.style.setProperty("--spot-opacity", "1");
  };

  const handleMouseLeave = () => {
    sectionRef.current?.style.setProperty("--spot-opacity", "0");
  };

  // magnetic pull on the buttons
  const handleBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.22}px, ${relY * 0.3 - 3}px)`;
  };

  const handleBtnLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translate(0, 0)";
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section position-relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layers — crossfaded, not remounted, so the swap is smooth */}
      <div className="hero-background-wrap position-absolute top-0 start-0 w-100 h-100">
        {slides.map((s, index) => (
          <div
            key={s.image}
            className={`hero-bg-layer position-absolute top-0 start-0 w-100 h-100 ${
              index === activeSlide ? "is-active" : ""
            }`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100" />
      <div className="hero-vignette position-absolute bottom-0 start-0 w-100" />
      <div className="hero-spotlight position-absolute top-0 start-0 w-100 h-100" />
      <div className="hero-grain position-absolute top-0 start-0 w-100 h-100" />

      {/* Content */}
      <div className="container position-relative h-100">
        <div className="row h-100 align-items-center">
          <div className="col-12 col-lg-7">
            <div key={activeSlide} className="hero-content">
              {/* Badge */}
              <span className="badge rounded-pill hero-badge">
                <i className="bi bi-stars me-2" />
                Welcome to BizPilot
                <span className="hero-badge-shine" />
              </span>

              {/* Heading */}
              <h1 className="hero-title fw-bold text-white">
                <RevealWords text={slide.title} startDelay={80} />
                <br />
                <RevealWords
                  text={slide.highlight}
                  startDelay={80 + slide.title.split(" ").length * 70 + 60}
                  className="hero-highlight"
                />
              </h1>

              {/* Description */}
              <p className="hero-description text-white-50">
                {slide.description}
              </p>

              {/* Buttons */}
              <div className="d-flex flex-wrap hero-buttons">
                <a
                  href="/shop"
                  className="btn btn-light fw-semibold rounded-3 hero-btn-primary hero-btn-pop"
                  onMouseMove={handleBtnMove}
                  onMouseLeave={handleBtnLeave}
                >
                  <span className="hero-btn-shine" />
                  Shop Now
                  <i className="bi bi-arrow-right ms-2 hero-btn-arrow" />
                </a>

                <a
                  href="/orders"
                  className="btn btn-outline-light rounded-3 hero-btn-outline hero-btn-pop hero-btn-pop-2"
                  onMouseMove={handleBtnMove}
                  onMouseLeave={handleBtnLeave}
                >
                  My Orders
                </a>
              </div>

              {/* Slider Dots with story-style progress fill */}
              <div className="hero-dots d-flex align-items-center">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                    className={`hero-dot border-0 p-0 ${
                      index === activeSlide ? "is-active" : ""
                    }`}
                  >
                    {index === activeSlide && (
                      <span
                        key={activeSlide}
                        className="hero-dot-progress"
                        style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue position-absolute start-50 translate-middle-x d-none d-md-flex flex-column align-items-center text-white-50">
        <span className="small mb-1">Scroll</span>
        <i className="bi bi-chevron-down" />
      </div>

      <style>
        {`
          /* ==============================
             MAIN HERO
          ============================== */

          .hero-section {
            min-height: 100vh;
            height: auto;
            display: flex;
            align-items: center;
            --spot-x: 50%;
            --spot-y: 50%;
            --spot-opacity: 0;
          }

          .hero-background-wrap {
            background-color: #0c0c0c;
          }

          .hero-bg-layer {
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0;
            transform: scale(1);
            transition: opacity 1.1s ease;
            will-change: opacity, transform;
          }

          .hero-bg-layer.is-active {
            opacity: 1;
            animation: heroKenBurns 9s ease-in-out infinite alternate;
          }

          .hero-overlay {
            background:
              linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.84) 0%,
                rgba(0, 0, 0, 0.62) 45%,
                rgba(0, 0, 0, 0.25) 100%
              );
          }

          .hero-vignette {
            height: 140px;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent);
            pointer-events: none;
          }

          /* soft light that follows the cursor */
          .hero-spotlight {
            background: radial-gradient(
              420px circle at var(--spot-x) var(--spot-y),
              rgba(255, 255, 255, 0.12),
              transparent 60%
            );
            opacity: var(--spot-opacity);
            transition: opacity 0.4s ease;
            pointer-events: none;
            mix-blend-mode: overlay;
          }

          /* very subtle film grain so the image doesn't feel flat */
          .hero-grain {
            opacity: 0.05;
            pointer-events: none;
            mix-blend-mode: overlay;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          }

          .hero-content {
            padding-top: 45px;
            padding-bottom: 45px;
          }

          /* ==============================
             BADGE
          ============================== */

          .hero-badge {
            position: relative;
            display: inline-block;
            overflow: hidden;
            background: #fff;
            color: #1f2428;
            padding: 10px 18px;
            font-size: 14px;
            margin-bottom: 15px;
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
            animation: heroBadgePulse 2.6s ease-out infinite, heroContentFade 0.6s ease both;
          }

          .hero-badge-shine {
            position: absolute;
            top: 0;
            left: -60%;
            width: 40%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(31, 36, 40, 0.18), transparent);
            animation: heroBadgeShine 3.2s ease-in-out infinite;
          }

          /* ==============================
             TITLE / WORD REVEAL
          ============================== */

          .hero-title {
            font-size: clamp(2.4rem, 4.5vw, 4rem);
            line-height: 1.08;
            margin-bottom: 15px;
          }

          .hero-word-mask {
            display: inline-block;
            overflow: hidden;
            vertical-align: top;
          }

          .hero-word-inner {
            display: inline-block;
            transform: translateY(115%);
            animation: heroWordUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .hero-highlight {
            background: linear-gradient(
              100deg,
              rgba(255, 255, 255, 0.55) 0%,
              #fff 35%,
              rgba(255, 255, 255, 0.55) 60%
            );
            background-size: 220% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation:
              heroWordUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both,
              heroShimmer 4.5s ease-in-out 1.2s infinite;
          }

          /* ==============================
             DESCRIPTION
          ============================== */

          .hero-description {
            max-width: 540px;
            font-size: clamp(0.9rem, 1.25vw, 1.1rem);
            line-height: 1.45;
            margin-bottom: 30px;
            animation: heroContentFade 0.7s ease 0.35s both;
          }

          /* ==============================
             BUTTONS
          ============================== */

          .hero-buttons {
            gap: 14px;
            margin-bottom: 28px;
            animation: heroContentFade 0.7s ease 0.5s both;
          }

          .hero-buttons .btn {
            padding: 15px 30px;
            font-size: 1.05rem;
            position: relative;
            overflow: hidden;
            transition: transform 0.15s ease-out, box-shadow 0.25s ease, background-color 0.25s ease, color 0.25s ease;
          }

          .hero-btn-pop {
            animation: heroBtnPop 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
          }

          .hero-btn-pop-2 {
            animation-delay: 0.68s;
          }

          .hero-btn-shine {
            position: absolute;
            top: 0;
            left: -60%;
            width: 35%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(31, 36, 40, 0.16), transparent);
            animation: heroBadgeShine 3.6s ease-in-out 1.4s infinite;
            pointer-events: none;
          }

          .hero-btn-arrow {
            display: inline-block;
            animation: heroArrowNudge 1.6s ease-in-out 1.4s infinite;
          }

          .hero-btn-primary:hover,
          .hero-btn-primary:focus-visible {
            box-shadow: 0 14px 28px -10px rgba(255, 255, 255, 0.35);
            color: #1f2428;
          }

          .hero-btn-outline:hover,
          .hero-btn-outline:focus-visible {
            background-color: rgba(255, 255, 255, 0.12);
            box-shadow: 0 14px 28px -14px rgba(0, 0, 0, 0.5);
          }

          /* ==============================
             DOTS + PROGRESS
          ============================== */

          .hero-dots {
            gap: 8px;
            margin-top: 34px;
            animation: heroContentFade 0.7s ease 0.6s both;
          }

          .hero-dot {
            position: relative;
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background-color: rgba(255, 255, 255, 0.35);
            overflow: hidden;
            transition: width 0.35s ease, background-color 0.25s ease;
            cursor: pointer;
          }

          .hero-dot:hover {
            background-color: rgba(255, 255, 255, 0.55);
          }

          .hero-dot.is-active {
            width: 44px;
            background-color: rgba(255, 255, 255, 0.3);
          }

          .hero-dot-progress {
            position: absolute;
            inset: 0;
            background: #fff;
            transform-origin: left center;
            transform: scaleX(0);
            animation-name: heroDotProgress;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
          }

          @keyframes heroDotProgress {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }

          /* ==============================
             SCROLL CUE
          ============================== */

          .hero-scroll-cue {
            bottom: 22px;
            z-index: 2;
            animation: heroScrollBounce 2s ease-in-out infinite;
          }

          .hero-scroll-cue .small {
            font-size: 0.72rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          @media (prefers-reduced-motion: reduce) {
            .hero-bg-layer.is-active,
            .hero-badge,
            .hero-badge-shine,
            .hero-scroll-cue,
            .hero-word-inner,
            .hero-highlight,
            .hero-description,
            .hero-buttons,
            .hero-dots,
            .hero-btn-pop,
            .hero-btn-shine,
            .hero-btn-arrow {
              animation: none !important;
              transform: none !important;
              opacity: 1 !important;
            }
            .hero-spotlight { display: none; }
          }

          /* ==============================
             SMALL HEIGHT DESKTOP
          ============================== */

          @media (max-height: 750px) and (min-width: 992px) {

            .hero-content {
              padding-top: 25px;
              padding-bottom: 25px;
            }

            .hero-badge {
              padding: 7px 15px;
              font-size: 12px;
              margin-bottom: 10px;
            }

            .hero-title {
              font-size: 2.8rem;
              margin-bottom: 10px;
            }

            .hero-description {
              font-size: 0.85rem;
              line-height: 1.35;
              margin-bottom: 22px;
              max-width: 480px;
            }

            .hero-buttons {
              gap: 10px;
              margin-bottom: 18px;
            }

            .hero-buttons .btn {
              padding: 12px 24px;
              font-size: 0.95rem;
            }

            .hero-dots {
              margin-top: 22px;
            }

            .hero-scroll-cue {
              display: none !important;
            }
          }

          /* ==============================
             TABLET
          ============================== */

          @media (max-width: 991px) {

            .hero-section {
              min-height: 100vh;
            }

            .hero-content {
              padding-top: 55px;
              padding-bottom: 55px;
            }

            .hero-title {
              font-size: clamp(2.3rem, 7vw, 3.4rem);
            }

            .hero-description {
              max-width: 500px;
            }

          }

          /* ==============================
             MOBILE
          ============================== */

          @media (max-width: 575px) {

            .hero-section {
              min-height: 100vh;
            }

            .hero-overlay {
              background:
                linear-gradient(
                  90deg,
                  rgba(0, 0, 0, 0.84),
                  rgba(0, 0, 0, 0.60)
                );
            }

            .hero-content {
              padding-top: 35px;
              padding-bottom: 35px;
            }

            .hero-badge {
              padding: 7px 13px;
              font-size: 11px;
              margin-bottom: 10px;
            }

            .hero-title {
              font-size: 2rem;
              line-height: 1.08;
              margin-bottom: 10px;
            }

            .hero-description {
              font-size: 0.82rem;
              line-height: 1.4;
              margin-bottom: 20px;
            }

            .hero-buttons {
              gap: 10px;
              margin-bottom: 16px;
            }

            .hero-buttons .btn {
              padding: 11px 20px;
              font-size: 0.9rem;
            }

            .hero-dots {
              margin-top: 26px;
              gap: 7px;
            }
          }

          /* ==============================
             VERY SMALL SCREEN
          ============================== */

          @media (max-width: 375px), (max-height: 650px) {

            .hero-content {
              padding-top: 22px;
              padding-bottom: 22px;
            }

            .hero-badge {
              margin-bottom: 7px;
              padding: 5px 11px;
              font-size: 10px;
            }

            .hero-title {
              font-size: 1.7rem;
              margin-bottom: 7px;
            }

            .hero-description {
              font-size: 0.74rem;
              line-height: 1.3;
              margin-bottom: 14px;
            }

            .hero-buttons {
              gap: 8px;
              margin-bottom: 12px;
            }

            .hero-buttons .btn {
              padding: 9px 18px;
              font-size: 0.82rem;
            }

            .hero-dots {
              margin-top: 18px;
            }
          }

          /* ==============================
             ANIMATION
          ============================== */

          @keyframes heroKenBurns {
            from { transform: scale(1); }
            to { transform: scale(1.08); }
          }

          @keyframes heroContentFade {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes heroWordUp {
            from { transform: translateY(115%); }
            to { transform: translateY(0); }
          }

          @keyframes heroBtnPop {
            0% { opacity: 0; transform: scale(0.85) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }

          @keyframes heroArrowNudge {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }

          @keyframes heroShimmer {
            0% { background-position: 120% 0; }
            60% { background-position: -20% 0; }
            100% { background-position: -20% 0; }
          }

          @keyframes heroBadgePulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35); }
            70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
          }

          @keyframes heroBadgeShine {
            0% { left: -60%; }
            100% { left: 130%; }
          }

          @keyframes heroScrollBounce {
            0%, 100% { transform: translate(-50%, 0); opacity: 0.6; }
            50% { transform: translate(-50%, 6px); opacity: 1; }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;