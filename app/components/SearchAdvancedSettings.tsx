import {useState, useEffect} from 'react';
import {SearchSettingsService} from '~/lib/search/settings';

export function SearchAdvancedSettings() {
  const settingsService = SearchSettingsService.getInstance();
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [metrics, setMetrics] = useState(settingsService.getPerformanceMetrics());
  const [indexingStats, setIndexingStats] = useState(settingsService.getIndexingStats());
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Uppdatera mätvärden regelbundet
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(settingsService.getPerformanceMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {...settings, [key]: value};
    const validationErrors = settingsService.validateSettings(newSettings);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      setSettings(newSettings);
      settingsService.saveSettings(newSettings);
    }
  };

  const handleUpdateIndex = async () => {
    setIsUpdating(true);
    try {
      await settingsService.updateIndex();
      setIndexingStats(settingsService.getIndexingStats());
    } catch (error) {
      console.error('Failed to update index:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Prestandamätare */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Prestandaöversikt
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center">
              <div className="relative w-full h-2 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 rounded"
                  style={{width: `${metrics.cacheHitRate * 100}%`}}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {Math.round(metrics.cacheHitRate * 100)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Cache-träffar</p>
          </div>
          <div>
            <div className="text-center">
              <span className="text-lg font-medium text-gray-900">
                {Math.round(metrics.averageResponseTime)}ms
              </span>
              <p className="mt-1 text-xs text-gray-500">Svarstid</p>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <div className="relative w-full h-2 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded"
                  style={{width: `${metrics.errorRate * 100}%`}}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {(metrics.errorRate * 100).toFixed(1)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Felfrekvens</p>
          </div>
        </div>
      </div>

      {/* Indexeringsstatistik */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Indexeringsstatistik
          </h3>
          <button
            onClick={handleUpdateIndex}
            disabled={isUpdating}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isUpdating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isUpdating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uppdaterar...
              </>
            ) : (
              'Uppdatera index'
            )}
          </button>
        </div>
        {indexingStats && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Senaste körning</p>
              <p className="font-medium">
                {new Date(indexingStats.lastRun).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Totalt dokument</p>
              <p className="font-medium">{indexingStats.totalDocuments}</p>
            </div>
            <div>
              <p className="text-gray-500">Indexstorlek</p>
              <p className="font-medium">{indexingStats.indexSize} MB</p>
            </div>
            <div>
              <p className="text-gray-500">Processtid</p>
              <p className="font-medium">
                {(indexingStats.averageProcessingTime / 1000).toFixed(2)}s
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Algoritminställningar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Algoritminställningar
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum träffsäkerhet
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.minScore}
              onChange={(e) =>
                handleSettingChange('minScore', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Låg (fler resultat)</span>
              <span>{settings.minScore}</span>
              <span>Hög (färre resultat)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fuzzy-matchning
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.fuzzyThreshold}
              onChange={(e) =>
                handleSettingChange('fuzzyThreshold', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Exakt</span>
              <span>{settings.fuzzyThreshold}</span>
              <span>Ungefärlig</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max antal resultat
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={settings.maxResults}
                onChange={(e) =>
                  handleSettingChange('maxResults', parseInt(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timeout (ms)
              </label>
              <input
                type="number"
                min="1000"
                max="30000"
                step="1000"
                value={settings.timeout}
                onChange={(e) =>
                  handleSettingChange('timeout', parseInt(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Felmeddelanden */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Valideringsfel
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 