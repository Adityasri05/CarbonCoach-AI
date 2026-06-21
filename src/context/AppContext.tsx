"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  type User as FirebaseUser,
} from "@/lib/firebase";

export interface UserProfile {
  name: string;
  email: string;
  age: string;
  country: string;
  occupation: string;
  onboarded: boolean;
  uid: string;
}

export interface Habits {
  travelDistance: number; // km per day
  vehicleType: string; // Electric, Hybrid, Gasoline, Diesel, None/Public
  fuelType: string; // Petrol, Diesel, Electric, N/A
  electricityBill: number; // USD per month
  acUsage: number; // hours per day
  appliances: string[]; // ['washing_machine', 'dryer', 'dishwasher', 'refrigerator']
  foodHabit: string; // Vegan, Vegetarian, Eggetarian, Non-Vegetarian
  shoppingFrequency: string; // Rarely, Monthly, Weekly, Daily
  recyclingHabits: string; // Never, Sometimes, Always
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number; // 0 to 100
  daysTotal: number;
  daysCompleted: number;
  status: "not_started" | "joined" | "completed";
  category: "transport" | "food" | "energy" | "shopping" | "waste";
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  impactGenerated: string;
  category: string;
  redeemedCount: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export interface NotificationMsg {
  id: string;
  type: "success" | "info" | "achievement" | "streak" | "error";
  message: string;
  timestamp: Date;
}

interface AppContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  habits: Habits;
  carbonScore: number; // Tons CO2 / year
  monthlyEmissions: number; // kg CO2
  reductionGoal: number; // percentage completed (e.g. 72)
  greenPoints: number;
  xp: number;
  level: number;
  streak: number;
  activeTab: string;
  challenges: Challenge[];
  rewards: RewardItem[];
  chatHistory: ChatMessage[];
  notifications: NotificationMsg[];
  cameraScans: Array<{
    id: string;
    item: string;
    category: string;
    emission: number;
    alternative: number;
    altName: string;
    reduction: number;
    imageUrl: string;
    timestamp: Date;
  }>;

  // Auth Actions
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // App Actions
  completeOnboarding: (profile: Partial<UserProfile>, habits: Partial<Habits>) => void;
  updateHabits: (habits: Partial<Habits>) => void;
  joinChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, days: number) => void;
  redeemReward: (rewardId: string) => boolean;
  sendChatMessage: (text: string) => Promise<void>;
  triggerCameraScan: (category: string, imageUrl: string) => void;
  addXPPoints: (amount: number) => void;
  addNotification: (type: "success" | "info" | "achievement" | "streak" | "error", message: string) => void;
  clearNotification: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

const defaultHabits: Habits = {
  travelDistance: 25,
  vehicleType: "Gasoline",
  fuelType: "Petrol",
  electricityBill: 120,
  acUsage: 4,
  appliances: ["refrigerator", "washing_machine"],
  foodHabit: "Non-Vegetarian",
  shoppingFrequency: "Monthly",
  recyclingHabits: "Sometimes",
};

const defaultUser: UserProfile = {
  name: "",
  email: "",
  age: "",
  country: "United States",
  occupation: "",
  onboarded: false,
  uid: "",
};

const initialChallenges: Challenge[] = [
  {
    id: "no_car",
    title: "No Car Week",
    description: "Commute using public transport, walking, or cycling for 7 days.",
    points: 350,
    progress: 42,
    daysTotal: 7,
    daysCompleted: 3,
    status: "joined",
    category: "transport",
  },
  {
    id: "plant_based",
    title: "Plant-Based Week",
    description: "Eat purely vegan or vegetarian meals for 7 days straight.",
    points: 400,
    progress: 0,
    daysTotal: 7,
    daysCompleted: 0,
    status: "not_started",
    category: "food",
  },
  {
    id: "energy_saver",
    title: "Energy Saver Challenge",
    description: "Turn off AC and unplug idle devices daily for 5 days.",
    points: 250,
    progress: 80,
    daysTotal: 5,
    daysCompleted: 4,
    status: "joined",
    category: "energy",
  },
  {
    id: "plastic_free",
    title: "Plastic-Free Week",
    description: "Avoid single-use plastics and carry your own reusable items for 7 days.",
    points: 300,
    progress: 100,
    daysTotal: 7,
    daysCompleted: 7,
    status: "completed",
    category: "waste",
  },
];

