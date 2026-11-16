"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormError, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { signIn, type SignInState } from "@/server/actions/auth";

/**
 * Form login HAL-01. Memakai form action biasa (useActionState), sehingga tetap berfungsi
 * sebelum JavaScript selesai dimuat. Tidak ada tautan daftar atau lupa password (AC5).
 */
export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <form action={action} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <FormError message={state.message} />
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          defaultValue={state.email}
          aria-invalid={state.message ? true : undefined}
          autoFocus
        />
      </FormField>
      <FormField label="Password" htmlFor="password">
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          aria-invalid={state.message ? true : undefined}
        />
      </FormField>
      <Button type="submit" size="lg" className="w-full md:h-control-height" loading={pending}>
        Masuk
      </Button>
    </form>
  );
}
