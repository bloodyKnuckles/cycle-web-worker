import xs from 'xstream'
import eventBridge from 'worker-event-bridge/worker'

self.addEventListener('message', function (evt) {
  var data = evt.data
  switch ( data.cmd ) {
    case 'init': console.log('worker init'); break
  } // end switch
})

function makeWWDriver (container) {
  self.postMessage([{'cmd': 'init', 'rootnode': container}])

  return function wwDriver (vtree$) {

    console.log('WW driver init')

    vtree$.addListener({
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
          events: (eventname, response = 'target.value') => {

            // return event$
            return xs.create({
              next: null,
              start: function (listener) {

                eventBridge.send(selector, eventname, response)

                this.next = function next(evt) {

                  Function.prototype.context = function(context)  {
                    var action = this;
                    return function() { action.apply(context, arguments); };
                  }
                  eventBridge.receive(evt, selector, eventname, listener.next.context(listener))

                }
                self.addEventListener('message', this.next)
              },
              stop: function () {
                /*document.querySelector(selector).removeEventListener(
                  event,
                  this.next
                )*/
              }
            }) // end event$
          } // end events
        }
      } // end select
    }
  } // end wwDriver
}

exports.makeWWDriver = makeWWDriver;