const initialRewards: RewardItem[] = [
  {
    id: "plant_tree",
    title: "Plant a Tree",
    description: "We partner with One Tree Planted to plant a native tree on your behalf.",
    pointsRequired: 500,
    impactGenerated: "Saves ~22 kg CO₂/year",
    category: "nature",
    redeemedCount: 2,
  },
  {
    id: "ocean_cleanup",
    title: "Donate to Ocean Cleanups",
    description: "Remove 1 kg of plastic trash from oceans and coastal waterways.",
    pointsRequired: 400,
    impactGenerated: "Reduces plastic pollution & marine eco-damage",
    category: "cleanup",
    redeemedCount: 1,
  },
  {
    id: "eco_bottle",
    title: "Bamboo Coffee Mug",
    description: "Get a 100% biodegradable bamboo coffee travel tumbler.",
    pointsRequired: 800,
    impactGenerated: "Saves ~150 single-use cups/year",
    category: "product",
    redeemedCount: 0,
  },
  {
    id: "green_coupon",
    title: "$10 Sustainable Fashion Coupon",
    description: "Discount code for verified organic cotton clothing brands.",
    pointsRequired: 300,
    impactGenerated: "Supports eco-friendly clothing production",
    category: "coupon",
    redeemedCount: 0,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Sanitize user input to prevent XSS attacks in chat messages.
 */
function sanitizeInput(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, 2000); // Cap message length
}

/**
 * Map Firebase auth error codes to user-friendly messages.
 */
function getAuthErrorMessage(code: string): string {
  const errorMap: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email. Please sign up.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/invalid-credential": "Invalid credentials. Please check your email and password.",
  };
  return errorMap[code] || "Authentication failed. Please try again.";
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [habits, setHabits] = useState<Habits>(defaultHabits);

  // Recalculate carbon score dynamically based on user habits
  const { carbonScore, monthlyEmissions } = React.useMemo(() => {
    let transportScore = 0;
    if (habits.vehicleType === "Gasoline") transportScore = (habits.travelDistance * 365 * 0.18) / 1000;
    else if (habits.vehicleType === "Diesel") transportScore = (habits.travelDistance * 365 * 0.20) / 1000;
    else if (habits.vehicleType === "Hybrid") transportScore = (habits.travelDistance * 365 * 0.09) / 1000;
    else if (habits.vehicleType === "Electric") transportScore = (habits.travelDistance * 365 * 0.04) / 1000;
    else transportScore = (habits.travelDistance * 365 * 0.02) / 1000;

    const energyScore = (habits.electricityBill * 12 * 0.4) / 100 + (habits.acUsage * 365 * 0.5) / 1000;

    let foodScore = 1.5;
    if (habits.foodHabit === "Vegan") foodScore = 0.6;
    else if (habits.foodHabit === "Vegetarian") foodScore = 0.9;
    else if (habits.foodHabit === "Eggetarian") foodScore = 1.1;
    else foodScore = 2.1;

    let wasteScore = 0.8;
    if (habits.recyclingHabits === "Always") wasteScore = 0.3;
    else if (habits.recyclingHabits === "Sometimes") wasteScore = 0.5;

    let shoppingScore = 0.5;
    if (habits.shoppingFrequency === "Daily") shoppingScore = 1.2;
    else if (habits.shoppingFrequency === "Weekly") shoppingScore = 0.8;
    else if (habits.shoppingFrequency === "Monthly") shoppingScore = 0.4;

    const total = parseFloat((transportScore + energyScore + foodScore + wasteScore + shoppingScore).toFixed(1));
    return {
      carbonScore: total,
      monthlyEmissions: Math.round((total * 1000) / 12),
    };
  }, [habits]);

  const [reductionGoal] = useState<number>(72);
  const [greenPoints, setGreenPoints] = useState<number>(1250);
  const [xp, setXp] = useState<number>(750);
  const [level, setLevel] = useState<number>(3);
  const [streak, setStreak] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [notifications, setNotifications] = useState<NotificationMsg[]>([]);
  const [cameraScans, setCameraScans] = useState<AppContextType["cameraScans"]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I am your AI Carbon Coach powered by Google Gemini. You can ask me anything about climate change, reducing emissions, or tracking your daily carbon footprint!",
      timestamp: new Date(),
    },
  ]);

  // ──────────────────────────────────────────────
  // Firebase Auth State Listener
  // ──────────────────────────────────────────────
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        setIsAuthenticated(true);

        // Try to load user profile from Firestore
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              name: data.name || fbUser.displayName || "User",
              email: data.email || fbUser.email || "",
              age: data.age || "",
              country: data.country || "United States",
              occupation: data.occupation || "",
              onboarded: data.onboarded ?? false,
              uid: fbUser.uid,
            });
            if (data.habits) {
              setHabits(prev => ({ ...prev, ...data.habits }));
            }
            if (data.greenPoints !== undefined) setGreenPoints(data.greenPoints);
            if (data.xp !== undefined) setXp(data.xp);
            if (data.level !== undefined) setLevel(data.level);
            if (data.streak !== undefined) setStreak(data.streak);
          } else {
            // New user — set basic profile
            setUser({
              name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
              email: fbUser.email || "",
              age: "",
              country: "United States",
              occupation: "",
              onboarded: false,
              uid: fbUser.uid,
            });
          }
        } catch (err) {
          console.warn("[AppContext] Failed to load Firestore profile, using defaults:", err);
          setUser({
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
            email: fbUser.email || "",
            age: "",
            country: "United States",
            occupation: "",
            onboarded: false,
            uid: fbUser.uid,
          });
        }
      } else {
        setFirebaseUser(null);
        setIsAuthenticated(false);
        setUser(defaultUser);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ──────────────────────────────────────────────
  // Persist to Firestore on key state changes
  // ──────────────────────────────────────────────
  const saveToFirestore = useCallback(async (data: Record<string, unknown>) => {
    if (!firebaseUser) return;
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, data, { merge: true });
    } catch (err) {
      console.warn("[AppContext] Firestore save failed:", err);
    }
  }, [firebaseUser]);

  // Also persist to localStorage as offline fallback
  React.useEffect(() => {
    if (typeof window !== "undefined" && user.uid) {
      localStorage.setItem("carbon_user", JSON.stringify(user));
      localStorage.setItem("carbon_habits", JSON.stringify(habits));
      localStorage.setItem("carbon_points", greenPoints.toString());
      localStorage.setItem("carbon_xp", xp.toString());
      localStorage.setItem("carbon_level", level.toString());
      localStorage.setItem("carbon_streak", streak.toString());
    }
  }, [user, habits, greenPoints, xp, level, streak]);

  // ──────────────────────────────────────────────
  // Notification system
  // ──────────────────────────────────────────────
  const addNotification = useCallback((type: "success" | "info" | "achievement" | "streak" | "error", message: string) => {
    const newNotif: NotificationMsg = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ──────────────────────────────────────────────
  // Auth: Email Login
  // ──────────────────────────────────────────────
  const loginWithEmail = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addNotification("success", "Login successful! Welcome back.");
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      const message = getAuthErrorMessage(code);
      addNotification("error", message);
      return { success: false, error: message };
    }
  }, [addNotification]);

  // ──────────────────────────────────────────────
  // Auth: Email Sign Up
  // ──────────────────────────────────────────────
  const signUpWithEmail = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name
      await updateProfile(cred.user, { displayName: name });

      // Create Firestore user document
      const userDocRef = doc(db, "users", cred.user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        age: "",
        country: "United States",
        occupation: "",
        onboarded: false,
        greenPoints: 0,
        xp: 0,
        level: 1,
        streak: 0,
        createdAt: new Date().toISOString(),
      });

      addNotification("success", "Account created! Let's set up your profile.");
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      const message = getAuthErrorMessage(code);
      addNotification("error", message);
      return { success: false, error: message };
    }
  }, [addNotification]);

  // ──────────────────────────────────────────────
  // Auth: Google Sign-In
  // ──────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Check if user exists in Firestore, if not create entry
      const userDocRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: fbUser.displayName || "Google User",
          email: fbUser.email || "",
          age: "",
          country: "United States",
          occupation: "",
          onboarded: false,
          greenPoints: 0,
          xp: 0,
          level: 1,
          streak: 0,
          createdAt: new Date().toISOString(),
        });
      }

      addNotification("success", "Google authentication successful!");
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      const message = getAuthErrorMessage(code);
      if (code !== "auth/popup-closed-by-user") {
        addNotification("error", message);
      }
      return { success: false, error: message };
    }
  }, [addNotification]);

  // ──────────────────────────────────────────────
  // XP and leveling
  // ──────────────────────────────────────────────
  const addXPPoints = useCallback((amount: number) => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      if (newXp >= 1000) {
        setLevel((prevLvl) => {
          const nextLvl = prevLvl + 1;
          setTimeout(() => {
            addNotification("achievement", `🎉 Level Up! You reached Level ${nextLvl}!`);
          }, 500);
          return nextLvl;
        });
        return newXp - 1000;
      }
      return newXp;
    });
  }, [addNotification]);

  // ──────────────────────────────────────────────
  // Onboarding
  // ──────────────────────────────────────────────
  const completeOnboarding = useCallback((profile: Partial<UserProfile>, userHabits: Partial<Habits>) => {
    setUser((prev) => ({ ...prev, ...profile, onboarded: true }));
    setHabits((prev) => ({ ...prev, ...userHabits }));
    addNotification("success", "Welcome to CarbonCoach AI! Onboarding complete.");
    addXPPoints(150);

    // Save onboarding data to Firestore
    saveToFirestore({
      ...profile,
      onboarded: true,
      habits: { ...defaultHabits, ...userHabits },
    });
  }, [addNotification, addXPPoints, saveToFirestore]);

  const updateHabits = useCallback((newHabits: Partial<Habits>) => {
    setHabits((prev) => {
      const updated = { ...prev, ...newHabits };
      saveToFirestore({ habits: updated });
      return updated;
    });
  }, [saveToFirestore]);

  // ──────────────────────────────────────────────
  // Challenges
  // ──────────────────────────────────────────────
  const joinChallenge = useCallback((challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          addNotification("info", `Joined the "${ch.title}" Challenge! Let's save the planet.`);
          return { ...ch, status: "joined", progress: 0, daysCompleted: 0 };
        }
        return ch;
      })
    );
  }, [addNotification]);

  const updateChallengeProgress = useCallback((challengeId: string, days: number) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId && ch.status === "joined") {
          const completed = Math.min(ch.daysTotal, ch.daysCompleted + days);
          const pct = Math.round((completed / ch.daysTotal) * 100);
          const isFinished = completed === ch.daysTotal;

          if (isFinished) {
            setTimeout(() => {
              addNotification("success", `🏆 Challenge Completed: "${ch.title}"! +${ch.points} pts`);
              addXPPoints(200);
              setGreenPoints((pts) => pts + ch.points);
            }, 300);
            return { ...ch, daysCompleted: completed, progress: pct, status: "completed" };
          }
          return { ...ch, daysCompleted: completed, progress: pct };
        }
        return ch;
      })
    );
  }, [addNotification, addXPPoints]);

  // ──────────────────────────────────────────────
  // Rewards
  // ──────────────────────────────────────────────
  const redeemReward = useCallback((rewardId: string): boolean => {
    let success = false;
    setRewards((prevRewards) =>
      prevRewards.map((item) => {
        if (item.id === rewardId) {
          if (greenPoints >= item.pointsRequired) {
            setGreenPoints((points) => points - item.pointsRequired);
            addNotification("success", `Successfully redeemed: "${item.title}"!`);
            addXPPoints(100);
            success = true;
            return { ...item, redeemedCount: item.redeemedCount + 1 };
          } else {
            addNotification("info", `Insufficient green points for: "${item.title}"`);
          }
        }
        return item;
      })
    );
    return success;
  }, [greenPoints, addNotification, addXPPoints]);

  // ──────────────────────────────────────────────
  // AI Chat (Gemini API)
  // ──────────────────────────────────────────────
  const sendChatMessage = useCallback(async (text: string) => {
    const sanitized = sanitizeInput(text);
    if (!sanitized) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      sender: "user",
      text: sanitized,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const systemPrompt = `You are CarbonCoach AI, an enthusiastic, knowledgeable sustainability coach powered by Google Gemini.
Your job is to help users track, simulate, and reduce their carbon footprint.
Be encouraging, professional, and actionable. Use markdown for lists/bolding where helpful.
Keep responses concise (under 200 words).
User Profile/Habits:
- Vehicle Type: ${habits.vehicleType || "Gasoline"}
- Daily Travel Distance: ${habits.travelDistance} km
- Monthly Electricity Bill: $${habits.electricityBill}
- Daily AC Runtime: ${habits.acUsage} hours
- Food Habit: ${habits.foodHabit}
- Shopping Frequency: ${habits.shoppingFrequency}
- Recycling Habits: ${habits.recyclingHabits}
- Owned Appliances: ${habits.appliances.join(", ") || "None"}`;

    let reply = "";
    let success = false;

    // Build conversation history for Gemini
    const contents = chatHistory
      .filter(msg => msg.id !== "init")
      .map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

    contents.push({ role: "user", parts: [{ text: sanitized }] });

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: { temperature: 0.7 },
            }),
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            reply = responseText;
            success = true;
          }
        }
      } catch (err) {
        console.warn("[CarbonCoach] Gemini API call failed:", err);
      }
    }

    if (!success) {
      // Intelligent fallback responses
      const lower = sanitized.toLowerCase();
      if (lower.includes("how can i reduce") || lower.includes("ways to reduce")) {
        reply = "**Great question!** Here are proven ways to reduce your carbon footprint:\n\n1. 🚲 Switch to **active transport** (cycling, walking) or electric vehicles\n2. ❄️ Set your AC thermostat **1-2°C higher** — saves ~110 kg CO₂/year\n3. 🥗 Adopt a **plant-based diet** at least 3 days/week\n4. ♻️ **Recycle, compost**, and avoid fast fashion\n5. 💡 Switch to **LED bulbs** and unplug idle devices\n\nWant me to calculate the savings for any specific change?";
      } else if (lower.includes("cycling") || lower.includes("bike")) {
        reply = "🚲 **Cycling is the greenest transit!** It generates **0g CO₂/km**, compared to:\n- 🚗 Petrol car: ~180g CO₂/km\n- 🚌 Bus: ~35g CO₂/km\n- 🚆 Train: ~14g CO₂/km\n\nSwitching your daily commute could save **over 1 tonne CO₂/year!**";
      } else if (lower.includes("flight") || lower.includes("plane") || lower.includes("flying")) {
        reply = "✈️ A round-trip domestic flight emits **0.8–1.2 tonnes CO₂** per passenger — nearly **20% of the average yearly carbon budget** in just one trip!\n\n**Alternatives:** Train travel emits ~75% less. For unavoidable flights, consider verified **carbon offset programs**.";
      } else if (lower.includes("ac") || lower.includes("air conditioner")) {
        reply = "❄️ **AC optimization tips:**\n1. Reduce runtime by 1 hour/day → saves **~110 kg CO₂/year**\n2. Set temperature to **25°C (77°F)** instead of 21°C\n3. Clean filters monthly for **15-20% better efficiency**\n4. Use ceiling fans to support — they use 10x less energy!";
      } else if (lower.includes("meat") || lower.includes("diet") || lower.includes("vegan")) {
        reply = "🥩 **Dietary impact on emissions:**\n- Beef: ~27 kg CO₂/kg produced\n- Chicken: ~6.9 kg CO₂/kg\n- Plant-based: ~2 kg CO₂/kg\n\nSwapping beef for plant-based alternatives saves up to **4 kg CO₂ per meal!** Going vegetarian 3 days/week saves ~500 kg CO₂/year.";
      } else {
        reply = "That's a great question! 🌿 Reducing carbon emissions involves combining smart transit choices, energy efficiency, and mindful consumption. I'm here to help you analyze and optimize each area. What specific habit would you like to explore today?";
      }
    }

    const botMsg: ChatMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      sender: "bot",
      text: reply,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, botMsg]);
  }, [chatHistory, habits]);

  // ──────────────────────────────────────────────
  // Camera Scan
  // ──────────────────────────────────────────────
  const triggerCameraScan = useCallback((category: string, imageUrl: string) => {
    let item = "Eco-Friendly Option";
    let emission = 2.0;
    let alternative = 0.5;
    let altName = "Sustainable Alternative";
    let reduction = 75;

    if (category === "meal") {
      item = "Beef Burger & Fries";
      emission = 5.4;
      altName = "Beyond Plant Burger";
      alternative = 1.2;
      reduction = 78;
    } else if (category === "vehicle") {
      item = "Mid-size Gasoline SUV";
      emission = 14.5;
      altName = "Electric Hatchback / e-Bike";
      alternative = 2.8;
      reduction = 81;
    } else if (category === "appliance") {
      item = "Standard Electric Clothes Dryer";
      emission = 3.2;
      altName = "Air Drying / Energy Star Dryer";
      alternative = 0.8;
      reduction = 75;
    }

    setTimeout(() => {
      const newScan = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
        item,
        category,
        emission,
        alternative,
        altName,
        reduction,
        imageUrl,
        timestamp: new Date(),
      };
      setCameraScans((prev) => [newScan, ...prev]);
      addNotification("success", `📸 Carbon Camera detected: ${item}! +50 XP`);
      addXPPoints(50);
      setGreenPoints((pts) => pts + 20);
    }, 1500);
  }, [addNotification, addXPPoints]);

  // ──────────────────────────────────────────────
  // Logout
  // ──────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn("[AppContext] Firebase sign-out error:", err);
    }

    setUser(defaultUser);
    setFirebaseUser(null);
    setIsAuthenticated(false);
    setHabits(defaultHabits);
    setGreenPoints(0);
    setXp(0);
    setLevel(1);
    setStreak(0);
    setCameraScans([]);
    setChatHistory([
      {
        id: "init",
        sender: "bot",
        text: "Hello! I am your AI Carbon Coach powered by Google Gemini. You can ask me anything about climate change, reducing emissions, or tracking your daily carbon footprint!",
        timestamp: new Date(),
      },
    ]);
    setActiveTab("dashboard");

    if (typeof window !== "undefined") {
      localStorage.removeItem("carbon_user");
      localStorage.removeItem("carbon_habits");
      localStorage.removeItem("carbon_points");
      localStorage.removeItem("carbon_xp");
      localStorage.removeItem("carbon_level");
      localStorage.removeItem("carbon_streak");
      localStorage.removeItem("carbon_challenges");
      localStorage.removeItem("carbon_scans");
      localStorage.removeItem("carbon_chat");
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        isAuthLoading,
        habits,
        carbonScore,
        monthlyEmissions,
        reductionGoal,
        greenPoints,
        xp,
        level,
        streak,
        activeTab,
        challenges,
        rewards,
        chatHistory,
        notifications,
        cameraScans,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
        completeOnboarding,
        updateHabits,
        joinChallenge,
        updateChallengeProgress,
        redeemReward,
        sendChatMessage,
        triggerCameraScan,
        addXPPoints,
        addNotification,
        clearNotification,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
