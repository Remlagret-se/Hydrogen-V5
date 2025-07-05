import {useEffect, useRef} from 'react';
import {SearchAnalytics} from '~/lib/search/analytics';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export function SearchAnalyticsCharts() {
  const timeChartRef = useRef<HTMLCanvasElement>(null);
  const patternChartRef = useRef<HTMLCanvasElement>(null);
  const filterChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Importera Chart.js dynamiskt för att undvika SSR-problem
    import('chart.js').then((ChartModule) => {
      const Chart = ChartModule.default;

      // Konfigurera Chart.js
      Chart.defaults.color = '#6B7280';
      Chart.defaults.font.family = 'Inter var, sans-serif';

      // Tidsserie för sökningar
      const timeData: ChartData = {
        labels: getLastNDays(7),
        datasets: [{
          label: 'Sökningar',
          data: [12, 19, 15, 25, 22, 30, 28],
          borderColor: '#3B82F6',
          fill: false,
        }],
      };

      // Sökmönster distribution
      const patternData: ChartData = {
        labels: ['Direktträffar', 'Förfinade sökningar', 'Avbrutna sökningar', 'Klickade resultat'],
        datasets: [{
          data: [30, 25, 15, 30],
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#6366F1',
          ],
        }],
      };

      // Filter användning
      const filterData: ChartData = {
        labels: ['Tillverkare', 'Pris', 'Lagerstatus', 'Kategori', 'Storlek'],
        datasets: [{
          label: 'Användning',
          data: [65, 45, 35, 30, 25],
          backgroundColor: '#3B82F6',
        }],
      };

      // Skapa diagrammen
      if (timeChartRef.current) {
        new Chart(timeChartRef.current, {
          type: 'line',
          data: timeData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Sökningar över tid',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        });
      }

      if (patternChartRef.current) {
        new Chart(patternChartRef.current, {
          type: 'doughnut',
          data: patternData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Sökmönster Distribution',
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }

      if (filterChartRef.current) {
        new Chart(filterChartRef.current, {
          type: 'bar',
          data: filterData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Filter Användning',
              },
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        });
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tidsserie diagram */}
      <div className="bg-white p-4 rounded-lg shadow">
        <canvas ref={timeChartRef} />
      </div>

      {/* Sökmönster diagram */}
      <div className="bg-white p-4 rounded-lg shadow">
        <canvas ref={patternChartRef} />
      </div>

      {/* Filter användning diagram */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <canvas ref={filterChartRef} />
      </div>
    </div>
  );
}

function getLastNDays(n: number): string[] {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('sv-SE', {month: 'short', day: 'numeric'}));
  }
  return dates;
} 