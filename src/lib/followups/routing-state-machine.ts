/**
 * Routing State Machine
 *
 * Tracks conversation flow using state transitions in format:
 * "PersonType>Topic>Stage"
 *
 * Example states:
 * - "Recruiter>Resume>Qualification" - Recruiter asking about credentials
 * - "Engineer>Project>DeepDive" - Engineer exploring technical details
 * - "Student>Skills>Learning" - Student learning about technologies
 * - "General>Contact>Outreach" - General visitor wanting to connect
 *
 * State transitions guide conversation toward valuable outcomes
 */

import type {
  PersonTypeEnum,
  TopicEnum,
  EntitiesType,
} from "@/lib/schemas/followup-schema";

/**
 * Conversation stages for different topics
 */
const TOPIC_STAGES: Record<TopicEnum, string[]> = {
  resume: ["Overview", "Qualification", "Experience", "Download"],
  project: ["Discovery", "Details", "DeepDive", "Explore"],
  skills: ["Overview", "Learning", "Application", "Certification"],
  contact: ["Inquiry", "Outreach", "Scheduling", "Connected"],
  other: ["Introduction", "Exploration", "Engagement", "Next"],
};

/**
 * Next stage suggestions based on current stage
 */
const STAGE_TRANSITIONS: Record<
  string,
  { next: string[]; actions: string[] }
> = {
  // Resume flow
  Overview: {
    next: ["Qualification", "Experience"],
    actions: ["Discuss background and credentials"],
  },
  Qualification: {
    next: ["Experience", "Download"],
    actions: ["Explore work history", "Download resume"],
  },
  Experience: {
    next: ["Download", "Skills"],
    actions: ["Get resume", "Dive into skills"],
  },
  Download: {
    next: ["Project", "Contact"],
    actions: ["View projects", "Schedule chat"],
  },

  // Project flow
  Discovery: {
    next: ["Details", "Explore"],
    actions: ["Learn more about specific project", "Browse all projects"],
  },
  Details: {
    next: ["DeepDive", "Explore"],
    actions: ["Technical deep dive", "See other projects"],
  },
  DeepDive: {
    next: ["Skills", "Contact"],
    actions: ["Discuss technologies", "Schedule discussion"],
  },
  Explore: {
    next: ["Details", "Skills"],
    actions: ["Pick a project", "See tech stack"],
  },

  // Skills flow
  Learning: {
    next: ["Application", "Project"],
    actions: ["See practical applications", "View projects using skill"],
  },
  Application: {
    next: ["Project", "Certification"],
    actions: ["Explore projects", "View credentials"],
  },
  Certification: {
    next: ["Resume", "Contact"],
    actions: ["Get full resume", "Discuss opportunities"],
  },

  // Contact flow
  Inquiry: {
    next: ["Outreach", "Scheduling"],
    actions: ["Ask follow-up questions", "Set up meeting"],
  },
  Outreach: {
    next: ["Scheduling", "Connected"],
    actions: ["Schedule call", "Exchange contact info"],
  },
  Scheduling: {
    next: ["Connected"],
    actions: ["Confirm meeting"],
  },
  Connected: {
    next: [],
    actions: ["Meeting scheduled - follow up via email"],
  },

  // Other flow
  Introduction: {
    next: ["Exploration", "Engagement"],
    actions: ["Learn about background", "Explore portfolio"],
  },
  Exploration: {
    next: ["Engagement", "Next"],
    actions: ["Dive deeper", "Take action"],
  },
  Engagement: {
    next: ["Next"],
    actions: ["Move to specific topic"],
  },
  Next: {
    next: ["Resume", "Project", "Skills", "Contact"],
    actions: ["Pick a direction"],
  },
};

/**
 * Parse routing state string into components
 */
export function parseRoutingState(
  state: string
): { personType: string; topic: string; stage: string } | null {
  const parts = state.split(">");

  if (parts.length !== 3) {
    console.warn(`[RoutingState] Invalid state format: ${state}`);
    return null;
  }

  const [personType, topic, stage] = parts;

  return {
    personType: personType.trim(),
    topic: topic.trim(),
    stage: stage.trim(),
  };
}

/**
 * Build routing state string from components
 */
