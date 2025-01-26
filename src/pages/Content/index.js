import { showLyricsTranslated } from './modules/translate';
import { printLine } from './modules/print';

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');
printLine();


showLyricsTranslated();
