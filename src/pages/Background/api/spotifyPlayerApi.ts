import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: string[];
    isPlaying: boolean;
}

export class SpotifyPlayerApi {
    private api: SpotifyApi;

    constructor(api: SpotifyApi) {
        this.api = api;
    }

    // 获取当前播放曲目信息
    async getCurrentTrack(): Promise<SpotifyTrack | null> {
        try {
            const playbackState = await this.api.player.getCurrentlyPlayingTrack();

            if (!playbackState || !playbackState.item || playbackState.item.type !== 'track') {
                return null;
            }

            const track = playbackState.item as {
                id: string;
                name: string;
                artists: Array<{ name: string }>;
            };

            return {
                id: track.id,
                name: track.name,
                artists: track.artists.map(artist => artist.name),
                isPlaying: playbackState.is_playing
            };
        } catch (error) {
            console.error('获取当前播放曲目失败:', error);
            return null;
        }
    }

    // 监听播放状态变化
    watchPlaybackState(callback: (track: SpotifyTrack | null) => void): () => void {
        let previousTrackId: string | null = null;

        const checkPlaybackState = async () => {
            try {
                const currentTrack = await this.getCurrentTrack();

                if (!currentTrack) {
                    if (previousTrackId !== null) {
                        previousTrackId = null;
                        callback(null);
                    }
                    return;
                }

                if (currentTrack.id !== previousTrackId) {
                    previousTrackId = currentTrack.id;
                    callback(currentTrack);
                }
            } catch (error) {
                console.error('检查播放状态失败:', error);
            }
        };

        // 每3秒检查一次播放状态
        const intervalId = setInterval(checkPlaybackState, 3000);

        // 立即执行一次检查
        checkPlaybackState();

        // 返回清理函数
        return () => clearInterval(intervalId);
    }
} 