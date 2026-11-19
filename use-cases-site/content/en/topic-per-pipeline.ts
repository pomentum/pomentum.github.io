import type { UseCaseText } from "../types";

export const topicPerPipeline: UseCaseText = {
  title: "One connection, a topic per pipeline",
  situation: "Many pipelines should share one broker connection, each reading and writing only its own topics within it.",
  team: "Integration and platform teams",
  context:
    "For a team whose readings and events arrive on one broker under many topics. When a connection reads one topic, a second topic costs a second connection, with its own secret and its own binding; and a pipeline that reads everything has to filter by hand.",
  metricLabels: {
    connections: "Connections for three rooms",
    room: "The room 1 pipeline gets",
    outside: "A topic outside the connection's",
  },
  steps: [
    {
      tag: "problem",
      title: "A connection per topic",
      body: [
        "Each room's readings are on their own topic. With one topic per connection, three rooms need three connections, each bound and kept on its own.",
      ],
      metrics: { connections: "3", room: "a connection of its own", outside: "—" },
    },
    {
      tag: "syrmos",
      title: "One connection, a ceiling",
      body: [
        "The person who binds the broker connection sets what it may reach: here, `sensors/#`. That topic is now a ceiling, not the only topic.",
      ],
      metrics: { connections: "1" },
    },
    {
      tag: "how",
      title: "Each pipeline chooses within it",
      body: [
        "Each pipeline's intake names its own topic inside the ceiling. One reads `sensors/#` whole; another reads only `sensors/room-1`.",
        "The editor shows the ceiling beside the node and checks the topic as it is typed, against example topics.",
      ],
    },
    {
      tag: "how",
      title: "One subscription, routed to each",
      body: [
        "The bridge keeps one subscription for the connection and routes each record to every pipeline whose topic matches, checking it once more before it reaches the intake.",
        "In the trial, 15 readings went to rooms 0 to 2: the room 1 pipeline got exactly its five, and the pipeline that reads the whole connection still got all 15.",
      ],
      metrics: { room: "its 5 of 15 readings" },
    },
    {
      tag: "syrmos",
      title: "Outside the ceiling: refused",
      body: [
        "A topic outside the connection's is refused at deploy, at a rollout and at a promotion, with the topic named.",
        "On Kafka, a pipeline may also read by a pattern, but only one anchored to a prefix, so the check stays a prefix check.",
      ],
      metrics: { outside: "refused at deploy" },
    },
    {
      tag: "how",
      title: "A hand-off to each message's topic",
      body: [
        "A hand-off writes to its own topic within the sink's, or, when its node says so, to each message's own topic.",
        "That topic is checked in the cell before the run closes; a message whose topic is outside the sink's is dead-lettered, not sent.",
      ],
    },
  ],
  parts: {
    bridge: "One subscription per connection, each record routed to every pipeline whose topic matches, and checked again.",
    bus: "Each pipeline's topic is an intake source of its own on the bus.",
    cell: "Its pipelines each choose a topic within the connection's.",
  },
  tryIt: {
    text: "The broker trial runs the room's pipeline beside the one that reads the whole connection, with MQTT, Kafka and RabbitMQ in Docker.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/trials/README.md",
    linkText: "Read the trials",
  },
  statusNote:
    "Shown: the broker trial runs a second pipeline on the readings' connection that reads one room's topic alone. On 2026-11-19 it passed 23 of 23 checks, the room's pipeline taking exactly readings 1, 4, 7, 10 and 13. A hand-off to each message's own topic is built and tested, but not part of that run.",
};
