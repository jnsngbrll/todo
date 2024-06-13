import React from 'react';

interface ButtonProps {
  type: 'button' | 'submit';
  title: string;
  variant?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, title, variant, onClick }) => {
  const solidButtonStyle =
    'py-2 px-4 bg-primary text-sm font-medium text-white rounded-md';
  const outlineButtonStyle =
    'py-2 px-4 border border-primary text-sm font-medium text-primary rounded-md';

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${
        variant !== 'outline' ? solidButtonStyle : outlineButtonStyle
      }`}
    >
      {title}
    </button>
  );
};

export default Button;
