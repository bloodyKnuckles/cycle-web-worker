import sd from 'snabbdom'
import eventBridge from 'worker-event-bridge/main'
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
      case 'event': eventBridge(worker, data.event); break
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

