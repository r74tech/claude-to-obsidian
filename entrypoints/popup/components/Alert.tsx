import type React from 'react';

interface AlertProps {
  type: 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type, children }) => {
  const className = `${type}-message`;

  return <div className={className}>{children}</div>;
};
