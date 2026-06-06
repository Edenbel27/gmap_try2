import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  points: number;
  assignee: string;
  isSprint: boolean;
  reviewApproved?: boolean | null;
  reviewFeedback?: string;
  reviewRating?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface SpeakerNotes {
  yesterday: string;
  today: string;
  obstacles: string;
  doneCheckingIn: boolean;
}

export interface RetroCard {
  id: string;
  category: 'well' | 'improve' | 'action';
  content: string;
  upvotes: number;
  assignee?: string;
}

interface ScrumContextType {
  sprintNumber: number;
  sprintName: string;
  sprintGoal: string;
  startDate: string;
  endDate: string;
  backlog: BacklogItem[];
  teamMembers: TeamMember[];
  blockers: string[];
  retroCards: RetroCard[];
  
  // Standup State
  standupActive: boolean;
  standupTimer: number;
  standupSpeakerIdx: number;
  standupSpeakerTimer: number;
  speakerNotes: Record<string, SpeakerNotes>;
  
  // Methods
  updateSprintGoal: (goal: string) => void;
  addBacklogItem: (item: Omit<BacklogItem, 'id' | 'status' | 'isSprint'>) => void;
  updateBacklogItemStatus: (id: string, status: BacklogItem['status']) => void;
  toggleBacklogSprintAssociation: (id: string) => void;
  addBlocker: (blocker: string) => void;
  removeBlocker: (index: number) => void;
  addRetroCard: (category: RetroCard['category'], content: string) => void;
  upvoteRetroCard: (id: string) => void;
  assignRetroCard: (id: string, assignee: string) => void;
  
  // Standup Methods
  startStandup: () => void;
  pauseStandup: () => void;
  resetStandup: () => void;
  nextSpeaker: () => void;
  updateSpeakerNotes: (memberName: string, field: 'yesterday' | 'today' | 'obstacles', text: string) => void;
  completeSpeakerCheckIn: (memberName: string) => void;
  
