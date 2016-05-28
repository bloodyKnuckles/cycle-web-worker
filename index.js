console.log('main init')

//var worker = new Worker("./otherb.js")
var worker = new Worker("./dist/main.js")
worker.addEventListener('message', function (evt) {
  //console.log('i got: ', evt.data)
  evt.data.forEach(function (cmd) {
    switch ( cmd.cmd ) {
      case 'event': workerHandler(cmd.event); break
    }
  })
}, false)
worker.postMessage({cmd: 'init', absurl: location.origin + location.pathname})

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

