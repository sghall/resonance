/* @flow weak */
/* eslint max-len: "off", arrow-parens: "off", no-plusplus: "off", one-var: "off", one-var-declaration-per-line: "off" */

const log = process.stderr;
const str = JSON.stringify;

function solution(input) {

  const merge = (a, b) => {

  };

  const split = (arr) => {
    const mid = Math.floor(arr.length / 2);

  };

  return split(input);
}

log.write(`********** ${new Date().toString()} *********** \n`);
const time = process.hrtime();
const res = solution([1, 1, 1, 1]);
const diff = process.hrtime(time);
log.write(`Answer: ${str(res)}\n`);
log.write(`${diff[0]} seconds, ${diff[1].toLocaleString()} nanoseconds \n`);
