import type {LoaderFunctionArgs} from '@remix-run/react';
import {useLoaderData} from '@remix-run/react';

export async function loader({params}: LoaderFunctionArgs) {
  const {pageHandle} = params;

  if (!pageHandle) {
    throw new Response('Page not found', {status: 404});
  }

  // Here you would typically fetch the page data from your CMS or API
  // For now, we'll return a placeholder based on the page handle
  const getPageContent = (handle: string) => {
    switch (handle) {
      case 'kontakt':
        return {
          title: 'Kontakt',
          content: 'Kontakta oss för frågor om våra produkter och tjänster.',
        };
      case 'om-oss':
        return {
          title: 'Om oss',
          content: 'Vi är ett ledande företag inom lagerteknik.',
        };
      case 'karriar':
        return {
          title: 'Karriär',
          content: 'Jobba med oss och utveckla din karriär.',
        };
      default:
        return {
          title: `Sida: ${handle}`,
          content: 'Detta är en anpassad sida.',
        };
    }
  };

  const pageData = getPageContent(pageHandle);
  return {
    pageHandle,
    title: pageData.title,
    content: pageData.content,
  };
}

export default function Page() {
  const {title, content, pageHandle} = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          <div className="mt-8">
            <p className="text-lg text-gray-600">{content}</p>

            {pageHandle === 'kontakt' && (
              <div className="mt-8">
                <div className="rounded-lg bg-gray-50 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Kontaktinformation
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p>Telefon: +46 8 123 456 78</p>
                    <p>E-post: info@example.com</p>
                    <p>Adress: Exempelgatan 123, 123 45 Stockholm</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

