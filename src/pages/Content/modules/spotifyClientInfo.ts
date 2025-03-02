import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { SpotifyPlayerApi } from '../../Background/api/spotifyPlayerApi';

export const spotifyApi = new SpotifyPlayerApi(
    SpotifyApi.withUserAuthorization(
        'YOUR_CLIENT_ID',
        'YOUR_REDIRECT_URI'
    )
); 