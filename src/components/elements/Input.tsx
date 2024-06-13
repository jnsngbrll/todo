import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
  label?: string;
  id: string;
  type: string;
  placeholder?: string;
  required: boolean;
  pattern?: string;
  register: UseFormRegister<FieldValues>;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  id,
  placeholder,
  required,
  pattern,
  register,
  className,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-xs font-semibold text-gray-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        {...register(id, { required })}
        className={`py-2 px-4 rounded-md outline-none border w-full ${className}`}
      />
    </div>
  );
};

export default Input;
