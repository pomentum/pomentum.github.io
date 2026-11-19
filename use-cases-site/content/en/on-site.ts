import type { UseCaseText } from "../types";

export const onSite: UseCaseText = {
  title: "On site, beside the machines",
  situation: "The pipeline should run on the plant's own machine, next to the equipment, and keep going when the network drops.",
  team: "Manufacturing · plant floor",
  context:
    "For a plant or a site whose pipelines read its own machines and sensors. Without a governed machine on site, the flows run far away and stop when the network does, or a Node-RED on a local PC runs whatever someone last deployed to it.",
  metricLabels: {
    offline: "Runs while the network is down",
    write: "A write to a machine",
    isolation: "Isolation comes from",
  },
  steps: [
    {
      tag: "problem",
      title: "The site's network drops",
      body: ["The flows that read the line run far away. When the site's network goes down, nothing reads the machines and nothing checks the line."],
      metrics: { offline: "no", write: "unchecked", isolation: "—" },
    },
    {
      tag: "syrmos",
      title: "A spur, enrolled with one link",
      body: [
        "A spur is a tenant's own machine: a Linux server, a Raspberry Pi 4 or 5, or a Windows PC. A writer makes a spur link on the tenant's Spurs page; the machine installs one package and enrols with it. The link's code works once.",
        "This part is in development: a package for Linux and the Pi and a Windows setup are built, but it has not yet run on a real Pi, and its updates are not yet signed.",
      ],
    },
    {
      tag: "how",
      title: "Its cell, synced",
      body: [
        "The spur runs the cell its link named as a service of the machine, without containers: unmodified Node-RED under Node's permission model. It syncs with the platform through the spur service, over HTTPS.",
        "Governed deploys, reviewed nodes and the gateway still apply on a spur. One cell per spur for now; a second is not built yet.",
      ],
      metrics: { isolation: "the machine and its administrator" },
    },
    {
      tag: "how",
      title: "Beside the machines",
      body: [
        "The machine's administrator decides what the spur may reach, in its local policy, never the platform: Modbus reads over TCP or a serial line, OPC UA reads, the machine's own disk, heat and USB devices, and its printers and scanners.",
        "The spur tells the platform only the names of what it was given, never an address or a port. A connection can be bound only to one of those names.",
      ],
    },
    {
      tag: "syrmos",
      title: "Offline, still running",
      body: [
        "When the network is down, the cell on the spur keeps running and keeps reading the line. Its calls to the platform fail at once instead of hanging, and a run's records wait in a queue until the platform answers.",
        "If the machine restarts while the network is still down, the spur starts its cell again from the last copy it synced.",
      ],
      metrics: { offline: "yes" },
    },
    {
      tag: "syrmos",
      title: "Read only, and a person asked",
      body: [
        "Modbus, OPC UA and the machine itself are read only on a spur: a write changes equipment, and it is not built.",
        "When an outside agent or the assistant wants to change a spur's cell, Syrmos asks the person every time and names the machine and what its cell reaches there.",
      ],
      metrics: { write: "read only for now" },
    },
  ],
  parts: {
    spur: "A tenant's own machine running a governed cell on site; in development.",
    cell: "A spur cell is still a cell: governed deploys and reviewed nodes.",
    gateway: "Still applies on a spur.",
    registry: "Only reviewed nodes run on the spur too.",
  },
  tryIt: {
    text: "The spur guide says how to build the package, enrol a machine and give it what it may read.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/spurs.md",
    linkText: "Read the spur guide",
  },
  statusNote:
    "In development: what is built follows the spur guide and the features list: the enrolment, one cell per spur, and the reads given in the local policy. Not built yet: signed updates, a second cell on a spur, writes to equipment and GPIO. Not yet run: a real Raspberry Pi, and Modbus over a real serial line. Running on with the platform gone is shown by the music trial, on one Windows desktop.",
};
