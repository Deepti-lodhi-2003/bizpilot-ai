import Hero from "../components/customer/Hero";
import AnimatedPoster from "../components/customer/AnimatedPoster";
import CategorySection from "../components/customer/CategorySection";
import FeaturedProducts from "../components/customer/FeaturedProducts";

const Home = () => {
  return (
    <div>

      {/* Hero */}
      <Hero />

       {/* Poster */}
      <AnimatedPoster
        eyebrow="Your Orders"
        title="Keep your shopping journey organized."
        description="Track your orders and stay updated with every stage of your purchase."
        image="https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=1400&q=80"
        buttonText="View Orders"
        buttonLink="/orders"
        dark
      />

      {/* Categories */}
      <CategorySection />

      {/* Poster */}
      <AnimatedPoster
        eyebrow="Explore"
        title="Find what you're looking for."
        description="Browse products by category and discover products that fit your needs."
        image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
        buttonText="Explore Shop"
        buttonLink="/shop"
      />

      {/* Products */}
      <FeaturedProducts />

     

      {/* Cart / Shopping */}
      <AnimatedPoster
        eyebrow="Simple Shopping"
        title="Add products. Review your cart. Checkout."
        description="Everything you need for a smooth shopping experience is available in one place."
        image="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80"
        buttonText="Go to Cart"
        buttonLink="/cart"
      />

    </div>
  );
};

export default Home;