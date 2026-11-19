import type { UseCaseText } from "../types";

export const printScan: UseCaseText = {
  title: "Labels and scans at a packing desk",
  situation: "A packing desk should print each order's label and slip, and scan its delivery notes, from the same pipelines that handle the order.",
  team: "Packing desks · front offices",
  context:
    "For a desk whose label printer, office printer and scanner sit on the site's own network. A pipeline that runs far away can't reach them, and opening them to the internet exposes the devices instead.",
  metricLabels: {
    reach: "The desk's devices",
    jobs: "Jobs a pipeline can read",
    real: "Run on a real printer",
  },
  steps: [
    {
      tag: "problem",
      title: "Out of reach",
      body: ["The printers and the scanner answer only on the site's network. The pipeline that handles the order can't print its label or fetch a scan."],
      metrics: { reach: "out of reach", jobs: "—", real: "—" },
    },
    {
      tag: "syrmos",
      title: "The administrator gives them",
      body: [
        "The desk's machine is a spur. Its administrator gives it each device in the local policy: a label printer's raw port by its IP address and port, a print queue of the machine, and a scanner's address.",
        "A raw port and a scanner are named by address, never by a host name. A scanner over HTTPS is trusted only with its certificate pinned.",
      ],
      metrics: { reach: "given by the administrator" },
    },
    {
      tag: "how",
      title: "A label, in the printer's own language",
      body: [
        "The pipeline sends the shipping label as ZPL, the label printer's own language, straight to its raw port.",
        "The spur renders nothing: a raw port takes only what the printer itself speaks.",
      ],
    },
    {
      tag: "how",
      title: "A document through the queue",
      body: [
        "The packing slip goes as a PDF through the machine's own print queue: CUPS on Linux. On Windows, the spooler takes only the printer's own language.",
        "A pipeline reads the state of the jobs it printed, and never another program's.",
      ],
      metrics: { jobs: "only its own" },
    },
    {
      tag: "how",
      title: "A scan from the feeder",
      body: [
        "The pipeline asks the scanner for the delivery note over eSCL. Every page in the feeder comes back, up to 50 within 7 MiB, and the scanner's job is deleted afterwards.",
        "The pipeline stores the scan with another connector, here object storage through the credential gateway.",
      ],
    },
    {
      tag: "syrmos",
      title: "Given to read alone",
      body: [
        "A device given to read alone tells its status and takes no job: a print sent to it is refused.",
        "This part is in development: it is built and tested against stand-ins and a real CUPS print server in a container, but no real printer or scanner has been used yet.",
      ],
      metrics: { real: "not yet" },
    },
  ],
  parts: {
    spur: "Reaches the desk's printers and scanner, as its administrator gives them.",
    cell: "The pipelines run in a governed cell on the spur.",
    gateway: "Stores the scan with another connection, with no secret in the cell.",
  },
  tryIt: {
    text: "Printers and scanners are not in the spur guide yet. The guide says how to install a spur and give it what it may reach.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/spurs.md",
    linkText: "Read the spur guide",
  },
  statusNote:
    "In development: printers and scanners on a spur were built on 2026-11-19. The print client was tried against a real CUPS 2.4 in a container, and the scanner against a stand-in. The Windows spooler's jobs, Windows's own scanner interface, and a real printer or scanner have not been tried yet.",
};
