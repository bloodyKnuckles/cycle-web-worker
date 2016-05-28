import xs from 'xstream';
import Cycle from '@cycle/xstream-run';
import {div, button, p} from '@cycle/dom'; //, makeHTMLDriver} from '@cycle/dom';
import {makeWWDriver} from './makeWWDriver';

function main(sources) {
  /*let action$ = xs.merge(
    sources.DOM.select('.decrement').events('click').map(ev => -1),
    sources.DOM.select('.increment').events('click').map(ev => +1)
  );
  let count$ = action$.fold((x,y) => x + y, 0);*/
  let count$ = sources.WW.map(x => 1).fold((x,y) => x + y, 0);
  return {
    WW: count$.map(count => {
        return div([
          button('.decrement', 'Decrement'),
          button('.increment', 'Increment'),
          p('Counter: ' + count)
        ])
      })
  };
}

Cycle.run(main, {
  WW: makeWWDriver('#main-container')
  //DOM: makeHTMLDriver('#main-container')
});
