"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _browserifyMiddleware = require("browserify-middleware");

var _browserifyMiddleware2 = _interopRequireDefault(_browserifyMiddleware);

var _handlebars = require("handlebars");

var _handlebars2 = _interopRequireDefault(_handlebars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.set('port', process.env.PORT || 6587);

app.use('/dist/planck.js', (0, _browserifyMiddleware2.default)('./lib/index.js', { standalone: 'planck' }));
app.use('/dist/planck-with-testbed.js', (0, _browserifyMiddleware2.default)('./testbed/index.js', { standalone: 'planck' }));

app.use(_express2.default.static(_path2.default.resolve(__dirname, '..')));

app.get('/example/:name?', function (req, res, next) {
  var pname = req.params.name || '';
  var script = '';
  var examples = _fs2.default.readdirSync('./example/').filter(function (file) {
    return file.endsWith('.js');
  }).map(function (file) {
    var name = file.replace(/\.[^.]+$/, '');
    var url = '/example/' + name;
    var selected = false;
    if (name.toLowerCase() == pname.toLowerCase()) {
      script = '/example/' + file;
      selected = true;
    }
    return { name: name, url: url, selected: selected };
  });

  var page = _handlebars2.default.compile(_fs2.default.readFileSync('./testbed/index.hbs') + '');
  res.send(page({
    script: script,
    examples: examples
  }));
});

app.get('/', function (req, res, next) {
  res.redirect('/example/');
});

// app.use(ServeIndex(__dirname, {
//   icons : true,
//   css : 'ul#files li{float:none;}' // not actually working!
// }));

app.listen(app.get('port'), function () {
  console.log('Checkout http://localhost:' + app.get('port'));
});