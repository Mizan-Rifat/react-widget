import { useRef, useState } from 'preact/hooks';
import { WidgetConfig } from './InteractiveWidget';

interface WidgetContentFormProps {
  config: WidgetConfig;
}

interface WidgetContentFormValues {
  email: string;
  subject: string;
  message: string;
  ticketFieldId?: string;
  attachments?: File[];
}

interface FormErrors {
  email?: string;
  subject?: string;
  message?: string;
  ticketFieldId?: string;
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

const validateAttachments = (files: File[]): string | undefined => {
  if (files.length > 5) return 'Maximum 5 files are allowed';
  return undefined;
};

const WidgetContentForm = ({ config }: WidgetContentFormProps) => {
  const [formData, setFormData] = useState<WidgetContentFormValues>({
    email: '',
    subject: '',
    message: '',
    ticketFieldId: undefined,
    attachments: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof WidgetContentFormValues,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: preact.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const files = Array.from(target.files);
    const validFiles = files.filter(
      (file) =>
        ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'].includes(
          file.type,
        ) && file.size <= 400 * 1024,
    );
    setAttachments((prev) => {
      const all = [...prev, ...validFiles].slice(0, 3);
      return all;
    });
    target.value = '';
  };

  const handleRemove = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (
    e: preact.JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    e.preventDefault();

    // Validate form
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const subjectError = validateRequired(formData.subject, 'Subject');
    if (subjectError) newErrors.subject = subjectError;

    const messageError = validateRequired(formData.message, 'Message');
    if (messageError) newErrors.message = messageError;

    const attachmentError = validateAttachments(attachments);
    if (attachmentError) newErrors.attachments = attachmentError;

    setErrors(newErrors);

    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      console.log({ ...formData, attachments });
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d0d7de',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#da3633',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#24292f',
  };

  const errorStyle = {
    fontSize: '12px',
    color: '#da3633',
    marginTop: '4px',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='p-6 flex flex-col gap-4'>
        <div>
          <label style={labelStyle}>
            Email <span style={{ color: '#da3633' }}>*</span>
          </label>
          <input
            type='email'
            placeholder='Your email address'
            value={formData.email}
            onChange={(e) =>
              handleInputChange('email', (e.target as HTMLInputElement).value)
            }
            style={errors.email ? errorInputStyle : inputStyle}
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
        </div>

        <div>
          <label style={labelStyle}>
            Subject <span style={{ color: '#da3633' }}>*</span>
          </label>
          <input
            type='text'
            placeholder='Subject'
            value={formData.subject}
            onChange={(e) =>
              handleInputChange('subject', (e.target as HTMLInputElement).value)
            }
            style={errors.subject ? errorInputStyle : inputStyle}
          />
          {errors.subject && <div style={errorStyle}>{errors.subject}</div>}
        </div>

        <div>
          <label style={labelStyle}>
            Message <span style={{ color: '#da3633' }}>*</span>
          </label>
          <textarea
            placeholder='Your message'
            value={formData.message}
            onChange={(e) =>
              handleInputChange(
                'message',
                (e.target as HTMLTextAreaElement).value,
              )
            }
            style={{
              ...(errors.message ? errorInputStyle : inputStyle),
              minHeight: '80px',
              resize: 'vertical',
            }}
          />
          {errors.message && <div style={errorStyle}>{errors.message}</div>}
        </div>

        {config.formWithTicketFields && (
          <div>
            <label style={labelStyle} className='sr-only'>
              Product
            </label>
            <select
              value={formData.ticketFieldId || ''}
              onChange={(e) =>
                handleInputChange(
                  'ticketFieldId',
                  (e.target as HTMLSelectElement).value,
                )
              }
              style={inputStyle}
            >
              <option value=''>Choose your product name</option>
              <option value='aurora'>Aurora</option>
              <option value='phoenix'>Phoenix</option>
              <option value='falcon'>Falcon</option>
              <option value='falcon-react'>Falcon React</option>
              <option value='phoenix-react'>Phoenix React</option>
            </select>
            {errors.ticketFieldId && (
              <div style={errorStyle}>{errors.ticketFieldId}</div>
            )}
          </div>
        )}

        {config.allowFileAttachments && (
          <>
            <div
              className='border-dashed border-border-default py-6 px-4 mt-2 flex flex-col bg-bg-neutral-muted items-center justify-center gap-4 border-1 rounded-md text-center text-fg-muted cursor-pointer'
              onClick={handleUploadClick}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleUploadClick();
              }}
              role='button'
              aria-label='Upload attachments'
              style={{
                border: '1px dashed #d0d7de',
                borderRadius: '6px',
                backgroundColor: '#f6f8fa',
                color: '#656d76',
                cursor: 'pointer',
                padding: '24px 16px',
                textAlign: 'center',
              }}
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z' />
                <polyline points='14,2 14,8 20,8' />
                <line x1='12' y1='18' x2='12' y2='12' />
                <line x1='9' y1='15' x2='15' y2='15' />
              </svg>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '8px 0 4px 0',
                }}
              >
                Click here to upload{' '}
                <span style={{ fontWeight: '400' }}>or drag and drop</span>
              </p>
              <p style={{ fontSize: '12px', margin: '0' }}>
                png, jpg, gif or mp4 (maximum 5 files)
              </p>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/png,image/jpeg,image/gif,video/mp4'
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {errors.attachments && (
              <div style={errorStyle}>{errors.attachments}</div>
            )}
            {attachments.length > 0 && (
              <div className='flex flex-col gap-2'>
                {attachments.map((file, index) => (
                  <div
                    key={file.name}
                    className='flex justify-between items-center gap-2 bg-bg-neutral-muted rounded px-2 py-1'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f6f8fa',
                      borderRadius: '6px',
                      padding: '8px',
                    }}
                  >
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className='w-10 h-10 object-cover rounded border border-border-default'
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #d0d7de',
                        }}
                      />
                    ) : file.type === 'video/mp4' ? (
                      <video
                        src={URL.createObjectURL(file)}
                        className='w-10 h-10 object-cover rounded border border-border-default'
                        controls
                        preload='metadata'
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #d0d7de',
                        }}
                      />
                    ) : null}
                    <span
                      style={{
                        fontSize: '12px',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {file.name}
                    </span>
                    <button
                      type='button'
                      onClick={() => handleRemove(index)}
                      aria-label={`Remove ${file.name}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                      }}
                    >
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 16 16'
                        fill='currentColor'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z' />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
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
            padding: '12px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            width: '100%',
          }}
        >
          {config.submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default WidgetContentForm;

// Named export for better tree shaking
export { WidgetContentForm };
