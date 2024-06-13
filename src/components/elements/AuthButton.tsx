import React from 'react';
import { IconType } from 'react-icons';

interface AuthButtonProps {
  onClick: () => void;
  icon: IconType;
  title: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  onClick,
  icon: Icon,
  title,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 flex items-center justify-center gap-x-1 font-medium border rounded-md"
    >
      <Icon size={20} /> {title}
    </button>
  );
};

export default AuthButton;
