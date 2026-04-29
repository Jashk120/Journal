```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; // Adjust the path if necessary
import axios from 'axios';
import { signInSchema } from '@/schemas/signInSchema';

/**
 * SignInForm component renders a login form with email and password fields.
 * It handles form submission via axios POST to '/api/users/login' and redirects
 * to the dashboard on success or displays an error toast on failure.
 *
 * @returns A JSX element representing the sign-in form page.
 */
export default function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handles the form submission event.
   * Sends a POST request to the login API endpoint with email and password.
   * On success, shows a success toast and redirects to the home page after a short delay.
   * On failure, logs the error and displays a destructive toast with the error message.
   *
   * @param data - The validated form data containing email and password.
   */
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await axios.post('/api/users/login', {
        email: data.email,
        password: data.password,
      });

      toast({
        title: 'Login Successful',
        description: response.data.message,
        variant: 'success'
      });

      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.replace('/');
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || 'An error occurred during login';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
             name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email"  {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```