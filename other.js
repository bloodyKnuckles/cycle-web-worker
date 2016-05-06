Rx = require('rx-lite')

console.log('worker init')

self.postMessage(
  [
    {cmd: 'event', 'event': {'element': 'button#down', 'event': 'click', 'response': 'target.value'}},
    {cmd: 'event', 'event': {'element': 'button#up', 'event': 'click', 'response': 'target.value'}}
  ]
)

//*
var source = Rx.Observable.fromEvent(self, 'message', function (evt) {
  return evt.data
})
var subscription = source.subscribe(
  function (cmd) {
    //console.log('Next: Clicked! ', cmd)
    cmdOp(cmd)
  },
  function (err) {
    console.log('Error: %s', err)
  },
  function () {
    console.log('Completed')
  }
)
//*/

/*
self.addEventListener('message', function (evt) {
  cmdOp(evt.data)
}, false)
//*/

function cmdOp (cmd) {
  switch ( cmd.cmd ) {
    case 'echo':  self.postMessage({cmd: 'echo', msg: data}); break
    case 'event':
      console.log('worker ', cmd.event);
      switch ( cmd.event.element ) {
        case 'button': console.log(cmd.event.response); break;
        case 'button': console.log(cmd.event.response); break;
      }
      break
  }
}
