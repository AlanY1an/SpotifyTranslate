import { createRoot } from 'react-dom/client';
import Popup, { notifyUser } from './Popup';
import React from 'react';
import './index.css';

console.log('Popup index.jsx loaded');

const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(<Popup />);

// 示例：检查当前标签页并调用 notifyUser
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab && !currentTab.url.includes('open.spotify.com')) {
    console.log('This is not a Spotify page!');
  }
});
