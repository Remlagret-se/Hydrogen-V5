import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {getInputStyleClasses} from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [{title: 'Logga in | Remlagret'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.customerAccount.isLoggedIn();
  if (customerAccessToken) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get('email'));
  const password = String(form.get('password'));
  const rememberMe = Boolean(form.get('rememberMe'));

  const validationErrors: Record<string, string> = {};

  if (!email || !email.includes('@')) {
    validationErrors.email = 'Vänligen ange en giltig e-postadress';
  }

  if (!password) {
    validationErrors.password = 'Lösenord krävs';
  }

  if (Object.keys(validationErrors).length > 0) {
    return json({errors: validationErrors}, {status: 400});
  }

  try {
    const {session, customer} = await context.customerAccount.login({
      email,
      password,
    });

    if (!customer) {
      return json(
        {error: 'Något gick fel vid inloggningen. Försök igen.'},
        {status: 400},
      );
    }

    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      await session.commit({
        maxAge: rememberMe ? 60 * 60 * 24 * 365 : undefined, // 1 år om "Kom ihåg mig" är valt
      }),
    );

    return redirect('/account', {headers});
  } catch (error: any) {
    // Hantera specifika Shopify-fel
    if (error?.status === 401) {
      return json(
        {error: 'Felaktig e-postadress eller lösenord'},
        {status: 401},
      );
    }

    // Hantera andra API-fel
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }

    return json(
      {error: 'Något gick fel vid inloggningen. Försök igen senare.'},
      {status: 500},
    );
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold">Logga in</h1>
        <p className="mt-4 text-gray-500">
          Logga in på ditt konto för att se din orderhistorik, hantera dina
          adresser och uppdatera dina kontoinställningar.
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
          onSubmit={() => setFormError(null)}
        >
          <div className="space-y-4">
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
                  autoComplete="current-password"
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

            {/* Kom ihåg mig & Glömt lösenord */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Kom ihåg mig
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/account/recover"
                  className="text-primary hover:text-primary/80"
                >
                  Glömt lösenord?
                </Link>
              </div>
            </div>
          </div>

          {/* Inloggningsknapp */}
          <div>
            <button
              type="submit"
              className="w-full bg-primary text-contrast rounded py-3 px-4 focus:shadow-outline font-bold hover:opacity-90 transition-opacity duration-200"
            >
              Logga in
            </button>
          </div>

          {/* Länk till registrering */}
          <div className="flex items-center justify-center mt-8 border-t border-gray-300">
            <p className="align-baseline text-sm mt-6">
              Har du inget konto?{' '}
              <Link
                className="inline text-primary hover:text-primary/80"
                to="/account/register"
              >
                Skapa konto
              </Link>
            </p>
          </div>
        </Form>

        {/* Business Account */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Är du företagskund?{' '}
            <Link
              to="/pages/foretagskonto"
              className="text-primary hover:text-primary/80"
            >
              Ansök om företagskonto
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 
