import sd from 'snabbdom'
import sh from 'snabbdom/h'
import sv from 'snabbdom-virtualize/nodes' 
var patch = sd.init([])

console.log('index init')

var rootnode

var worker = new Worker('./dist/main.js')
worker.addEventListener('message', function (evt) {
  evt.data.forEach(function (data) {
    switch ( data.cmd ) {
      case 'msg': console.log(data.msg); break
      case 'event': workerHandler(data.event); break
      case 'init':
        rootnode = document.querySelector(data.rootnode)
        worker.postMessage({
          cmd: 'init',
          absurl: location.origin + location.pathname,
        })
        break;
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

function workerHandler (evtinfo) {
  document.querySelector(evtinfo.element).addEventListener(evtinfo.event, function evtFn (evt) {
    worker.postMessage({
      cmd: 'event',
      'event': {
        'element': evtinfo.element,
        'event': evtinfo.event,
        'response': evtinfo.response.split('.').reduce(function (obj, ii) { return obj[ii] }, evt)
      }
    })
  }, false);
}

