# MQTT last will test ground

This project's only meaning is to demonstrate that the MQTT last will works as expected.

I need this to protect me from the NIMB™ effect.

## Components

This project is based on the following [Docker] containers:

- `mqtt`: the MQTT server (a [Mosquitto] instance)
- `monit`: a [Node.js] process monitoring the `test/#` topics
- `willy`: a [Node.js] process publishing on `test/connected`

The goal of the project is to demonstrate that The `mqtt` container is the [Mosquitto] instance is relaying `willy` last will as expected to the `monit` instance.

The `willy` process publishes on a cycle basis carried out by the following steps:

1. it connects to `mqtt` and immediately publishes `true` on the `test/connected` topic
2. it waits 20s
3. it publishes `false` on the `test/connected` topic and immediately disconnects from `mqtt`
4. it waits 10s and then starts a new cycle

## Last will testing

All components are started and monitored with the following command:

```bash
docker-compose up -d && docker-compose logs -t -f
```

Depending on the `LAST_WILL` environment variable value, `willy` will ask or not the `mqtt` service for a last will during connection.

In order to check that the last will feature is working as expected when `LAST_WILL=true`, a network disconnection is simulated with the following command just after `monit` has received the `true` value on the `test/connected` topic during `Cycle 3`:

```bash
docker network disconnect last-will_default last-will_willy_1
```

## Test results

The test results are described [here](./results/README.md).

For people affected by the TL;DR syndrom, the test results are for now showing that last will is working as expected.

[Docker]: https://www.docker.com/
[Mosquitto]: https://mosquitto.org/
[Node.js]: https://nodejs.org/en/
