import xs from 'xstream'

self.addEventListener('message', function (evt) {
  var data = evt.data
  switch ( data.cmd ) {
    case 'echo': self.postMessage({cmd: 'echo', msg: data}); break
    case 'init':
      console.log('worker init')
      break

    /*default:
      rm = app.match(data.url)
      rm.fn(data, rm).then(function (pageinfo) {
        getTemplate(pageinfo.templates).then(function (vdom) {
          render(vdom, pageinfo.content)
        })
      })*/

  } // end switch
})



function makeWWDriver (container) {
  self.postMessage([{'cmd': 'init', 'rootnode': container}])

  return function wwDriver (outgoing$) {

console.log('WW driver init')

    outgoing$.addListener({
      next: vtree => {

// render here

        self.postMessage([{'cmd': 'render', 'vtree': vtree}])

      },
      error: err => console.log(`err: ${err}`),
      complete: () => console.log('completed')
    });
    return {
      select: (selector) => {
        return {
          events: (event) => {

// add event listener here

            // return event$
            return xs.create({
              next: null,
              start: function (listener) {
                self.postMessage([{
                  'cmd': 'event',
                  'event': {
                    'element': selector, 'event': event, 'response': 'target.value'
                  }
                }])
                this.next = function next(evt) {
                  if (
                    'event' === evt.data.cmd &&
                    selector === evt.data.event.element &&
                    event === evt.data.event.event
                  ) {
                    listener.next(evt.data);
                  }
                }
                self.addEventListener('message', this.next)
              },
              stop: function () {
                /*document.querySelector(selector).removeEventListener(
                  event,
                  this.next
                )*/
              }
            })
              .map(x => 1)
              .map(x => {return {target: {value: 1}}})
          }
        }
      }
    }
  }
}

exports.makeWWDriver = makeWWDriver;
