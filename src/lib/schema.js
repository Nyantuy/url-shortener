import { z } from 'zod';

const formSchema = z.object({
  url: z.string().regex(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/, {
    message: 'Invalid URL format: must start with http:// or https:// and contain valid characters',
  }),
  duration: z
    .string()
    .regex(/^(3h|12h|1d|7d)$/, {
      message: 'Duration must be one of: 3h, 12h, 1d, or 7d',
    })
    .optional()
    .or(z.literal('')),
  alias: z
    .string()
    .regex(/^[A-Za-z_0-9]+$/, {
      message: 'Alias must contain only letters (a-z and A-Z) or numbers (0-9) or underscores (_)',
    })
    .optional()
    .or(z.literal('')),
});

export default formSchema;
