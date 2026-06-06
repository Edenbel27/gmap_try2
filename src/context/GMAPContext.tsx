import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Interfaces mapping to database tables
export interface Gym {
  id: string;
  name: string;
  description: string;
  images: string[];
  rating: number;
  distance: string;
  openStatus: string;
  hours: string;
  services: string[];
  amenities: string[];
  plans: MembershipPlan[];
  trainers: string[]; // trainer IDs
}

export interface MembershipPlan {
  name: string;
  price: number;
  duration: string;
  features: string[];
}

export interface Trainer {
  id: string;
  name: string;
  bio: string;
  experience: string;
  rating: number;
  specialties: string[];
  photo: string;
  price: number;
  gymId: string;
}

export interface Class {
  id: string;
  name: string;
  gymId: string;
  gymName: string;
  trainerName: string;
  time: string;
  day: string; // e.g. 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  spots: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Membership {
  gymId: string;
  gymName: string;
  planName: string;
  status: 'active' | 'pending' | 'expired' | 'none';
  price: number;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  qrCode: string;
  lastCheckIn: string;
}

export interface Booking {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerPhoto: string;
  day: string;
  time: string;
  note: string;
  status: 'pending' | 'confirmed' | 'declined';
  price: number;
}

export interface CheckIn {
  id: string;
  gymName: string;
  date: string;
  time: string;
}

export interface Payment {
  id: string;
  item: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Review {
  id: string;
  targetId: string; // gymId or trainerId
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'membership' | 'booking' | 'classes' | 'check_in' | 'announcement';
  date: string;
  read: boolean;
}

export interface Streak {
  count: number;
  days: string[]; // e.g. ['Mon', 'Wed']
}

interface GMAPContextType {
  currentUser: User | null;
  gyms: Gym[];
  trainers: Trainer[];
  classes: Class[];
  membership: Membership;
  bookings: Booking[];
  classRegistrations: string[]; // list of classIds
  checkIns: CheckIn[];
  payments: Payment[];
  reviews: Review[];
  notifications: Notification[];
  streak: Streak;
  settings: {
    darkMode: boolean;
    pushNotifications: boolean;
  };
  
  // Auth Operations
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  
  // Gym/Membership Operations
  joinGym: (gymId: string, planName: string, price: number, paymentMethod: string) => void;
  approvePendingMembership: () => void; // admin mock simulation trigger
  addReview: (targetId: string, rating: number, comment: string) => void;
  
  // Trainer Booking Operations
  bookTrainer: (trainerId: string, day: string, time: string, note: string) => void;
  approvePendingBooking: (bookingId: string) => void; // admin mock simulation trigger
  
  // Classes Operations
  registerForClass: (classId: string) => void;
  cancelClassRegistration: (classId: string) => void;
  
  // Pass / Check-In Operations
  triggerCheckIn: () => void;
  
