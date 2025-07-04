import {redirect} from '@shopify/remix-oxygen';
import favicon from '~/assets/favicon.svg';

export async function loader() {
  return redirect(favicon);
} 
