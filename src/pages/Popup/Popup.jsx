import React, { useEffect, useState } from 'react';
import {
  getStoredOptions,
  resetStoredOptions,
  defaultOptions,
  allOptions,
} from '../Services/options';
import './Popup.css';

import { handleFormChange, handleReset } from './handler';

export default function Popup() {
  const [options, setOptions] = useState(defaultOptions);

  // ✅ 1. 初始化时从 `chrome.storage.sync` 获取数据
  useEffect(() => {
    async function fetchOptions() {
      const storedOptions = await getStoredOptions();
      setOptions(storedOptions);
    }
    fetchOptions();
  }, []);

  // ✅ 2. 监听 `chrome.storage.sync` 变化，自动更新 UI
  useEffect(() => {
    function handleStorageChange(changes) {
      if (changes.options) {
        if (changes.options) {
          setOptions(changes.options.newValue);
        }
      }
    }
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  return (
    <>
      <h1 className="app-title">Spotify Enhancer</h1>
      <form onChange={handleFormChange}>
        <div className="translation-container">
          <input
            id="checkboxInput"
            type="checkbox"
            name="enableTranslation"
            checked={options.enableTranslation}
          />
          <label className="toggleSwitch" for="checkboxInput"></label>

          <span className="translation-title">Enable Translation</span>
        </div>

        {options.enableTranslation && (
          <label>
            <span>Select Language:</span>
            <select name="selectedLanguage" value={options.selectedLanguage}>
              {Object.entries(allOptions.selectedLanguage.options).map(
                ([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                )
              )}
            </select>
          </label>
        )}

        <button id="reset" type="button" onClick={handleReset}>
          Reset to defaults
        </button>
      </form>
    </>
  );
}
