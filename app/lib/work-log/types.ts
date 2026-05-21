export interface WorkLogEntry {
  id: string;

  date: string;

  rawTranscript: string;

  rawInput: string;

  refinedText: string;

  cleanedSummary: string;

  metadata: {
    clients: string[];
    locations: string[];
    equipment: string[];
    tasks: string[];
    issues: string[];
  };

    // clients: string[];
    // locations: string[];
    // equipment: string[];
    // tasks: string[];
    // issues: string[];   

  createdAt: string;
}