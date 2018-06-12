const {connect} = require('mqtt');

const topic = 'test/connected';

const cycle = (count) => {
  console.log(`______________________________________ Cycle ${count} ______________________________________`);

  const mqttURL = process.env.WEBSOCKET === "true"
    ? 'ws://mqtt:9883'
    : 'mqtt://mqtt:1883'

  const lastWill = process.env.LAST_WILL === "true" ? {
    will: {
      topic,
      payload: 'false'
    }
  } : {}

  const mqttOptions = {
    ...lastWill
  };

  console.log('Connection configuration', mqttURL, mqttOptions);

  const client = connect(mqttURL, mqttOptions);

  const pubConnected = value => new Promise((resolve, reject) => client.publish(topic, value, err => {
    if (err) {
      console.log(`connected: failed to publish ${value} (${err.message})`);
      return reject(err);
    }
    console.log(`connected: ${value} was published`);
    return resolve();
  }));

  client.on('connect', () => {
    console.log('connected');
    pubConnected('true').then(() => setTimeout(() => {
      pubConnected('false').then(() => client.end(() => {
        console.log('disconnected')
        setTimeout(() => cycle(count + 1), 10e3);
      }));
    }, 20e3));
  });

  client.on('close', () => console.log('disconnect'));

  client.on('error', err => console.log(`error: ${err}`));
};

cycle(0);
