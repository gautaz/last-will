# Test results

The complete test results are available as session log files in the same directory that this README file.

> Be aware that the log's lines sequence does not exactly match the execution sequence as its order reflects the moments Docker has taken into account the outputs of the containers.

## Session log file details

A typical (meaning networking is OK) publishing cycle results in a log close to the following:

```
willy_1  | 2018-06-12T07:09:24.281663700Z ______________________________________ Cycle 0 ______________________________________
willy_1  | 2018-06-12T07:09:24.295878800Z Connection configuration { host: 'mqtt',
willy_1  | 2018-06-12T07:09:24.295912700Z   port: 1883,
willy_1  | 2018-06-12T07:09:24.295930100Z   will: { topic: 'test/connected', payload: 'false' } }
mqtt_1   | 2018-06-12T07:09:24.326858700Z 1528787364: New connection from 172.22.0.4 on port 1883.
mqtt_1   | 2018-06-12T07:09:24.328480700Z 1528787364: New client connected from 172.22.0.4 as mqttjs_ca16c66c (c1, k60).
mqtt_1   | 2018-06-12T07:09:24.328546500Z 1528787364: Sending CONNACK to mqttjs_ca16c66c (0, 0)
willy_1  | 2018-06-12T07:09:24.333614700Z connected
willy_1  | 2018-06-12T07:09:24.334921900Z connected: true was published
mqtt_1   | 2018-06-12T07:09:24.335784600Z 1528787364: Received PUBLISH from mqttjs_ca16c66c (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
mqtt_1   | 2018-06-12T07:09:24.336463400Z 1528787364: Sending PUBLISH to mqttjs_d1997107 (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
monit_1  | 2018-06-12T07:09:24.339740000Z test/connected: true
willy_1  | 2018-06-12T07:09:44.323248900Z connected: false was published
mqtt_1   | 2018-06-12T07:09:44.325814600Z 1528787384: Received PUBLISH from mqttjs_ca16c66c (d0, q0, r0, m0, 'test/connected', ... (5 bytes))
willy_1  | 2018-06-12T07:09:44.326954400Z disconnect
monit_1  | 2018-06-12T07:09:44.329683500Z test/connected: false
mqtt_1   | 2018-06-12T07:09:44.329697200Z 1528787384: Sending PUBLISH to mqttjs_d1997107 (d0, q0, r0, m0, 'test/connected', ... (5 bytes))
mqtt_1   | 2018-06-12T07:09:44.329788700Z 1528787384: Received DISCONNECT from mqttjs_ca16c66c
mqtt_1   | 2018-06-12T07:09:44.329805600Z 1528787384: Client mqttjs_ca16c66c disconnected.
willy_1  | 2018-06-12T07:09:44.332956200Z disconnected
```

A cycle starts with `willy` connecting to the `mqtt` service.
`willy` will first display its connection configuration:

```
willy_1  | 2018-06-12T07:09:24.295878800Z Connection configuration { host: 'mqtt',
willy_1  | 2018-06-12T07:09:24.295912700Z   port: 1883,
willy_1  | 2018-06-12T07:09:24.295930100Z   will: { topic: 'test/connected', payload: 'false' } }
```

> Here `willy` is asking for a last will, if no last will is requested, the output is close to this one:
>
> ```
> willy_1  | 2018-06-12T07:04:23.297936800Z Connection configuration { host: 'mqtt', port: 1883 }
> ```

`willy` then operates the connection:

```
mqtt_1   | 2018-06-12T07:09:24.326858700Z 1528787364: New connection from 172.22.0.4 on port 1883.
mqtt_1   | 2018-06-12T07:09:24.328480700Z 1528787364: New client connected from 172.22.0.4 as mqttjs_ca16c66c (c1, k60).
mqtt_1   | 2018-06-12T07:09:24.328546500Z 1528787364: Sending CONNACK to mqttjs_ca16c66c (0, 0)
willy_1  | 2018-06-12T07:09:24.333614700Z connected
```

