import HeroSection from '../components/HeroSection';
import CollectionGrid from '../components/CollectionGrid';
import HomeStoriesSection from '../components/HomeStoriesSection';
import ProductPage from '../components/ProductPage';

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <CollectionGrid />
            <HomeStoriesSection />
            <ProductPage />
        </>
    );
};

export default HomePage;
