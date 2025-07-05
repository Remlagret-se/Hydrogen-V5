import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, useActionData, type MetaFunction} from '@remix-run/react';
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

export async function action({request, context, params}: ActionFunctionArgs) {
  const form = await request.formData();
  const password = String(form.get('password'));
  const passwordConfirm = String(form.get('passwordConfirm'));
  const resetToken = String(params.resetToken);
  const id = String(params.id);

  const validationErrors: Record<string, string> = {};

  if (!password || password.length < 8) {
    validationErrors.password = 'Lösenordet måste vara minst 8 tecken';
  }

  if (password !== passwordConfirm) {
    validationErrors.passwordConfirm = 'Lösenorden matchar inte';
  }

  if (Object.keys(validationErrors).length > 0) {
    return json({errors: validationErrors}, {status: 400});
  }

  try {
    // Använd Shopify's resetPassword mutation
    const {accessToken} = await context.customerAccount.resetPassword({
      id,
      input: {
        password,
        resetToken,
      },
    });

    if (!accessToken) {
      return json(
        {error: 'Något gick fel vid återställning av lösenord.'},
        {status: 400},
      );
    }

    // Logga in användaren direkt efter återställning
    const headers = new Headers();
    headers.append('Set-Cookie', await accessToken.commit());

    return redirect('/account', {headers});
  } catch (error: any) {
    if (error?.message) {
      return json({error: error.message}, {status: 500});
    }
    return json(
      {
        error:
          'Länken för återställning av lösenord är ogiltig eller har gått ut. Vänligen begär en ny återställningslänk.',
      },
      {status: 500},
    );
  }
}

export default function Reset() {
  const actionData = useActionData<typeof action>();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold">Återställ lösenord</h1>
        <p className="mt-4 text-gray-500">
          Ange ditt nya lösenord nedan för att återställa ditt konto.
        </p>

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
            {/* Nytt lösenord */}
            <div>
              <label className="block text-sm font-medium" htmlFor="password">
                Nytt lösenord
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={getInputStyleClasses(actionData?.errors?.password)}
                  aria-label="Nytt lösenord"
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

            {/* Bekräfta nytt lösenord */}
            <div>
              <label
                className="block text-sm font-medium"
                htmlFor="passwordConfirm"
              >
                Bekräfta nytt lösenord
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
                aria-label="Bekräfta nytt lösenord"
              />
              {actionData?.errors?.passwordConfirm && (
                <p className="text-red-500 text-xs mt-1">
                  {actionData.errors.passwordConfirm}
                </p>
              )}
            </div>
          </div>

          {/* Submit-knapp */}
          <div>
            <button
              type="submit"
              className="w-full bg-primary text-contrast rounded py-3 px-4 focus:shadow-outline font-bold hover:opacity-90 transition-opacity duration-200"
            >
              Återställ lösenord
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
} 