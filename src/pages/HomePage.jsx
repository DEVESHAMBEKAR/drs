import HeroSection from '../components/HeroSection';
import CollectionGrid from '../components/CollectionGrid';
import HomeStoriesSection from '../components/HomeStoriesSection';
import CollectionsGrid from '../components/CollectionsGrid';

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <CollectionsGrid />
            <CollectionGrid />
            <HomeStoriesSection />
        </>
    );
};

export default HomePage;
