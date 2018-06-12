# Test results

The complete test results are available as session log files in the same directory that this README file.

> Be aware that the log's lines sequence does not exactly match the execution sequence as its order reflects the moments Docker has taken into account the outputs of the containers.

## Test reports

The following reports are available:

- [Tests with a native MQTT connection](./2018-06-12T07.md)
- [Tests with a MQTT connection over a WebSocket](./2018-06-12T12.md)

> Before diving into these test results, it is strongly recommended that you read the following section.

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

Or (with WebSockets and a later version of the tests):

```
willy_1  | 2018-06-12T12:45:52.132070700Z Connection configuration ws://mqtt:9883 { will: { topic: 'test/connected', payload: 'false' } }
```

> Here `willy` is asking for a last will, if no last will is requested, the output is close to this one:
>
> ```
> willy_1  | 2018-06-12T07:04:23.297936800Z Connection configuration { host: 'mqtt', port: 1883 }
> ```
>
> Or:
>
> ```
> willy_1  | 2018-06-12T12:39:47.860504800Z Connection configuration ws://mqtt:9883 {}
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
