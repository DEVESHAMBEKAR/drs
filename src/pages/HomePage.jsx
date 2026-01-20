import HeroSection from '../components/HeroSection';
import SplitHero from '../components/SplitHero'; // NEW: Deeproot Split Hero
import CollectionGrid from '../components/CollectionGrid';
import HomeStoriesSection from '../components/HomeStoriesSection';
import CollectionsGrid from '../components/CollectionsGrid';

const HomePage = () => {
    return (
        <>
            {/* OLD: Original Hero Section (preserved for rollback)
            <HeroSection />
            */}

            {/* NEW: Deeproot Split Hero - 50/50 Acrylic vs Wood */}
            <SplitHero />

            <CollectionsGrid />
            <CollectionGrid />
            <HomeStoriesSection />
        </>
    );
};

export default HomePage;
