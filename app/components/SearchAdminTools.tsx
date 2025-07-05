import {useState} from 'react';
import {SearchAnalytics} from '~/lib/search/analytics';

interface SearchRule {
  id: string;
  pattern: string;
  replacement: string;
  isActive: boolean;
  priority: number;
}

interface SearchBoost {
  id: string;
  term: string;
  productIds: string[];
  multiplier: number;
  isActive: boolean;
}

interface SearchSynonym {
  id: string;
  terms: string[];
  isActive: boolean;
}

export function SearchAdminTools() {
  const [activeTab, setActiveTab] = useState<'rules' | 'boosts' | 'synonyms' | 'blacklist'>('rules');
  const [searchRules, setSearchRules] = useState<SearchRule[]>([
    {
      id: '1',
      pattern: '\\d+mm',
      replacement: '{number} millimeter',
      isActive: true,
      priority: 1,
    },
    {
      id: '2',
      pattern: '(\\d+)-(\\d+)rs',
      replacement: '$1-$2 radialseals',
      isActive: true,
      priority: 2,
    },
  ]);

  const [searchBoosts, setSearchBoosts] = useState<SearchBoost[]>([
    {
      id: '1',
      term: 'kullager',
      productIds: ['prod_1', 'prod_2'],
      multiplier: 1.5,
      isActive: true,
    },
  ]);

  const [searchSynonyms, setSearchSynonyms] = useState<SearchSynonym[]>([
    {
      id: '1',
      terms: ['lager', 'bearing', 'kullager'],
      isActive: true,
    },
  ]);

  const [blacklistedTerms, setBlacklistedTerms] = useState<string[]>([]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['rules', 'boosts', 'synonyms', 'blacklist'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'rules' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Sökregler</h3>
              <button
                onClick={() => {
                  const newRule: SearchRule = {
                    id: Date.now().toString(),
                    pattern: '',
                    replacement: '',
                    isActive: true,
                    priority: searchRules.length + 1,
                  };
                  setSearchRules([...searchRules, newRule]);
                }}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90"
              >
                Lägg till regel
              </button>
            </div>
            
            <div className="space-y-4">
              {searchRules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mönster (RegEx)
                      </label>
                      <input
                        type="text"
                        value={rule.pattern}
                        onChange={(e) => {
                          const updated = searchRules.map((r) =>
                            r.id === rule.id ? {...r, pattern: e.target.value} : r
                          );
                          setSearchRules(updated);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ersättning
                      </label>
                      <input
                        type="text"
                        value={rule.replacement}
                        onChange={(e) => {
                          const updated = searchRules.map((r) =>
                            r.id === rule.id ? {...r, replacement: e.target.value} : r
                          );
                          setSearchRules(updated);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={(e) => {
                          const updated = searchRules.map((r) =>
                            r.id === rule.id ? {...r, isActive: e.target.checked} : r
                          );
                          setSearchRules(updated);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Aktiv</span>
                    </label>
                    <button
                      onClick={() => {
                        setSearchRules(searchRules.filter((r) => r.id !== rule.id));
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'boosts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Sökboostning</h3>
              <button
                onClick={() => {
                  const newBoost: SearchBoost = {
                    id: Date.now().toString(),
                    term: '',
                    productIds: [],
                    multiplier: 1.0,
                    isActive: true,
                  };
                  setSearchBoosts([...searchBoosts, newBoost]);
                }}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90"
              >
                Lägg till boost
              </button>
            </div>

            <div className="space-y-4">
              {searchBoosts.map((boost) => (
                <div key={boost.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sökterm
                      </label>
                      <input
                        type="text"
                        value={boost.term}
                        onChange={(e) => {
                          const updated = searchBoosts.map((b) =>
                            b.id === boost.id ? {...b, term: e.target.value} : b
                          );
                          setSearchBoosts(updated);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Boost-faktor
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        value={boost.multiplier}
                        onChange={(e) => {
                          const updated = searchBoosts.map((b) =>
                            b.id === boost.id ? {...b, multiplier: parseFloat(e.target.value)} : b
                          );
                          setSearchBoosts(updated);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Produkt-IDs (kommaseparerade)
                    </label>
                    <input
                      type="text"
                      value={boost.productIds.join(', ')}
                      onChange={(e) => {
                        const updated = searchBoosts.map((b) =>
                          b.id === boost.id
                            ? {...b, productIds: e.target.value.split(',').map((id) => id.trim())}
                            : b
                        );
                        setSearchBoosts(updated);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={boost.isActive}
                        onChange={(e) => {
                          const updated = searchBoosts.map((b) =>
                            b.id === boost.id ? {...b, isActive: e.target.checked} : b
                          );
                          setSearchBoosts(updated);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Aktiv</span>
                    </label>
                    <button
                      onClick={() => {
                        setSearchBoosts(searchBoosts.filter((b) => b.id !== boost.id));
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'synonyms' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Söksynonymer</h3>
              <button
                onClick={() => {
                  const newSynonym: SearchSynonym = {
                    id: Date.now().toString(),
                    terms: [],
                    isActive: true,
                  };
                  setSearchSynonyms([...searchSynonyms, newSynonym]);
                }}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90"
              >
                Lägg till synonym
              </button>
            </div>

            <div className="space-y-4">
              {searchSynonyms.map((synonym) => (
                <div key={synonym.id} className="border rounded-lg p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Termer (kommaseparerade)
                    </label>
                    <input
                      type="text"
                      value={synonym.terms.join(', ')}
                      onChange={(e) => {
                        const updated = searchSynonyms.map((s) =>
                          s.id === synonym.id
                            ? {...s, terms: e.target.value.split(',').map((term) => term.trim())}
                            : s
                        );
                        setSearchSynonyms(updated);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={synonym.isActive}
                        onChange={(e) => {
                          const updated = searchSynonyms.map((s) =>
                            s.id === synonym.id ? {...s, isActive: e.target.checked} : s
                          );
                          setSearchSynonyms(updated);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Aktiv</span>
                    </label>
                    <button
                      onClick={() => {
                        setSearchSynonyms(searchSynonyms.filter((s) => s.id !== synonym.id));
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blacklist' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Svartlistade söktermer</h3>
              <button
                onClick={() => {
                  const term = prompt('Ange term att svartlista:');
                  if (term && !blacklistedTerms.includes(term)) {
                    setBlacklistedTerms([...blacklistedTerms, term]);
                  }
                }}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90"
              >
                Lägg till term
              </button>
            </div>

            <div className="space-y-2">
              {blacklistedTerms.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <span className="text-sm text-gray-700">{term}</span>
                  <button
                    onClick={() => {
                      setBlacklistedTerms(blacklistedTerms.filter((t) => t !== term));
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spara-knapp */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => {
              // Återställ till standardinställningar
              if (window.confirm('Är du säker på att du vill återställa alla inställningar?')) {
                setSearchRules([]);
                setSearchBoosts([]);
                setSearchSynonyms([]);
                setBlacklistedTerms([]);
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Återställ
          </button>
          <button
            onClick={() => {
              // Spara alla inställningar
              const settings = {
                rules: searchRules,
                boosts: searchBoosts,
                synonyms: searchSynonyms,
                blacklist: blacklistedTerms,
              };
              localStorage.setItem('search_admin_settings', JSON.stringify(settings));
              alert('Inställningarna har sparats!');
            }}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
          >
            Spara ändringar
          </button>
        </div>
      </div>
    </div>
  );
} 