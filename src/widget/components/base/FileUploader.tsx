import { Dispatch, StateUpdater } from 'preact/hooks';

interface FileUploaderProps {
  attachments: File[];
  setAttachments: Dispatch<StateUpdater<File[]>>;
}

const FileUploader = ({ attachments, setAttachments }: FileUploaderProps) => {
  const handleFileChange = (
    e: preact.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const files = Array.from(target.files);
    console.log({ files });
    const validFiles = files.filter(
      (file) =>
        ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'].includes(
          file.type,
        ) && file.size <= 5 * 1024 * 1024,
    );
    setAttachments((prev) => {
      const all = [...prev, ...validFiles].slice(0, 5);
      return all;
    });
    target.value = '';
  };

  const handleRemove = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <label
        className='border-dashed border-border-default p-6 flex flex-col bg-bg-neutral-muted items-center justify-center border-1 rounded-md text-center text-fg-muted cursor-pointer mb-3'
        // onClick={handleUploadClick}
        // tabIndex={0}
        // onKeyDown={(e) => {
        //   if (e.key === 'Enter' || e.key === ' ') handleUploadClick();
        // }}
        role='button'
        aria-label='Upload attachments'
        style={{
          backgroundColor: '#818b981f',
        }}
        htmlFor='attachments'
      >
        <svg
          width='14'
          height='13'
          viewBox='0 0 14 13'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='mb-4'
        >
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M1.75 13C0.783501 13 1.51525e-07 12.2165 1.09278e-07 11.25L0 8.74998C-1.81059e-08 8.33577 0.335786 7.99998 0.75 7.99998C1.16421 7.99998 1.5 8.33577 1.5 8.74998L1.5 11.25C1.5 11.3881 1.61193 11.5 1.75 11.5L12.25 11.5C12.3881 11.5 12.5 11.3881 12.5 11.25V8.74998C12.5 8.33577 12.8358 7.99998 13.25 7.99998C13.6642 7.99998 14 8.33577 14 8.74998V11.25C14 12.2165 13.2165 13 12.25 13L1.75 13Z'
            fill='#1F2328'
          />
          <path
            d='M10.7803 3.71967C11.0732 4.01256 11.0732 4.48744 10.7803 4.78033C10.4874 5.07322 10.0126 5.07322 9.71967 4.78033L7.75 2.81066L7.75 8.49998C7.75 8.91419 7.41421 9.24998 7 9.24998C6.58578 9.24998 6.25 8.91419 6.25 8.49998L6.25 2.81066L4.28033 4.78033C3.98744 5.07322 3.51256 5.07322 3.21967 4.78033C2.92678 4.48744 2.92678 4.01256 3.21967 3.71967L6.46967 0.46967C6.76256 0.176777 7.23744 0.176777 7.53033 0.46967L10.7803 3.71967Z'
            fill='#1F2328'
          />
        </svg>
        <p className='text-sm leading-5 font-semibold text-fg-muted mb-1'>
          Click here to upload{' '}
          <span className='font-normal'>or drag and drop</span>
        </p>
        <p className='text-xs leading-5 text-fg-muted'>
          png, jpg, gif or mp4 (maximum 5 files)
        </p>
      </label>
      <input
        id='attachments'
        type='file'
        accept='image/png,image/jpeg,image/gif,video/mp4'
        multiple
        className='hidden'
        onChange={handleFileChange}
      />

      {attachments.length > 0 && (
        <div className='flex flex-col gap-2'>
          {attachments.map((file, index) => (
            <div
              key={file.name}
              className='flex justify-between items-center gap-2 rounded px-2 py-1'
              style={{
                backgroundColor: '#818b981f',
              }}
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  height={40}
                  width={40}
                  className='w-10 h-10 object-cover rounded border border-border-default'
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
              <span className='text-xs leading-5 text-fg-muted truncate flex-1'>
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
  );
};

export default FileUploader;

export { FileUploader };
