/* @flow weak */
/* eslint max-len: "off", arrow-parens: "off", no-plusplus: "off", one-var: "off", one-var-declaration-per-line: "off" */

const log = process.stderr;
const str = JSON.stringify;

function toNegaBinary(number) {
  const negabinary = [];
  const base = -2;

  let remain;

  while (number !== 0) {
    remain = number % base;
    number = Math.ceil(number / base);
    negabinary.push(remain >= 0 ? remain : -remain);
  }

  return negabinary.reverse();
}

function solution(arr) {
  const bits = arr.join('');
  const deci = parseInt(bits, 2);

  return (-deci).toString(2);
}

log.write(`******** ${new Date().toString()} *********** \n`);
const time = process.hrtime();
const res = solution([1, 1, 1, 1]);
const diff = process.hrtime(time);
log.write(`Answer: ${str(res)}\n`);
log.write(`${diff[0]} seconds, ${diff[1].toLocaleString()} nanoseconds \n`);