export function buildRoutingState(
  personType: PersonTypeEnum,
  topic: TopicEnum,
  stage: string
): string {
  // Capitalize first letter of each component
  const capitalizedPersonType =
    personType.charAt(0).toUpperCase() + personType.slice(1);
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  return `${capitalizedPersonType}>${capitalizedTopic}>${stage}`;
}

/**
 * Get initial stage for a topic
 */
export function getInitialStage(topic: TopicEnum): string {
  const stages = TOPIC_STAGES[topic];
  return stages[0]; // First stage is always initial
}

/**
 * Get next stage suggestions based on current state
 */
export function getNextStages(currentStage: string): {
  next: string[];
  actions: string[];
} {
  const transition = STAGE_TRANSITIONS[currentStage];

  if (!transition) {
    console.warn(`[RoutingState] No transitions defined for stage: ${currentStage}`);
    return {
      next: [],
      actions: ["Continue conversation"],
    };
  }

  return transition;
}

/**
 * Determine next routing state based on entities
 */
export function determineNextState(entities: EntitiesType): {
  next_state: string;
  reason: string;
} {
  const { person_type, topic, confidence } = entities;

  // Get initial or next stage based on topic
  let stage = getInitialStage(topic);

  // Adjust stage based on confidence
  // High confidence (>0.75) - skip intro stages
  // Medium confidence (0.55-0.75) - start at intro
  // Low confidence (<0.55) - stay at discovery
  if (confidence > 0.75) {
    // Skip intro stage for confident users
    const stages = TOPIC_STAGES[topic];
    if (stages.length > 1) {
      stage = stages[1]; // Use second stage
    }
  }

  const next_state = buildRoutingState(person_type, topic, stage);

  // Build reason based on entities
  const reason = buildStateReason(person_type, topic, stage, confidence);

  return { next_state, reason };
}

/**
 * Build human-readable reason for state transition
 */
function buildStateReason(
  personType: PersonTypeEnum,
  topic: TopicEnum,
  stage: string,
  confidence: number
): string {
  const confidenceLevel = confidence > 0.75 ? "clear" : "emerging";

  const personTypeLabels: Record<PersonTypeEnum, string> = {
    recruiter: "Recruiter",
    engineer: "Engineer",
    student: "Student",
    general: "Visitor",
    unknown: "Visitor",
  };

  const topicLabels: Record<TopicEnum, string> = {
    resume: "credentials",
    project: "work",
    skills: "expertise",
    contact: "connection",
    other: "portfolio",
  };

  const personLabel = personTypeLabels[personType];
  const topicLabel = topicLabels[topic];

  return `${personLabel} showing ${confidenceLevel} interest in ${topicLabel}, guide to ${stage.toLowerCase()}`;
}

/**
 * Track state history (in-memory for now, could be persisted to Redis)
 */
class StateHistory {
  private history: Array<{ state: string; timestamp: number }> = [];
  private readonly MAX_HISTORY = 10;

  add(state: string): void {
    this.history.push({
      state,
      timestamp: Date.now(),
    });

    // Keep only last N states
    if (this.history.length > this.MAX_HISTORY) {
      this.history = this.history.slice(-this.MAX_HISTORY);
    }
  }

  getRecent(count: number = 5): string[] {
    return this.history.slice(-count).map((h) => h.state);
  }

  getCurrent(): string | null {
    if (this.history.length === 0) return null;
    return this.history[this.history.length - 1].state;
  }

  clear(): void {
    this.history = [];
  }
}

// Singleton instance (could be replaced with Redis-backed storage)
export const stateHistory = new StateHistory();

/**
 * Get conversation flow suggestion based on current state
 */
export function suggestConversationFlow(currentState: string): {
  currentStage: string;
  nextStages: string[];
  suggestedActions: string[];
} {
  const parsed = parseRoutingState(currentState);

  if (!parsed) {
    return {
      currentStage: "Unknown",
      nextStages: [],
      suggestedActions: ["Start fresh conversation"],
    };
  }

  const { stage } = parsed;
  const transition = getNextStages(stage);

  return {
    currentStage: stage,
    nextStages: transition.next,
    suggestedActions: transition.actions,
  };
}
