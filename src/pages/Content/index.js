import { showLyricsTranslated } from './modules/translate';
import { sendExtractLyricsMessages } from "./modules/lyricsExtractor";

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');
printLine();
showLyricsTranslated();
sendExtractLyricsMessages();




