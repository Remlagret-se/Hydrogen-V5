'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectionStore, Product } from '~/lib/collectionStore';
import { ProductCard } from '../ui/ProductCard';
import { SearchBar } from '../ui/SearchBar';
import { CollectionFilters } from './CollectionFilters';
import { MobileFilters } from './MobileFilters';
import { Filter, ChevronDown, X } from 'lucide-react';
import { useSearchParams } from 'react-router';

// Exempel på filteralternativ
const categories = ['T-shirts', 'Hoodies', 'Byxor', 'Skor'];
const tags = ['Nyhet', 'Rea', 'Bestseller', 'Limited Edition'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Svart', 'Vit', 'Blå', 'Röd', 'Grön'];

// Exempel på produkter (ersätt med din egen data)
const exampleProducts: Product[] = [
  {
    id: '1',
    title: 'Basic T-shirt',
    description: 'En bekväm t-shirt i 100% bomull',
    price: 299,
    image: '/images/tshirt.jpg',
    category: 'T-shirts',
    tags: ['Nyhet', 'Bestseller'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Svart', 'Vit', 'Blå'],
    inStock: true,
    brand: 'Basic Brand',
    material: 'Bomull',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    title: 'Hoodie',
    description: 'En varm och bekväm hoodie',
    price: 599,
    image: '/images/hoodie.jpg',
    category: 'Hoodies',
    tags: ['Nyhet'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Svart', 'Grön'],
    inStock: true,
    brand: 'Premium Brand',
    material: 'Bomull/Polyester',
    rating: 4.8,
    reviews: 256,
  },
  {
    id: '3',
    title: 'Jeans',
    description: 'Klassiska jeans i stretch',
    price: 799,
    image: '/images/jeans.jpg',
    category: 'Byxor',
    tags: ['Bestseller'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Blå', 'Svart'],
    inStock: true,
    brand: 'Denim Co',
    material: 'Denim',
    rating: 4.3,
    reviews: 89,
  },
  {
    id: '4',
    title: 'Sneakers',
    description: 'Bekväma sneakers för vardag',
    price: 899,
    image: '/images/sneakers.jpg',
    category: 'Skor',
    tags: ['Nyhet', 'Limited Edition'],
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Vit', 'Svart'],
    inStock: true,
    brand: 'Shoe Brand',
    material: 'Läder',
    rating: 4.7,
    reviews: 167,
  },
];

export function CollectionGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const {
    products,
    filteredProducts,
    sortBy,
    setProducts,
    setSortBy,
    setSearchQuery,
    updateFiltersFromUrl,
    getFiltersAsUrlParams,
  } = useCollectionStore();

  // Uppdatera filter från URL vid första laddning
  useEffect(() => {
    updateFiltersFromUrl(searchParams);
  }, []);

  // Uppdatera URL när filter ändras
  useEffect(() => {
    const newParams = getFiltersAsUrlParams();
    setSearchParams(newParams);
  }, [filteredProducts, sortBy]);

  useEffect(() => {
    setProducts(exampleProducts);
  }, [setProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sökfält */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SearchBar onSearch={setSearchQuery} />
      </motion.div>

      <div className="flex gap-8">
        {/* Mobil filter-knapp */}
        <motion.div 
          className="lg:hidden mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </motion.div>

        {/* Filter */}
        <motion.div 
          className="hidden lg:block w-80 flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CollectionFilters />
        </motion.div>

        {/* Produktgrid */}
        <div className="flex-1">
          {/* Sortering */}
          <motion.div 
            className="flex justify-end mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <select
              className="px-4 py-2 border rounded-lg hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setSortBy(e.target.value as any)}
              value={sortBy}
            >
              <option value="newest">Senaste</option>
              <option value="price-asc">Pris: Lågt till högt</option>
              <option value="price-desc">Pris: Högt till lågt</option>
              <option value="rating">Bästa betyg</option>
              <option value="popular">Populärast</option>
            </select>
          </motion.div>

          {/* Produktgrid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  layout
                >
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    description={product.description}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Inga resultat */}
          <AnimatePresence>
            {filteredProducts.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-2">Inga produkter hittades</h3>
                <p className="text-gray-600">
                  Prova att ändra dina filter eller söktermer
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobil filter-meny */}
      <MobileFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
      />
    </motion.div>
  );
} 
