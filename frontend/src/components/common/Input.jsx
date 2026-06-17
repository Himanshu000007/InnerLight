import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, type = 'text', className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-text mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition focus:ring-2 focus:ring-primary focus:ring-opacity-10 ${className}`}
          {...props}
        />
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;