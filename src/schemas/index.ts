import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'A valid email is required.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

export const SignupSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  email: z.string().email({
    message: 'A valid email is required.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});


export const ReviewSchema = z.object({
    rating: z.number().min(1, "Rating is required").max(5),
    text: z.string().min(10, {
        message: "Review must be at least 10 characters long."
    }).max(1000, {
        message: "Review must not exceed 1000 characters."
    }),
    movieId: z.string(),
    userId: z.string(),
});
