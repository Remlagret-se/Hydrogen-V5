import { Link } from '@remix-run/react';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export function HeroBanner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
}: HeroBannerProps) {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div
            className="max-w-2xl text-white"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              {title}
            </h1>
            <p
              className="text-lg md:text-xl mb-8"
            >
              {subtitle}
            </p>
            <div>
              <Link
                to={ctaLink}
                className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