> The `connected` line means that `willy` considers itself as connected to the `mqtt` service.

`willy` immediately publishes `true` on the `test/connected` topic and `mqtt` receives this publication:

```
willy_1  | 2018-06-12T07:09:24.334921900Z connected: true was published
mqtt_1   | 2018-06-12T07:09:24.335784600Z 1528787364: Received PUBLISH from mqttjs_ca16c66c (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
```

`mqtt` forwards the publication to `monit`:

```
mqtt_1   | 2018-06-12T07:09:24.336463400Z 1528787364: Sending PUBLISH to mqttjs_d1997107 (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
monit_1  | 2018-06-12T07:09:24.339740000Z test/connected: true
```

> `monit` will log every message it subscribed for.

20 seconds later, `willy` will publish `false` on `test/connected`:

```
willy_1  | 2018-06-12T07:09:44.323248900Z connected: false was published
mqtt_1   | 2018-06-12T07:09:44.325814600Z 1528787384: Received PUBLISH from mqttjs_ca16c66c (d0, q0, r0, m0, 'test/connected', ... (5 bytes))
```

Again, this publication is forwarded by `mqtt` to `monit`:

```
monit_1  | 2018-06-12T07:09:44.329683500Z test/connected: false
mqtt_1   | 2018-06-12T07:09:44.329697200Z 1528787384: Sending PUBLISH to mqttjs_d1997107 (d0, q0, r0, m0, 'test/connected', ... (5 bytes))
```

> Log messages were reversed (`mqtt` did in fact forward the publication before `monit` could receive it).


`willy` finally disconnects from `mqtt`:

```
willy_1  | 2018-06-12T07:09:44.326954400Z disconnect
...
mqtt_1   | 2018-06-12T07:09:44.329788700Z 1528787384: Received DISCONNECT from mqttjs_ca16c66c
mqtt_1   | 2018-06-12T07:09:44.329805600Z 1528787384: Client mqttjs_ca16c66c disconnected.
willy_1  | 2018-06-12T07:09:44.332956200Z disconnected
```

> Some publication logs are interleaved (`...`) as `willy` will disconnect as soon as he has published on `test/connected`.

10 seconds later, a new cycle begins.

## `2018-06-12T07` results with a native MQTT connection

The following logs were produced by using native MQTT connections (port `1883`):

- [no_last_will](./2018-06-12T07:04:21.227103300Z-no-last-will.txt) shows what happens without any last will setting on connection
- [last_will](./2018-06-12T07:09:21.365715700Z-last-will.txt) shows what happens with the last will set on connection

### Without a last will

As for all tests, the disconnection occured during `Cycle 3` after  `monit` has received the `true` payload on the `test/connected` topic.

The `Cycle 3` log is the following:

