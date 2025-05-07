// CustomCheckbox.tsx
import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  value: string;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, value, onChange }) => {
  const getCheckmark = () => {
    if (!checked) return null;
    switch (value) {
      case '1': return 'x';
      case '2': return 'y';
      case '3': return 'z';
      default: return 'x';
    }
  };

  return (
    <div 
      className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer
        ${checked ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}
      onClick={() => onChange(!checked)}
    >
      {checked && (
        <span className="text-xs font-bold text-blue-700">{getCheckmark()}</span>
      )}
    </div>
  );
};

export default CustomCheckbox;