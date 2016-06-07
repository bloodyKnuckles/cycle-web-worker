import xs from 'xstream'
import sh from 'snabbdom/h'
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
  let domContainer = sh('div')
  function wWDriver (vtree$) {
console.log('acc2')
    /*vtree$.addListener({
      next: function (vtree) {
//console.log('dp',dp.diff(vtree, vtree))
        self.postMessage([{'cmd': 'patch', 'patch': vtree}])
      },
      error: function (err) { console.log(err); },
      complete: function () { console.log('complete'); }
    });*/

    let rootElem$ = renderRawRootElem$(vtree$, domContainer)
      .startWith(domContainer)
      //.replay(null, 1)
    //let disposable = rootElem$.connect()

    return {
      observable: rootElem$,
      namespace: [],
      select: makeElementSelector(rootElem$),
      events: makeEventsSelector(rootElem$, [])
    }
  }
  return wWDriver;
}
exports.makeWWDriver = makeWWDriver;

function renderRawRootElem$(vtree$, domContainer) {
console.log('acc3')
  return vtree$
    .startWith(domContainer)
    .map(vtree => {
if ( vtree.children && vtree.children[0] && vtree.children[0].children && vtree.children[0].children[0] ) {
  console.log('cc',vtree.children[0].children[0].text)
}
else { console.log('cc') }
      self.postMessage([{'cmd': 'render', 'vtree': vtree}])
      return vtree
    })
}

function makeEventsSelector(rootElem$, namespace) {
  return function events (eventname, options = {}) {
    self.postMessage([{'cmd': 'msg', 'msg': 'hey there'}])
    //return xs.periodic(1000).take(5)
    return rootElem$
  }
}

function makeElementSelector(rootElem$) {
  return function select (selector) {
    const namespace = this.namespace
    const trimmedSelector = selector.trim()
    const childnamespace = trimmedSelector === `:root` ?
      namespace :
      namespace.concat(trimmedSelector)

    return {
      observable: rootElem$,
      namespace: childnamespace,
      select: makeElementSelector(rootElem$),
      events: makeEventsSelector(rootElem$, childnamespace)
    }
  }
}

