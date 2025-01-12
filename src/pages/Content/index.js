import { printLine } from './modules/print';
import { init } from './modules/translate';

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');

init();

printLine("Using the 'printLine' function from the Print Module");
