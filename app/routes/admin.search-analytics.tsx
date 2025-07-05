import {SearchInsights} from '~/components/SearchInsights';
import {SearchAnalyticsCharts} from '~/components/SearchAnalyticsCharts';
import {RealtimeSearchDashboard} from '~/components/RealtimeSearchDashboard';
import {SearchAdminTools} from '~/components/SearchAdminTools';
import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {SearchAnalytics} from '~/lib/search/analytics';

export async function loader() {
  // Här kan du lägga till behörighetskontroll för admin-åtkomst
  return json({
    pageTitle: 'Sökhantering',
  });
}

export default function SearchAnalyticsPage() {
  const {pageTitle} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Hantera och analysera sökfunktioner
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Realtidsdata */}
        <div className="lg:col-span-1">
          <RealtimeSearchDashboard />
        </div>

        {/* Huvudinnehåll */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sökinsikter */}
          <SearchInsights />

          {/* Diagram */}
          <SearchAnalyticsCharts />
        </div>
      </div>

      {/* Admin-verktyg */}
      <div className="mt-12">
        <SearchAdminTools />
      </div>

      {/* Snabbåtgärder */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sökindexering
          </h3>
          <div className="space-y-4">
            <button
              onClick={() => {
                // Implementera indexeringslogik här
                alert('Indexering startad');
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              Uppdatera sökindex
            </button>
            <p className="text-sm text-gray-500">
              Senaste indexering: Aldrig
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Prestandaoptimering
          </h3>
          <div className="space-y-4">
            <button
              onClick={() => {
                // Implementera optimeringslogik här
                alert('Optimering startad');
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              Optimera sökprestanda
            </button>
            <p className="text-sm text-gray-500">
              Nuvarande prestanda: God
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Säkerhetskopiering
          </h3>
          <div className="space-y-4">
            <button
              onClick={() => {
                // Implementera backup-logik här
                const settings = localStorage.getItem('search_admin_settings');
                if (settings) {
                  const blob = new Blob([settings], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `search-settings-backup-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              Säkerhetskopiera inställningar
            </button>
            <p className="text-sm text-gray-500">
              Senaste backup: Idag 08:00
            </p>
          </div>
        </div>
      </div>

      {/* Avancerade inställningar */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Avancerade inställningar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sökalgoritm
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option>Standard</option>
              <option>Fuzzy matching</option>
              <option>Exakt matchning</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Relevansberäkning
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option>Balanserad</option>
              <option>Prioritera exakta träffar</option>
              <option>Prioritera popularitet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cache-storlek
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option>1000 poster</option>
              <option>5000 poster</option>
              <option>10000 poster</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Språkstöd
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option>Svenska</option>
              <option>Svenska + Engelska</option>
              <option>Alla språk</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="advanced_mode"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="advanced_mode" className="ml-2 text-sm text-gray-700">
              Aktivera avancerat läge
            </label>
          </div>

          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            onClick={() => {
              // Spara avancerade inställningar
              alert('Inställningarna har sparats!');
            }}
          >
            Spara inställningar
          </button>
        </div>
      </div>
    </div>
  );
} 