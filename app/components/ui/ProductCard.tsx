'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';
import { useCartStore } from '~/lib/cartStore';

interface ProductCardProps {
  product: {
  id: string;
  title: string;
    price: string;
    image: string;
    description?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <OptimizedImage
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover"
        />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        {product.description && (
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        )}
        <p className="text-gray-800 font-bold mt-2">{product.price}</p>
        <motion.button
          whileHover={{ backgroundColor: '#4F46E5' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart({
            id: product.id,
            title: product.title,
            price: parseFloat(product.price.replace(/[^0-9.-]+/g, '')),
            quantity: 1
          })}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded transition-colors"
        >
          Lägg i varukorg
        </motion.button>
      </div>
    </motion.div>
  );
} 
