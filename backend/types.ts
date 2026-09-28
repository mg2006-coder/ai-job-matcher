export interface JobInput {
  title: string;
  description: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
}

export interface CandidateProfile {
  skills: string[];
  education: string;
  experience: string;
  projects: string;
}

export interface MatchExplanation {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}
