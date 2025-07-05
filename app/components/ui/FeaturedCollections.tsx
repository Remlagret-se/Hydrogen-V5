import {Link} from '@remix-run/react';
import {ShopifyImage} from './ShopifyImage';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface FeaturedCollectionsProps {
  collections: Pick<Collection, 'id' | 'title' | 'handle' | 'image'>[];
  title?: string;
}

export function FeaturedCollections({
  collections,
  title = 'Utvalda kollektioner',
}: FeaturedCollectionsProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <div key={collection.id} className="group">
              <Link to={`/collections/${collection.handle}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-200">
                  <ShopifyImage
                    data={collection.image}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                    fallbackText=""
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center px-4 drop-shadow-lg">
                      {collection.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

