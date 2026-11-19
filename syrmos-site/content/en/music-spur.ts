import type { UseCaseText } from "../types";

export const musicSpur: UseCaseText = {
  title: "Music on a spur",
  situation: "A venue's own machine should play a synth, keep its clock steady and answer the keys, even when the network drops mid-show.",
  caveat: "Shown in a trial with virtual MIDI ports, not yet with a real synth; the spur as a whole is still in development.",
  team: "Musicians · small venues",
  context:
    "For a musician or a small venue whose show runs from pipelines: notes, chords and patterns played on a synth, a clock it follows, keys and pads that start things. A flow that runs far away times each note over the network, so notes arrive late, and the show stops when the connection does.",
  metricLabels: {
    chord: "A key to its chord",
    clock: "The clock",
    offline: "With the platform gone",
  },
  steps: [
    {
      tag: "problem",
      title: "Notes timed far away",
      body: [
        "The flow that plays the synth runs on a server somewhere else. Every note crosses the network, so its timing is the network's timing.",
        "When the connection drops, the music stops.",
      ],
      metrics: { chord: "over the network", clock: "timed by the flow", offline: "the show stops" },
    },
    {
      tag: "syrmos",
      title: "A spur, and the ports it is given",
      body: [
        "The venue's machine is enrolled as a spur with one link and runs a governed cell. Its administrator gives the spur the ports it may use in the machine's local policy: the synth to play, and the keyboard and the drum machine to hear only.",
        "A port that isn't given can't be bound, and a port no running cell is bound to is never opened.",
      ],
      metrics: { chord: "on the machine", clock: "timed by the spur", offline: "the cell runs on" },
    },
    {
      tag: "how",
      title: "A key in, a chord out",
      body: [
        "A key played on the keyboard reaches the pipeline, which plays it back on the synth as a triad.",
        "In the trial, on virtual ports, that took 24 ms at the median once the pipeline was warm.",
      ],
      metrics: { chord: "24 ms at the median" },
    },
    {
      tag: "syrmos",
      title: "Timed by the spur, not the flow",
      body: [
        "A pad starts a bar's pattern. The pipeline hands over the notes with their times, and the spur plays each one on time.",
        "Asked for notes 500 ms apart, the trial's notes came 500, 501 and 500 ms apart.",
      ],
    },
    {
      tag: "how",
      title: "A clock it sends, a clock it follows",
      body: [
        "The pipeline clocks the synth: Start, 24 pulses a beat, then Stop. In the trial, 151 pulses came 20.84 ms apart at the median, against 20.83 asked, and none was more than 5 ms late.",
        "It can follow another device's clock too. With the drum machine as master, each of its 192 pulses was passed on, and the pipeline heard its start, its bars and its stop.",
      ],
      metrics: { clock: "none more than 5 ms late" },
    },
    {
      tag: "syrmos",
      title: "Given to hear, never played",
      body: ["The keyboard was given to read only. A pipeline that tries to play it is refused by the machine itself, and a connection to a port the machine never gave is refused by the platform."],
    },
    {
      tag: "syrmos",
      title: "The platform gone, the show goes on",
      body: [
        "With the platform unreachable, the clock keeps running and a key is still harmonised.",
        "In the trial, the spur's service was even killed while the platform was still gone. It started its cell again from what it last knew, and a key played while it was down never sounded late.",
      ],
      metrics: { offline: "clock and keys go on" },
    },
    {
      tag: "how",
      title: "Every held note released",
      body: ["When an operator stops the cell, the spur releases every note the cell held, then sends All Notes Off, so nothing drones on."],
    },
  ],
  parts: {
    spur: "The venue's own machine: it times the notes and the clock, and plays on without the platform.",
    cell: "The pipelines run in a governed cell on the spur.",
    registry: "Only reviewed nodes run in the spur's cell.",
  },
  tryIt: {
    text: "The spur guide shows how to give a MIDI port and plan for a show. The trial's script runs on virtual ports, or against a synth on the machine.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/spurs.md",
    linkText: "Read the spur guide",
  },
  statusNote:
    "Shown: a trial (44 checks, passed on 2026-11-19 on one Windows desktop) runs the spur's own agent and a real cell, with every MIDI port virtual. The timings are from those virtual ports, not from a device. A synth on USB has not been run through the trial yet, nor Linux or a Raspberry Pi. The spur itself is still in development.",
};