```
willy_1  | 2018-06-12T07:05:53.378458400Z ______________________________________ Cycle 3 ______________________________________
willy_1  | 2018-06-12T07:05:53.378540200Z Connection configuration { host: 'mqtt', port: 1883 }
willy_1  | 2018-06-12T07:05:53.388816600Z connected
willy_1  | 2018-06-12T07:05:53.388873300Z connected: true was published
monit_1  | 2018-06-12T07:05:53.389915900Z test/connected: true
mqtt_1   | 2018-06-12T07:05:53.390479900Z 1528787153: New connection from 172.22.0.4 on port 1883.
mqtt_1   | 2018-06-12T07:05:53.390522900Z 1528787153: New client connected from 172.22.0.4 as mqttjs_d668f3fa (c1, k60).
mqtt_1   | 2018-06-12T07:05:53.390535800Z 1528787153: Sending CONNACK to mqttjs_d668f3fa (0, 0)
mqtt_1   | 2018-06-12T07:05:53.390547000Z 1528787153: Received PUBLISH from mqttjs_d668f3fa (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
mqtt_1   | 2018-06-12T07:05:53.390558200Z 1528787153: Sending PUBLISH to mqttjs_6904483a (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
willy_1  | 2018-06-12T07:06:13.367070700Z connected: false was published
willy_1  | 2018-06-12T07:06:13.367501700Z disconnect
mqtt_1   | 2018-06-12T07:06:21.759670100Z 1528787181: Saving in-memory database to /var/lib/mosquitto/mosquitto.db.
mqtt_1   | 2018-06-12T07:06:22.780473400Z 1528787182: Received PINGREQ from mqttjs_6904483a
mqtt_1   | 2018-06-12T07:06:22.780561500Z 1528787182: Sending PINGRESP to mqttjs_6904483a
mqtt_1   | 2018-06-12T07:07:22.665544400Z 1528787242: Saving in-memory database to /var/lib/mosquitto/mosquitto.db.
mqtt_1   | 2018-06-12T07:07:22.672349600Z 1528787242: Client mqttjs_d668f3fa has exceeded timeout, disconnecting.
mqtt_1   | 2018-06-12T07:07:22.672415500Z 1528787242: Socket error on client mqttjs_d668f3fa, disconnecting.
mqtt_1   | 2018-06-12T07:07:22.749964100Z 1528787242: Received PINGREQ from mqttjs_6904483a
mqtt_1   | 2018-06-12T07:07:22.750116500Z 1528787242: Sending PINGRESP to mqttjs_6904483a
mqtt_1   | 2018-06-12T07:08:22.726749800Z 1528787302: Received PINGREQ from mqttjs_6904483a
mqtt_1   | 2018-06-12T07:08:22.726856300Z 1528787302: Sending PINGRESP to mqttjs_6904483a
mqtt_1   | 2018-06-12T07:08:23.551711700Z 1528787303: Saving in-memory database to /var/lib/mosquitto/mosquitto.db.
```

This log differs from the previous cycles at the moment `willy` initiates its disconnecting sequence:

```
willy_1  | 2018-06-12T07:06:13.367070700Z connected: false was published
willy_1  | 2018-06-12T07:06:13.367501700Z disconnect
```

Two points are showing that a disconnection occured:

1. The `willy` publication is not received by `mqtt`
2. `willy` tries to disconnect but fails to (no `disconnected` log)

At `07:06:22` (UTC), `mqtt` receives a `PINGREQ` (ping request) from the `monit` client.

It also expects to receive a `PINGREQ` from the `willy` client approximately at the same time because:

- all clients are using the default `keepAlive` setting which is 60 seconds
- the cycles duration is 30 seconds
- both `monit` and `willy` started approximately at the same time

As this `PINGREQ` was not received, `mqtt` starts the `keepAlive` disconnection timer and in fact, one minute later, it disconnects `willy`:

```
mqtt_1   | 2018-06-12T07:07:22.672349600Z 1528787242: Client mqttjs_d668f3fa has exceeded timeout, disconnecting.
mqtt_1   | 2018-06-12T07:07:22.672415500Z 1528787242: Socket error on client mqttjs_d668f3fa, disconnecting.
```

As `willy` did not set any last will on connection, `mqtt` did not emit anything after `willy` disconnection.

### With a last will

The `Cycle 3` log is the following:

