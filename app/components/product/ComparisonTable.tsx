import {useState, useEffect} from 'react';
import {Link} from '@remix-run/react';
import {ProductComparisonService} from '~/lib/product/comparison';
import {Money} from '@shopify/hydrogen';

export function ComparisonTable() {
  const [products, setProducts] = useState<Array<{
    id: string;
    handle: string;
    title: string;
    price: string;
    compareAtPrice?: string;
    imageSrc: string;
    variants: Array<{
      id: string;
      title: string;
      price: string;
      compareAtPrice?: string;
      available: boolean;
    }>;
    description: string;
    features: Record<string, string | number | boolean>;
  }>>([]);
  const [commonFeatures, setCommonFeatures] = useState<string[]>([]);

  const comparisonService = ProductComparisonService.getInstance();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const comparedProducts = comparisonService.getComparedProducts();
    setProducts(comparedProducts);
    setCommonFeatures(comparisonService.getCommonFeatures(comparedProducts));
  };

  const handleRemoveProduct = async (productId: string) => {
    await comparisonService.removeFromComparison(productId);
    loadProducts();
  };

  const handleClearAll = () => {
    comparisonService.clearComparison();
    loadProducts();
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Inga produkter att jämföra</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Jämför produkter ({products.length})
        </h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Rensa alla
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-4 pr-4 font-medium text-gray-900 min-w-[200px]">
                Produkt
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="p-4 font-medium text-gray-900 min-w-[250px]"
                >
                  <div className="relative">
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="absolute -top-2 -right-2 p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Ta bort från jämförelse"
                    >
                      <CloseIcon className="h-5 w-5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            {/* Produktbild och titel */}
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-900">Bild</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <Link
                    to={`/products/${product.handle}`}
                    className="block aspect-square overflow-hidden rounded-lg border hover:border-primary"
                  >
                    <img
                      src={product.imageSrc}
                      alt={product.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-900">Namn</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <Link
                    to={`/products/${product.handle}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary"
                  >
                    {product.title}
                  </Link>
                </td>
              ))}
            </tr>

            {/* Pris */}
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-900">Pris</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <div className="flex items-baseline gap-2">
                    <Money data={product.price} className="text-lg font-medium" />
                    {product.compareAtPrice && (
                      <Money
                        data={product.compareAtPrice}
                        className="text-sm text-gray-500 line-through"
                      />
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Beskrivning */}
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-900">
                Beskrivning
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <p className="text-gray-500">{product.description}</p>
                </td>
              ))}
            </tr>

            {/* Varianter */}
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-900">Varianter</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <ul className="space-y-2">
                    {product.variants.map((variant) => (
                      <li
                        key={variant.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">{variant.title}</span>
                        <span
                          className={`text-sm ${
                            variant.available
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {variant.available ? 'I lager' : 'Ej i lager'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Gemensamma egenskaper */}
            {commonFeatures.map((feature) => (
              <tr key={feature} className="border-b">
                <td className="py-4 pr-4 font-medium text-gray-900">
                  {feature}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    {typeof product.features[feature] === 'boolean' ? (
                      product.features[feature] ? (
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-500" />
                      )
                    ) : (
                      <span className="text-gray-700">
                        {product.features[feature]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CloseIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
} 