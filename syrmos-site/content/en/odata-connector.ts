import type { UseCaseText } from "../types";

export const odataConnector: UseCaseText = {
  title: "A connector drafted from an OData description",
  situation: "Pipelines should read and write an ERP's OData service, such as SAP S/4HANA, without anyone hand-writing a connector.",
  team: "ERP and integration teams",
  context:
    "For a team whose orders, customers and stock live behind an OData service. A connector drafted by reading the description as another format leaves paging and keys as notes for a person, and its writes fail where the service asks for a token against cross-site requests first.",
  metricLabels: {
    paging: "Paging",
    writes: "A write",
    secret: "The login",
  },
  steps: [
    {
      tag: "problem",
      title: "A generic draft loses what OData says",
      body: [
        "The service's description says how its lists are paged, where the items are and how keys are written. Read as another format, that is lost: paging becomes a note, and a key can lose its quotes.",
        "A write the service guards with a token fails, because nothing fetched one.",
      ],
      metrics: { paging: "a note for a person", writes: "refused", secret: "—" },
    },
    {
      tag: "syrmos",
      title: "Drafted from its own description",
      body: [
        "Syrmos reads the service's `$metadata` itself, V2 or V4, and drafts a connector from its entity sets: paging by the service's own next links, keys written as OData writes them, and an entity's version sent with an update.",
        "The reader refuses a document with a DOCTYPE or an XML entity, never fetches a referenced document, and keeps a 4 MB limit.",
      ],
      metrics: { paging: "the service's next links" },
    },
    {
      tag: "how",
      title: "A person ticks what it may do",
      body: [
        "Listing and reading by key are ticked by default. A write is in the draft only if a person ticks it, within 50 operations.",
      ],
    },
    {
      tag: "syrmos",
      title: "Reviewed into the registry",
      body: [
        "The draft is proposed to the registry, and another person approves it. Only then can a cell's allow-list name it.",
      ],
    },
    {
      tag: "how",
      title: "Reads, page by page",
      body: [
        "A pipeline lists customers through the credential gateway, which adds the login. The connector follows each next link the service writes, and only while it stays on the same resource under the connection.",
        "A query every call must carry, such as the ERP's client number, sits on the connection; a pipeline can't choose another.",
      ],
      metrics: { secret: "added by the gateway" },
    },
    {
      tag: "syrmos",
      title: "A write, with its token",
      body: [
        "Where the connection says so, the gateway fetches the service's token against cross-site requests in the same call as each write, sends the write with it, and drops it when the call ends.",
        "Nothing is kept between calls, and nothing reaches the cell or a log.",
      ],
      metrics: { writes: "a token fetched for each write" },
    },
  ],
  parts: {
    registry: "Holds the drafted connector, proposed and approved by another person.",
    gateway: "Adds the login, the fixed query and the write's token; keeps nothing.",
    cell: "Calls the connector by name, with no login in its flows.",
  },
  tryIt: {
    text: "The SAP and OData guide goes from a service's $metadata to a drafted connector, its binding and a pipeline that uses it.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/sap-and-odata.md",
    linkText: "Read the SAP and OData guide",
  },
  statusNote:
    "Target: drafting from an OData description, its paging and keys, the token fetched for each write and a preset for SAP S/4HANA are built and tested against stand-ins. No real SAP system or sandbox has been reached yet; checking its facts on one is still open.",
};