```
willy_1  | 2018-06-12T07:10:54.342953100Z ______________________________________ Cycle 3 ______________________________________
willy_1  | 2018-06-12T07:10:54.343030300Z Connection configuration { host: 'mqtt',
willy_1  | 2018-06-12T07:10:54.343055500Z   port: 1883,
willy_1  | 2018-06-12T07:10:54.343076400Z   will: { topic: 'test/connected', payload: 'false' } }
mqtt_1   | 2018-06-12T07:10:54.345525600Z 1528787454: New connection from 172.22.0.4 on port 1883.
mqtt_1   | 2018-06-12T07:10:54.347287200Z 1528787454: New client connected from 172.22.0.4 as mqttjs_c328652c (c1, k60).
mqtt_1   | 2018-06-12T07:10:54.347349800Z 1528787454: Sending CONNACK to mqttjs_c328652c (0, 0)
willy_1  | 2018-06-12T07:10:54.348400300Z connected
willy_1  | 2018-06-12T07:10:54.348449200Z connected: true was published
mqtt_1   | 2018-06-12T07:10:54.349709600Z 1528787454: Received PUBLISH from mqttjs_c328652c (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
mqtt_1   | 2018-06-12T07:10:54.349810500Z 1528787454: Sending PUBLISH to mqttjs_d1997107 (d0, q0, r0, m0, 'test/connected', ... (4 bytes))
monit_1  | 2018-06-12T07:10:54.350084200Z test/connected: true
willy_1  | 2018-06-12T07:11:14.333642200Z connected: false was published
willy_1  | 2018-06-12T07:11:14.333951300Z disconnect
mqtt_1   | 2018-06-12T07:11:22.412638500Z 1528787482: Saving in-memory database to /var/lib/mosquitto/mosquitto.db.
mqtt_1   | 2018-06-12T07:11:23.800329200Z 1528787483: Received PINGREQ from mqttjs_d1997107
mqtt_1   | 2018-06-12T07:11:23.800431700Z 1528787483: Sending PINGRESP to mqttjs_d1997107
mqtt_1   | 2018-06-12T07:12:23.329720000Z 1528787543: Saving in-memory database to /var/lib/mosquitto/mosquitto.db.
mqtt_1   | 2018-06-12T07:12:23.336025400Z 1528787543: Client mqttjs_c328652c has exceeded timeout, disconnecting.
mqtt_1   | 2018-06-12T07:12:23.336117000Z 1528787543: Socket error on client mqttjs_c328652c, disconnecting.
mqtt_1   | 2018-06-12T07:12:23.438391000Z 1528787543: Sending PUBLISH to mqttjs_d1997107 (d0, q0, r0, m0, 'test/connected', ... (5 bytes))
monit_1  | 2018-06-12T07:12:23.438697900Z test/connected: false
mqtt_1   | 2018-06-12T07:12:23.729479400Z 1528787543: Received PINGREQ from mqttjs_d1997107
mqtt_1   | 2018-06-12T07:12:23.729578000Z 1528787543: Sending PINGRESP to mqttjs_d1997107
mqtt_1   | 2018-06-12T07:13:23.714064600Z 1528787603: Received PINGREQ from mqttjs_d1997107
mqtt_1   | 2018-06-12T07:13:23.714164300Z 1528787603: Sending PINGRESP to mqttjs_d1997107
mqtt_1   | 2018-06-12T07:13:24.224712600Z 1528787604: Saving in-memory database to /var/lib/mosquitto/mosquitto.db.
```

As for the previous test, the disconnection occured:

```
willy_1  | 2018-06-12T07:11:14.333642200Z connected: false was published
willy_1  | 2018-06-12T07:11:14.333951300Z disconnect
```

The publication and the disconnection both failed.

Again a `PINGREQ` is emitted by `monit` at `07:11:23` and `mqtt` also expects `willy` to operate a ping as it has not succeeded to disconnect.

60 seconds later, the `keepAlive` timer goes off and `mqtt` disconnects `willy`:

```
mqtt_1   | 2018-06-12T07:12:23.336025400Z 1528787543: Client mqttjs_c328652c has exceeded timeout, disconnecting.
mqtt_1   | 2018-06-12T07:12:23.336117000Z 1528787543: Socket error on client mqttjs_c328652c, disconnecting.
```

**But this time**, `mqtt` also publishes the last will message set by `willy` during its connection:

```
mqtt_1   | 2018-06-12T07:12:23.438391000Z 1528787543: Sending PUBLISH to mqttjs_d1997107 (d0, q0, r0, m0, 'test/connected', ... (5 bytes))
monit_1  | 2018-06-12T07:12:23.438697900Z test/connected: false
```

> Notice that the delay between the disconnection and the last will message is close to 100ms.

This was tested at least 10 times under the same conditions and the last will message was always received by `monit` in the same second `willy` was disconnected.
