'use client';

import * as React from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { z } from 'zod';

type FormProps<T extends ZodSchema<any>> = {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  children: (props: {
    register: ReturnType<typeof useReactHookForm<z.infer<T>>>['register'];
    handleSubmit: ReturnType<typeof useReactHookForm<z.infer<T>>>['handleSubmit'];
    formState: ReturnType<typeof useReactHookForm<z.infer<T>>>['formState'];
  }) => React.ReactNode;
}

export function Form<T extends ZodSchema<any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormProps<T>) {
  const form = useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return children({
    register: form.register,
    handleSubmit,
    formState: form.formState,
  });
}
