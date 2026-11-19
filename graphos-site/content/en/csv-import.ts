import type { UseCaseText } from "../types";

export const csvImport: UseCaseText = {
  title: "A spreadsheet in, checked first",
  situation: "A CSV file from a spreadsheet or another system should become nodes, with every row checked before anything is written.",
  team: "Analysts and data stewards",
  context:
    "For a team that receives data as spreadsheets or exports from other systems, and has no loader for them. Without one, each file needs a script of its own, and a bad row is found only after half the file is written.",
  metricLabels: {
    checked: "Rows checked before writing",
    noid: "A row with no id",
    again: "Sending the file again",
  },
  steps: [
    {
      tag: "problem",
      title: "A loader per file",
      body: ["Each spreadsheet needs its own script to turn rows into nodes, and its mistakes show up only once rows are written."],
      metrics: { checked: "none", noid: "—", again: "—" },
    },
    {
      tag: "product",
      title: "The file, sent as it is",
      body: [
        "The CSV file goes to `POST …/graph/nodes:csv?label=Person` as it is; edges go to `…/graph/edges:csv` with their type and their two labels.",
        "graphos reads it as UTF-8, detects a comma, semicolon or tab as the separator, and takes the first row as the header.",
      ],
    },
    {
      tag: "how",
      title: "Its columns, mapped",
      body: [
        "The id column defaults to `id` or `key`. Any column can be renamed to a property, given a type (text, number or boolean), or left out.",
        "In the web UI, the import dialog maps each column, shows a preview, and checks again after every change.",
      ],
    },
    {
      tag: "product",
      title: "Every row checked, nothing written",
      body: [
        "With `dry_run=true`, graphos checks every row and writes nothing. It answers how many rows became how many records, and lists each issue with a count and up to three examples.",
        "A row with an empty or overlong id is refused. A ragged row, a repeated id, or a value that doesn't fit its type (that value is left out) is written anyway and reported. Rows sharing an id merge into one record, a later non-empty cell winning.",
      ],
      metrics: { checked: "every one, in a dry run", noid: "refused, and reported" },
    },
    {
      tag: "how",
      title: "Written in batches",
      body: [
        "The import goes through the same bulk path as a stream: 500-row batches, so sending the file again is safe. It isn't one transaction, and a file over 256 MiB is refused.",
      ],
      metrics: { again: "safe" },
    },
  ],
  parts: {
    writes: "The same 500-row bulk path as a stream.",
    ui: "The import dialog: mapping, preview and the check.",
    api: "Reads the file as it is, with its separator detected.",
  },
  tryIt: {
    text: "The usage guide's section on CSV import shows a dry run and its issues, for nodes and for relationships.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/usage.md",
    linkText: "Read the usage guide",
  },
  statusNote:
    "Tested: graphos's tests check the separator detection, rows of one id merged with a later non-empty cell winning, and that a dry run answers as the import would and writes nothing; the web UI's import dialog has tests of its own. No benchmark covers it. The file and its rows drawn are examples, as in the screenshot.",
};
