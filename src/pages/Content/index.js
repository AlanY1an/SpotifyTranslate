import { printLine } from './modules/print';
import { showLyricsTranslated } from './modules/translate';
import { sendExtractLyricsMessages } from "./modules/lyricsExtractor";

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');

showLyricsTranslated();
sendExtractLyricsMessages();




