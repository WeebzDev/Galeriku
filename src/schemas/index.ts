import { z } from "zod";

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Nama pengguna minimal 2 karakter." })
    .max(50, { message: "Nama pengguna maksimal 50 karakter." }),
  password: z
    .string()
    .min(8, { message: "Kata sandi minimal 8 karakter." })
    .max(50, { message: "Kata sandi maksimal 50 karakter." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Kata sandi harus mengandung minimal satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus.",
    }),
  confirm_password: z
    .string()
    .min(8, { message: "Kata sandi minimal 8 karakter." })
    .max(50, { message: "Kata sandi maksimal 50 karakter." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Kata sandi harus mengandung minimal satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus.",
    }),
});

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Nama pengguna minimal 2 karakter." })
    .max(50, { message: "Nama pengguna maksimal 50 karakter." }),
  password: z
    .string()
    .min(8, { message: "Kata sandi minimal 8 karakter." })
    .max(50, { message: "Kata sandi maksimal 50 karakter." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Kata sandi harus mengandung minimal satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus.",
    }),
});

export type registerFormSchemaType = z.infer<typeof registerFormSchema>;
export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