  // General Operations
  clearNotifications: () => void;
  toggleSetting: (key: 'darkMode' | 'pushNotifications') => void;
}

const EMAIL_ALREADY_EXISTS_MESSAGE = 'A user with this email already exist';

// Initial Seed Data
const MOCK_TRAINERS: Trainer[] = [
  {
    id: 'tr1',
    name: 'Alex D.',
    bio: 'Certified bodybuilding coach and athletic strength coordinator with 5+ years of experience helping people achieve their dream physiques.',
    experience: '5 years',
    rating: 4.8,
    specialties: ['Bodybuilding', 'Weight Loss', 'Strength'],
    photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200',
    price: 300,
    gymId: 'g1',
  },
  {
    id: 'tr2',
    name: 'Sofia M.',
    bio: 'Mindfulness advocate and flexible movement specialist. Focuses on yoga flows, flexibility workshops, and custom HIIT training.',
    experience: '4 years',
    rating: 4.9,
    specialties: ['Yoga', 'Flexibility', 'HIIT'],
    photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200',
    price: 250,
    gymId: 'g1',
  },
  {
    id: 'tr3',
    name: 'Michael B.',
    bio: 'Elite functional training expert. Specializes in cardiovascular optimization, sports performance, and athletic therapy.',
    experience: '6 years',
    rating: 4.7,
    specialties: ['Functional Training', 'Cardio', 'Sports Performance'],
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200',
    price: 350,
    gymId: 'g2',
  },
];

const MOCK_GYMS: Gym[] = [
  {
    id: 'g1',
    name: 'Falcon Fitness Center',
    description: 'Addis Ababa\'s premier fitness zone. Fully equipped with modern cardiovascular systems, high-quality free weights, dynamic group classes, and sauna facilities.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
    ],
    rating: 4.8,
    distance: '1.2 km (Bole)',
    openStatus: 'Open Now',
    hours: '06:00 AM - 10:00 PM',
    services: ['Weights', 'Cardio', 'Classes', 'PT Sessions'],
    amenities: ['Wifi', 'Showers', 'Sauna', 'Lockers'],
    plans: [
      { name: 'Basic Plan', price: 1000, duration: 'Monthly', features: ['Gym Access', 'Lockers & Wifi'] },
      { name: 'Premium Plan', price: 1800, duration: 'Monthly', features: ['Gym Access', 'Sauna & Showers', '2 Guest Passes/mo'] },
      { name: 'VIP Plan', price: 3000, duration: 'Monthly', features: ['Gym Access', 'Sauna & Showers', '1 Free PT Session/mo', 'Flexible Hours'] },
    ],
    trainers: ['tr1', 'tr2'],
  },
  {
    id: 'g2',
    name: 'Addis Iron Paradise',
    description: 'A no-nonsense powerlifting and strength training gym dedicated to heavy lifting, personal coaching, and raw power athletics.',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500',
    ],
    rating: 4.6,
    distance: '3.5 km (Sarbet)',
    openStatus: 'Open Now',
    hours: '05:00 AM - 11:00 PM',
    services: ['Weights', 'PT Sessions'],
    amenities: ['Parking', 'Wifi', 'Lockers'],
    plans: [
      { name: 'Basic Strength', price: 800, duration: 'Monthly', features: ['Iron Room Access', 'Lockers'] },
      { name: 'Elite Athlete', price: 1500, duration: 'Monthly', features: ['Iron Room Access', 'Custom Workouts', 'Wifi'] },
    ],
    trainers: ['tr3'],
  },
  {
    id: 'g3',
    name: 'Apex Fitness Hub',
    description: 'Luxury fitness space providing custom pilates, indoor swimming pool, indoor spin cycles, sauna, and massage therapy treatments.',
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500',
    ],
    rating: 4.9,
    distance: '5.1 km (CMC)',
    openStatus: '24 Hour',
    hours: 'Open 24/7',
    services: ['Weights', 'Cardio', 'Classes', 'PT Sessions', 'Pilates'],
    amenities: ['Parking', 'Wifi', 'Sauna', 'Showers', 'Lockers'],
    plans: [
      { name: 'VIP Platinum', price: 4000, duration: 'Monthly', features: ['All Gym Access', 'Pool & Cycle Classes', 'Full Amenities'] },
    ],
    trainers: [],
  },
];

const MOCK_CLASSES: Class[] = [
  { id: 'c1', name: 'Morning Yoga Flow', gymId: 'g1', gymName: 'Falcon Fitness Center', trainerName: 'Sofia M.', time: '07:00 AM', day: 'Monday', spots: 12 },
  { id: 'c2', name: 'HIIT Cardio Blast', gymId: 'g1', gymName: 'Falcon Fitness Center', trainerName: 'Michael B.', time: '06:30 PM', day: 'Monday', spots: 8 },
  { id: 'c3', name: 'Strength 101', gymId: 'g1', gymName: 'Falcon Fitness Center', trainerName: 'Alex D.', time: '06:00 PM', day: 'Wednesday', spots: 15 },
  { id: 'c4', name: 'Flexibility & Balance', gymId: 'g1', gymName: 'Falcon Fitness Center', trainerName: 'Sofia M.', time: '08:00 AM', day: 'Friday', spots: 10 },
  { id: 'c5', name: 'Core Workout', gymId: 'g2', gymName: 'Addis Iron Paradise', trainerName: 'Michael B.', time: '10:00 AM', day: 'Saturday', spots: 20 },
];

