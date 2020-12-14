// new Date().getTime() => milliseconds since Jan 1, 1970, 00:00:00.000 GMT
// new Date().setTime(EPOCH) => Wed Jan 08 2014 04:00:00 GMT+0100 (Mitteleuropäische Normalzeit)
// FIRST CYCLE EVER!
export const EPOCH = 1389150000000;
export const CYCLE_LENGTH = 630000000; // in ms => 175 Hours
export const CHECKPOINT_LENGTH = 18000000;

export const TIME_FORMAT = 'HH:mm';
export const DATE_FORMAT = 'dddd D MMM';