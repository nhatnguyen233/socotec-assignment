import { z } from 'zod';

export const ProfileSchemaFragment = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  position: z.string().min(1, 'Position is required'),
  avatarUrl: z.string(),
});

export const ProfileSchema = ProfileSchemaFragment.extend({
  id: z.number(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

export const ProfileFormUpdateSchema = ProfileSchemaFragment.omit({
  password: true,
  avatarUrl: true,
})
  .extend({
    phoneNumber: z
      .string()
      .regex(
        /^(?:\+?[1-9]\d{0,2}|0)(?:\d{9,14})$/,
        "Invalid phone number format. It should start with a '+' followed by 1-3 digits (country code) or '0' (local number), and be followed by 9-14 digits."
      ),
  })
  .partial();

export type ProfileType = z.infer<typeof ProfileSchema>;
export type ProfileFormUpdateDto = z.infer<typeof ProfileFormUpdateSchema>;
