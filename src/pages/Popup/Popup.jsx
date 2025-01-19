import React, { useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [lyricsUrl, setLyricsUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLyrics = () => {
    setLoading(true);
    setError('');
    setLyricsUrl('');

    chrome.runtime.sendMessage(
      {
        type: 'FETCH_LYRICS',
        trackName: 'Shape of You',
        artistName: 'Ed Sheeran',
      },
      (response) => {
        setLoading(false);

        if (chrome.runtime.lastError) {
          setError(`Error: ${chrome.runtime.lastError.message}`);
        } else if (response?.lyrics) {
          setLyricsUrl(response.lyrics); // 显示真实歌词 URL
        } else {
          setError(response.error || 'No lyrics found.');
        }
      }
    );
  };

  return (
    <div className="popup-container">
      <h1>Lyrics Fetcher</h1>
      <button onClick={fetchLyrics} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Lyrics'}
      </button>
      {lyricsUrl && (
        <p>
          Lyrics URL:{' '}
          <a href={lyricsUrl} target="_blank" rel="noopener noreferrer">
            {lyricsUrl}
          </a>
        </p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Popup;
