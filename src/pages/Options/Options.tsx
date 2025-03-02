import React from 'react';
import './Options.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return (
    <>
      <div className="OptionsContainer">{title} Page</div>
      <div className="container">
        <h2>Spotify API Settings</h2>
        <form id="spotifySettings">
          <div>
            <label htmlFor="clientId">Client ID:</label>
            <input type="text" id="clientId" name="clientId" required />
          </div>
          <div>
            <label htmlFor="redirectUri">Redirect URI:</label>
            <input type="text" id="redirectUri" name="redirectUri" required />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </>
  );
};

export default Options;
