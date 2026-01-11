
import { ZoneType, Role, BuildingTemplate } from './types';

export const ZONES = [
  { id: 1, type: ZoneType.DEEP_WATER, name: '深水航道', color: '#1E40AF', icon: '⚓', x: 250, y: 350, path: 'M 100 300 Q 200 350 300 400 L 250 500 L 50 450 Z' },
  { id: 2, type: ZoneType.TECH_CITY, name: '科技城', color: '#7C3AED', icon: '🔬', x: 450, y: 200, path: 'M 350 150 Q 450 100 550 150 L 600 250 L 400 300 Z' },
  { id: 3, type: ZoneType.ECOLOGY, name: '生态区', color: '#059669', icon: '🌿', x: 150, y: 150, path: 'M 50 100 Q 150 50 250 100 L 300 200 L 100 250 Z' },
  { id: 4, type: ZoneType.ENERGY, name: '能源区', color: '#DC2626', icon: '⚡', x: 650, y: 350, path: 'M 600 300 Q 700 350 750 450 L 650 550 L 550 450 Z' },
  { id: 5, type: ZoneType.TOURISM, name: '文旅带', color: '#F59E0B', icon: '🏖️', x: 400, y: 450, path: 'M 300 400 Q 400 450 500 400 L 550 500 L 350 550 Z' },
  { id: 6, type: ZoneType.FISHING, name: '渔港', color: '#0891B2', icon: '🎣', x: 100, y: 400, path: 'M 20 350 L 120 350 L 150 450 L 50 500 Z' },
  { id: 7, type: ZoneType.FREE_TRADE, name: '自贸区', color: '#6366F1', icon: '💼', x: 550, y: 100, path: 'M 500 50 L 650 50 L 700 150 L 550 200 Z' },
];

