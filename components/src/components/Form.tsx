import React from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";

export const Form = <T extends FieldValues>({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
}) => {
  const methods = useForm<T>();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
