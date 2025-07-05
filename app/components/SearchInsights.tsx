import {useState, useEffect} from 'react';
import {SearchAnalytics} from '~/lib/search/analytics';

export function SearchInsights() {
  const [insights, setInsights] = useState<any>(null);
  const [efficiency, setEfficiency] = useState(0);
  const [filters, setFilters] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'filters'>('overview');

  useEffect(() => {
    const updateInsights = () => {
      setInsights(SearchAnalytics.getInsights());
      setEfficiency(SearchAnalytics.getSearchEfficiency());
      setFilters(SearchAnalytics.getPopularFilters());
    };

    updateInsights();
    const interval = setInterval(updateInsights, 60000); // Uppdatera varje minut

    return () => clearInterval(interval);
  }, []);

  if (!insights) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Sökanalys</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === 'overview'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Översikt
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === 'patterns'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('patterns')}
          >
            Sökmönster
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === 'filters'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('filters')}
          >
            Filter
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Nyckeltal */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {Math.round(insights.averageSearchesPerSession * 10) / 10}
              </div>
              <div className="text-sm text-gray-600">Sökningar per session</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {Math.round(efficiency * 100)}%
              </div>
              <div className="text-sm text-gray-600">Sökeffektivitet</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {Math.round((1 - insights.searchAbandonmentRate) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Framgångsrika sökningar</div>
            </div>
          </div>

          {/* Tidsstatistik */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sessionsstatistik</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Genomsnittlig sessionslängd</span>
                <span className="text-sm font-medium">
                  {Math.round(insights.averageSessionDuration / 1000)} sekunder
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Förfiningsfrekvens</span>
                <span className="text-sm font-medium">
                  {Math.round(insights.searchRefinementRate * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-6">
          {/* Sökmönster */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Vanliga sökmönster</h3>
            <div className="space-y-2">
              {insights.mostCommonSearchPatterns.map((pattern: string, index: number) => (
                <div
                  key={pattern}
                  className="flex items-center text-sm"
                >
                  <span className="w-6 text-gray-400">{index + 1}.</span>
                  <span className="flex-1">{pattern}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sökordskombinationer */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Populära kombinationer
            </h3>
            <div className="space-y-2">
              {insights.popularSearchCombinations.map((combo: string, index: number) => (
                <div
                  key={combo}
                  className="flex items-center text-sm"
                >
                  <span className="w-6 text-gray-400">{index + 1}.</span>
                  <span className="flex-1">{combo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'filters' && (
        <div className="space-y-6">
          {/* Populära filter */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Mest använda filter</h3>
            <div className="space-y-2">
              {Object.entries(filters)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([filter, count], index) => (
                  <div
                    key={filter}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-gray-400">{index + 1}.</span>
                      <span>{filter}</span>
                    </div>
                    <span className="text-gray-500">{count}x</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Filterstatistik */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Filterstatistik</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unika filter</span>
                <span className="text-sm font-medium">
                  {Object.keys(filters).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Totalt filteranvändning</span>
                <span className="text-sm font-medium">
                  {Object.values(filters).reduce((a, b) => a + b, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 