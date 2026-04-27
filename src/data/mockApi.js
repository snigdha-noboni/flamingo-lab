const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const store = {
  membersCount: 18,
  announcements: [
    {
      id: 1,
      title: "Sprint Planning",
      description: "Planning session is scheduled for Monday at 10:00 AM in Studio Room B.",
      date: "2026-04-28",
      tag: "Event",
    },
    {
      id: 2,
      title: "Product Update",
      description: "The notes workflow now supports category and visibility tagging.",
      date: "2026-04-24",
      tag: "Update",
    },
    {
      id: 3,
      title: "QA Guidelines",
      description: "Please include reproduction steps and expected behavior for all new questions.",
      date: "2026-04-22",
      tag: "Process",
    },
  ],
  notes: [
    {
      id: 1,
      title: "API Migration Notes",
      body: "Plan rollout for phase two endpoints and align payload contracts with QA checklists.",
      author: "Nobi Sultan",
      category: "Technical",
      visibility: "Shared",
      createdAt: "2026-04-24T14:10:00.000Z",
    },
    {
      id: 2,
      title: "Career Growth Roundtable",
      body: "Collect mentorship goals and define a recurring monthly review process.",
      author: "Priya Das",
      category: "Career",
      visibility: "Shared",
      createdAt: "2026-04-20T09:30:00.000Z",
    },
    {
      id: 3,
      title: "Personal Workflow Reflection",
      body: "Experiment with focused writing windows and async check-ins before meetings.",
      author: "Alex Kim",
      category: "Personal",
      visibility: "Private",
      createdAt: "2026-04-19T17:05:00.000Z",
    },
  ],
  meetings: [
    {
      id: 1,
      title: "Design Critique",
      date: "2026-04-29",
      time: "11:00",
      location: "Studio Room A",
      description: "Review dashboard readability and hierarchy before release.",
    },
    {
      id: 2,
      title: "QA Alignment",
      date: "2026-04-30",
      time: "15:30",
      location: "Remote",
      description: "Confirm question triage policy and ownership model.",
    },
    {
      id: 3,
      title: "Roadmap Retrospective",
      date: "2026-04-15",
      time: "09:00",
      location: "Atrium",
      description: "Summarize outcomes from the last product cycle.",
    },
  ],
  questions: [
    {
      id: 1,
      text: "How should we prioritize accessibility bugs this sprint?",
      author: "Taylor R.",
      createdAt: "2026-04-25T10:30:00.000Z",
      answers: [
        { id: 101, text: "Critical blockers first, then moderate UI contrast issues.", author: "QA Lead" },
        { id: 102, text: "Tag them by user impact and pair with design owners.", author: "Nobi Sultan" },
      ],
    },
    {
      id: 2,
      text: "Should shared notes auto-notify project subscribers?",
      author: "Anonymous",
      createdAt: "2026-04-23T13:10:00.000Z",
      answers: [{ id: 103, text: "Yes, but only for notes marked as Shared and General.", author: "Product Ops" }],
    },
  ],
  ideas: [
    {
      id: 1,
      title: "Contextual Meeting Summary",
      description: "Generate a compact summary card after each meeting with linked notes and open questions.",
      author: "Mina K.",
      createdAt: "2026-04-22T16:40:00.000Z",
      likes: 12,
    },
    {
      id: 2,
      title: "Question Clustering",
      description: "Group similar QA topics with tags and confidence scoring.",
      author: "Sam D.",
      createdAt: "2026-04-21T08:55:00.000Z",
      likes: 7,
    },
  ],
};

let idCounter = 500;
const createId = () => ++idCounter;

export async function fetchDashboardData() {
  await delay();
  return {
    stats: {
      members: store.membersCount,
      notes: store.notes.length,
      questions: store.questions.length,
      ideas: store.ideas.length,
    },
    announcements: [...store.announcements],
  };
}

export async function fetchNotes() {
  await delay();
  return [...store.notes];
}

export async function addNote(payload) {
  await delay();
  const note = {
    id: createId(),
    author: payload.author || "Anonymous",
    createdAt: new Date().toISOString(),
    ...payload,
  };
  store.notes.unshift(note);
  return note;
}

export async function fetchMeetings() {
  await delay();
  return [...store.meetings];
}

export async function addMeeting(payload) {
  await delay();
  const meeting = { id: createId(), ...payload };
  store.meetings.push(meeting);
  return meeting;
}

export async function fetchQuestions() {
  await delay();
  return [...store.questions];
}

export async function addQuestion(payload) {
  await delay();
  const question = {
    id: createId(),
    text: payload.text,
    author: payload.author || "Anonymous",
    createdAt: new Date().toISOString(),
    answers: [],
  };
  store.questions.unshift(question);
  return question;
}

export async function addAnswer(questionId, payload) {
  await delay();
  const question = store.questions.find((item) => item.id === questionId);
  if (!question) {
    throw new Error("Question not found");
  }

  const answer = {
    id: createId(),
    text: payload.text,
    author: payload.author || "Anonymous",
  };

  question.answers.push(answer);
  return answer;
}

export async function fetchIdeas() {
  await delay();
  return [...store.ideas];
}

export async function addIdea(payload) {
  await delay();
  const idea = {
    id: createId(),
    likes: 0,
    createdAt: new Date().toISOString(),
    author: payload.author || "Anonymous",
    ...payload,
  };
  store.ideas.unshift(idea);
  return idea;
}

export async function likeIdea(ideaId) {
  await delay(140);
  const idea = store.ideas.find((item) => item.id === ideaId);
  if (!idea) {
    throw new Error("Idea not found");
  }
  idea.likes += 1;
  return { ...idea };
}
