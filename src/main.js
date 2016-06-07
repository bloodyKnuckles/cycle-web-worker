import xs from 'xstream';
import Cycle from '@cycle/xstream-run';
import {div, h2, span, button} from '@cycle/dom'; //, makeHTMLDriver} from '@cycle/dom';
import {makeWWDriver} from './makeWWDriver';

function main(sources) {
  /*let action$ = xs.merge(
    sources.DOM.select('.decrement').events('click').map(ev => -1),
    sources.DOM.select('.increment').events('click').map(ev => +1)
  );
  let count$ = action$.fold((x,y) => x + y, 0);*/
  let count$ = sources.WW.select('.down')
    .events('click')
    .map(x => {
      console.log('x', x);
      return 1
    })
    .fold((x,y) => {
      let ret = x + y;
      console.log('acc',x, 'nxt',y, 'ret',ret);
      return ret
    }, 0);
  return {
    WW: count$.map(count => {
console.log('acc1')
        return div([
          h2('Hello ',[span('#count', `${count}`)]),
          button('#down', 'down'),
          button('#up', 'up'),
        ])
      })
  };
}

Cycle.run(main, {
  WW: makeWWDriver('#main-container')
  //DOM: makeHTMLDriver('#main-container')
});
