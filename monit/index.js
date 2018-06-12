const Observable = require('zen-observable');
const observableMQTT = require('observable-mqtt')(Observable);
const {connect} = require('mqtt');

const subscribe = observableMQTT(connect({host:'mqtt', port: 1883}));

subscribe(['test/#'])
  .subscribe(({topic, message}) => {
        if (topic) { console.log(`${topic}: ${message.toString()}`); }
      });
