import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {motion} from 'framer-motion';
import {useCartStore} from '~/lib/cartStore';
import {useLocale} from '@remix-run/react';
import {useEffect, useState} from 'react';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Minst 2 tecken'),
  lastName: z.string().min(2, 'Minst 2 tecken'),
  email: z.string().email('Ogiltig e-post'),
  address: z.string().min(5, 'Minst 5 tecken'),
  city: z.string().min(2, 'Minst 2 tecken'),
  postalCode: z.string().min(5, 'Minst 5 tecken'),
  cardNumber: z.string().length(16, 'Måste vara 16 siffror'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().length(3, 'Måste vara 3 siffror'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  countryCode: CountryCode;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'klarna',
    name: 'Klarna',
    icon: '💳',
    description: 'Betala senare med Klarna',
    countryCode: 'SE',
  },
  {
    id: 'swish',
    name: 'Swish',
    icon: '📱',
    description: 'Betala direkt med Swish',
    countryCode: 'SE',
  },
  {
    id: 'vipps',
    name: 'Vipps',
    icon: '📱',
    description: 'Betal med Vipps',
    countryCode: 'NO',
  },
  {
    id: 'mobilepay',
    name: 'MobilePay',
    icon: '📱',
    description: 'Betal med MobilePay',
    countryCode: 'DK',
  },
  {
    id: 'credit-card',
    name: 'Kort',
    icon: '💳',
    description: 'Betala med kort',
    countryCode: '*',
  },
];

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const cartTotal = useCartStore((state) => state.total);
  const locale = useLocale();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');
  const [countryCode, setCountryCode] = useState<CountryCode>('SE');

  // Determine country code from locale
  useEffect(() => {
    const country = locale.language.split('-')[1];
    setCountryCode(country as CountryCode);
  }, [locale]);

  // Get available payment methods for the current country
  const availablePaymentMethods = PAYMENT_METHODS.filter(
    (method) =>
      method.countryCode === '*' || method.countryCode === countryCode,
  );

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Implementera betalningslogik här
      console.log('Betalningsdata:', data);
    } catch (error) {
      console.error('Betalningsfel:', error);
    }
  };

  return (
    <motion.form
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Leveransinformation</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Förnamn
            </label>
            <input
              {...register('firstName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Efternamn
            </label>
            <input
              {...register('lastName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            E-post
          </label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Adress
          </label>
          <input
            {...register('address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stad
            </label>
            <input
              {...register('city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Postnummer
            </label>
            <input
              {...register('postalCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Betalningsinformation</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kortnummer
          </label>
          <input
            {...register('cardNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.cardNumber.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Utgångsdatum (MM/YY)
            </label>
            <input
              {...register('expiryDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              {...register('cvv')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Totalt att betala:</span>
          <span className="text-2xl font-bold">{cartTotal} kr</span>
        </div>

        <motion.button
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.98}}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Bearbetar...' : 'Slutför köp'}
        </motion.button>
      </div>
    </motion.form>
  );
}
