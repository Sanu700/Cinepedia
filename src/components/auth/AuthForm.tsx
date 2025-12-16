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
import { login, signup, signInWithGoogle } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { GoogleIcon } from '../icons/GoogleIcon';

type AuthFormProps = {
  type: 'login' | 'signup';
};

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();


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
        if (isLogin) {
          router.push('/dashboard');
        } else {
          // On signup, Firebase automatically logs the user in.
          // We can redirect them to a page that tells them to verify their email.
          router.push('/'); 
        }
      }
    });
  };

  const onGoogleSignIn = () => {
    startGoogleTransition(async () => {
        const result = await signInWithGoogle();
        if (result.error) {
            toast({
                title: 'Google Sign-In Error',
                description: result.error,
                variant: 'destructive'
            });
        }
        if (result.success) {
            toast({
                title: 'Success!',
                description: 'Logged in with Google successfully.'
            });
            router.push('/dashboard');
        }
    })
  }

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
          <div className="space-y-4">
             <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isPending || isGooglePending}>
                {isGooglePending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <GoogleIcon className="mr-2 h-5 w-5" />
                )}
                Sign {isLogin ? 'in' : 'up'} with Google
            </Button>

            <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" disabled={isPending || isGooglePending} />
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
                        disabled={isPending || isGooglePending}
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
                      <Input {...field} type="password" placeholder="••••••••" disabled={isPending || isGooglePending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending || isGooglePending}>
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
