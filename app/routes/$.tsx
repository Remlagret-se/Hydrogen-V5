import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {redirect} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Hantera locale-prefix som /en/, /sv/, etc.
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)$/);
  
  if (localeMatch) {
    // Ta bort locale-prefix och omdirigera
    const newPath = localeMatch[2];
    return redirect(newPath + url.search);
  }
  
  // Om det inte är en locale-URL, kasta 404
  throw new Response('Not found', {status: 404});
}

export default function CatchAll() {
  return null;
} 