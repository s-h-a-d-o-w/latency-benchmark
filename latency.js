const fs = require('fs');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ping = require('ping');

const promClient = require('prom-client');
const { Gauge, Histogram } = promClient;
const g = new Gauge({
  name: 'latency_max',
  help: 'Max. latency'
});
const gAvg = new Gauge({
  name: 'latency_avg',
  help: 'Avg. latency'
});
const h = new Histogram({
  name: 'latency',
  help: 'Latency',
  buckets: [5, 10, 30, 100],
});

const port = process.env.PORT || 2000;

app.set('trust proxy', true);

app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});

app.use(express.static(__dirname + '/'));

server.listen(port, function () {
  console.log(`Listening on http://127.0.0.1:${port}`);
});


io.on('connection', function (socket) {
  let doStop = false;
  socket.on('stop', () => {
    doStop = true;
  });

  let target = socket.handshake.query.target || socket.handshake.address;
  if (target.split('.').length === 4) {
    // IPv4 mapped address, ping won't support it if we don't extract the IPv4 address
    const fragments = target.split(':');
    target = fragments[fragments.length - 1];
  }

  console.log('Probing ' + target + '...')

  let start = Date.now();
  let allTimes = [];
  let times = [];
  const pingIt = async function () {
    if (doStop) {
      console.log('Stopping.');
      fs.writeFileSync(`${
          new Date().toISOString().replace(/:/g, '-')
        }.csv`, allTimes
        .map((time, idx) => `${idx},${time}`)
        .join('\n')
      );
      return;
    }

    let res = await ping.promise.probe(target);

    if (typeof res.time === 'number') {
      if (Date.now() - start > 1000) {
        const max = Math.max(...times);
        g.set(max);
        // console.log(`Max. ${max} ms out of: [${times.join(', ')}]`);
        console.log(times.join(', '));

        gAvg.set(times.reduce((a, b) => a + b) / times.length)

        allTimes = allTimes.concat(times);
        times = [];
        start = Date.now();
      } else {
        times.push(res.time);
      }

      h.observe(res.time);
    }

    pingIt();
  };

  pingIt();
});
