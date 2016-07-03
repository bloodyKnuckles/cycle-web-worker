function eventBridge (worker, evtinfo) {
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

module.exports = eventBridge
