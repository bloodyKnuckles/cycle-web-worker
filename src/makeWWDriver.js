import xs from 'xstream';

function makeWWDriver (container, options) {
  if (!options) { options = {}; }
  function wWDriver (vtree$) {
    vtree$.addListener({
      next: function (vtree) { console.log('w',vtree); },
      error: function (err) { console.log(err); },
      complete: function () { console.log('complete'); }
    });
    return xs.periodic(1000).take(5);
  }
  return wWDriver;
}
exports.makeWWDriver = makeWWDriver;
