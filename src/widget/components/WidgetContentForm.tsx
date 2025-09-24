import { useEffect, useRef, useState } from 'preact/hooks';
import { WidgetConfig } from './InteractiveWidget';
import FormControl from './base/FormControl';
import FileUploader from './base/FileUploader';

interface WidgetContentFormProps {
  config: WidgetConfig;
}

export interface TicketFieldOption {
  label: string;
  order: number;
  value: string;
  default: boolean;
}

export interface TicketField {
  id: number;
  organizationId: string;
  order: number;
  label: string;
  labelForCustomer: string | null;
  name: string;
  selection: boolean;
  requiredOnSubmit: boolean;
  requiredOnClose: boolean;
  options: TicketFieldOption[];
  default: boolean;
}

interface WidgetContentFormValues {
  email: string;
  subject: string;
  message: string;
  ticketField?: {
    [key: number]: string;
  };

  attachments?: File[];
}

interface FormErrors {
  email?: string;
  subject?: string;
  message?: string;
  ticketField?: {
    [key: string]: string;
  };
  attachments?: string;
}

const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email';
  return undefined;
};

const validateRequired = (
  value: string,
  fieldName: string,
): string | undefined => {
  if (!value.trim()) return `${fieldName} is required`;
  return undefined;
};

const setByPath = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  let cur = obj;
  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      cur[key] = value;
    } else {
      cur[key] = cur[key] ?? {};
      cur = cur[key];
    }
  });
};

const WidgetContentForm = ({ config }: WidgetContentFormProps) => {
  const [ticketFields, setTicketFields] = useState<TicketField[]>([]);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const ticketFieldRefs = useRef<HTMLSelectElement[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleInputChange = (field: string) => {
    const updatedErrors = { ...errors };
    setByPath(updatedErrors, field, undefined);

    setErrors(updatedErrors);
  };

  const handleSubmit = (e: Event & { currentTarget: HTMLFormElement }) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    const formData: WidgetContentFormValues = {} as WidgetContentFormValues;

    ticketFieldRefs.current.forEach((ref) => {
      const ticketFieldError = validateRequired(ref.value || '', 'This field');

      if (ticketFieldError) {
        newErrors.ticketField = {
          ...newErrors.ticketField,
          [ref.name]: ticketFieldError,
        };
        ref.focus();
      } else {
        formData.ticketField = {
          ...formData.ticketField,
          [ref.name]: ref.value,
        };
      }
    });

    const messageError = validateRequired(
      messageRef.current?.value || '',
      'Message',
    );
    if (messageError) {
      newErrors.message = messageError;
      messageRef.current?.focus();
    } else {
      formData.message = messageRef.current?.value || '';
    }

    const subjectError = validateRequired(
      subjectRef.current?.value || '',
      'Subject',
    );
    if (subjectError) {
      newErrors.subject = subjectError;
      subjectRef.current?.focus();
    } else {
      formData.subject = subjectRef.current?.value || '';
    }

    const emailError = validateEmail(emailRef.current?.value || '');
    if (emailError) {
      newErrors.email = emailError;
      emailRef.current?.focus();
    } else {
      formData.email = emailRef.current?.value || '';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      formData.attachments = attachments;
      console.log({ formData });
    }
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://localhost:3000/api/widgets/0199754c-7955-7e22-849d-3ff2221d330d/ticket-fields`,
      );
      const data = await response.json();

      setTicketFields(data.data);
    })();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className='p-6 flex flex-col gap-3'>
        <FormControl>
          <FormControl.Label required>Email</FormControl.Label>
          <FormControl.Input
            type='email'
            placeholder='Your email address'
            ref={emailRef}
            hasError={!!errors.email}
            onChange={() => handleInputChange('email')}
          />
          {errors.email && (
            <FormControl.Validation>{errors.email}</FormControl.Validation>
          )}
        </FormControl>

        <FormControl>
          <FormControl.Label required>Subject</FormControl.Label>
          <FormControl.Input
            type='text'
            placeholder='Subject'
            ref={subjectRef}
            hasError={!!errors.subject}
            onChange={() => handleInputChange('subject')}
          />
          {errors.subject && (
            <FormControl.Validation>{errors.subject}</FormControl.Validation>
          )}
        </FormControl>

        <FormControl className='mb-3'>
          <FormControl.Label required>Message</FormControl.Label>
          <FormControl.Textarea
            placeholder='Your message'
            ref={messageRef}
            hasError={!!errors.message}
            rows={4}
            onChange={() => handleInputChange('message')}
          />

          {errors.message && (
            <FormControl.Validation>{errors.message}</FormControl.Validation>
          )}
        </FormControl>

        {config.formWithTicketFields && (
          <div className='flex flex-col gap-3 mb-3'>
            {ticketFields.map((field, index) => (
              <FormControl key={field.id}>
                <FormControl.Label required>
                  {field.labelForCustomer || field.label}
                </FormControl.Label>
                <FormControl.Select
                  name={field.name}
                  onChange={() =>
                    handleInputChange('ticketField.' + field.name)
                  }
                  ref={(el: any) => {
                    if (el) {
                      ticketFieldRefs.current[index] = el;
                    }
                  }}
                  hasError={!!errors.ticketField?.[field.name]}
                >
                  <option value=''>
                    {field.labelForCustomer || field.label}
                  </option>
                  {field.options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </FormControl.Select>
                {errors.ticketField?.[field.name] && (
                  <FormControl.Validation>
                    {errors.ticketField?.[field.name]}
                  </FormControl.Validation>
                )}
              </FormControl>
            ))}
          </div>
        )}

        {config.allowFileAttachments && (
          <FileUploader
            attachments={attachments}
            setAttachments={setAttachments}
          />
        )}

        <button
          type='submit'
          style={{
            background: config.buttonColor,
            color: config.buttonTextColor,
            borderRadius:
              config.buttonShape === 'rounded'
                ? '8px'
                : config.buttonShape === 'pill'
                  ? '9999px'
                  : '0px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            width: '100%',
          }}
          className='w-full shadow-resting-small! px-3 min-h-8'
        >
          {config.submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default WidgetContentForm;

export { WidgetContentForm };
