"use client";

import React, { createContext, useContext, useState } from "react";

export interface UserProfile {
  name: string;
  age: string;
  country: string;
  occupation: string;
  onboarded: boolean;
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
  type: "success" | "info" | "achievement" | "streak";
  message: string;
  timestamp: Date;
}

interface AppContextType {
  user: UserProfile;
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
  
  // Actions
  completeOnboarding: (profile: Partial<UserProfile>, habits: Partial<Habits>) => void;
  updateHabits: (habits: Partial<Habits>) => void;
  joinChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, days: number) => void;
  redeemReward: (rewardId: string) => boolean;
  sendChatMessage: (text: string) => void;
  triggerCameraScan: (category: string, imageUrl: string) => void;
  addXPPoints: (amount: number) => void;
  addNotification: (type: "success" | "info" | "achievement" | "streak", message: string) => void;
  clearNotification: (id: string) => void;
  setActiveTab: (tab: string) => void;
  logout: () => void;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>({
    name: "Alex Rivera",
    age: "26",
    country: "United States",
    occupation: "Software Designer",
    onboarded: true, // Default to true so they see dashboard right away, can go through onboarding flow too
  });

  const [habits, setHabits] = useState<Habits>(defaultHabits);
  
  // Recalculate carbon score dynamically based on user habits using useMemo
  const { carbonScore, monthlyEmissions } = React.useMemo(() => {
    // Basic approximate carbon footprint formula for illustrative UX purposes
    let transportScore = 0;
    if (habits.vehicleType === "Gasoline") transportScore = (habits.travelDistance * 365 * 0.18) / 1000;
    else if (habits.vehicleType === "Diesel") transportScore = (habits.travelDistance * 365 * 0.20) / 1000;
    else if (habits.vehicleType === "Hybrid") transportScore = (habits.travelDistance * 365 * 0.09) / 1000;
    else if (habits.vehicleType === "Electric") transportScore = (habits.travelDistance * 365 * 0.04) / 1000;
    else transportScore = (habits.travelDistance * 365 * 0.02) / 1000; // Public transport/walking

    const energyScore = (habits.electricityBill * 12 * 0.4) / 100 + (habits.acUsage * 365 * 0.5) / 1000;
    
    let foodScore = 1.5; // Average baseline
    if (habits.foodHabit === "Vegan") foodScore = 0.6;
    else if (habits.foodHabit === "Vegetarian") foodScore = 0.9;
    else if (habits.foodHabit === "Eggetarian") foodScore = 1.1;
    else foodScore = 2.1; // Non-veg meat heavy

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

  const [reductionGoal, setReductionGoal] = useState<number>(72); // Completed
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
      text: "Hello! I am your AI Carbon Coach. You can ask me anything about climate change, reducing emissions, or tracking your daily carbon footprint!",
      timestamp: new Date(),
    },
  ]);

  const addNotification = (type: "success" | "info" | "achievement" | "streak", message: string) => {
    const newNotif: NotificationMsg = {
      id: Math.random().toString(),
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addXPPoints = (amount: number) => {
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
  };

  const completeOnboarding = (profile: Partial<UserProfile>, userHabits: Partial<Habits>) => {
    setUser((prev) => ({ ...prev, ...profile, onboarded: true }));
    setHabits((prev) => ({ ...prev, ...userHabits }));
    addNotification("success", "Welcome to CarbonCoach AI! Onboarding complete.");
    addXPPoints(150);
  };

  const updateHabits = (newHabits: Partial<Habits>) => {
    setHabits((prev) => ({ ...prev, ...newHabits }));
  };

  const joinChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          addNotification("info", `Joined the "${ch.title}" Challenge! Let's save the planet.`);
          return { ...ch, status: "joined", progress: 0, daysCompleted: 0 };
        }
        return ch;
      })
    );
  };

  const updateChallengeProgress = (challengeId: string, days: number) => {
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
            return {
              ...ch,
              daysCompleted: completed,
              progress: pct,
              status: "completed",
            };
          }
          return {
            ...ch,
            daysCompleted: completed,
            progress: pct,
          };
        }
        return ch;
      })
    );
  };

  const redeemReward = (rewardId: string): boolean => {
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
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    // Simple AI carbon bot matching logic
    setTimeout(() => {
      let reply = "That's a great question! Reducing carbon emissions involves combining smart transit choices, energy efficiency, and mindful consumption. What specific habit would you like to target today?";
      const lower = text.toLowerCase();
      
      if (lower.includes("how can i reduce") || lower.includes("ways to reduce")) {
        reply = "To quickly reduce your carbon footprint:\n1. Move to active transport (cycling, walking) or electric cars.\n2. Set AC thermostat higher by 1-2°C.\n3. Adopt a plant-based diet at least 3 days a week.\n4. Recycle, compost, and avoid fast fashion shopping.";
      } else if (lower.includes("cycling") || lower.includes("bike") || lower.includes("cycling better")) {
        reply = "Absolutely! Cycling generates 0g CO₂/km, while a standard petrol car emits about 180g CO₂/km. Public transport averages 35g CO₂/km per passenger. Cycling or walking is the absolute greenest travel method!";
      } else if (lower.includes("flight") || lower.includes("plane") || lower.includes("flying")) {
        reply = "A single flight emits significant greenhouse gases. A standard round-trip domestic flight (e.g. NYC to LA) emits about 0.8 to 1.2 Tons of CO₂ per passenger. That's nearly 20% of the average yearly carbon allowance in just one trip!";
      } else if (lower.includes("ac") || lower.includes("air conditioner")) {
        reply = "Reducing AC runtime by 1 hour daily can save roughly 110 kg of CO₂ per year. Setting the temperature to 25°C (77°F) instead of 21°C is a fantastic step that saves both power and emissions!";
      } else if (lower.includes("meat") || lower.includes("diet") || lower.includes("vegan")) {
        reply = "Meat production, particularly beef and lamb, has a high greenhouse gas cost due to land usage and methane emissions. Swapping beef for a plant-based alternative can save up to 4 kg of CO₂ per meal!";
      }

      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "bot",
        text: reply,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const triggerCameraScan = (category: string, imageUrl: string) => {
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
        id: Math.random().toString(),
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
  };

  const logout = () => {
    setUser((prev) => ({ ...prev, onboarded: false }));
    setHabits(defaultHabits);
    setGreenPoints(0);
    setXp(0);
    setLevel(1);
    setActiveTab("dashboard");
  };

  return (
    <AppContext.Provider
      value={{
        user,
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
        logout,
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
