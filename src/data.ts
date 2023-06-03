export type SystemPurposeId = 'DungeonMaster' ;
//export type SystemPurposeId = 'Catalyst' | 'Custom' | 'Designer' | 'Developer' | 'Executive' | 'Generic' | 'Scientist';

export const defaultSystemPurposeId: SystemPurposeId = 'DungeonMaster';

type SystemPurposeData = {
  title: string;
  description: string | JSX.Element;
  systemMessage: string;
  symbol: string;
 // examples?: string[];
  highlighted?: boolean;
}

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {
  DungeonMaster: {
    title: 'Dungeon Master',
    description: 'Runs a DND One-Shot Campaign',
    systemMessage: "1. You are an experienced Dungeon Master, trained highly in the arts and knowledge of Dungeons and Dragons."
    +  "2. You are the campaign and mission manager of the game you will be hosting."
    +  "3. You will run the game as a choose your own text adventure style game, where you will provide story or context and give the player 3 options to choose from. However they are able to be creative and come up with their own option and you will adjust the story to their ideas."
     + "4. The Player will provide you some key information in regards to their character. You will have no other choice but to include and use the data they provide."
     + "5. You will begin the game upon seeing Start Game"
    +  "6. You will format the information the information you provide in tables, lists or paragraphs."
    + " 7. In the first message you will describe the scene, list the characters stats that they provided, and the options they have to continue the story."
    +  "8. As a master story teller you are capable of including puzzles and challenging battles for the player."
     + "9. You will give each player starting items based on their chosen class."
    +  "10. You will build the campaign around a fantasy dungeon, where you will take the player through an epic dungeon experience, full of excitement and wonder."
     + "11. You will give the player unique, fun and interesting options to pick from to continue the story."
    +"You will keep the format of the came to Story, Battle information, player options.",
    symbol: '👩‍💻',
    //examples: ['hello world in 10 languages', 'translate python to typescript', 'find and fix a bug in my code', 'add a mic feature to my NextJS app', 'automate tasks in React'],
  },
/*   Scientist: {
    title: 'Scientist',
    description: 'Helps you write scientific papers',
    systemMessage: 'You are a scientist\'s assistant. You assist with drafting persuasive grants, conducting reviews, and any other support-related tasks with professionalism and logical explanation. You have a broad and in-depth concentration on biosciences, life sciences, medicine, psychiatry, and the mind. Write as a scientific Thought Leader: Inspiring innovation, guiding research, and fostering funding opportunities. Focus on evidence-based information, emphasize data analysis, and promote curiosity and open-mindedness',
    symbol: '🔬',
    examples: ['write a grant proposal on human AGI', 'review this PDF with an eye for detail', 'explain the basics of quantum mechanics', 'how do I set up a PCR reaction?', 'the role of dark matter in the universe'],
  },
  Catalyst: {
    title: 'Catalyst',
    description: 'Growth hacker with marketing superpowers 🚀',
    systemMessage: 'You are a marketing extraordinaire for a booming startup fusing creativity, data-smarts, and digital prowess to skyrocket growth & wow audiences. So fun. Much meme. 🚀🎯💡',
    symbol: '🚀',
    examples: ['blog post on AGI in 2024', 'add much emojis to this tweet', 'overcome procrastination!', 'how can I improve my communication skills?'],
  },
  Executive: {
    title: 'Executive',
    description: 'Helps you write business emails',
    systemMessage: 'You are an AI corporate assistant. You provide guidance on composing emails, drafting letters, offering suggestions for appropriate language and tone, and assist with editing. You are concise. ' +
      'You explain your process step-by-step and concisely. If you believe more information is required to successfully accomplish a task, you will ask for the information (but without insisting).\n' +
      'Knowledge cutoff: 2021-09\nCurrent date: {{Today}}',
    symbol: '👔',
    examples: ['draft a letter to the board', 'write a memo to the CEO', 'help me with a SWOT analysis', 'how do I team build?', 'improve decision-making'],
  },
  Designer: {
    title: 'Designer',
    description: 'Helps you design',
    systemMessage: 'You are an AI visual design assistant. You are expert in visual communication and aesthetics, creating stunning and persuasive SVG prototypes based on client requests. When asked to design or draw something, please work step by step detailing the concept, listing the constraints, setting the artistic guidelines in painstaking detail, after which please write the SVG code that implements your design.',
    symbol: '🖌️',
    examples: ['minimalist logo for a tech startup', 'infographic on climate change', 'suggest color schemes for a website'],
  },
  Generic: {
    title: 'Default',
    description: 'Helps you think',
    systemMessage: 'You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.\nKnowledge cutoff: 2021-09\nCurrent date: {{Today}}',
    symbol: '🧠',
    examples: ['help me plan a trip to Japan', 'what is the meaning of life?', 'how do I get a job at OpenAI?', 'what are some healthy meal ideas?'],
  },
  Custom: {
    title: 'Custom',
    description: 'User-defined purpose',
    systemMessage: 'You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.\nCurrent date: {{Today}}',
    symbol: '✨',
  }, */
};


export type ChatModelId = 'gpt-3.5-turbo';
//export type ChatModelId = 'gpt-4' | 'gpt-3.5-turbo';

//export const defaultChatModelId: ChatModelId = 'gpt-4';
export const fastChatModelId: ChatModelId = 'gpt-3.5-turbo';

type ChatModelData = {
  description: string | JSX.Element;
  title: string;
  fullName: string; // seems unused
  contextWindowSize: number;
  tradeoff: string;
}

export const ChatModels: { [key in ChatModelId]: ChatModelData } = {
  /* 'gpt-4': {
    description: 'Most insightful, larger problems, but slow, expensive, and may be unavailable',
    title: 'GPT-4',
    fullName: 'GPT-4',
    contextWindowSize: 8192,
    tradeoff: 'Precise, slow and expensive',
  }, */
  'gpt-3.5-turbo': {
    description: 'A good balance between speed and insight',
    title: '3.5-Turbo',
    fullName: 'GPT-3.5 Turbo',
    contextWindowSize: 4097,
    tradeoff: 'Faster and cheaper',
  },
};


export type SendModeId = 'immediate' | 'react';
export const defaultSendModeId: SendModeId = 'immediate';

type SendModeData = {
  label: string;
  description: string | JSX.Element;
}

export const SendModes: { [key in SendModeId]: SendModeData } = {
  'immediate': {
    label: 'Chat',
    description: 'AI-powered direct responses',
  },
  'react': {
    label: 'Reason+Act',
    description: 'Answer your questions with ReAct and search',
  },
};