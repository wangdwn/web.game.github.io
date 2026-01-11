
export enum Role {
  PORT_OPERATOR = '⚓ 港务商',
  SHIP_OWNER = '🚢 船舶商',
  PHARMA_TRADER = '💊 医药商',
  TOURISM_DEV = '🏖️ 文旅商',
  ENERGY_CORP = '⚡ 能源商',
  BUREAU_CHIEF = '🛡️ 事务局长',
  RESEARCH_DIRECTOR = '🔬 调查主任',
  CITIZEN = '🏘️ 市民代表'
}

export enum ZoneType {
  DEEP_WATER = '深水航道区',
  TECH_CITY = '海洋科技城',
  ECOLOGY = '生态保护区',
  ENERGY = '能源开发区',
  TOURISM = '滨海文旅带',
  FISHING = '渔港经济区',
  FREE_TRADE = '自贸试验区'
}

export interface Building {
  id: string;
  type: string;
  name: string;
  level: number;
  zoneId: number;
  cost: number;
  revenuePerTurn: number;
  techBonus: number;
  envImpact: number;
  happyBonus: number;
  status: 'active' | 'constructing' | 'locked';
  constructionTurnsLeft: number;
  totalConstructionTurns: number;
}

export interface GameState {
  funds: number;
  reputation: number;
  techPoints: number;
  influencePoints: number; // 新增：基础积分/影响积分
  turn: number;
  currentRole: Role | null;
  buildings: Building[];
  environmentalIndex: number;
  happinessIndex: number;
  messages: ChatMessage[];
  isGameStarted: boolean;
  startTime: number;
  totalRevenueAccumulated: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  role: Role | 'System';
}

export interface ScienceFact {
  title: string;
  content: string;
  reward: string;
  pointsReward: number; // 新增：科普奖励积分
}

export interface SettlementData {
  role: Role;
  duration: string;
  totalRevenue: number;
  finalFunds: number;
  buildingCount: number;
  turnCount: number;
  finalTech: number;
  finalEnv: number;
  finalInfluence: number; // 新增：结算积分
  performanceRank: string;
}

export interface BuildingTemplate {
  type: string;
  name: string;
  cost: number;
  baseRevenue: number;
  icon: string;
  description: string;
  buildTime: number;
  allowedRoles: Role[];
  baseTechBonus: number;
  baseEnvImpact: number;
  baseHappyBonus: number;
}
