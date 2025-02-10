import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <label className="block">
      <input
        type="checkbox"
        name="enableTranslation"
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <span>Enable Translation</span>
    </label>
  );
};

export default Checkbox;
