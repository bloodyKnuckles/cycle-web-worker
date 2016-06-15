import xs from 'xstream';
import Cycle from '@cycle/xstream-run';
import {div, button, input} from '@cycle/dom'; //, makeHTMLDriver} from '@cycle/dom';
import {makeWWDriver} from './makeWWDriver';

function main(sources) {

console.log('cycle main init')
  let action$ = xs.merge( // evt.target.value
    sources.WW.select('button#down').events('click').map(evt => { return {'count': -1} }),
    sources.WW.select('button#up').events('click').map(evt => { return {'count': 1} }),
    sources.WW.select('#in').events('keyup').map(evt => { return {'txt': evt.response} })
  );
  let output$ = action$.fold((acc, val) => {
      acc.count = val.count? acc.count + val.count: acc.count
      acc.txt = val.txt || acc.txt
      return acc
    }, {'count': 0, 'txt': ''})

  const sinks = {
    WW: output$.map(output => {
      return div('#app', [
        button('#down', 'down'),
        button('#up', 'up'),
        div(`count: ${output.count}`),
        input('#in'),
        div('#out', output.txt)
      ])
    })
  };
  return sinks;
}

Cycle.run(main, { WW: makeWWDriver('div#app') });

