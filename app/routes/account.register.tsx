import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {getInputStyleClasses} from '~/lib/utils.ts';

export const meta: MetaFunction = () => {
  return [{title: 'Registrera | Remlagret'}];
};

// Kontrollera om användaren redan är inloggad
export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.customerAccount.isLoggedIn();
  if (customerAccessToken) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const passwordConfirm = String(form.get('passwordConfirm'));
    const firstName = String(form.get('firstName'));
    const lastName = String(form.get('lastName'));
    const phone = String(form.get('phone'));
    const acceptsMarketing = Boolean(form.get('acceptsMarketing'));

    const validationErrors: Record<string, string> = {};

    if (!email || !email.includes('@')) {
      validationErrors.email = 'Vänligen ange en giltig e-postadress';
    }

    if (!password || password.length < 8) {
      validationErrors.password = 'Lösenordet måste vara minst 8 tecken';
    }

    if (password !== passwordConfirm) {
      validationErrors.passwordConfirm = 'Lösenorden matchar inte';
    }

    if (!firstName) {
      validationErrors.firstName = 'Vänligen ange ditt förnamn';
    }

    if (!lastName) {
      validationErrors.lastName = 'Vänligen ange ditt efternamn';
    }

    if (Object.keys(validationErrors).length > 0) {
      return json({errors: validationErrors}, {status: 400});
    }

    // Använd Shopify Hydrogen's Customer Account API för registrering
    const {session, customer} = await context.customerAccount.register({
      email,
      password,
      firstName,
      lastName,
      phone,
      acceptsMarketing,
    });

    if (!customer) {
      return json(
        {error: 'Något gick fel vid registreringen. Försök igen.'},
        {status: 400},
      );
    }

    const headers = new Headers();
    headers.append('Set-Cookie', await session.commit());

    return redirect('/account', {headers});
  } catch (error: any) {
    // Hantera Shopify-specifika fel
    if (error?.status === 422) {
      const errorMessage =
        error?.message ?? 'E-postadressen är redan registrerad';
      return json({error: errorMessage}, {status: 422});
    }

    // Hantera andra Shopify API-fel
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }

    return json(
      {error: 'Något gick fel vid registreringen. Försök igen senare.'},
      {status: 500},
    );
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold">Skapa konto</h1>
        <p className="mt-4 text-gray-500">
          Skapa ett konto för att hantera dina beställningar, se orderhistorik
          och få personliga erbjudanden.
        </p>

        {/* Visa API-fel */}
        {actionData?.error && (
          <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
            <p className="m-4 text-sm text-red-900">{actionData.error}</p>
          </div>
        )}

        <Form
          method="post"
          noValidate
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            // Återställ formulärfel vid ny submit
            setFormError(null);
          }}
        >
          <div className="space-y-4">
            {/* Förnamn och efternamn i samma rad */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="block text-sm font-medium"
                  htmlFor="firstName"
                >
                  Förnamn
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className={getInputStyleClasses(
                    actionData?.errors?.firstName,
                  )}
                  aria-label="Förnamn"
                />
                {actionData?.errors?.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {actionData.errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium" htmlFor="lastName">
                  Efternamn
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className={getInputStyleClasses(actionData?.errors?.lastName)}
                  aria-label="Efternamn"
                />
                {actionData?.errors?.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {actionData.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* E-post */}
            <div>
              <label className="block text-sm font-medium" htmlFor="email">
                E-post
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={getInputStyleClasses(actionData?.errors?.email)}
                aria-label="E-post"
              />
              {actionData?.errors?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {actionData.errors.email}
                </p>
              )}
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-medium" htmlFor="phone">
                Telefon (valfritt)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={getInputStyleClasses()}
                aria-label="Telefon"
              />
            </div>

            {/* Lösenord */}
            <div>
              <label className="block text-sm font-medium" htmlFor="password">
                Lösenord
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={getInputStyleClasses(actionData?.errors?.password)}
                  aria-label="Lösenord"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Dölj' : 'Visa'}
                </button>
              </div>
              {actionData?.errors?.password && (
                <p className="text-red-500 text-xs mt-1">
                  {actionData.errors.password}
                </p>
              )}
            </div>

            {/* Bekräfta lösenord */}
            <div>
              <label
                className="block text-sm font-medium"
                htmlFor="passwordConfirm"
              >
                Bekräfta lösenord
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                className={getInputStyleClasses(
                  actionData?.errors?.passwordConfirm,
                )}
                aria-label="Bekräfta lösenord"
              />
              {actionData?.errors?.passwordConfirm && (
                <p className="text-red-500 text-xs mt-1">
                  {actionData.errors.passwordConfirm}
                </p>
              )}
            </div>

            {/* Marknadsföring */}
            <div className="flex items-center">
              <input
                id="acceptsMarketing"
                name="acceptsMarketing"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="acceptsMarketing"
                className="ml-2 block text-sm text-gray-900"
              >
                Ja, jag vill ta emot erbjudanden och nyheter via e-post
              </label>
            </div>

            {/* GDPR och villkor */}
            <div className="text-sm text-gray-500">
              Genom att skapa ett konto godkänner du våra{' '}
              <Link
                to="/policies/privacy-policy"
                className="text-primary hover:text-primary/80"
              >
                villkor
              </Link>{' '}
              och{' '}
              <Link
                to="/policies/privacy-policy"
                className="text-primary hover:text-primary/80"
              >
                integritetspolicy
              </Link>
              .
            </div>
          </div>

          {/* Registreringsknapp */}
          <div>
            <button
              type="submit"
              className="w-full bg-primary text-contrast rounded py-3 px-4 focus:shadow-outline font-bold hover:opacity-90 transition-opacity duration-200"
            >
              Skapa konto
            </button>
          </div>

          {/* Länk till inloggning */}
          <div className="flex items-center justify-center mt-8 border-t border-gray-300">
            <p className="align-baseline text-sm mt-6">
              Har du redan ett konto?{' '}
              <Link
                className="inline text-primary hover:text-primary/80"
                to="/account/login"
              >
                Logga in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
