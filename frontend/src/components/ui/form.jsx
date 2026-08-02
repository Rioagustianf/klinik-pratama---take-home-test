import { createContext, useContext, useId } from "react";
import { Slot } from "@radix-ui/react-slot";
import { FormProvider, Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormFieldContext = createContext({});

const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const { formState, getFieldState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext.name) {
    throw new Error("useFormField should be used within <FormField>");
  }

  return {
    id: fieldContext.name,
    name: fieldContext.name,
    formItemContext: {
      id: fieldContext.name,
      name: fieldContext.name,
      formDescriptionId: `${fieldContext.name}-form-item-description`,
      formMessageId: `${fieldContext.name}-form-item-message`,
    },
    ...fieldState,
  };
};

const FormItemContext = createContext({});

const FormItem = ({ className, ...props }) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
};

const FormLabel = ({ className, ...props }) => {
  const { id } = useFormField();

  return (
    <label
      className={cn(
        "text-sm font-medium leading-none text-ink-soft peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      htmlFor={id}
      {...props}
    />
  );
};

const FormControl = ({ ...props }) => {
  const { error, formItemContext } = useFormField();

  return (
    <Slot
      id={formItemContext.id}
      aria-describedby={
        !error
          ? `${formItemContext.formDescriptionId}`
          : `${formItemContext.formDescriptionId} ${formItemContext.formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};

const FormDescription = ({ className, ...props }) => {
  const { formItemContext } = useFormField();

  return (
    <p
      id={formItemContext.formDescriptionId}
      className={cn("text-[0.8rem] text-ink-muted", className)}
      {...props}
    />
  );
};

const FormMessage = ({ className, children, ...props }) => {
  const { error, formItemContext } = useFormField();
  const body = error?.message || children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formItemContext.formMessageId}
      className={cn("text-[0.8rem] font-medium text-danger-500", className)}
      {...props}
    >
      {body}
    </p>
  );
};

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
