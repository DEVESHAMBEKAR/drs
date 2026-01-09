import HeroSection from '../components/HeroSection';
import CollectionGrid from '../components/CollectionGrid';
import HomeStoriesSection from '../components/HomeStoriesSection';
import ProductPage from '../components/ProductPage';
import CorporateShowcase from '../components/CorporateShowcase';

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <CollectionGrid />
            <HomeStoriesSection />
            <ProductPage />
            <CorporateShowcase />
        </>
    );
};

export default HomePage;
