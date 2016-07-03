module.exports = {
  'send': function (selector, eventname, response = 'target.value') {
    self.postMessage([{
      'cmd': 'event',
      'event': {
        'element': selector, 'event': eventname, 'response': response
      }
    }])
  },
  'receive': function (evt, selector, eventname, fn) {
    if (
      'event' === evt.data.cmd &&
      selector === evt.data.event.element &&
      eventname === evt.data.event.event
    ) {
      fn(evt.data.event);
    }
  }
}