  // Review Methods
  submitReviewFeedback: (itemId: string, approved: boolean, rating: number, feedback: string) => void;
}

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { name: 'Alex', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
  { name: 'Sofia', role: 'Product Owner', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { name: 'Michael', role: 'Scrum Master', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
  { name: 'Sarah', role: 'UI Designer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { name: 'Lily', role: 'QA Engineer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
];

const INITIAL_BACKLOG: BacklogItem[] = [
  {
    id: 't1',
    title: 'Setup Supabase Integration',
    description: 'Configure supabase clients, local auth hooks, and setup schema migrations.',
    status: 'done',
    priority: 'high',
    points: 5,
    assignee: 'Alex',
    isSprint: true,
    reviewApproved: true,
    reviewRating: 5,
    reviewFeedback: 'Perfect integration, authentication works flawlessly in local tests.',
  },
  {
    id: 't2',
    title: 'Create Home Dashboard Shell',
    description: 'Implement a beautiful dashboard layout with circular indicators and stats panels.',
    status: 'done',
    priority: 'high',
    points: 3,
    assignee: 'Sarah',
    isSprint: true,
    reviewApproved: true,
    reviewRating: 4,
    reviewFeedback: 'UI layout matches Figma mockup perfectly, transitions are smooth.',
  },
  {
    id: 't3',
    title: 'Build Interactive Standup Timer',
    description: 'Create a 15-minute timer countdown with individual speaker timing support.',
    status: 'in_progress',
    priority: 'high',
    points: 5,
    assignee: 'Alex',
    isSprint: true,
  },
  {
    id: 't4',
    title: 'Implement Retrospective Voting',
    description: 'Add support for retro boards card additions and upvoting system.',
    status: 'todo',
    priority: 'medium',
    points: 3,
    assignee: 'Michael',
    isSprint: true,
  },
  {
    id: 't5',
    title: 'Configure Notification Settings',
    description: 'Implement settings screen toggles and integrate local notifications setup.',
    status: 'todo',
    priority: 'low',
    points: 2,
    assignee: 'Lily',
    isSprint: true,
  },
  {
    id: 't6',
    title: 'Add Booking Calendar Grid View',
    description: 'Develop a custom monthly calendar display for class scheduling and gym reservations.',
    status: 'todo',
    priority: 'medium',
    points: 8,
    assignee: 'Sarah',
    isSprint: false,
  },
  {
    id: 't7',
    title: 'Design Dark Mode Custom Themes',
    description: 'Implement premium tokens, dark styling options, and visual layout gradients.',
    status: 'todo',
    priority: 'low',
    points: 3,
    assignee: 'Sarah',
    isSprint: false,
  },
  {
    id: 't8',
    title: 'Create Trainer Profile Details',
    description: 'Design the trainer details sheet containing reviews list, specialties list, and ratings.',
    status: 'todo',
    priority: 'medium',
    points: 5,
    assignee: 'Lily',
    isSprint: false,
  },
];

const INITIAL_RETRO: RetroCard[] = [
  { id: 'r1', category: 'well', content: 'Great teamwork during the complex Supabase authentication setup.', upvotes: 4 },
  { id: 'r2', category: 'well', content: 'Beautiful premium splash animations are getting awesome feedback.', upvotes: 3 },
  { id: 'r3', category: 'improve', content: 'Standups often exceed the 15-minute timebox.', upvotes: 5 },
  { id: 'r4', category: 'improve', content: 'Figma assets were missing dimensions for tablet layouts.', upvotes: 2 },
  { id: 'r5', category: 'action', content: 'Strictly timebox daily standups using an interactive visual timer.', upvotes: 4, assignee: 'Michael' },
  { id: 'r6', category: 'action', content: 'Export all tablet sizing guides to the shared design project.', upvotes: 2, assignee: 'Sarah' },
];

const INITIAL_SPEAKER_NOTES: Record<string, SpeakerNotes> = {
  Alex: { yesterday: 'Configured Supabase client & DB functions.', today: 'Working on active standup timer UI.', obstacles: 'None', doneCheckingIn: false },
  Sofia: { yesterday: 'Refined backlog priorities & user stories.', today: 'Gathering feedback from beta user groups.', obstacles: 'Awaiting design team approval on layout details.', doneCheckingIn: false },
  Michael: { yesterday: 'Facilitated sprint planning for Sprint 5.', today: 'Clearing bottlenecks for the auth setup team.', obstacles: 'None', doneCheckingIn: false },
  Sarah: { yesterday: 'Finished styling for onboarding screens.', today: 'Preparing assets for booking workflows.', obstacles: 'Slow internet connection is delaying Figma exports.', doneCheckingIn: false },
  Lily: { yesterday: 'Wrote unit tests for auth services.', today: 'Testing gym class scheduling logic.', obstacles: 'Need simulator access for tablet-specific testing.', doneCheckingIn: false },
};

const ScrumContext = createContext<ScrumContextType | undefined>(undefined);

export const ScrumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sprintNumber] = useState(5);
  const [sprintName] = useState('Falcon Elevate');
  const [sprintGoal, setSprintGoal] = useState('Establish fully functional core features including Supabase integration, authentication flows, standup runner, and retrospective boards.');
  const [startDate] = useState('Jun 01, 2026');
  const [endDate] = useState('Jun 14, 2026');

  const [backlog, setBacklog] = useState<BacklogItem[]>(INITIAL_BACKLOG);
  const [blockers, setBlockers] = useState<string[]>(['Figma assets missing for tablet screens', 'Simulator access needed for QA testing']);
  const [retroCards, setRetroCards] = useState<RetroCard[]>(INITIAL_RETRO);
  const [teamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  // Standup Facilitator States
  const [standupActive, setStandupActive] = useState(false);
  const [standupTimer, setStandupTimer] = useState(0); // overall timer in seconds
  const [standupSpeakerIdx, setStandupSpeakerIdx] = useState(0);
  const [standupSpeakerTimer, setStandupSpeakerTimer] = useState(0); // active speaker timer in seconds
  const [speakerNotes, setSpeakerNotes] = useState<Record<string, SpeakerNotes>>(INITIAL_SPEAKER_NOTES);

  // Overall Standup timer ticks
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (standupActive) {
      interval = setInterval(() => {
        setStandupTimer((prev) => prev + 1);
        setStandupSpeakerTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [standupActive]);

  const updateSprintGoal = (goal: string) => {
    setSprintGoal(goal);
  };

  const addBacklogItem = (item: Omit<BacklogItem, 'id' | 'status' | 'isSprint'>) => {
    const newItem: BacklogItem = {
      ...item,
      id: `t${Date.now()}`,
      status: 'todo',
      isSprint: false,
    };
    setBacklog((prev) => [...prev, newItem]);
  };

  const updateBacklogItemStatus = (id: string, status: BacklogItem['status']) => {
    setBacklog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const toggleBacklogSprintAssociation = (id: string) => {
    setBacklog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSprint: !item.isSprint } : item))
    );
  };

  const addBlocker = (blocker: string) => {
    if (blocker.trim()) {
      setBlockers((prev) => [...prev, blocker]);
    }
  };

  const removeBlocker = (index: number) => {
    setBlockers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addRetroCard = (category: RetroCard['category'], content: string) => {
    if (content.trim()) {
      const newCard: RetroCard = {
        id: `r${Date.now()}`,
        category,
        content,
        upvotes: 0,
      };
      setRetroCards((prev) => [...prev, newCard]);
    }
  };

  const upvoteRetroCard = (id: string) => {
    setRetroCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, upvotes: card.upvotes + 1 } : card))
    );
  };

  const assignRetroCard = (id: string, assignee: string) => {
    setRetroCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, assignee } : card))
    );
  };

  // Standup Methods
  const startStandup = () => {
    setStandupActive(true);
  };

  const pauseStandup = () => {
    setStandupActive(false);
  };

  const resetStandup = () => {
    setStandupActive(false);
    setStandupTimer(0);
    setStandupSpeakerIdx(0);
    setStandupSpeakerTimer(0);
    // Reset check-in completion states
    setSpeakerNotes((prev) => {
      const resetNotes: Record<string, SpeakerNotes> = {};
      Object.keys(prev).forEach((key) => {
        resetNotes[key] = { ...prev[key], doneCheckingIn: false };
      });
      return resetNotes;
    });
  };

  const nextSpeaker = () => {
    // Mark current speaker as checked-in
    const currentSpeakerName = teamMembers[standupSpeakerIdx].name;
    completeSpeakerCheckIn(currentSpeakerName);

    // If there are obstacles in notes, log them dynamically as blockers
    const notes = speakerNotes[currentSpeakerName];
    if (notes && notes.obstacles && notes.obstacles.trim().toLowerCase() !== 'none' && notes.obstacles.trim() !== '') {
      addBlocker(`${currentSpeakerName} blocker: ${notes.obstacles}`);
    }

    if (standupSpeakerIdx < teamMembers.length - 1) {
      setStandupSpeakerIdx((prev) => prev + 1);
      setStandupSpeakerTimer(0);
    } else {
      // Completed Standup for all members
      setStandupActive(false);
    }
  };

  const updateSpeakerNotes = (
    memberName: string,
    field: 'yesterday' | 'today' | 'obstacles',
    text: string
  ) => {
    setSpeakerNotes((prev) => ({
      ...prev,
      [memberName]: {
        ...prev[memberName],
        [field]: text,
      },
    }));
  };

  const completeSpeakerCheckIn = (memberName: string) => {
    setSpeakerNotes((prev) => ({
      ...prev,
      [memberName]: {
        ...prev[memberName],
        doneCheckingIn: true,
      },
    }));
  };

  // Review feedback
  const submitReviewFeedback = (itemId: string, approved: boolean, rating: number, feedback: string) => {
    setBacklog((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              reviewApproved: approved,
              reviewRating: rating,
              reviewFeedback: feedback,
            }
          : item
      )
    );
  };

  return (
    <ScrumContext.Provider
      value={{
        sprintNumber,
        sprintName,
        sprintGoal,
        startDate,
        endDate,
        backlog,
        teamMembers,
        blockers,
        retroCards,
        
        standupActive,
        standupTimer,
        standupSpeakerIdx,
        standupSpeakerTimer,
        speakerNotes,
        
        updateSprintGoal,
        addBacklogItem,
        updateBacklogItemStatus,
        toggleBacklogSprintAssociation,
        addBlocker,
        removeBlocker,
        addRetroCard,
        upvoteRetroCard,
        assignRetroCard,
        
        startStandup,
        pauseStandup,
        resetStandup,
        nextSpeaker,
        updateSpeakerNotes,
        completeSpeakerCheckIn,
        
        submitReviewFeedback,
      }}
    >
      {children}
    </ScrumContext.Provider>
  );
};

export const useScrum = () => {
  const context = useContext(ScrumContext);
  if (context === undefined) {
    throw new Error('useScrum must be used within a ScrumProvider');
  }
  return context;
};
