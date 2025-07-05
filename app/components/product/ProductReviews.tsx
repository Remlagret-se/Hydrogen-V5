import {useState, useEffect} from 'react';
import {ProductService} from '~/lib/product/service';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({productId}: ProductReviewsProps) {
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
    verifiedReviews: number;
  } | null>(null);
  const [reviews, setReviews] = useState<Array<{
    id: string;
    rating: number;
    title: string;
    content: string;
    author: string;
    createdAt: number;
    verified: boolean;
    helpful: number;
    images?: string[];
  }>>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productService = ProductService.getInstance();

  useEffect(() => {
    loadReviewsAndStats();
  }, [productId]);

  const loadReviewsAndStats = () => {
    const reviews = productService.getReviews(productId);
    const stats = productService.getProductStats(productId);
    setReviews(reviews);
    setStats(stats);
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        await productService.updateReview(reviewId, {
          helpful: review.helpful + 1,
        });
        loadReviewsAndStats();
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Ratings Summary */}
      {stats && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-baseline">
            <h2 className="text-2xl font-bold text-gray-900">Kundrecensioner</h2>
            <span className="ml-3 text-gray-500">
              ({stats.totalReviews} recensioner)
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-gray-500 ml-1">/ 5</span>
              </div>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(stats.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {stats.verifiedReviews} verifierade köp
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <span className="w-8 text-sm text-gray-600">{rating}</span>
                  <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-yellow-400 rounded"
                      style={{
                        width: `${
                          (stats.ratingDistribution[rating] /
                            stats.totalReviews) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm text-gray-600">
                    {stats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowWriteReview(true)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Skriv en recension
          </button>
        </div>
      )}

      {/* Write Review Form */}
      {showWriteReview && (
        <WriteReviewForm
          productId={productId}
          onSubmit={async (review) => {
            setIsSubmitting(true);
            setError(null);
            try {
              await productService.addReview(review);
              setShowWriteReview(false);
              loadReviewsAndStats();
            } catch (error) {
              console.error('Failed to submit review:', error);
              setError('Kunde inte spara recensionen');
            } finally {
              setIsSubmitting(false);
            }
          }}
          onCancel={() => setShowWriteReview(false)}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="mt-1 text-lg font-medium text-gray-900">
                  {review.title}
                </h3>
              </div>
              <time
                dateTime={new Date(review.createdAt).toISOString()}
                className="text-sm text-gray-500"
              >
                {new Date(review.createdAt).toLocaleDateString('sv-SE')}
              </time>
            </div>

            <div className="mt-2">
              <p className="text-gray-600">{review.content}</p>
              {review.images && review.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Av {review.author}
                {review.verified && (
                  <span className="ml-2 text-green-600">✓ Verifierat köp</span>
                )}
              </span>
              <button
                onClick={() => handleHelpful(review.id)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                <span className="mr-2">👍</span>
                Hjälpsam ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WriteReviewForm({
  productId,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: {
  productId: string;
  onSubmit: (review: {
    productId: string;
    rating: number;
    title: string;
    content: string;
    author: string;
    verified: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      productId,
      rating,
      title,
      content,
      author,
      verified: true, // This should be based on actual purchase verification
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Betyg</label>
        <div className="mt-1 flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`h-6 w-6 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Rubrik
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Recension
        </label>
        <textarea
          id="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Ditt namn
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isSubmitting ? 'Sparar...' : 'Publicera recension'}
        </button>
      </div>
    </form>
  );
}

function StarIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
} 