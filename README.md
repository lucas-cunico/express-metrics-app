## `npm install --save-dev express-node-metrics`

## on server.js
```
if(process.env.NODE_ENV === 'development'){
  var metricsMiddleware = require('express-node-metrics').middleware;
  var metrics = require('express-node-metrics').metrics;
  server.use(metricsMiddleware);
  server.get('/metrics', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.send(metrics.getAll(req.query.reset));
  });
}
```
