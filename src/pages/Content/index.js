import { printLine } from './modules/print';
import { showLyricsTranslated } from './modules/translate';
import { extractLyricsFromURL } from "../Content/modules/lyricsExtractor";

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');

showLyricsTranslated();

const testLyricsURL = "https://genius.com/Genius-brasil-traducoes-ed-sheeran-shape-of-you-traducao-em-portugues-lyrics"
extractLyricsFromURL(testLyricsURL)

