import { printLine } from './modules/print';
import { init } from './modules/translate';
import { waitForSongTitle } from './modules/getInfo';

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');

init();
waitForSongTitle();
printLine("Using the 'printLine' function from the Print Module");