export const BUILDING_TEMPLATES: BuildingTemplate[] = [
  // ⚓ 港务商专属 (侧重：工业吞吐量)
  { type: 'mega_port', name: '全自动码头', cost: 120000000, baseRevenue: 8000000, icon: '🏗️', description: '吞吐量极高的现代化港口。', buildTime: 4, allowedRoles: [Role.PORT_OPERATOR], baseTechBonus: 5, baseEnvImpact: -10, baseHappyBonus: 2 },
  { type: 'container_terminal', name: '深水集装箱场', cost: 90000000, baseRevenue: 6500000, icon: '🚢', description: '大规模标准化装卸基地。', buildTime: 3, allowedRoles: [Role.PORT_OPERATOR], baseTechBonus: 2, baseEnvImpact: -15, baseHappyBonus: 0 },
  { type: 'logistics', name: '跨境转运中心', cost: 60000000, baseRevenue: 4500000, icon: '📦', description: '连接全球的物流枢纽。', buildTime: 2, allowedRoles: [Role.PORT_OPERATOR], baseTechBonus: 5, baseEnvImpact: -5, baseHappyBonus: 1 },
  { type: 'dry_dock', name: '深水干船坞', cost: 95000000, baseRevenue: 5500000, icon: '⛴️', description: '船舶维修基地，航道配套。', buildTime: 3, allowedRoles: [Role.PORT_OPERATOR], baseTechBonus: 8, baseEnvImpact: -8, baseHappyBonus: 0 },
  { type: 'rail_link', name: '疏港铁路站', cost: 75000000, baseRevenue: 4000000, icon: '🚂', description: '实现海铁联运，极大提升效率。', buildTime: 3, allowedRoles: [Role.PORT_OPERATOR], baseTechBonus: 12, baseEnvImpact: -4, baseHappyBonus: 5 },

  // 🚢 船舶商专属 (侧重：流转服务)
  { type: 'cruise_base', name: '国际邮轮母港', cost: 150000000, baseRevenue: 10000000, icon: '🛳️', description: '高端旅游消费增长点。', buildTime: 5, allowedRoles: [Role.SHIP_OWNER], baseTechBonus: 5, baseEnvImpact: -12, baseHappyBonus: 15 },
  { type: 'bunker_station', name: 'LNG加注站', cost: 55000000, baseRevenue: 3500000, icon: '⛽', description: '清洁航运能源补给点。', buildTime: 2, allowedRoles: [Role.SHIP_OWNER], baseTechBonus: 12, baseEnvImpact: 5, baseHappyBonus: 2 },
  { type: 'service_hub', name: '海事综合服务中心', cost: 45000000, baseRevenue: 3000000, icon: '⚖️', description: '提供法律、保险与经纪服务。', buildTime: 2, allowedRoles: [Role.SHIP_OWNER], baseTechBonus: 10, baseEnvImpact: 0, baseHappyBonus: 8 },
  { type: 'refit_yard', name: '绿色改装船厂', cost: 80000000, baseRevenue: 4500000, icon: '🛠️', description: '将旧船升级为环保动力。', buildTime: 3, allowedRoles: [Role.SHIP_OWNER], baseTechBonus: 25, baseEnvImpact: 10, baseHappyBonus: 5 },
  { type: 'training_center', name: '高级船员学院', cost: 40000000, baseRevenue: 1000000, icon: '🎓', description: '培养海事精英。', buildTime: 3, allowedRoles: [Role.SHIP_OWNER], baseTechBonus: 20, baseEnvImpact: 0, baseHappyBonus: 12 },

  // 💊 医药商专属 (侧重：高额科技回报)
  { type: 'pharma_lab', name: '深海药理所', cost: 90000000, baseRevenue: 3000000, icon: '💊', description: '提取深海生物精华。', buildTime: 3, allowedRoles: [Role.PHARMA_TRADER], baseTechBonus: 30, baseEnvImpact: -2, baseHappyBonus: 8 },
  { type: 'cryo_vault', name: '基因种子库', cost: 110000000, baseRevenue: 4000000, icon: '🧬', description: '储存珍稀基因，解锁未来科技。', buildTime: 4, allowedRoles: [Role.PHARMA_TRADER], baseTechBonus: 45, baseEnvImpact: 5, baseHappyBonus: 5 },
  { type: 'algae_farm', name: '微藻固碳场', cost: 50000000, baseRevenue: 2000000, icon: '🧪', description: '生产制药原料并净化大气。', buildTime: 2, allowedRoles: [Role.PHARMA_TRADER], baseTechBonus: 15, baseEnvImpact: 20, baseHappyBonus: 2 },
  { type: 'health_resort', name: '海洋康养中心', cost: 60000000, baseRevenue: 5000000, icon: '🧖', description: '高端康养，幸福感倍增。', buildTime: 3, allowedRoles: [Role.PHARMA_TRADER], baseTechBonus: 10, baseEnvImpact: 2, baseHappyBonus: 25 },
  { type: 'synthesis_plant', name: '生物芯片工厂', cost: 130000000, baseRevenue: 7000000, icon: '💾', description: '利用蛋白质构建超算核心。', buildTime: 4, allowedRoles: [Role.PHARMA_TRADER], baseTechBonus: 55, baseEnvImpact: -5, baseHappyBonus: 2 },

  // 🏖️ 文旅商专属 (侧重：幸福度与溢价)
  { type: 'resort_plus', name: '亚特兰蒂斯酒店', cost: 80000000, baseRevenue: 12000000, icon: '🏨', description: '顶奢乐园，旅游支柱。', buildTime: 3, allowedRoles: [Role.TOURISM_DEV], baseTechBonus: 0, baseEnvImpact: -15, baseHappyBonus: 35 },
  { type: 'ferris_wheel', name: '大湾区之眼', cost: 65000000, baseRevenue: 7000000, icon: '🎡', description: '城市地标，游客必选。', buildTime: 3, allowedRoles: [Role.TOURISM_DEV], baseTechBonus: 5, baseEnvImpact: -5, baseHappyBonus: 40 },
  { type: 'underwater_res', name: '深蓝沉浸餐厅', cost: 50000000, baseRevenue: 5500000, icon: '🍽️', description: '在鱼群包围中用餐。', buildTime: 2, allowedRoles: [Role.TOURISM_DEV], baseTechBonus: 12, baseEnvImpact: -8, baseHappyBonus: 25 },
  { type: 'yacht_club', name: '海天一色俱乐部', cost: 70000000, baseRevenue: 8500000, icon: '🚤', description: '吸引高净值人群入驻。', buildTime: 2, allowedRoles: [Role.TOURISM_DEV], baseTechBonus: 2, baseEnvImpact: -10, baseHappyBonus: 20 },
  { type: 'surf_club', name: '极客冲浪基地', cost: 25000000, baseRevenue: 2500000, icon: '🏄', description: '吸引年轻人。', buildTime: 1, allowedRoles: [Role.TOURISM_DEV], baseTechBonus: 5, baseEnvImpact: 0, baseHappyBonus: 25 },

  // ⚡ 能源商专属 (侧重：绿色增长与技术)
  { type: 'tidal_power', name: '潮汐能阵列', cost: 150000000, baseRevenue: 6000000, icon: '⚡', description: '无穷动力，绿色未来。', buildTime: 5, allowedRoles: [Role.ENERGY_CORP], baseTechBonus: 35, baseEnvImpact: 20, baseHappyBonus: 5 },
  { type: 'hydrogen', name: '海水制氢站', cost: 100000000, baseRevenue: 4000000, icon: '🧪', description: '未来能源的核心。', buildTime: 4, allowedRoles: [Role.ENERGY_CORP], baseTechBonus: 40, baseEnvImpact: 15, baseHappyBonus: 2 },
  { type: 'solar_island', name: '浮动光伏岛', cost: 70000000, baseRevenue: 3000000, icon: '☀️', description: '生态发电。', buildTime: 2, allowedRoles: [Role.ENERGY_CORP], baseTechBonus: 20, baseEnvImpact: 15, baseHappyBonus: 5 },
  { type: 'wind_farm', name: '海上风电场', cost: 80000000, baseRevenue: 3500000, icon: '🌬️', description: '稳定绿能产出。', buildTime: 3, allowedRoles: [Role.ENERGY_CORP], baseTechBonus: 18, baseEnvImpact: 18, baseHappyBonus: 5 },
  { type: 'cable_hub', name: '跨海输电枢纽', cost: 60000000, baseRevenue: 2500000, icon: '🔌', description: '打通全区能源互连网。', buildTime: 2, allowedRoles: [Role.ENERGY_CORP], baseTechBonus: 25, baseEnvImpact: 5, baseHappyBonus: 5 },

  // 🛡️ 事务局长 (侧重：全局效率与安全)
  { type: 'customs_tower', name: '智慧海关塔', cost: 85000000, baseRevenue: 5000000, icon: '🗼', description: '提升全区流转效率。', buildTime: 3, allowedRoles: [Role.BUREAU_CHIEF], baseTechBonus: 20, baseEnvImpact: 0, baseHappyBonus: 15 },
  { type: 'command_center', name: '综合指挥枢纽', cost: 120000000, baseRevenue: 2000000, icon: '📡', description: '应对突发事件的核心。', buildTime: 4, allowedRoles: [Role.BUREAU_CHIEF], baseTechBonus: 30, baseEnvImpact: 0, baseHappyBonus: 20 },
  { type: 'env_monitor', name: '实时水文监测站', cost: 40000000, baseRevenue: 0, icon: '🌡️', description: '大幅提升环保指标。', buildTime: 2, allowedRoles: [Role.BUREAU_CHIEF], baseTechBonus: 15, baseEnvImpact: 40, baseHappyBonus: 10 },
  { type: 'coast_guard', name: '海巡特警基地', cost: 50000000, baseRevenue: 0, icon: '🛡️', description: '保障海域安全，降低事故率。', buildTime: 2, allowedRoles: [Role.BUREAU_CHIEF], baseTechBonus: 10, baseEnvImpact: 5, baseHappyBonus: 15 },

  // 🔬 调查主任专属 (侧重：极致科技与发现)
  { type: 'ocean_obs', name: '深海哨所', cost: 50000000, baseRevenue: 500000, icon: '🛰️', description: '监控洋流变化。', buildTime: 2, allowedRoles: [Role.RESEARCH_DIRECTOR], baseTechBonus: 60, baseEnvImpact: 25, baseHappyBonus: 5 },
  { type: 'data_center', name: '海底冷算中心', cost: 130000000, baseRevenue: 9000000, icon: '🖥️', description: '全球顶级算力基地。', buildTime: 4, allowedRoles: [Role.RESEARCH_DIRECTOR], baseTechBonus: 85, baseEnvImpact: -5, baseHappyBonus: 5 },
  { type: 'mining_rd', name: '可燃冰开采试验场', cost: 150000000, baseRevenue: 15000000, icon: '💎', description: '高收益，极高风险。', buildTime: 5, allowedRoles: [Role.RESEARCH_DIRECTOR], baseTechBonus: 40, baseEnvImpact: -40, baseHappyBonus: 0 },
  { type: 'bio_institute', name: '生物演化研究所', cost: 95000000, baseRevenue: 1500000, icon: '🔬', description: '研究物种多样性。', buildTime: 3, allowedRoles: [Role.RESEARCH_DIRECTOR], baseTechBonus: 50, baseEnvImpact: 15, baseHappyBonus: 10 },
  { type: 'submersible_bay', name: '深潜器整备站', cost: 70000000, baseRevenue: 1000000, icon: '🤿', description: '探索海底奥秘。', buildTime: 3, allowedRoles: [Role.RESEARCH_DIRECTOR], baseTechBonus: 50, baseEnvImpact: 10, baseHappyBonus: 12 },

  // 🏘️ 市民代表专属 (侧重：公共福利与人文)
  { type: 'maritime_museum', name: '航海博物馆', cost: 70000000, baseRevenue: 500000, icon: '🏛️', description: '文化地标。', buildTime: 3, allowedRoles: [Role.CITIZEN], baseTechBonus: 20, baseEnvImpact: 5, baseHappyBonus: 50 },
  { type: 'wetland_park', name: '红树林步道', cost: 30000000, baseRevenue: 200000, icon: '🛤️', description: '亲近自然。', buildTime: 2, allowedRoles: [Role.CITIZEN], baseTechBonus: 5, baseEnvImpact: 45, baseHappyBonus: 45 },
  { type: 'coastal_plaza', name: '蓝海节庆广场', cost: 45000000, baseRevenue: 800000, icon: '🎪', description: '举办文化活动。', buildTime: 2, allowedRoles: [Role.CITIZEN], baseTechBonus: 2, baseEnvImpact: 0, baseHappyBonus: 60 },
  { type: 'sea_school', name: '深海博学馆', cost: 55000000, baseRevenue: 0, icon: '📖', description: '青少年科普教育基地。', buildTime: 3, allowedRoles: [Role.CITIZEN], baseTechBonus: 35, baseEnvImpact: 5, baseHappyBonus: 40 },
  { type: 'community_clinic', name: '海滨智慧医院', cost: 60000000, baseRevenue: 0, icon: '🏥', description: '保障健康。', buildTime: 2, allowedRoles: [Role.CITIZEN], baseTechBonus: 15, baseEnvImpact: 0, baseHappyBonus: 55 },

  // 通用建筑
  { type: 'fishing_base', name: '现代渔场', cost: 20000000, baseRevenue: 1500000, icon: '🐟', description: '基础生产。', buildTime: 2, allowedRoles: Object.values(Role), baseTechBonus: 0, baseEnvImpact: -2, baseHappyBonus: 5 },
];

