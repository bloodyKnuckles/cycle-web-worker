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
      case 'event': workerHandler(cmd.event); break
      case 'init':
        console.log('rn',cmd.rootnode)
        rootnode = document.querySelector(cmd.rootnode)
        rootnode = patch(rootnode, sh('div', '')) //sv(rootnode))
console.log('rna',rootnode)
        worker.postMessage({
          cmd: 'init',
          absurl: location.origin + location.pathname,
        })
        break;
      case 'patch':
        window.requestAnimationFrame(function () {
console.log('nn',cmd.patch)
          patch(rootnode, cmd.patch)
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

