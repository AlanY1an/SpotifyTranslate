import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [songInfoUrl, setSongInfoUrl] = useState('');
  const [lyricsLinks, setLyricsLinks] = useState([]);
  const [error, setError] = useState('');
  const [loadingSongInfo, setLoadingSongInfo] = useState(false);
  const [loadingLyricsLinks, setLoadingLyricsLinks] = useState(false);

  console.log('Popup component mounted');

  const fetchSongInfo = () => {
    console.log('fetchSongInfo called');
    setLoadingSongInfo(true);
    setError('');
    setSongInfoUrl('');

    chrome.runtime.sendMessage(
      {
        type: 'FETCH_SONG_INFO',
        trackName: 'Love Story',
        artistName: 'Taylor Swift',
      },
      (response) => {
        setLoadingSongInfo(false);

        if (chrome.runtime.lastError) {
          setError(`Error: ${chrome.runtime.lastError.message}`);
        } else if (response?.lyrics) {
          setSongInfoUrl(response.lyrics);
        } else {
          setError(response.error || 'No song info found.');
        }
      }
    );
  };

  const fetchLyricsContent = async () => {
    console.log('fetchLyricsContent called with URL:', songInfoUrl);
    if (!songInfoUrl) {
      console.log('No song info URL available');
      return;
    }

    setLoadingLyricsLinks(true);
    setError('');
    setLyricsLinks([]);

    try {
      const existingListener = window.messageListener;
      if (existingListener) {
        chrome.runtime.onMessage.removeListener(existingListener);
      }

      // 创建一个 Promise 来处理消息响应
      const responsePromise = new Promise((resolve, reject) => {
        window.messageListener = function (message) {
          if (message.type === 'LYRICS_RESULT') {
            console.log('Received response in popup:', message);
            resolve(message);
          }
        };
        chrome.runtime.onMessage.addListener(window.messageListener);
      });

      // 检查并关闭现有的 offscreen 文档
      try {
        await chrome.offscreen.closeDocument();
      } catch (e) {
        console.log('No existing offscreen document to close');
      }

      // 创建新的 offscreen 文档
      console.log('Creating new offscreen document...');
      await chrome.offscreen.createDocument({
        url: chrome.runtime.getURL('offscreen.html'),
        reasons: ['DOM_PARSER'],
        justification: 'Need to parse Genius lyrics page',
      });

      // 发送消息
      console.log('Sending message to offscreen document...');
      chrome.runtime.sendMessage({
        target: 'offscreen',
        type: 'FETCH_LYRICS',
        url: songInfoUrl,
      });

      // 等待响应
      const response = await Promise.race([
        responsePromise,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Timeout waiting for response')),
            10000
          )
        ),
      ]);

      // 处理响应
      if (response.error) {
        throw new Error(response.error);
      }
      setLyricsLinks(response.links || []);
    } catch (error) {
      console.error('Error in fetchLyricsContent:', error);
      setError(error.message);
    } finally {
      setLoadingLyricsLinks(false);
      // 清理
      try {
        await chrome.offscreen.closeDocument();
      } catch (e) {
        console.log('Error closing offscreen document:', e);
      }
      if (window.messageListener) {
        chrome.runtime.onMessage.removeListener(window.messageListener);
        window.messageListener = null;
      }
    }
  };

  console.log('Current state:', {
    songInfoUrl,
    lyricsLinks,
    error,
    loadingSongInfo,
    loadingLyricsLinks,
  });

  return (
    <div className="popup-container">
      <h1>Lyrics Fetcher</h1>

      {/* Fetch Song Info 按钮 */}
      <button
        onClick={fetchSongInfo}
        disabled={loadingSongInfo || loadingLyricsLinks}
      >
        {loadingSongInfo ? 'Fetching Song Info...' : 'Fetch Song Info'}
      </button>

      {songInfoUrl && (
        <p>
          Song Info URL:{' '}
          <a href={songInfoUrl} target="_blank" rel="noopener noreferrer">
            {songInfoUrl}
          </a>
        </p>
      )}

      {/* 获取歌词内容和链接的按钮 */}
      <button
        onClick={fetchLyricsContent}
        disabled={loadingLyricsLinks || !songInfoUrl}
      >
        {loadingLyricsLinks
          ? 'Fetching Lyrics Content...'
          : 'Get Lyrics Content'}
      </button>

      {/* 展示歌词链接 */}
      {lyricsLinks.length > 0 && (
        <div>
          <h2>Available Languages:</h2>
          <ul>
            {lyricsLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.language}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 错误提示 */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Popup;
