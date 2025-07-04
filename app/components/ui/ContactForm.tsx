import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(2, 'Minst 2 tecken'),
  email: z.string().email('Ogiltig e-post'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}>
      <input {...register('name')} placeholder="Namn" />
      {errors.name && <span>{errors.name.message}</span>}
      <input {...register('email')} placeholder="E-post" />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Skicka</button>
    </form>
  );
} 
