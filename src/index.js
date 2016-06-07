import sd from 'snabbdom'
import sh from 'snabbdom/h'
import sv from 'snabbdom-virtualize/nodes' 
var patch = sd.init([])

console.log('main init')

var rootnode

var worker = new Worker('./dist/main.js')
worker.addEventListener('message', function (evt) {
  evt.data.forEach(function (cmd) {
    switch ( cmd.cmd ) {
      case 'msg': console.log(cmd.msg); break
      case 'event': workerHandler(cmd.event); break
      case 'init':
        rootnode = document.querySelector(cmd.rootnode)
        rootnode = patch(rootnode, sh('div', '')) //sv(rootnode))
        worker.postMessage({
          cmd: 'init',
          absurl: location.origin + location.pathname,
        })
        break;
      case 'render':
        window.requestAnimationFrame(function () {
          patch(rootnode, cmd.vtree)
        })

    }
  })
}, false)

function workerHandler (evtinfo) {
  document.querySelector(evtinfo.element).addEventListener(evtinfo.event, function (evt) {
    //console.log(evt)
    worker.postMessage(
      {
        cmd: 'event',
        'event': {
          'element': evtinfo.element,
          'response': evtinfo.response.split('.').reduce(function (obj, ii) { return obj[ii] }, evt)
        }
      }
    )
  }, false)
}

