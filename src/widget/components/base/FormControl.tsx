import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'preact';
import { ForwardedRef, forwardRef, PropsWithChildren } from 'preact/compat';

interface FormControlProps {
  className?: string;
}

interface FormControlLabelProps {
  required?: boolean;
  className?: string;
}

interface FormControlInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  hasError?: boolean;
}

interface FormControlSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  hasError?: boolean;
}

interface FormControlTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  hasError?: boolean;
}

const FormControl = ({
  children,
  className,
}: PropsWithChildren<FormControlProps>) => {
  return <div className={className}>{children}</div>;
};

const FormControlLabel = ({
  children,
  required,
  className,
}: PropsWithChildren<FormControlLabelProps>) => {
  return (
    <label
      className={`text-sm leading-5 text-fg-default font-semibold ${className}`}
    >
      {children} {required && <span>*</span>}
    </label>
  );
};

const FormControlInput = forwardRef(
  (
    { children, hasError, ...props }: PropsWithChildren<FormControlInputProps>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const errorClass = hasError
      ? 'focus-within:outline-border-danger-emphasis border-border-danger-emphasis!'
      : '';

    return (
      <span
        className={`flex border border-border-default rounded-md w-full min-h-8 text-sm leading-5 -outline-offset-1 shadow-inset focus-within:outline-2 focus-within:outline-border-accent-emphasis mt-1 ${errorClass}`}
      >
        <input
          className='px-3 py-px rounded-md w-full text-sm leading-5 outline-none text-fg-default'
          {...props}
          ref={ref}
        />
      </span>
    );
  },
);

const FormControlSelect = forwardRef(
  (
    { children, hasError, ...props }: PropsWithChildren<FormControlSelectProps>,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => {
    const errorClass = hasError
      ? 'focus-within:outline-border-danger-emphasis border-border-danger-emphasis!'
      : '';

    return (
      <span
        className={`flex border border-border-default rounded-md w-full min-h-8 text-sm leading-5 -outline-offset-1 shadow-inset focus-within:outline-2 focus-within:outline-border-accent-emphasis mt-1 ${errorClass}`}
      >
        <select
          {...props}
          className='px-3 mr-2 rounded-md w-full text-sm leading-5 outline-none text-fg-default'
          ref={ref}
        >
          {children}
        </select>
      </span>
    );
  },
);

const FormControlTextarea = forwardRef(
  (
    {
      children,
      hasError,
      ...props
    }: PropsWithChildren<FormControlTextareaProps>,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const errorClass = hasError
      ? 'focus-within:outline-border-danger-emphasis border-border-danger-emphasis!'
      : '';

    return (
      <span
        className={`flex border border-border-default rounded-md w-full min-h-8 text-sm leading-5 -outline-offset-1 shadow-inset focus-within:outline-2 focus-within:outline-border-accent-emphasis mt-1 ${errorClass}`}
      >
        <textarea
          className='p-3 rounded-md w-full text-sm leading-5 outline-none text-fg-default'
          {...props}
          ref={ref}
        />
      </span>
    );
  },
);

const FormControlValidation = ({ children }: PropsWithChildren) => {
  return (
    <div className='text-xs leading-4 font-semibold text-fg-danger mt-1'>
      {children}
    </div>
  );
};

FormControl.Label = FormControlLabel;
FormControl.Input = FormControlInput;
FormControl.Select = FormControlSelect;
FormControl.Textarea = FormControlTextarea;
FormControl.Validation = FormControlValidation;

export default FormControl;
