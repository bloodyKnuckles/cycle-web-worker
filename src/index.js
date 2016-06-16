import sd from 'snabbdom'
import sh from 'snabbdom/h'
var patch = sd.init([])

console.log('index init')

var rootnode

var worker = new Worker('./dist/main.js')

worker.addEventListener('message', function (evt) {
  evt.data.forEach(function (data) {
    switch ( data.cmd ) {
      case 'init':
        rootnode = document.querySelector(data.rootnode)
        worker.postMessage({
          cmd: 'init',
          absurl: location.origin + location.pathname,
        })
        break;
      case 'event': eventBridge(data.event); break
      case 'render':
        if ( rootnode instanceof HTMLElement ) {
          rootnode = patch(rootnode, data.vtree)
        }
        else {
          window.requestAnimationFrame(function () {
            rootnode = patch(rootnode, data.vtree)
          })
        }

    }
  })
}, false)

function eventBridge (evtinfo) {
  document.querySelector(evtinfo.element)
    .addEventListener(evtinfo.event, function evtFn (evt) {
      worker.postMessage({
        cmd: 'event',
        'event': {
          'element': evtinfo.element,
          'event': evtinfo.event,
          // return specified property, e.g., 'target.value'
          'response': evtinfo.response.split('.')
            .reduce(function (obj, ii) { return obj[ii] }, evt)
        }
      })
    }, false);
}

