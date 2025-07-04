import { useLoaderData } from 'react-router';

export async function loader() {
  // Placeholder loader, returns static data
  return {
    heroTitle: 'Välkommen till butiken!',
    heroImage: '/images/collections/hero.jpg',
    heroText: 'Detta är en statisk hero efter att Sanity tagits bort.'
  };
}

export default function Hero() {
  const { heroTitle, heroImage, heroText } = useLoaderData<typeof loader>();
  return (
    <section>
      <h1>{heroTitle}</h1>
      <img src={heroImage} alt={heroTitle} />
      <p>{heroText}</p>
    </section>
  );
}
