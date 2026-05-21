import { WorkLogEntry } from "./types";

export const mockEntries: WorkLogEntry[] = [
  {
    id: "1",

    rawInput:
      "Went to client office downtown and replaced failed UPS battery. Tested backup system and documented serial numbers.",

    refinedText:
      "Visited the client’s downtown office to replace a failed UPS battery. Performed backup system testing and documented equipment serial numbers.",

    locations: ["Downtown Office"],

    equipment: [
      "UPS Battery",
      "Backup System",
    ],

    clients: ["Acme Corp"],

    tasks: [
      "Battery Replacement",
      "System Testing",
      "Documentation",
    ],

    createdAt: new Date().toISOString(),
  },
];