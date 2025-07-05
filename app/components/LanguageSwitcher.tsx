import {useLocale, useNavigate} from '@remix-run/react';
import {Menu} from '@headlessui/react';

interface Language {
  code: string;
  label: string;
  flag: string;
}

const LANGUAGES: Record<string, Language[]> = {
  SE: [
    {code: 'sv-SE', label: 'Svenska', flag: '🇸🇪'},
    {code: 'en-SE', label: 'English', flag: '🇬🇧'},
  ],
  NO: [
    {code: 'nb-NO', label: 'Norsk', flag: '🇳🇴'},
    {code: 'en-NO', label: 'English', flag: '🇬🇧'},
  ],
  DK: [
    {code: 'da-DK', label: 'Dansk', flag: '🇩🇰'},
    {code: 'en-DK', label: 'English', flag: '🇬🇧'},
  ],
  FI: [
    {code: 'fi-FI', label: 'Suomi', flag: '🇫🇮'},
    {code: 'sv-FI', label: 'Svenska', flag: '🇸🇪'},
    {code: 'en-FI', label: 'English', flag: '🇬🇧'},
  ],
  US: [
    {code: 'en-US', label: 'English', flag: '🇺🇸'},
    {code: 'es-US', label: 'Español', flag: '🇪🇸'},
  ],
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const navigate = useNavigate();
  
  // Get country code from locale
  const country = locale.language.split('-')[1];
  
  // Get available languages for the current country
  const availableLanguages = LANGUAGES[country] || LANGUAGES.US;

  // Find current language
  const currentLanguage = availableLanguages.find(
    (lang) => lang.code === locale.language,
  ) || availableLanguages[0];

  const handleLanguageChange = (languageCode: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(
      /^\/[a-zA-Z]{2}-[a-zA-Z]{2}/,
      languageCode,
    );
    
    navigate(newPath, {
      replace: true,
    });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center space-x-2 hover:text-gray-600">
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.label}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {availableLanguages.map((language) => (
            <Menu.Item key={language.code}>
              {({active}) => (
                <button
                  onClick={() => handleLanguageChange(language.code)}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } ${
                    language.code === locale.language
                      ? 'text-primary font-medium'
                      : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  <span className="text-lg mr-2">{language.flag}</span>
                  {language.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}

function ChevronDownIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
} 