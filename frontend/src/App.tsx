import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import './App.css';

type FormValues = {
  name: string;
  email: string;
};

function App() {
  const form = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch('http://localhost:8080/users/create', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('User created successfully:', data);
      form.reset();
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    }
  });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values);
  };

  return (
    <main style={{ minHeight: '100vh', width: '100%' }}>
      <h1>Hello</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            {...form.register('name', { required: 'Name is required' })}
          />
          {form.formState.errors.name && (
            <p style={{ color: 'red' }}>{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...form.register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address'
              }
            })}
          />
          {form.formState.errors.email && (
            <p style={{ color: 'red' }}>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>
        {mutation.isError && (
          <p style={{ color: 'red' }}>
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'An error occurred'}
          </p>
        )}
        {mutation.isSuccess && <p>User registered successfully!</p>}
      </form>
    </main>
  );
}

export default App;
