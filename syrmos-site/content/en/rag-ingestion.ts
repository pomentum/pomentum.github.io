import type { UseCaseText } from "../types";

export const ragIngestion: UseCaseText = {
  title: "Documents into search, scanned first",
  situation: "Pages and files should reach a search index or a model only after a scan, and every record should say where it came from.",
  team: "AI and knowledge teams",
  context:
    "For a team that feeds documents into a vector store for search or a model. A flow that fetches and loads can skip the scan, start over from page one after a crash, and leave records nobody can trace back to the run that wrote them.",
  metricLabels: {
    unscanned: "A path that skips the scan",
    resume: "After a crash",
    trace: "A record traces back to",
  },
  steps: [
    {
      tag: "problem",
      title: "Pages loaded unscanned",
      body: ["The flow fetches pages and loads them straight into the store. Nothing makes the scan happen, and nothing shows which run wrote what."],
      metrics: { unscanned: "possible", resume: "starts over", trace: "nothing" },
    },
    {
      tag: "syrmos",
      title: "Stages joined by the bus",
      body: [
        "The work is split into stages: fetch, scan, chunk and load. Each stage hands its work to the next over the bus, so a stage can fail and be tried again without losing what came before.",
      ],
    },
    {
      tag: "syrmos",
      title: "No path past the scan",
      body: [
        "The cell's path rule names the scan as a step every path from a source to the store must pass. A copy of the pipeline without it is refused at deploy, with the path named.",
      ],
      metrics: { unscanned: "refused at deploy" },
    },
    {
      tag: "how",
      title: "In batches, progress kept",
      body: ["The fetch stage reads the source five pages at a time and keeps where it got to as the pipeline's progress, written only when a batch's run succeeds."],
    },
    {
      tag: "syrmos",
      title: "Killed mid-scan, resumed",
      body: [
        "In the trial the cell was killed in the middle of the scan and started again. The crawl went on from its last batch, not from the first page.",
      ],
      metrics: { resume: "from its last batch" },
    },
    {
      tag: "how",
      title: "Flagged pages kept out",
      body: [
        "Of the trial's 23 pages, 20 came through clean and 3 were flagged, and the counts matched the source. The store held exactly the 39 chunks of the clean pages.",
        "The load goes through the credential gateway to the tenant's own service, so no key sits in the flow.",
      ],
    },
    {
      tag: "how",
      title: "Every record traces back",
      body: ["Each record in the store carries its run's key. From it you find the run, and the pipeline version, by its digest, that wrote it."],
      metrics: { trace: "its run and pipeline version" },
    },
  ],
  parts: {
    bus: "Joins the stages, so each one hands on its work durably.",
    cell: "Its path rule makes the scan a step no path can skip.",
    gateway: "Reaches the tenant's store with no key in the flow.",
    tracing: "Ties each record to its run and pipeline version.",
  },
  tryIt: {
    text: "The trial's script runs this against a NATS server in Docker and a real cell. The trials list says how to run it.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/trials/README.md",
    linkText: "Read the trials",
  },
  statusNote:
    "Shown: a trial (17 checks, passed on 2026-10-24) runs it against a NATS server in Docker and a real cell. The tenant's services and the gateway are stand-ins in the trial's process; the real gateway's way to a service is shown by a separate test.",
};
