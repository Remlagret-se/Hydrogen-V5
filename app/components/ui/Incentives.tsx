import {
  TruckIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface Incentive {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const incentives: Incentive[] = [
  {
    name: 'Fri frakt',
    description:
      'Fri frakt på alla beställningar över 1000 SEK. Snabb leverans direkt till din verkstad.',
    icon: TruckIcon,
  },
  {
    name: 'Teknisk support',
    description:
      'Experthjälp från våra ingenjörer. Vi hjälper dig välja rätt lager för din applikation.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Snabb leverans',
    description:
      'Leverans inom 1-3 arbetsdagar från vårt lager. Express-alternativ tillgängligt för akuta behov.',
    icon: BoltIcon,
  },
  {
    name: 'Kvalitetsgaranti',
    description:
      'Alla våra lager är certifierade och kommer med fullständig kvalitetsgaranti från tillverkaren.',
    icon: ShieldCheckIcon,
  },
];

export default function Incentives() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {incentives.map((incentive) => {
            const IconComponent = incentive.icon;
            return (
              <div key={incentive.name}>
                <IconComponent className="h-24 w-24 text-blue-600" />
                <h3 className="mt-6 text-sm font-medium text-gray-900">
                  {incentive.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {incentive.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
