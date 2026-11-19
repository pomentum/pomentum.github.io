import type { UseCaseText } from "../types";

export const padShortcuts: UseCaseText = {
  title: "A pad that starts pipelines",
  situation: "A macro pad or a foot switch on a desk should start pipelines and show their state in its lights, without anything reading what people type.",
  team: "Studios · front desks · operators",
  context:
    "For a desk, a studio or a control room where one press should start a pipeline. The usual way, a keyboard hook, sees every key of every keyboard on the machine, passwords included, and any program can listen to the same pad.",
  metricLabels: {
    reads: "What is read",
    text: "Letters, digits and text",
    real: "Run on a real pad",
  },
  steps: [
    {
      tag: "problem",
      title: "A hook that reads every key",
      body: [
        "A keyboard hook catches the pad's shortcut, but it also sees every key typed on every keyboard of the machine.",
        "Nothing stops it from reading a password, and the pad's keys still reach every other program.",
      ],
      metrics: { reads: "every keyboard", text: "read", real: "—" },
    },
    {
      tag: "syrmos",
      title: "The administrator gives the pad",
      body: [
        "The machine's administrator gives the spur one device in its local policy: a pad, a foot switch, a keypad or a mouse's buttons. To find it, they press a key on it; the spur counts presses on each candidate, keeps none, and names the device to confirm.",
        "The main keyboard can't be given.",
      ],
      metrics: { reads: "one device, given by name", text: "the keyboard can't be given" },
    },
    {
      tag: "how",
      title: "Held whole",
      body: [
        "The spur takes the device whole, so its keys reach the cell and no other program.",
        "Each press reaches the cell's webhook as an event: which key, pressed or released, and when.",
      ],
    },
    {
      tag: "syrmos",
      title: "Key codes, never characters",
      body: [
        "Letters, the top row's digits, space and punctuation are dropped by the spur and never delivered. A device that sends nothing else can't be given at all.",
        "On Windows, a named combination such as Ctrl+Alt+F9 can be registered instead; the system then delivers that combination alone.",
      ],
      metrics: { text: "dropped, never delivered" },
    },
    {
      tag: "how",
      title: "A shortcut is a pipeline",
      body: ["The pipeline behind the webhook maps each key to what it does, and runs it as a traced run like any other."],
    },
    {
      tag: "how",
      title: "The pad's lights",
      body: [
        "A pipeline can set the pad's lights, only those the device has, so the pad shows what is running.",
        "This part is in development: it is tested on recorded key streams of a foot switch, a macro pad, a mouse and a keyboard, but no real pad has been opened or lit yet.",
      ],
      metrics: { real: "not yet" },
    },
  ],
  parts: {
    spur: "Holds the pad whole, drops text, and delivers key codes to the cell.",
    cell: "The shortcuts are pipelines in a governed cell on the spur.",
  },
  tryIt: {
    text: "The guide to keys on a spur says which pads work where, and how to give one.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/spur-keys.md",
    linkText: "Read the guide to keys",
  },
  statusNote:
    "In development: keys on a spur, and the pad's lights, are built and tested on recorded key streams, not yet on a real pad, foot switch or Raspberry Pi. The Windows part is checked but has not been run on a signed-in machine (spur guide, Not built yet).",
};
