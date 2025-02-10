import React from 'react';

interface TranslationProps {
  selectedLanguage: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Record<string, string>;
}

const Translation: React.FC<TranslationProps> = ({
  selectedLanguage,
  onChange,
  options,
}) => {
  return (
    <label>
      <span>Select Language:</span>
      <select
        name="selectedLanguage"
        value={selectedLanguage}
        onChange={onChange}
      >
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Translation;
