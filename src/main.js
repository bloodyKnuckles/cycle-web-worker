//import xs from 'xstream';
import Cycle from '@cycle/xstream-run';
import {div, button} from '@cycle/dom'; //, makeHTMLDriver} from '@cycle/dom';
import {makeWWDriver} from './makeWWDriver';

function main(sources) {

console.log('cycle main init')

  const sinks = {
    WW: sources.WW.select('button#up').events('click')
      .map(evt => evt.target.value)
      .fold((acc,inc) => acc + inc, 0)
      .map(count => 
        div('#app', [
          button('#up', 'up'),
          div(`count: ${count}`)
        ])
      )
  };
  return sinks;
}

Cycle.run(main, { WW: makeWWDriver('div#app') });

