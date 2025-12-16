"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginSchema, SignupSchema } from '@/schemas';
import { login, signup } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type AuthFormProps = {
  type: 'login' | 'signup';
};

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isLogin = type === 'login';
  const schema = isLogin ? LoginSchema : SignupSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isLogin
      ? { email: '', password: '' }
      : { name: '', email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(async () => {
      const action = isLogin ? login : signup;
      // The `values` type needs to be asserted because `login` and `signup` expect different shapes.
      const result = await action(values as any); 

      if (result.error) {
        toast({
          title: 'Authentication Error',
          description: result.error,
          variant: 'destructive',
        });
      }

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.success,
        });
        router.push('/dashboard');
      }
    });
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to continue to Cinepedia.' : 'Join us and start your cinematic journey.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••••" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link href={isLogin ? '/signup' : '/login'} className="underline text-accent-foreground/80 hover:text-accent-foreground">
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