export const ZONE_COMPATIBILITY: Record<ZoneType, { [key: string]: { revenueMul: number, techMul: number, envPenalty: number, warning?: string } }> = {
  [ZoneType.DEEP_WATER]: {
    mega_port: { revenueMul: 1.6, techMul: 1.0, envPenalty: 0 },
    container_terminal: { revenueMul: 1.8, techMul: 1.0, envPenalty: 0 },
    resort_plus: { revenueMul: 0.3, techMul: 0.2, envPenalty: 15, warning: "航道建设度假村严重干扰海运，且存在巨型轮船碰撞风险，收益极低！" },
    wetland_park: { revenueMul: 0.1, techMul: 1.0, envPenalty: 50, warning: "深水区洋流剧烈，红树林无法存活，环境评级将大幅受损。" },
  },
  [ZoneType.TECH_CITY]: {
    data_center: { revenueMul: 1.5, techMul: 2.2, envPenalty: 0 },
    synthesis_plant: { revenueMul: 1.4, techMul: 2.5, envPenalty: 0 },
    mining_rd: { revenueMul: 1.2, techMul: 1.5, envPenalty: 20 },
    ferris_wheel: { revenueMul: 0.6, techMul: 0.5, envPenalty: 10, warning: "游乐设施产生的电磁干扰严重影响了隔壁实验室的精密测量数据！" },
    mega_port: { revenueMul: 0.8, techMul: 0.8, envPenalty: 20, warning: "繁忙工业港口产生的震动破坏了科技城的精密制造环境。" },
  },
  [ZoneType.ECOLOGY]: {
    wetland_park: { revenueMul: 2.5, techMul: 1.2, envPenalty: -15 },
    bio_institute: { revenueMul: 1.2, techMul: 1.8, envPenalty: -5 },
    mega_port: { revenueMul: 0.05, techMul: 0.1, envPenalty: 80, warning: "【警告】在生态区强制建设工业码头将触发公众舆论危机，面临巨额环保罚款！" },
    mining_rd: { revenueMul: 0.5, techMul: 1.0, envPenalty: 100, warning: "深海开采实验对自然生态区是毁灭性的，满意度将清零。" },
    resort_plus: { revenueMul: 0.8, techMul: 0.5, envPenalty: 30, warning: "高端酒店建设破坏了候鸟栖息地，环保评分将急剧下滑。" },
  },
  [ZoneType.ENERGY]: {
    tidal_power: { revenueMul: 1.7, techMul: 1.3, envPenalty: 0 },
    hydrogen: { revenueMul: 1.5, techMul: 1.5, envPenalty: 0 },
    solar_island: { revenueMul: 1.5, techMul: 1.2, envPenalty: 0 },
    maritime_museum: { revenueMul: 0.5, techMul: 1.0, envPenalty: 5, warning: "能源作业区的强磁场和作业噪音不适合游客参观。" },
  },
  [ZoneType.TOURISM]: {
    resort_plus: { revenueMul: 2.2, techMul: 1.0, envPenalty: 0 },
    underwater_res: { revenueMul: 2.5, techMul: 1.2, envPenalty: 0 },
    ferris_wheel: { revenueMul: 2.0, techMul: 1.0, envPenalty: 0 },
    data_center: { revenueMul: 0.4, techMul: 0.4, envPenalty: 10, warning: "在旅游区建设巨大的算力中心严重破坏了城市天际线的美感。" },
    container_terminal: { revenueMul: 0.2, techMul: 0.2, envPenalty: 40, warning: "集装箱卡车严重堵塞了旅游道路，游客幸福感暴跌！" },
  },
  [ZoneType.FISHING]: {
    fishing_base: { revenueMul: 2.2, techMul: 1.0, envPenalty: 0 },
    algae_farm: { revenueMul: 1.8, techMul: 1.2, envPenalty: 0 },
    mega_port: { revenueMul: 0.7, techMul: 0.5, envPenalty: 20, warning: "航道封锁导致当地渔民失去生计，社会稳定性下降。" },
  },
  [ZoneType.FREE_TRADE]: {
    logistics: { revenueMul: 2.5, techMul: 1.5, envPenalty: 0 },
    customs_tower: { revenueMul: 1.8, techMul: 1.4, envPenalty: 0 },
    rail_link: { revenueMul: 2.2, techMul: 1.2, envPenalty: 0 },
    wetland_park: { revenueMul: 0.6, techMul: 0.8, envPenalty: -5, warning: "自贸区地价高昂，在此部署公园并不经济。" },
  }
};

export const INITIAL_FUNDS = 500000000;
