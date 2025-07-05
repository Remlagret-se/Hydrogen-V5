import {StoreNavigation} from './StoreNavigation';
import {HeaderMenu} from './HeaderWithHeadlessUI';
import type {HeaderProps} from './HeaderWithHeadlessUI';
import {SearchBar} from '~/components/SearchBar';
import {Link} from 'react-router-dom';

export function Header({isLoggedIn, cart, currentMarket, header}: HeaderProps) {
  return (
    <header className="header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              {/* Your logo here */}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {/* Existing navigation items */}
          </nav>
        </div>
      </div>
    </header>
  );
}

export {HeaderMenu};
export type {HeaderProps};
