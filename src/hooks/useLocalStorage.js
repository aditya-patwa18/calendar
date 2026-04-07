import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const getInitialValue = () => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState(getInitialValue);

  const updateValue = (newValue) => {
    try {
      const finalValue =
        typeof newValue === 'function' ? newValue(value) : newValue;

      setValue(finalValue);
      window.localStorage.setItem(key, JSON.stringify(finalValue));
    } catch {

    }
  };

  return [value, updateValue];
}