const MOCK_REVIEWS: Review[] = [
  { id: 'rv1', targetId: 'g1', userName: 'Melaku T.', rating: 5, comment: 'Clean facilities, and the premium sauna is incredibly relaxing after a workout.', date: 'May 20, 2026' },
  { id: 'rv2', targetId: 'g1', userName: 'Tsion Y.', rating: 4, comment: 'Great coaches, but Bole traffic makes it hard to find parking during rush hour.', date: 'May 28, 2026' },
  { id: 'rv3', targetId: 'tr1', userName: 'Elias K.', rating: 5, comment: 'Alex completely transformed my strength training. Added 30kg to my squat in 2 months.', date: 'May 15, 2026' },
];

const GMAPContext = createContext<GMAPContextType | undefined>(undefined);

export const GMAPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // DB Table States
  const [gyms, setGyms] = useState<Gym[]>(MOCK_GYMS);
  const [trainers] = useState<Trainer[]>(MOCK_TRAINERS);
  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  
  // User relational state tables
  const [membership, setMembership] = useState<Membership>({
    gymId: 'g1',
    gymName: 'Falcon Fitness Center',
    planName: 'Premium Plan',
    status: 'active',
    price: 1800,
    paymentMethod: 'Pay In Person',
    startDate: 'May 25, 2026',
    endDate: 'Jun 25, 2026',
    qrCode: 'GMAP-MEMBER-LILY-FALCON',
    lastCheckIn: 'Today, 08:15 AM',
  });

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'b1',
      trainerId: 'tr1',
      trainerName: 'Alex D.',
      trainerPhoto: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200',
      day: 'Tuesday',
      time: '09:00 AM',
      note: 'Focusing on barbell deadlift form check.',
      status: 'confirmed',
      price: 300,
    }
  ]);

  const [classRegistrations, setClassRegistrations] = useState<string[]>(['c1']);
  
  const [checkIns, setCheckIns] = useState<CheckIn[]>([
    { id: 'ch1', gymName: 'Falcon Fitness Center', date: 'May 25, 2026', time: '08:00 AM' },
    { id: 'ch2', gymName: 'Falcon Fitness Center', date: 'May 27, 2026', time: '08:30 AM' },
    { id: 'ch3', gymName: 'Falcon Fitness Center', date: 'May 29, 2026', time: '08:10 AM' },
    { id: 'ch4', gymName: 'Falcon Fitness Center', date: 'Jun 01, 2026', time: '08:15 AM' },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    { id: 'p1', item: 'Membership - Premium Plan', date: 'May 25, 2026', amount: 1800, method: 'Pay In Person', status: 'completed' },
    { id: 'p2', item: 'PT Session - Alex D.', date: 'May 28, 2026', amount: 300, method: 'Pay In Person', status: 'completed' },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', title: 'Welcome to Falcon Fitness', body: 'Your Premium membership request was approved by gym management.', type: 'membership', date: 'May 25, 2026', read: false },
    { id: 'n2', title: 'Booking Confirmed', body: 'Alex D. confirmed your personal training session on Tuesday.', type: 'booking', date: 'May 28, 2026', read: true },
  ]);

  const [streak, setStreak] = useState<Streak>({
    count: 4,
    days: ['Mon', 'Wed', 'Fri', 'Mon'],
  });

  const [settings, setSettings] = useState({
    darkMode: true,
    pushNotifications: true,
  });

  const mapAuthUserToProfile = (authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
    const metadataName = typeof authUser.user_metadata?.name === 'string' ? authUser.user_metadata.name : '';
    const metadataAvatar = typeof authUser.user_metadata?.avatar_url === 'string' ? authUser.user_metadata.avatar_url : '';

    return {
      id: authUser.id,
      name: metadataName || authUser.email?.split('@')[0] || 'Athlete',
      email: authUser.email || '',
      avatar: metadataAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    } satisfies User;
  };

  const loadCurrentUser = async (authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, avatar_url')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!error && data) {
      setCurrentUser({
        id: data.id,
        name: data.name || authUser.user_metadata?.name?.toString() || authUser.email?.split('@')[0] || 'Athlete',
        email: data.email || authUser.email || '',
        avatar: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      });
      return;
    }

    setCurrentUser(mapAuthUserToProfile(authUser));
  };

  const isEmailAlreadyRegisteredError = (message?: string) => {
    return typeof message === 'string' && /already.*(registered|exist)|user.*already.*exists|email.*already.*exist/i.test(message);
  };

  const isExistingSupabaseSignupUser = (user: { identities?: unknown[] | null } | null | undefined) => {
    return Array.isArray(user?.identities) && user.identities.length === 0;
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session?.user) {
        await loadCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
    };

    bootstrapSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        await loadCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Auth Operations
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      await loadCurrentUser(data.user);
    }

    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (!lookupError && existingUser) {
      return {
        success: false,
        message: EMAIL_ALREADY_EXISTS_MESSAGE,
      };
    }

    const { data: authEmailExists, error: authLookupError } = await supabase.rpc('email_exists', {
      p_email: normalizedEmail,
    });

    if (!authLookupError && authEmailExists) {
      return {
        success: false,
        message: EMAIL_ALREADY_EXISTS_MESSAGE,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      if (isEmailAlreadyRegisteredError(error.message)) {
        return {
          success: false,
          message: EMAIL_ALREADY_EXISTS_MESSAGE,
        };
      }

      return { success: false, message: error.message };
    }

    if (isExistingSupabaseSignupUser(data.user)) {
      return {
        success: false,
        message: EMAIL_ALREADY_EXISTS_MESSAGE,
      };
    }

    if (data.session?.user) {
      await loadCurrentUser(data.session.user);
      return { success: true };
    }

    return {
      success: true,
      requiresEmailConfirmation: true,
      message: 'Check your email to confirm your account before signing in.',
    };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // Gym/Membership Operations
  const joinGym = (gymId: string, planName: string, price: number, paymentMethod: string) => {
    const gym = gyms.find(g => g.id === gymId);
    if (!gym) return;

    const newMembership: Membership = {
      gymId,
      gymName: gym.name,
      planName,
      status: 'pending',
      price,
      paymentMethod,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      qrCode: `GMAP-PENDING-${currentUser?.name.toUpperCase()}-${gym.name.toUpperCase().replace(/\s+/g, '')}`,
      lastCheckIn: 'None',
    };

    setMembership(newMembership);

    // Create payment
    const newPayment: Payment = {
      id: `pay${Date.now()}`,
      item: `Membership - ${planName}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: price,
      method: paymentMethod,
      status: 'pending',
    };
    setPayments(prev => [newPayment, ...prev]);

    // Create notification
    const newNotif: Notification = {
      id: `notif${Date.now()}`,
      title: 'Membership Request Logged',
      body: `Your join request for ${gym.name} is pending gym management approval.`,
      type: 'membership',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Auto approve simulation: Trigger in 10 seconds to simulate background gym admin approval
    setTimeout(() => {
      approvePendingMembership();
    }, 15000);
  };

  const approvePendingMembership = () => {
    setMembership(prev => {
      if (prev.status !== 'pending') return prev;
      
      // Notify user
      const approveNotif: Notification = {
        id: `notif${Date.now()}`,
        title: 'Membership Approved!',
        body: `Welcome to ${prev.gymName}! Your membership is now active. Scan your QR Pass to enter.`,
        type: 'membership',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        read: false,
      };
      setNotifications(oldNotifs => [approveNotif, ...oldNotifs]);

      return {
        ...prev,
        status: 'active',
        qrCode: `GMAP-MEMBER-${currentUser?.name.toUpperCase()}-${prev.gymName.toUpperCase().replace(/\s+/g, '')}`,
      };
    });

    setPayments(prev => 
      prev.map(p => p.status === 'pending' && p.item.includes('Membership') ? { ...p, status: 'completed' } : p)
    );
  };

  const addReview = (targetId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev${Date.now()}`,
      targetId,
      userName: currentUser?.name || 'Anonymous',
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setReviews(prev => [newReview, ...prev]);

    // Update gym/trainer rating averages
    const isGym = gyms.some(g => g.id === targetId);
    if (isGym) {
      setGyms(prevGyms =>
        prevGyms.map(g => {
          if (g.id === targetId) {
            const associatedReviews = [newReview, ...reviews.filter(r => r.targetId === targetId)];
            const avg = associatedReviews.reduce((sum, r) => sum + r.rating, 0) / associatedReviews.length;
            return { ...g, rating: Math.round(avg * 10) / 10 };
          }
          return g;
        })
      );
    }
  };

  // Trainer Booking Operations
  const bookTrainer = (trainerId: string, day: string, time: string, note: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    if (!trainer) return;

    const newBooking: Booking = {
      id: `bk${Date.now()}`,
      trainerId,
      trainerName: trainer.name,
      trainerPhoto: trainer.photo,
      day,
      time,
      note,
      status: 'pending',
      price: trainer.price,
    };

    setBookings(prev => [newBooking, ...prev]);

    // Create payment
    const newPayment: Payment = {
      id: `pay${Date.now()}`,
      item: `PT Session - ${trainer.name}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: trainer.price,
      method: 'Pay In Person',
      status: 'pending',
    };
    setPayments(prev => [newPayment, ...prev]);

    // Create notification
    const newNotif: Notification = {
      id: `notif${Date.now()}`,
      title: 'Booking Request Sent',
      body: `Requested session with ${trainer.name} on ${day} at ${time}.`,
      type: 'booking',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Simulate auto-confirm in 10s
    setTimeout(() => {
      approvePendingBooking(newBooking.id);
    }, 10000);
  };

  const approvePendingBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          // Notify
          const confirmNotif: Notification = {
            id: `notif${Date.now()}`,
            title: 'PT Session Confirmed',
            body: `${b.trainerName} confirmed your booking on ${b.day} at ${b.time}.`,
            type: 'booking',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            read: false,
          };
          setNotifications(oldNotifs => [confirmNotif, ...oldNotifs]);

          return { ...b, status: 'confirmed' };
        }
        return b;
      })
    );

    setPayments(prev =>
      prev.map(p => p.status === 'pending' && p.item.includes('PT Session') ? { ...p, status: 'completed' } : p)
    );
  };

  // Classes Operations
  const registerForClass = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    if (!cls || classRegistrations.includes(classId)) return;

    setClassRegistrations(prev => [...prev, classId]);

    // Reduce spots remaining
    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, spots: Math.max(0, c.spots - 1) } : c))
    );

    // Notify
    const newNotif: Notification = {
      id: `notif${Date.now()}`,
      title: 'Class Registered',
      body: `You joined ${cls.name} scheduled for ${cls.day} at ${cls.time}.`,
      type: 'classes',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const cancelClassRegistration = (classId: string) => {
    if (!classRegistrations.includes(classId)) return;

    setClassRegistrations(prev => prev.filter(id => id !== classId));

    // Increase spots remaining
    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, spots: c.spots + 1 } : c))
    );
  };

  // Pass Check-in
  const triggerCheckIn = () => {
    if (membership.status !== 'active') return;

    const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const todayTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Log check-in
    const newCheckIn: CheckIn = {
      id: `ch${Date.now()}`,
      gymName: membership.gymName,
      date: todayDate,
      time: todayTime,
    };

    setCheckIns(prev => [newCheckIn, ...prev]);

    // Update streak (if not checked in today yet)
    setStreak(prev => {
      // Mock day calculation: Add to array
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
      const isAlreadyCheckedInToday = prev.days[prev.days.length - 1] === weekday && prev.count > 0;
      
      if (isAlreadyCheckedInToday) {
        return prev;
      }
      
      return {
        count: prev.count + 1,
        days: [...prev.days, weekday],
      };
    });

    // Update membership last check in field
    setMembership(prev => ({
      ...prev,
      lastCheckIn: `Today, ${todayTime}`,
    }));

    // Add notification
    const checkInNotif: Notification = {
      id: `notif${Date.now()}`,
      title: 'Gym Check-in Success',
      body: `Welcome to ${membership.gymName}. Access granted. Have a great session!`,
      type: 'check_in',
      date: todayDate,
      read: false,
    };
    setNotifications(prev => [checkInNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleSetting = (key: 'darkMode' | 'pushNotifications') => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <GMAPContext.Provider
      value={{
        currentUser,
        gyms,
        trainers,
        classes,
        membership,
        bookings,
        classRegistrations,
        checkIns,
        payments,
        reviews,
        notifications,
        streak,
        settings,
        
        login,
        register,
        logout,
        
        joinGym,
        approvePendingMembership,
        addReview,
        
        bookTrainer,
        approvePendingBooking,
        
        registerForClass,
        cancelClassRegistration,
        
        triggerCheckIn,
        clearNotifications,
        toggleSetting,
      }}
    >
      {children}
    </GMAPContext.Provider>
  );
};

export const useGMAP = () => {
  const context = useContext(GMAPContext);
  if (context === undefined) {
    throw new Error('useGMAP must be used within a GMAPProvider');
  }
  return context;
};
