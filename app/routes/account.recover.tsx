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
  return [{title: 'Återställ lösenord | Remlagret'}];
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

  if (!email || !email.includes('@')) {
    return json(
      {error: 'Vänligen ange en giltig e-postadress'},
      {status: 400},
    );
  }

  try {
    // Använd Shopify's recover mutation
    await context.customerAccount.recover({email});

    // Returnera success även om e-postadressen inte finns (säkerhetsskäl)
    return json({
      success: true,
      message:
        'Om ett konto med denna e-postadress existerar kommer instruktioner för återställning av lösenord att skickas inom kort.',
    });
  } catch (error: any) {
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }
    return json(
      {error: 'Något gick fel. Vänligen försök igen senare.'},
      {status: 500},
    );
  }
}

export default function Recover() {
  const actionData = useActionData<typeof action>();
  const [formSuccess, setFormSuccess] = useState(false);

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold">Återställ lösenord</h1>
        <p className="mt-4 text-gray-500">
          Ange din e-postadress nedan så skickar vi instruktioner för att återställa ditt lösenord.
        </p>

        {/* Visa success meddelande */}
        {actionData?.success ? (
          <div className="my-4 bg-green-100 rounded p-4">
            <p className="text-sm text-green-700">{actionData.message}</p>
            <div className="mt-4 text-center">
              <Link
                to="/account/login"
                className="text-primary hover:text-primary/80"
              >
                Tillbaka till inloggning
              </Link>
            </div>
          </div>
        ) : (
          <Form
            method="post"
            noValidate
            className="mt-8 space-y-6"
            onSubmit={() => setFormSuccess(false)}
          >
            {actionData?.error && (
              <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
                <p className="m-4 text-sm text-red-900">{actionData.error}</p>
              </div>
            )}

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
                className={getInputStyleClasses(actionData?.error)}
                aria-label="E-post"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-primary text-contrast rounded py-3 px-4 focus:shadow-outline font-bold hover:opacity-90 transition-opacity duration-200"
              >
                Skicka instruktioner
              </button>
            </div>

            <div className="flex items-center justify-center mt-8 border-t border-gray-300">
              <p className="align-baseline text-sm mt-6">
                Kom du på lösenordet?{' '}
                <Link
                  className="inline text-primary hover:text-primary/80"
                  to="/account/login"
                >
                  Logga in
                </Link>
              </p>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
} 