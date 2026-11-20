import type { UseCaseText } from "../types";

// One story, a show at a venue: the earlier walkthrough music-spur's eight steps, in the order its trial ran them (shown, on virtual
// MIDI ports), in plain words. A plant's machines (on-site) and a desk's pads and shortcuts (pad-shortcuts, docs/guide/spur-keys.md)
// are one line in the context: built, but not yet run on real hardware.
export const besideTheMachines: UseCaseText = {
  title: "Run on site, beside your machines",
  situation: "Some automations belong next to the equipment, like a venue's synth, and must keep going when the network drops.",
  caveat: "Shown in a trial with stand-ins for the instruments, not yet with a real synth; the spur as a whole is still in development.",
  team: "Venues and sites with their own equipment",
  context:
    "A show runs from automations: keys played, chords and a steady beat on a synth. When the automation runs on a server far away, every note's timing is the network's, and the show stops when the connection does. The same kind of spur is being built for a plant's machines (read only for now) and for a desk's pads and shortcuts; neither has run on real hardware yet.",
  metricLabels: {
    chord: "A key to its chord (stand-ins)",
    clock: "The beat",
    offline: "With the network gone",
  },
  steps: [
    {
      tag: "problem",
      title: "Today: notes timed far away",
      body: ["The automation that plays the synth runs on a server elsewhere, so every note's timing is the network's. When the connection drops, the music stops."],
      metrics: { chord: "over the network", clock: "timed far away", offline: "the show stops" },
    },
    {
      tag: "syrmos",
      title: "The venue's machine, and what it's given",
      body: [
        "With Syrmos, the venue's machine joins as a spur with one link and runs a sealed cell. Its administrator decides which instruments it may use: the synth to play, the keyboard and the drum machine to hear only.",
      ],
      metrics: { chord: "on the machine", clock: "kept on the machine" },
    },
    {
      tag: "how",
      title: "A key in, a chord out",
      body: ["A key played on the keyboard comes back from the synth as a full chord. In the trial, with stand-ins for the instruments, that took 24 ms at the median."],
      metrics: { chord: "24 ms, median" },
    },
    {
      tag: "syrmos",
      title: "The beat kept on the spot",
      body: ["The automation hands over a bar's notes with their times, and the spur plays each one on time. Asked for notes 500 ms apart, the trial's came 500, 501 and 500 ms apart."],
    },
    {
      tag: "how",
      title: "A beat it sends, a beat it follows",
      body: [
        "The automation sends the synth its beat: in the trial, 151 pulses came 20.84 ms apart at the median, against 20.83 asked, and none was more than 5 ms late. It can follow another device's beat too, such as the drum machine's.",
      ],
      metrics: { clock: "none more than 5 ms late" },
    },
    {
      tag: "syrmos",
      title: "Given to hear, never played",
      body: [
        "The keyboard was given to hear only. An automation that tries to play it is refused by the machine itself, and an instrument the machine never gave is refused by the platform.",
      ],
    },
    {
      tag: "syrmos",
      title: "The network gone, the show goes on",
      body: [
        "With the platform out of reach, the beat keeps running and a key still becomes a chord. In the trial the spur's own service was even stopped meanwhile: it came back from what it last knew, and no key sounded late.",
      ],
      metrics: { offline: "the beat goes on" },
    },
    {
      tag: "how",
      title: "Nothing left droning",
      body: ["When the cell is stopped, the spur releases every note it was holding, so nothing drones on."],
    },
  ],
  parts: {
    spur: "The venue's own machine: it keeps the timing and plays on without the platform.",
    cell: "The automations run in a sealed cell on the spur, using only the instruments its administrator gave.",
  },
  tryIt: {
    text: "The spur guide shows how to give an instrument to a spur and plan for a show. The trial's script runs with stand-ins, or with a synth on the machine.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/spurs.md",
    linkText: "Read the spur guide",
  },
  statusNote:
    "Shown: a trial (44 checks, passed on 2026-11-19 on one Windows desktop) running the spur's own agent and a real cell, with every MIDI port virtual. The timings are from those virtual ports, not from a device. Not yet run: a synth on USB, Linux or a Raspberry Pi. In development: the spur as a whole; at a plant, reads are built and writes are not; a desk's pads and shortcuts are built and tested on recorded key streams, not on a real pad.",
};
