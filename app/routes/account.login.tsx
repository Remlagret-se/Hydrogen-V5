import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Form} from 'react-router';

export async function loader() {
  return {};
}

export default function Login() {
  return (
    <div className="login">
      <h1>Login</h1>
      <Form method="post" className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
          />
        </div>
        <button type="submit">Sign in</button>
      </Form>
    </div>
  );
} 
