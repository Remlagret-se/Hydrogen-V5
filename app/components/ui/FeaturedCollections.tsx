import {Link} from 'react-router';

interface Collection {
  id: string;
  title: string;
  handle: string;
  image: {
    url: string;
    altText: string;
  };
}

interface FeaturedCollectionsProps {
  collections: Collection[];
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
            <div
              key={collection.id}
            >
              <Link
                to={`/collections/${collection.handle}`}
                className="block group"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  {collection.image ? (
                    <>
                      <img
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center px-4">
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
