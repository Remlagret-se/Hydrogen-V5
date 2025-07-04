import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';

export async function loader({ params }: LoaderFunctionArgs) {
  const { pageHandle } = params;
  // Here you would typically fetch the page data from your CMS or API
  // For now, we'll return a placeholder
  return { pageHandle, title: `Page: ${pageHandle}`, content: 'This is a custom page.' };
}

export default function Page() {
  const { title, content } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
} 
