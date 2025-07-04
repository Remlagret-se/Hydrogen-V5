import { Await } from 'react-router';
import { Suspense } from 'react';
import { AsideProvider } from '~/components/Aside';
import { HeaderWithHeadlessUI, type HeaderProps } from '~/components/HeaderWithHeadlessUI';
import { CartMain } from '~/components/Cart';
import { SearchAside } from '~/components/Search';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { Market } from '~/lib/utils/localization';

export interface PageLayoutProps extends HeaderProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<any>;
  children?: React.ReactNode;
  currentMarket?: Market;
}

// Modern Footer Component
function ModernFooter({ footer, currentMarket }: { footer: any; currentMarket?: Market }) {
  const marketKey = currentMarket?.pathPrefix === '' ? 'se' : currentMarket?.pathPrefix?.slice(1) || 'se';
  
  const footerSections = {
    company: {
      title: {
        'se': 'Företag',
        'en': 'Company',
        'de': 'Unternehmen',
        'no': 'Selskap',
        'dk': 'Virksomhed'
      },
      links: [
        { name: { 'se': 'Om oss', 'en': 'About us', 'de': 'Über uns', 'no': 'Om oss', 'dk': 'Om os' }, href: '/pages/om-oss' },
        { name: { 'se': 'Kontakt', 'en': 'Contact', 'de': 'Kontakt', 'no': 'Kontakt', 'dk': 'Kontakt' }, href: '/pages/kontakt' },
        { name: { 'se': 'Karriär', 'en': 'Careers', 'de': 'Karriere', 'no': 'Karriere', 'dk': 'Karriere' }, href: '/pages/karriar' },
        { name: { 'se': 'Press', 'en': 'Press', 'de': 'Presse', 'no': 'Presse', 'dk': 'Presse' }, href: '/pages/press' }
      ]
    },
    products: {
      title: {
        'se': 'Produkter',
        'en': 'Products',
        'de': 'Produkte',
        'no': 'Produkter',
        'dk': 'Produkter'
      },
      links: [
        { name: { 'se': 'Kullager', 'en': 'Ball bearings', 'de': 'Kugellager', 'no': 'Kulelagre', 'dk': 'Kugleleje' }, href: '/collections/kullager' },
        { name: { 'se': 'Rullager', 'en': 'Roller bearings', 'de': 'Rollenlager', 'no': 'Rullelagre', 'dk': 'Rulleleje' }, href: '/collections/rullager' },
        { name: { 'se': 'Glidlager', 'en': 'Plain bearings', 'de': 'Gleitlager', 'no': 'Glidlagre', 'dk': 'Glidleje' }, href: '/collections/glidlager' },
        { name: { 'se': 'Speciallager', 'en': 'Special bearings', 'de': 'Speziallager', 'no': 'Spesiallagre', 'dk': 'Specialleje' }, href: '/collections/speciallager' }
      ]
    },
    support: {
      title: {
        'se': 'Support',
        'en': 'Support',
        'de': 'Support',
        'no': 'Support',
        'dk': 'Support'
      },
      links: [
        { name: { 'se': 'Hjälpcenter', 'en': 'Help center', 'de': 'Hilfezentrum', 'no': 'Hjelpesenter', 'dk': 'Hjælpecenter' }, href: '/pages/hjalp' },
        { name: { 'se': 'Frakt & retur', 'en': 'Shipping & returns', 'de': 'Versand & Rücksendung', 'no': 'Frakt & retur', 'dk': 'Fragt & retur' }, href: '/pages/frakt' },
        { name: { 'se': 'Storleksguide', 'en': 'Size guide', 'de': 'Größenleitfaden', 'no': 'Størrelsesguide', 'dk': 'Størrelsesguide' }, href: '/pages/storlek' },
        { name: { 'se': 'Garanti', 'en': 'Warranty', 'de': 'Garantie', 'no': 'Garanti', 'dk': 'Garanti' }, href: '/pages/garanti' }
      ]
    },
    legal: {
      title: {
        'se': 'Juridiskt',
        'en': 'Legal',
        'de': 'Rechtliches',
        'no': 'Juridisk',
        'dk': 'Juridisk'
      },
      links: [
        { name: { 'se': 'Integritetspolicy', 'en': 'Privacy policy', 'de': 'Datenschutzrichtlinie', 'no': 'Personvernregler', 'dk': 'Privatlivspolitik' }, href: '/pages/integritet' },
        { name: { 'se': 'Användarvillkor', 'en': 'Terms of service', 'de': 'Nutzungsbedingungen', 'no': 'Bruksvilkår', 'dk': 'Servicevilkår' }, href: '/pages/villkor' },
        { name: { 'se': 'Cookies', 'en': 'Cookies', 'de': 'Cookies', 'no': 'Cookies', 'dk': 'Cookies' }, href: '/pages/cookies' }
      ]
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--gray-12)' }} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <img
              alt="Remlagret"
              src="https://cdn.shopify.com/s/files/1/2427/6923/files/remlagret.se-logo_5f630daf-9666-487a-a905-17a12c64de50.png?v=1704469705"
              className="h-10 brightness-0 invert"
            />
            <p className="text-sm leading-6" style={{ color: 'var(--gray-8)' }}>
              {marketKey === 'se' 
                ? 'Ditt första val för högkvalitativa lager och industrikomponenter. Vi levererar till hela Norden med expertkunskap sedan 1985.'
                : 'Your first choice for high-quality bearings and industrial components. We deliver throughout the Nordics with expert knowledge since 1985.'}
            </p>
            <div className="flex space-x-6">
              {/* Social media icons */}
              <a href="#" style={{ color: 'var(--gray-8)' }} className="hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" style={{ color: 'var(--gray-8)' }} className="hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" style={{ color: 'var(--gray-8)' }} className="hover:text-white">
                <span className="sr-only">YouTube</span>
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  {footerSections.company.title[marketKey] || footerSections.company.title['se']}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerSections.company.links.map((link) => (
                    <li key={link.href}>
                      <a href={`${currentMarket?.pathPrefix || ''}${link.href}`} className="text-sm leading-6 hover:text-white" style={{ color: 'var(--gray-8)' }}>
                        {link.name[marketKey] || link.name['se']}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  {footerSections.products.title[marketKey] || footerSections.products.title['se']}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerSections.products.links.map((link) => (
                    <li key={link.href}>
                      <a href={`${currentMarket?.pathPrefix || ''}${link.href}`} className="text-sm leading-6 hover:text-white" style={{ color: 'var(--gray-8)' }}>
                        {link.name[marketKey] || link.name['se']}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  {footerSections.support.title[marketKey] || footerSections.support.title['se']}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerSections.support.links.map((link) => (
                    <li key={link.href}>
                      <a href={`${currentMarket?.pathPrefix || ''}${link.href}`} className="text-sm leading-6 hover:text-white" style={{ color: 'var(--gray-8)' }}>
                        {link.name[marketKey] || link.name['se']}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  {footerSections.legal.title[marketKey] || footerSections.legal.title['se']}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerSections.legal.links.map((link) => (
                    <li key={link.href}>
                      <a href={`${currentMarket?.pathPrefix || ''}${link.href}`} className="text-sm leading-6 hover:text-white" style={{ color: 'var(--gray-8)' }}>
                        {link.name[marketKey] || link.name['se']}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t pt-8 sm:mt-20 lg:mt-24" style={{ borderColor: 'var(--gray-8)' }}>
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <p className="text-xs leading-5" style={{ color: 'var(--gray-8)' }}>
                {marketKey === 'se' 
                  ? 'Certifierad återförsäljare av SKF, FAG, NSK, NTN, Timken och INA'
                  : 'Certified reseller of SKF, FAG, NSK, NTN, Timken and INA'}
              </p>
            </div>
            <p className="mt-8 text-xs leading-5 md:order-1 md:mt-0" style={{ color: 'var(--gray-8)' }}>
              &copy; 2025 Remlagret AB. {marketKey === 'se' ? 'Alla rättigheter förbehållna.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageLayout({
  children,
  cart,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  currentMarket,
}: PageLayoutProps) {
  return (
    <AsideProvider>
      <HeaderWithHeadlessUI
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
          currentMarket={currentMarket}
        />
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <ModernFooter footer={footer} currentMarket={currentMarket} />}
        </Await>
      </Suspense>
    </AsideProvider>
  );
}
