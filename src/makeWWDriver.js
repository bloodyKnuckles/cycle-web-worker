import xs from 'xstream'
import dp from 'dffptch'

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

function makeWWDriver (container, options) {
  self.postMessage([{'cmd': 'init', 'rootnode': container}])
  if (!options) { options = {}; }
  function wWDriver (vtree$) {
    vtree$.addListener({
      next: function (vtree) {
console.log('dp',dp.diff(vtree, vtree))
        self.postMessage([{'cmd': 'patch', 'patch': vtree}])
      },
      error: function (err) { console.log(err); },
      complete: function () { console.log('complete'); }
    });
    return {
      select: selector => xs.periodic(1000).take(5),
      events: xs.periodic(1000).take(5)
    }
  }
  return wWDriver;
}
exports.makeWWDriver = makeWWDriver;
