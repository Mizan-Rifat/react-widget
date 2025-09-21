import {
  Button,
  FormControl,
  IconButton,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@primer/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UploadIcon, XIcon } from '@primer/octicons-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
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

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
  ticketFieldId: yup.string().optional(),
  attachments: yup.array().max(5, 'Maximum 5 files are allowed').optional(),
});

const WidgetContentForm = ({ config }: WidgetContentFormProps) => {
  const methods = useForm<WidgetContentFormValues>({
    defaultValues: {
      email: '',
      subject: '',
      message: '',
      ticketFieldId: undefined,
      attachments: [],
    },
    //@ts-ignore
    resolver: yupResolver(schema),
  });

  const {
    register,
    formState: { errors },
  } = methods;

  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) =>
        ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'].includes(
          file.type
        ) && file.size <= 400 * 1024
    );
    setAttachments((prev) => {
      const all = [...prev, ...validFiles].slice(0, 3);
      return all;
    });
    e.target.value = '';
  };

  const handleRemove = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = methods.handleSubmit((data) => {
    console.log({ ...data, attachments });
  });

  return (
    <FormProvider {...methods}>
      <div className="p-6 flex flex-col gap-4">
        <FormControl required>
          <FormControl.Label>Email</FormControl.Label>
          <TextInput
            block
            placeholder="Your email address"
            {...register('email')}
          />
          {errors.email && (
            <FormControl.Validation variant="error">
              {errors.email.message}
            </FormControl.Validation>
          )}
        </FormControl>
        <FormControl required>
          <FormControl.Label>Subject</FormControl.Label>
          <TextInput block placeholder="Subject" {...register('subject')} />
          {errors.subject && (
            <FormControl.Validation variant="error">
              {errors.subject.message}
            </FormControl.Validation>
          )}
        </FormControl>
        <FormControl required>
          <FormControl.Label>Message</FormControl.Label>
          <Textarea block placeholder="Your message" {...register('message')} />
          {errors.message && (
            <FormControl.Validation variant="error">
              {errors.message.message}
            </FormControl.Validation>
          )}
        </FormControl>
        {config.formWithTicketFields && (
          <FormControl>
            <FormControl.Label visuallyHidden>Label</FormControl.Label>
            <Select block>
              <Select.Option value="one">
                Choose your product name
              </Select.Option>
              <Select.Option value="two">Aurora</Select.Option>
              <Select.Option value="three">Phoenix</Select.Option>
              <Select.Option value="four">Falcon</Select.Option>
              <Select.Option value="five">Falcon React</Select.Option>
              <Select.Option value="six">Phoenix React</Select.Option>
            </Select>
            {errors.ticketFieldId && (
              <FormControl.Validation variant="error">
                {errors.ticketFieldId.message}
              </FormControl.Validation>
            )}
          </FormControl>
        )}
        {config.allowFileAttachments && (
          <>
            <div
              className="border-dashed border-border-default py-6 px-4 mt-2 flex flex-col bg-bg-neutral-muted items-center justify-center gap-4 border-1 rounded-md text-center text-fg-muted cursor-pointer"
              onClick={handleUploadClick}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleUploadClick();
              }}
              role="button"
              aria-label="Upload attachments"
            >
              <UploadIcon />
              <Text weight="semibold" color="fg.muted" size="medium">
                Click here to upload{' '}
                <span className="font-normal">or drag and drop</span>
              </Text>
              <Text className="-mt-3" color="fg.muted" size="small">
                png, jpg, gif or mp4 (maximum 5 files)
              </Text>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,video/mp4"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-col gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={file.name}
                    className="flex justify-between items-center gap-2 bg-bg-neutral-muted rounded px-2 py-1"
                  >
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded border border-border-default"
                      />
                    ) : file.type === 'video/mp4' ? (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-10 h-10 object-cover rounded border border-border-default"
                        controls
                        preload="metadata"
                      />
                    ) : null}
                    <Text size="small" className="truncate">
                      {file.name}
                    </Text>
                    <IconButton
                      icon={XIcon}
                      size="small"
                      variant="invisible"
                      onClick={() => handleRemove(index)}
                      aria-label={`Remove ${file.name}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <Button
          onClick={handleSubmit}
          style={{
            background: config.buttonColor,
            color: config.buttonTextColor,
            borderRadius:
              config.buttonShape === 'rounded'
                ? '8px'
                : config.buttonShape === 'pill'
                ? '9999px'
                : '0px',
          }}
          variant="primary"
        >
          {config.submitButtonText}
        </Button>
      </div>
    </FormProvider>
  );
};

export default WidgetContentForm;
