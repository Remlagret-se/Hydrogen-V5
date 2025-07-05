import {useEffect, useState} from 'react';
import {realtimeAnalytics} from '~/lib/search/realtime';

export function RealtimeSearchDashboard() {
  const [data, setData] = useState(realtimeAnalytics.getData());

  useEffect(() => {
    const unsubscribe = realtimeAnalytics.subscribe(() => {
      setData(realtimeAnalytics.getData());
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Realtidsöversikt</h2>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">
            {data.currentUsers}
          </div>
          <div className="text-sm text-gray-600">Aktiva användare</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">
            {data.activeSearches}
          </div>
          <div className="text-sm text-gray-600">Pågående sökningar</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Senaste sökningar */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Senaste sökningar
          </h3>
          <div className="space-y-2">
            {data.recentSearches.map((term, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
              >
                <span className="text-gray-600">{term}</span>
                <span className="text-xs text-gray-400">
                  {getTimeAgo(index)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Populära idag */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Populärt idag
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {data.popularToday.map((term, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-50 p-2 rounded"
              >
                <span className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-primary text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-600 truncate">
                  {term}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trendande sökningar */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Trendande nu
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.popularToday.slice(0, 5).map((term, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {term}
                <svg
                  className="ml-1 h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(index: number): string {
  const minutes = index * 2; // Simulera tid mellan sökningar
  if (minutes < 1) return 'Just nu';
  if (minutes < 60) return `${minutes}m sedan`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h sedan`;
} 