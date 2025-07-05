import {motion} from 'framer-motion';
import {ShopifyImage} from './ShopifyImage';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface FeaturedCollectionCardProps {
  collection: Pick<
    Collection,
    'id' | 'title' | 'handle' | 'image' | 'description'
  >;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function FeaturedCollectionCard({
  collection,
  className = '',
  loading = 'lazy',
}: FeaturedCollectionCardProps) {
  return (
    <motion.div
      whileHover={{scale: 1.02}}
      whileTap={{scale: 0.98}}
      className={`group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <a href={`/collections/${collection.handle}`} className="block">
        <div className="aspect-[4/3] bg-gray-200 group-hover:opacity-95 transition-opacity">
          <ShopifyImage
            data={collection.image}
            loading={loading}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full"
            fallbackText="Collection"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-yellow-300 transition-colors">
            {collection.title}
          </h3>
          {collection.description && (
            <p className="text-sm text-gray-200 line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>
      </a>
    </motion.div>
  );
}
