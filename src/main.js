import xs from 'xstream';
import Cycle from '@cycle/xstream-run';
import {div, button} from '@cycle/dom'; //, makeHTMLDriver} from '@cycle/dom';
import {makeWWDriver} from './makeWWDriver';

function main(sources) {

console.log('cycle main init')
  let action$ = xs.merge( // evt.target.value
    sources.WW.select('button#down').events('click').map(evt => -1),
    sources.WW.select('button#up').events('click').map(evt => +1)
  );
  let count$ = action$.fold((acc,inc) => acc + inc, 0);

  const sinks = {
    WW: count$.map(count => 
        div('#app', [
          button('#down', 'down'),
          button('#up', 'up'),
          div(`count: ${count}`)
        ])
      )
  };
  return sinks;
}

Cycle.run(main, { WW: makeWWDriver('div#app') });

