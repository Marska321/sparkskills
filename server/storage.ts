import { 
  users, lessons, userProgress, badges, userBadges, activities,
  type User, type InsertUser, type Lesson, type InsertLesson,
  type UserProgress, type InsertUserProgress, type Badge, type InsertBadge,
  type UserBadge, type ActivityRecord, type InsertActivity, type Section
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Lessons
  getAllLessons(): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  updateProgress(userId: number, lessonId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress>;

  // Badges
  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadge(userId: number, badgeId: number): Promise<UserBadge>;

  // Activities
  saveActivity(activity: InsertActivity): Promise<ActivityRecord>;
  getUserActivities(userId: number, lessonId?: number): Promise<ActivityRecord[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private lessons: Map<number, Lesson>;
  private userProgress: Map<string, UserProgress>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private activities: Map<number, ActivityRecord>;
  private currentId: { users: number; lessons: number; userProgress: number; badges: number; userBadges: number; activities: number };

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.activities = new Map();
    this.currentId = { users: 1, lessons: 1, userProgress: 1, badges: 1, userBadges: 1, activities: 1 };

    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "alex_sparkstar",
      name: "Alex SparkStar",
      avatar: "👦",
      level: 3,
      totalBadges: 3,
      currentStreak: 7,
      ideasCreated: 3,
    };
    this.users.set(1, defaultUser);
    this.currentId.users = 2;

    // Initialize badges for all 12 lessons
    const defaultBadges: Badge[] = [
      { id: 1, name: "Spark Finder", description: "Completed Lesson 1", emoji: "🌟", color: "from-spark-blue to-spark-green", requirement: "complete_lesson_1" },
      { id: 2, name: "Idea Creator", description: "Completed Lesson 2", emoji: "💡", color: "from-spark-green to-spark-teal", requirement: "complete_lesson_2" },
      { id: 3, name: "Validator", description: "Completed Lesson 3", emoji: "✨", color: "from-spark-teal to-spark-purple", requirement: "complete_lesson_3" },
      { id: 4, name: "Pitcher", description: "Completed Lesson 4", emoji: "🎤", color: "from-spark-orange to-spark-pink", requirement: "complete_lesson_4" },
      { id: 5, name: "Planner", description: "Completed Lesson 5", emoji: "📋", color: "from-spark-purple to-spark-blue", requirement: "complete_lesson_5" },
      { id: 6, name: "Money Master", description: "Completed Lesson 6", emoji: "💰", color: "from-spark-pink to-spark-orange", requirement: "complete_lesson_6" },
      { id: 7, name: "Brand Builder", description: "Completed Lesson 7", emoji: "🎨", color: "from-spark-blue to-spark-green", requirement: "complete_lesson_7" },
      { id: 8, name: "Marketing Wizard", description: "Completed Lesson 8", emoji: "📢", color: "from-spark-green to-spark-teal", requirement: "complete_lesson_8" },
      { id: 9, name: "Sales Star", description: "Completed Lesson 9", emoji: "💪", color: "from-spark-teal to-spark-purple", requirement: "complete_lesson_9" },
      { id: 10, name: "Success Tracker", description: "Completed Lesson 10", emoji: "📊", color: "from-spark-orange to-spark-pink", requirement: "complete_lesson_10" },
      { id: 11, name: "SparkStar Champion", description: "Completed Lesson 11", emoji: "🎉", color: "from-spark-purple to-spark-blue", requirement: "complete_lesson_11" },
      { id: 12, name: "Spark Leader", description: "Completed Lesson 12", emoji: "🚀", color: "from-spark-pink to-spark-orange", requirement: "complete_lesson_12" },
    ];

    defaultBadges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
    this.currentId.badges = 13;

    // Award first 3 badges to default user
    for (let i = 1; i <= 3; i++) {
      const userBadge: UserBadge = {
        id: i,
        userId: 1,
        badgeId: i,
        earnedAt: new Date(),
      };
      this.userBadges.set(i, userBadge);
    }
    this.currentId.userBadges = 4;

    // Initialize lesson data
    this.initializeLessons();
  }

  private initializeLessons() {
    const lessons: InsertLesson[] = [
      {
        title: "Discover Your Spark",
        subtitle: "Find your strengths and spark your first business idea",
        description: "Identify personal strengths and a community need to spark a business idea.",
        emoji: "🌟",
        duration: "60-90 minutes",
        objectives: ["Discover your strengths", "Find a community need", "Combine strengths and need into an idea", "Validate your idea", "Reflect on your spark"],
        tools: ["Pen/pencil", "paper"],
        sections: [
          {
            id: 1,
            title: "Discover Your Strengths",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what you're good at (e.g., drawing, helping). Write down your strengths.",
            activities: [
              {
                type: "textarea",
                prompt: "My Strengths:",
                placeholder: "I'm great at drawing and making crafts!"
              }
            ],
            tips: ["Pretend you're a superhero—what's your superpower?"]
          },
          {
            id: 2,
            title: "Find a Community Need",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Think about a problem people face (e.g., kids get bored). Write down the need.",
            activities: [
              {
                type: "textarea",
                prompt: "Community Need:",
                placeholder: "Kids need fun things to do at home!"
              }
            ],
            tips: ["Ask family or friends, \"What's something you wish was easier?\""]
          },
          {
            id: 3,
            title: "Combine Strengths and Need",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Mix your strengths and the need to create a business idea.",
            activities: [
              {
                type: "textarea",
                prompt: "My Business Idea:",
                placeholder: "SparkCraft Kits – Fun craft projects for kids to do at home!"
              }
            ],
            tips: ["Imagine your idea helping everyone in Sparkville!"]
          },
          {
            id: 4,
            title: "Validate Your Idea",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Ask 2-3 people: \"Is this a real problem? Would my idea help?\" Write their answers.",
            activities: [
              {
                type: "textarea",
                prompt: "Feedback:",
                placeholder: "Mom said, \"Kids would love craft kits!\""
              }
            ],
            tips: ["Be brave—feedback makes ideas stronger!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about finding your spark and what you learned about yourself.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about finding your spark?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What's one thing you learned about yourself?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Brainstorm Solutions",
        subtitle: "Create amazing solutions and your Idea Blast Poster",
        description: "Brainstorm solutions for the need and create an Idea Blast Poster.",
        emoji: "💡",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Brainstorm three solutions", "Pick one solution", "Create an Idea Blast Poster", "Share your poster", "Reflect on solutions"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 1.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft projects for kids!"
              }
            ],
            tips: ["Talk to your parent if you need a reminder."]
          },
          {
            id: 2,
            title: "Brainstorm Three Solutions",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "List three ways to solve the problem.",
            activities: [
              {
                type: "input",
                prompt: "Solution 1:",
                placeholder: "Craft kits"
              },
              {
                type: "input",
                prompt: "Solution 2:",
                placeholder: "Activity books"
              },
              {
                type: "input",
                prompt: "Solution 3:",
                placeholder: "Online craft videos"
              }
            ],
            tips: ["Think big—no idea is too wild!"]
          },
          {
            id: 3,
            title: "Pick One Solution",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Choose your favorite solution.",
            activities: [
              {
                type: "input",
                prompt: "My Solution:",
                placeholder: "SparkCraft Kits – Easy craft kits for kids!"
              }
            ],
            tips: ["Pick the one you're most excited about!"]
          },
          {
            id: 4,
            title: "Create an Idea Blast Poster",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your solution on a poster. Include: Solution name at the top, a drawing of your solution, a fun slogan, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Idea Blast Poster",
                placeholder: "Use the digital poster creator"
              }
            ],
            tips: ["Add colors or sparkles to make it pop!"]
          },
          {
            id: 5,
            title: "Share Your Poster",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your poster to 2-3 people. Ask: \"Would you use this?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write down one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be proud of your creativity!"]
          },
          {
            id: 6,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about brainstorming and what you learned about solving problems.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about brainstorming?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about solving problems?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Validate Your Vision",
        subtitle: "Test your idea and create a Validation Star Chart",
        description: "Test your idea with feedback and create a Validation Star Chart.",
        emoji: "✨",
        duration: "60-90 minutes",
        objectives: ["Review your solution", "Ask for feedback", "Create a Validation Star Chart", "Share your chart", "Reflect on feedback"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Solution",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your solution from Lesson 2.",
            activities: [
              {
                type: "input",
                prompt: "My Solution:",
                placeholder: "SparkCraft Kits – Easy craft kits for kids!"
              }
            ],
            tips: ["Look at your Idea Blast Poster if you need a reminder."]
          },
          {
            id: 2,
            title: "Ask for Feedback",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Ask 2-3 people: \"Would you use this?\" \"Why or why not?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Feedback:",
                placeholder: "Dad said, \"Kids would love it, but add more colors!\""
              }
            ],
            tips: ["Pretend you're a detective finding clues!"]
          },
          {
            id: 3,
            title: "Create a Validation Star Chart",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw a chart showing feedback. Include: Solution name at the top, a drawing of your solution, one feedback quote, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Validation Star Chart",
                placeholder: "Use the digital chart creator"
              }
            ],
            tips: ["Add stars or colors to make it shine!"]
          },
          {
            id: 4,
            title: "Share Your Chart",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your chart to 2-3 people. Ask: \"Does this show my idea well?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be brave—feedback helps!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about getting feedback and what you learned about your idea.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about getting feedback?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about your idea?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Craft Your Pitch",
        subtitle: "Create an exciting pitch and Pitch Spark Card",
        description: "Create a short pitch and Pitch Spark Card to explain your idea.",
        emoji: "🎤",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Write a pitch", "Create a Pitch Spark Card", "Practice and share your pitch", "Reflect on pitching"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 3.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft kits for kids!"
              }
            ],
            tips: ["Look at your Validation Star Chart if you need a reminder."]
          },
          {
            id: 2,
            title: "Write a Pitch",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Write a 2-3 sentence pitch: What's your idea? Why's it great?",
            activities: [
              {
                type: "textarea",
                prompt: "My Pitch:",
                placeholder: "SparkCraft Kits! Fun, easy crafts for kids at home for just R20!"
              }
            ],
            tips: ["Pretend you're telling a friend why your idea rocks!"]
          },
          {
            id: 3,
            title: "Create a Pitch Spark Card",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your pitch on a card. Include: Idea name at the top, your pitch in the middle, a drawing of your idea, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Pitch Spark Card",
                placeholder: "Use the digital pitch card creator"
              }
            ],
            tips: ["Add colors or sparkles to make it pop!"]
          },
          {
            id: 4,
            title: "Practice and Share Your Pitch",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Practice your pitch 2-3 times. Share with 2-3 people, asking: \"Is my pitch clear?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Smile and have fun—you're a SparkStar!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about pitching and what you learned about sharing ideas.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about pitching?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about sharing ideas?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Plan Your Mini-Business",
        subtitle: "Create a simple business plan and Mini-Business Blueprint",
        description: "Create a simple business plan and Mini-Business Blueprint.",
        emoji: "📋",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Plan your business", "Create a Mini-Business Blueprint", "Share your blueprint", "Reflect on planning"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 4.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft kits for kids!"
              }
            ],
            tips: ["Look at your Pitch Spark Card if you need a reminder."]
          },
          {
            id: 2,
            title: "Plan Your Business",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Answer: What will you sell? Who is it for? How will you make it?",
            activities: [
              {
                type: "input",
                prompt: "What:",
                placeholder: "craft kits"
              },
              {
                type: "input",
                prompt: "Who:",
                placeholder: "kids aged 7-12"
              },
              {
                type: "input",
                prompt: "How:",
                placeholder: "assemble at home"
              }
            ],
            tips: ["Pretend you're planning a Sparkville shop!"]
          },
          {
            id: 3,
            title: "Create a Mini-Business Blueprint",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your plan on a blueprint. Include: Idea name at the top, your plan answers (what, who, how), a drawing of your idea, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Mini-Business Blueprint",
                placeholder: "Use the digital blueprint creator"
              }
            ],
            tips: ["Add colors or cutouts to make it exciting!"]
          },
          {
            id: 4,
            title: "Share Your Blueprint",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your blueprint to 2-3 people. Ask: \"Is my plan clear?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be proud of your plan—you're a SparkStar!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about planning and what you learned about making ideas real.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about planning?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about making ideas real?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Money Basics",
        subtitle: "Set a price for your idea and create a Pricing Poster",
        description: "Set a price for your idea and create a Pricing Poster.",
        emoji: "💰",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "List costs", "Decide a price", "Create a Pricing Poster", "Share your poster", "Reflect on pricing"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 5.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft kits for kids!"
              }
            ],
            tips: ["Look at your Mini-Business Blueprint if you need a reminder."]
          },
          {
            id: 2,
            title: "List Costs",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "List what you need to make your idea (e.g., paper, glue).",
            activities: [
              {
                type: "textarea",
                prompt: "Costs:",
                placeholder: "Paper (R5), glue (R3), beads (R2) per kit."
              }
            ],
            tips: ["Pretend you're shopping for Sparkville supplies!"]
          },
          {
            id: 3,
            title: "Decide a Price",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Choose a fair price that covers costs and adds a little extra.",
            activities: [
              {
                type: "input",
                prompt: "Price:",
                placeholder: "R20 per SparkCraft Kit."
              }
            ],
            tips: ["Ask your parent, \"Is this price fair?\""]
          },
          {
            id: 4,
            title: "Create a Pricing Poster",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your price on a poster. Include: Idea name at the top, your price, a drawing of your idea, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Pricing Poster",
                placeholder: "Use the digital pricing poster creator"
              }
            ],
            tips: ["Add sparkles or colors to make it catchy!"]
          },
          {
            id: 5,
            title: "Share Your Poster",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your poster to 2-3 people. Ask: \"Is this price fair?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be confident—you're learning about money!"]
          },
          {
            id: 6,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about pricing your idea and what you learned about money.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about pricing your idea?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about money?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Make It Pop",
        subtitle: "Create a brand identity and Brand Spark Board",
        description: "Create a brand identity and Brand Spark Board.",
        emoji: "🎨",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Create a brand", "Create a Brand Spark Board", "Share your board", "Reflect on branding"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 6.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft kits for kids!"
              }
            ],
            tips: ["Look at your Pricing Poster if you need a reminder."]
          },
          {
            id: 2,
            title: "Create a Brand",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Choose: A name for your idea, a logo, and colors.",
            activities: [
              {
                type: "input",
                prompt: "Name:",
                placeholder: "SparkCraft Kits"
              },
              {
                type: "input",
                prompt: "Logo:",
                placeholder: "a star"
              },
              {
                type: "input",
                prompt: "Colors:",
                placeholder: "yellow and blue"
              }
            ],
            tips: ["Pretend your brand is for a Sparkville shop!"]
          },
          {
            id: 3,
            title: "Create a Brand Spark Board",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your brand on a board. Include: Idea name at the top, your logo and colors, a drawing of your idea, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Brand Spark Board",
                placeholder: "Use the digital brand board creator"
              }
            ],
            tips: ["Add sparkles or cutouts to make it stand out!"]
          },
          {
            id: 4,
            title: "Share Your Board",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your board to 2-3 people. Ask: \"Does my brand look exciting?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be proud of your brand—you're a SparkStar!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about creating a brand and what you learned about making ideas memorable.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about creating a brand?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about making ideas memorable?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Market Your Magic",
        subtitle: "Plan marketing and create a Spark Flyer",
        description: "Plan marketing and create a Spark Flyer.",
        emoji: "📢",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Plan your marketing", "Create a Spark Flyer", "Share your flyer", "Reflect on marketing"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 7.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft kits for kids!"
              }
            ],
            tips: ["Look at your Brand Spark Board if you need a reminder."]
          },
          {
            id: 2,
            title: "Plan Your Marketing",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Answer: Who should know about your idea? Where will you tell them? How will you tell them?",
            activities: [
              {
                type: "input",
                prompt: "Who:",
                placeholder: "kids at school"
              },
              {
                type: "input",
                prompt: "Where:",
                placeholder: "school noticeboard"
              },
              {
                type: "input",
                prompt: "How:",
                placeholder: "flyers"
              }
            ],
            tips: ["Pretend you're advertising in Sparkville!"]
          },
          {
            id: 3,
            title: "Create a Spark Flyer",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw a flyer to promote your idea. Include: Idea name at the top, a drawing of your idea, a catchy slogan, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Spark Flyer",
                placeholder: "Use the digital flyer creator"
              }
            ],
            tips: ["Add colors or cutouts to grab attention!"]
          },
          {
            id: 4,
            title: "Share Your Flyer",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your flyer to 2-3 people. Ask: \"Does this make you want to try my idea?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be excited—you're spreading the word!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about marketing and what you learned about telling people your idea.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about marketing?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about telling people your idea?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Sell with Confidence",
        subtitle: "Practice a sales pitch and create a Sales Spark Script",
        description: "Practice a sales pitch and create a Sales Spark Script.",
        emoji: "💪",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Write a sales pitch", "Create a Sales Spark Script", "Practice and share your pitch", "Reflect on selling"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 8.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft kits for kids!"
              }
            ],
            tips: ["Look at your Spark Flyer if you need a reminder."]
          },
          {
            id: 2,
            title: "Write a Sales Pitch",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Write a 2-3 sentence pitch to convince people: What's your idea? Why should they try it?",
            activities: [
              {
                type: "textarea",
                prompt: "My Pitch:",
                placeholder: "SparkCraft Kits! Get fun crafts for kids at just R20!"
              }
            ],
            tips: ["Pretend you're selling to a Sparkville customer!"]
          },
          {
            id: 3,
            title: "Create a Sales Spark Script",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your pitch on a card. Include: Idea name at the top, your pitch in the middle, a drawing of your idea, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Sales Spark Script",
                placeholder: "Use the digital sales script creator"
              }
            ],
            tips: ["Add colors or sparkles to make it exciting!"]
          },
          {
            id: 4,
            title: "Practice and Share Your Pitch",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Practice your pitch 2-3 times. Share with 2-3 people, asking: \"Does my pitch make you want to try it?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be confident—you're a SparkStar seller!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about selling and what you learned about convincing people.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about selling?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about convincing people?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Track Your Success",
        subtitle: "Track progress with QUASH method and create a Success Spark Tracker",
        description: "Track progress with the QUASH method and create a Success Spark Tracker.",
        emoji: "📊",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Track with QUASH", "Create a Success Spark Tracker", "Share your tracker", "Reflect on progress"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 9.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft kits for kids!"
              }
            ],
            tips: ["Look at your Sales Spark Script if you need a reminder."]
          },
          {
            id: 2,
            title: "Track with QUASH",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Answer these QUASH questions: Question - What do you want to know? Understand - What did you learn from feedback? Act - What will you do?",
            activities: [
              {
                type: "input",
                prompt: "Question:",
                placeholder: "Do kids like my kits?"
              },
              {
                type: "input",
                prompt: "Understand:",
                placeholder: "They want more colors."
              },
              {
                type: "input",
                prompt: "Act:",
                placeholder: "Add beads to kits."
              }
            ],
            tips: ["Pretend you're a Sparkville scientist checking your idea!"]
          },
          {
            id: 3,
            title: "Create a Success Spark Tracker",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your progress on a tracker. Include: Idea name at the top, your QUASH answers, a drawing of your idea, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Success Spark Tracker",
                placeholder: "Use the digital tracker creator"
              }
            ],
            tips: ["Add colors or stars to show progress!"]
          },
          {
            id: 4,
            title: "Share Your Tracker",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your tracker to 2-3 people. Ask: \"Does this show my progress well?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be proud of your progress—you're a SparkStar!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about tracking your idea and what you learned about making it better.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about tracking your idea?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did you learn about making it better?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Celebrate Your Spark",
        subtitle: "Celebrate your journey with a SparkStar Showcase",
        description: "Celebrate your journey with a SparkStar Showcase.",
        emoji: "🎉",
        duration: "60-90 minutes",
        objectives: ["Review your journey", "Pick favorite moments and lessons", "Create a SparkStar Showcase", "Share your showcase", "Reflect on your journey"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Journey",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lessons 1-10.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft projects for kids!"
              }
            ],
            tips: ["Look at past creations with your parent or teacher."]
          },
          {
            id: 2,
            title: "Pick Favorite Moments and Lessons",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Answer: Favorite thing made? Most fun lesson? One thing learned?",
            activities: [
              {
                type: "input",
                prompt: "Favorite Thing:",
                placeholder: "poster, pitch"
              },
              {
                type: "input",
                prompt: "Fun Lesson:",
                placeholder: "making a flyer"
              },
              {
                type: "input",
                prompt: "Learned:",
                placeholder: "Feedback helps."
              }
            ],
            tips: ["Pretend you're telling a Sparkville friend about your adventure!"]
          },
          {
            id: 3,
            title: "Create a SparkStar Showcase",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your journey on a showcase. Include: Idea name at the top, a drawing of your favorite creation, one lesson learned, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your SparkStar Showcase",
                placeholder: "Use the digital showcase creator"
              }
            ],
            tips: ["Add colors, sparkles, or cutouts to make it festive!"]
          },
          {
            id: 4,
            title: "Share Your Showcase",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your showcase to 2-3 people. Ask: \"Does this show my journey well?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be proud—you're a SparkStar champion!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about the most exciting part of your journey, how it felt to share your showcase, and if you would start a new idea.",
            activities: [
              {
                type: "textarea",
                prompt: "What was the most exciting part of your journey?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "How did it feel to share your showcase?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "Would you start a new idea?",
                placeholder: ""
              }
            ]
          }
        ]
      },
      {
        title: "Spark It Forward",
        subtitle: "Share your idea with a wider audience and create a Spark It Forward Plan",
        description: "Share your idea with a wider audience and create a Spark It Forward Plan.",
        emoji: "🚀",
        duration: "60-90 minutes",
        objectives: ["Review your idea", "Plan how to share", "Create a Spark It Forward Plan", "Share your plan", "Reflect on sharing"],
        tools: ["Pen/pencil", "paper", "crayons/markers"],
        sections: [
          {
            id: 1,
            title: "Review Your Idea",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Look back at your idea from Lesson 11.",
            activities: [
              {
                type: "input",
                prompt: "My Idea:",
                placeholder: "SparkCraft Kits – Fun craft projects for kids!"
              }
            ],
            tips: ["Look at your SparkStar Showcase if you need a reminder."]
          },
          {
            id: 2,
            title: "Plan How to Share",
            timeMinutes: 15,
            tools: ["Pen/pencil", "paper"],
            content: "Answer: Who else should know? How will you tell them? Why will they love it?",
            activities: [
              {
                type: "input",
                prompt: "Who:",
                placeholder: "kids at school"
              },
              {
                type: "input",
                prompt: "How:",
                placeholder: "flyers at school"
              },
              {
                type: "input",
                prompt: "Why:",
                placeholder: "it's fun and affordable"
              }
            ],
            tips: ["Pretend you're inviting all of Sparkville to try your idea!"]
          },
          {
            id: 3,
            title: "Create a Spark It Forward Plan",
            timeMinutes: 20,
            tools: ["Paper", "crayons/markers", "magazine cutouts"],
            content: "Draw your plan on a poster. Include: Idea name at the top, a drawing of you sharing, one sharing sentence, and your name at the bottom.",
            activities: [
              {
                type: "creation",
                prompt: "Create your Spark It Forward Plan",
                placeholder: "Use the digital plan creator"
              }
            ],
            tips: ["Add colors or cutouts to make it lively!"]
          },
          {
            id: 4,
            title: "Share Your Plan",
            timeMinutes: 10,
            tools: ["Pen/pencil", "paper"],
            content: "Show your plan to 2-3 people. Ask: \"Does my plan make you excited to share my idea?\" \"Any ideas to make it better?\"",
            activities: [
              {
                type: "textarea",
                prompt: "Write one piece of advice:",
                placeholder: ""
              }
            ],
            tips: ["Be proud—you're a SparkStar leader!"]
          },
          {
            id: 5,
            title: "Reflect",
            timeMinutes: 5,
            tools: ["Pen/pencil", "paper"],
            content: "Think about what was fun about planning to share, what people said about your plan, and if you would keep sharing or start a new idea.",
            activities: [
              {
                type: "textarea",
                prompt: "What was fun about planning to share?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "What did people say about your plan?",
                placeholder: ""
              },
              {
                type: "textarea",
                prompt: "Would you keep sharing or start a new idea?",
                placeholder: ""
              }
            ]
          }
        ]
      }
    ];

    lessons.forEach((lesson, index) => {
      const id = index + 1;
      this.lessons.set(id, { ...lesson, id });
    });
    this.currentId.lessons = lessons.length + 1;

    // Initialize progress for first 3 lessons (completed) and lesson 4 (in progress)
    const progressData = [
      { lessonId: 1, completedSections: [1, 2, 3, 4, 5], isCompleted: true },
      { lessonId: 2, completedSections: [1, 2, 3, 4, 5, 6], isCompleted: true },
      { lessonId: 3, completedSections: [1, 2, 3, 4, 5], isCompleted: true },
      { lessonId: 4, completedSections: [1, 2], isCompleted: false },
    ];

    progressData.forEach((progress, index) => {
      const userProgressItem: UserProgress = {
        id: index + 1,
        userId: 1,
        lessonId: progress.lessonId,
        completedSections: progress.completedSections,
        isCompleted: progress.isCompleted,
        lastAccessedAt: new Date(),
        data: {},
      };
      this.userProgress.set(`1-${progress.lessonId}`, userProgressItem);
    });
    this.currentId.userProgress = 5;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      level: 1, 
      totalBadges: 0, 
      currentStreak: 0, 
      ideasCreated: 0,
      avatar: insertUser.avatar || "👦"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = this.currentId.lessons++;
    const newLesson: Lesson = { ...lesson, id };
    this.lessons.set(id, newLesson);
    return newLesson;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${lessonId}`);
  }

  async updateProgress(userId: number, lessonId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress> {
    const key = `${userId}-${lessonId}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated = { ...existing, ...updates, lastAccessedAt: new Date() };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentId.userProgress++;
      const newProgress: UserProgress = {
        id,
        userId,
        lessonId,
        completedSections: [],
        isCompleted: false,
        lastAccessedAt: new Date(),
        data: {},
        ...updates,
      };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
  }

  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]> {
    const userBadgesList = Array.from(this.userBadges.values()).filter(ub => ub.userId === userId);
    return userBadgesList.map(ub => {
      const badge = this.badges.get(ub.badgeId)!;
      return { ...ub, badge };
    });
  }

  async awardBadge(userId: number, badgeId: number): Promise<UserBadge> {
    const id = this.currentId.userBadges++;
    const userBadge: UserBadge = {
      id,
      userId,
      badgeId,
      earnedAt: new Date(),
    };
    this.userBadges.set(id, userBadge);

    // Update user's total badges
    const user = this.users.get(userId);
    if (user) {
      user.totalBadges++;
      this.users.set(userId, user);
    }

    return userBadge;
  }

  async saveActivity(activity: InsertActivity): Promise<ActivityRecord> {
    const id = this.currentId.activities++;
    const newActivity: ActivityRecord = {
      ...activity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getUserActivities(userId: number, lessonId?: number): Promise<ActivityRecord[]> {
    const userActivities = Array.from(this.activities.values()).filter(activity => activity.userId === userId);
    if (lessonId) {
      return userActivities.filter(activity => activity.lessonId === lessonId);
    }
    return userActivities;
  }
}

export const storage = new MemStorage();
