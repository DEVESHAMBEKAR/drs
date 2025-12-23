import Header from './components/Header'
import HeroSection from './components/HeroSection'
import CollectionGrid from './components/CollectionGrid'
import ProductPage from './components/ProductPage'
import CartDrawer from './components/CartDrawer'

function App() {
    return (
        <div className="min-h-screen">
            <Header />
            <HeroSection />
            <CollectionGrid />
            <ProductPage />
            <CartDrawer />
        </div>
    )
}

export default App
