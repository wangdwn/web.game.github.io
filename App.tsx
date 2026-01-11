
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Role, GameState, ChatMessage, Building, ZoneType, SettlementData, BuildingTemplate } from './types';
import { INITIAL_FUNDS, ZONES, BUILDING_TEMPLATES, ZONE_COMPATIBILITY } from './constants';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';
import InteractiveMap from './components/InteractiveMap';
import ScienceModal from './components/ScienceModal';
import SettlementModal from './components/SettlementModal';
import ActionCenter from './components/ActionCenter';
import { simulateChat, generateEvent } from './services/gemini';

const MAX_SESSION_HOURS = 180;
const INITIAL_INFLUENCE = 1000;
const ACCELERATION_COST = 100;
const WRONG_DECISION_PENALTY = 150;
const SAVE_KEY = 'azure_city_v1_save';

const ROLE_BACKGROUNDS: Record<string, string> = {
  [Role.PORT_OPERATOR]: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop',
  [Role.SHIP_OWNER]: 'https://images.unsplash.com/photo-1494412574743-019485b7829a?q=80&w=1920&auto=format&fit=crop',
  [Role.PHARMA_TRADER]: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1920&auto=format&fit=crop',
  [Role.TOURISM_DEV]: 'https://images.unsplash.com/photo-1548576046-7454abd10f7a?q=80&w=1920&auto=format&fit=crop',
  [Role.ENERGY_CORP]: 'https://images.unsplash.com/photo-1466611653911-954ffec136ce?q=80&w=1920&auto=format&fit=crop',
  [Role.BUREAU_CHIEF]: 'https://images.unsplash.com/photo-1454165833767-027ffec90367?q=80&w=1920&auto=format&fit=crop',
  [Role.RESEARCH_DIRECTOR]: 'https://images.unsplash.com/photo-1510172951991-859a697119c5?q=80&w=1920&auto=format&fit=crop',
  [Role.CITIZEN]: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1920&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1920&auto=format&fit=crop'
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    funds: INITIAL_FUNDS,
    reputation: 50,
    techPoints: 0,
    influencePoints: INITIAL_INFLUENCE,
    turn: 0, 
    currentRole: null,
    buildings: [],
    environmentalIndex: 85,
    happinessIndex: 75,
    messages: [
      { id: '1', sender: '系统', content: '欢迎来到蔚蓝之城！请选择你的身份开始建设大湾区。', role: 'System' }
    ],
    isGameStarted: false,
    startTime: 0,
    totalRevenueAccumulated: 0,
  });

  const [showScience, setShowScience] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<{name: string, description: string, effect: string} | null>(null);
  const [showSettlement, setShowSettlement] = useState<SettlementData | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [turnFlash, setTurnFlash] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) setHasSave(true);
  }, []);

  useEffect(() => {
    if (gameState.isGameStarted) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleLoadSave = () => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as GameState;
        setGameState({ ...parsed, isGameStarted: true, startTime: Date.now() - (parsed.turn * 1000) });
        setHasSave(false);
      } catch (e) {
        alert("存档数据损坏。");
        localStorage.removeItem(SAVE_KEY);
      }
    }
  };

  const formatGameTime = (hours: number) => {
    const startHour = 8;
    const totalHours = startHour + hours;
    const day = Math.floor(totalHours / 24) + 1;
    const hour = totalHours % 24;
    return { day, time: `${hour.toString().padStart(2, '0')}:00` };
  };

  const gameTime = useMemo(() => formatGameTime(gameState.turn), [gameState.turn]);

  useEffect(() => {
    if (gameState.isGameStarted && !showSettlement) {
      const interval = setInterval(async () => {
        const roles = Object.values(Role);
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        if (randomRole !== gameState.currentRole) {
            const content = await simulateChat(randomRole);
            setGameState(prev => ({
                ...prev,
                messages: [...prev.messages.slice(-15), {
                    id: Date.now().toString(),
                    sender: randomRole.split(' ')[1],
                    content,
                    role: randomRole
                }]
            }));
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [gameState.isGameStarted, gameState.currentRole, showSettlement]);

  const handleRoleSelect = (role: Role) => {
    if (localStorage.getItem(SAVE_KEY)) {
      if (!window.confirm("发现已有管理记录，开启新生涯将覆盖旧存档。是否继续？")) return;
    }
    setGameState({ 
      funds: INITIAL_FUNDS,
      reputation: 50,
      techPoints: 0,
      influencePoints: INITIAL_INFLUENCE,
      turn: 0, 
      currentRole: role, 
      buildings: [],
      environmentalIndex: 85,
      happinessIndex: 75,
      messages: [{ id: '1', sender: '系统', content: `【${role}】身份已激活。初始影响积分：${INITIAL_INFLUENCE}。管理记录已重置。`, role: 'System' }],
      isGameStarted: true, 
      startTime: Date.now(),
      totalRevenueAccumulated: 0,
    });
  };

  const handleNextTurn = useCallback(async () => {
    if (gameState.turn >= MAX_SESSION_HOURS) {
        handleSettlement();
        return;
    }
    setTurnFlash(true);
    setTimeout(() => setTurnFlash(false), 500);
    const event = await generateEvent();
    setCurrentEvent(event);
    setGameState(prev => {
      let turnTech = 0;
      let turnEnv = 0;
      let turnHappy = 0;
      const updatedBuildings = prev.buildings.map(b => {
        if (b.status === 'constructing') {
          const nextTurnsLeft = b.constructionTurnsLeft - 1;
          if (nextTurnsLeft <= 0) return { ...b, status: 'active', constructionTurnsLeft: 0 } as Building;
          return { ...b, constructionTurnsLeft: nextTurnsLeft };
        }
        turnTech += b.techBonus;
        turnEnv += b.envImpact;
        turnHappy += b.happyBonus;
        return b;
      });
      const activeBuildings = updatedBuildings.filter(b => b.status === 'active');
      const revenue = activeBuildings.reduce((acc, b) => acc + b.revenuePerTurn, 0);
      return {
        ...prev,
        turn: prev.turn + 1,
        funds: prev.funds + revenue,
        techPoints: Math.max(0, prev.techPoints + turnTech),
        environmentalIndex: Math.min(100, Math.max(0, prev.environmentalIndex + (turnEnv / 10))),
        happinessIndex: Math.min(100, Math.max(0, prev.happinessIndex + (turnHappy / 10))),
        totalRevenueAccumulated: prev.totalRevenueAccumulated + revenue,
        buildings: updatedBuildings,
        messages: [...prev.messages, { id: Date.now().toString(), sender: '系统', content: `【时间流转】${event.name}发生。本小时净产值：¥${(revenue/10000).toFixed(1)}万`, role: 'System' }]
      }
    });
  }, [gameState.turn]);

  const handleExecuteAction = (actionId: string, payload: any) => {
    if (payload.influence && gameState.influencePoints + payload.influence < 0) return alert("积分不足以支付此项决定。");
    if (payload.funds && gameState.funds + payload.funds < 0) return alert("资产余额不足。");

    setGameState(prev => {
      const newFunds = prev.funds + (payload.funds || 0);
      const newInfluence = prev.influencePoints + (payload.influence || 0);
      const newTech = prev.techPoints + (payload.tech || 0);
      const newEnv = Math.min(100, Math.max(0, prev.environmentalIndex + (payload.env || 0)));
      
      let msg = `【决策反馈】成功执行了 ${actionId} 模块的相关指令。`;
      if (actionId === 'approve_policy') msg = `【政令发布】新法案已签署并推行，全局指标已更新。`;
      if (actionId === 'trade_cash') msg = `【资金运作】通过积分成功支取 ¥500万 流动资金。`;
      if (actionId.startsWith('research')) msg = `【科技突破】前沿实验室取得重大进展，科技实力增强。`;
      
      return {
        ...prev,
        funds: newFunds,
        influencePoints: newInfluence,
        techPoints: newTech,
        environmentalIndex: newEnv,
        messages: [...prev.messages, { id: `决策-${Date.now()}`, sender: '调度中心', content: msg, role: 'System' }]
      }
    });
    
    setActiveAction(null);
  };

  const handleSettlement = () => {
    const data: SettlementData = {
      role: gameState.currentRole!,
      duration: `${Math.floor((Date.now() - gameState.startTime) / 60000)}分`,
      totalRevenue: gameState.totalRevenueAccumulated,
      finalFunds: gameState.funds,
      buildingCount: gameState.buildings.length,
      turnCount: gameState.turn,
      finalTech: gameState.techPoints,
      finalEnv: Math.round(gameState.environmentalIndex),
      finalInfluence: gameState.influencePoints,
      performanceRank: gameState.environmentalIndex > 85 && gameState.influencePoints > 1200 ? '深海领袖' : '蓝海先锋'
    };
    setShowSettlement(data);
    localStorage.removeItem(SAVE_KEY);
  };

  const resetGame = useCallback(() => {
    setGameState({
      funds: INITIAL_FUNDS,
      reputation: 50,
      techPoints: 0,
      influencePoints: INITIAL_INFLUENCE,
      turn: 0, 
      currentRole: null,
      buildings: [],
      environmentalIndex: 85,
      happinessIndex: 75,
      messages: [{ id: '1', sender: '系统', content: '欢迎来到蔚蓝之城！请选择你的身份开始建设大湾区。', role: 'System' }],
      isGameStarted: false,
      startTime: 0,
      totalRevenueAccumulated: 0,
    });
    setShowSettlement(null);
    setShowScience(null);
    setCurrentEvent(null);
    localStorage.removeItem(SAVE_KEY);
  }, []);

  const handleScienceComplete = (rewardPoints: number) => {
    setGameState(prev => ({
        ...prev,
        influencePoints: prev.influencePoints + rewardPoints,
        messages: [...prev.messages, { id: `研学-${Date.now()}`, sender: '科学院', content: `科普研学完成，获得 ${rewardPoints} 点影响积分奖励。`, role: 'System' }]
    }));
    setShowScience(null);
  };

  const addBuilding = (zoneId: number, template: BuildingTemplate) => {
    if (gameState.funds < template.cost) return alert("资产余额不足。");
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return;
    const compat = ZONE_COMPATIBILITY[zone.type]?.[template.type] || { revenueMul: 1.0, techMul: 1.0, envPenalty: 5 };
    let penaltyApplied = 0;
    if (compat.warning) {
        if (!window.confirm(`【兼容性预警】\n${compat.warning}\n\n强行开工将消耗 ${WRONG_DECISION_PENALTY} 额外积分。确认吗？`)) return;
        if (gameState.influencePoints < WRONG_DECISION_PENALTY) return alert("积分不足。");
        penaltyApplied = WRONG_DECISION_PENALTY;
    }
    setShowScience(template.name);
    const newBuilding: Building = {
      id: Math.random().toString(36).substr(2, 9),
      type: template.type,
      name: template.name,
      level: 1,
      zoneId,
      cost: template.cost,
      revenuePerTurn: template.baseRevenue * (compat.revenueMul || 1),
      techBonus: template.baseTechBonus * (compat.techMul || 1),
      envImpact: template.baseEnvImpact - (compat.envPenalty || 0),
      happyBonus: template.baseHappyBonus,
      status: 'constructing',
      constructionTurnsLeft: template.buildTime,
      totalConstructionTurns: template.buildTime
    };
    setGameState(prev => ({
      ...prev,
      funds: prev.funds - template.cost,
      influencePoints: prev.influencePoints - penaltyApplied,
      buildings: [...prev.buildings, newBuilding],
      messages: [...prev.messages, { id: `建设-${Date.now()}`, sender: '系统', content: `项目【${template.name}】开工。${penaltyApplied > 0 ? `扣除决策积分 ${penaltyApplied}。` : ''}`, role: 'System' }]
    }));
  };

  const handleAccelerate = useCallback((buildingId: string) => {
    if (gameState.influencePoints < ACCELERATION_COST) {
      alert("影响积分不足，无法执行工期加速。");
      return;
    }

    setGameState(prev => {
      const buildings = prev.buildings.map(b => 
        (b.id === buildingId && b.status === 'constructing')
          ? { ...b, status: 'active' as const, constructionTurnsLeft: 0 } as Building
          : b
      );

      return {
        ...prev,
        influencePoints: prev.influencePoints - ACCELERATION_COST,
        buildings,
        messages: [...prev.messages, { 
          id: `加速-${Date.now()}`, 
          sender: '调度中心', 
          content: '项目已获准采用快速交付协议，即刻投入运营。', 
          role: 'System' 
        }]
      };
    });
  }, [gameState.influencePoints]);

  const handleShowTechTree = useCallback(() => {
    console.log("--- 《蔚蓝之城》大湾区科技树系统 ---");
    console.log(`当前科技感累积: ${gameState.techPoints}`);
    console.log("核心技术路径规划:");
    console.log("1. [已启动] 深海能源网 (当前贡献: +25%)");
    console.log("2. [进行中] 港口自动感知 AI (研发进度: 45%)");
    console.log("3. [待解锁] 海洋生物制药基因编辑 (需要科技感 > 500)");
    console.log("-----------------------------------");
    
    setGameState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: `科技树-${Date.now()}`,
        sender: '科学院',
        content: `【情报】已调取当前研发链路图，核心突破口在于：${gameState.techPoints > 500 ? '深潜器耐压材料' : '基础动力电池'}。`,
        role: 'System'
      }]
    }));
  }, [gameState.techPoints]);

  if (!gameState.isGameStarted) {
    const currentBg = (hoveredRole && ROLE_BACKGROUNDS[hoveredRole]) || ROLE_BACKGROUNDS.default;
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center transition-all duration-1000 ease-in-out relative overflow-hidden"
        style={{ backgroundImage: `url('${currentBg}')` }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"></div>
        <div className="glass-panel p-16 rounded-[4rem] text-center border-2 border-blue-400/30 animate-wave max-w-5xl shadow-2xl z-10 relative">
            <h1 className="text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl italic">蔚蓝之城</h1>
            <h2 className="text-3xl text-blue-200 mb-12 font-light uppercase tracking-[0.6em] drop-shadow-lg text-center font-montserrat">Pearl River Delta Legend</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {Object.values(Role).map(role => (
                <button key={role} onMouseEnter={() => setHoveredRole(role)} onMouseLeave={() => setHoveredRole(null)} onClick={() => handleRoleSelect(role)}
                  className="group p-6 rounded-3xl bg-white/10 hover:bg-blue-500/80 text-white transition-all border border-white/20 hover:scale-105 active:scale-95 shadow-xl">
                  <div className="text-4xl mb-2 transition-transform group-hover:rotate-12">{role.split(' ')[0]}</div>
                  <div className="text-sm font-black">{role.split(' ')[1]}</div>
                </button>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button onClick={() => hoveredRole && handleRoleSelect(hoveredRole as Role)}
                  className={`px-16 py-6 rounded-full shadow-2xl font-black tracking-widest transition-all text-xl uppercase ${hoveredRole ? 'bg-blue-600 text-white scale-105 ring-4 ring-blue-400/50' : 'bg-gray-500/50 text-white/50 cursor-not-allowed'}`}>
                开启新生涯
              </button>
              {hasSave && (
                <button onClick={handleLoadSave}
                    className="px-16 py-6 rounded-full shadow-2xl font-black tracking-widest transition-all text-xl uppercase bg-yellow-500 text-black hover:scale-105 hover:bg-yellow-400 ring-4 ring-yellow-400/50 animate-pulse">
                  载入管理记录
                </button>
              )}
            </div>
            <p className="mt-8 text-white/40 text-[10px] font-bold tracking-widest uppercase italic">"Data persists on this device automatically."</p>
        </div>
      </div>
    );
  }

  const sessionProgress = (gameState.turn / MAX_SESSION_HOURS) * 100;

  return (
    <div className={`h-screen w-screen flex flex-col bg-[#050B1A] text-blue-50 overflow-hidden select-none transition-colors duration-500 ${turnFlash ? 'bg-blue-900/40' : ''}`}>
      <div className="h-1.5 w-full bg-blue-900/30 relative z-[60]">
         <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
           style={{ width: `${sessionProgress}%` }}></div>
      </div>
      <header className="h-20 glass-panel border-b border-blue-400/20 flex items-center justify-between px-10 z-50">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-black bg-gradient-to-br from-white to-blue-400 bg-clip-text text-transparent italic tracking-wider">终端：珠江口</h1>
          <div className="flex gap-10 text-sm font-black">
            <div className="flex flex-col"><span className="text-[10px] opacity-40 uppercase tracking-widest">流动资金</span><span className="text-yellow-400 font-mono text-lg">¥{(gameState.funds / 10000).toFixed(0)}万</span></div>
            <div className="flex flex-col"><span className="text-[10px] opacity-40 uppercase tracking-widest">影响积分</span><span className="text-purple-400 font-mono text-lg">{gameState.influencePoints}</span></div>
            <div className="flex flex-col"><span className="text-[10px] opacity-40 uppercase tracking-widest">当前时间</span><span className="text-blue-300 font-mono text-lg">第{gameTime.day}天 {gameTime.time}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-8 border-l border-white/10 pl-8">
            <div className="flex flex-col items-center"><span className="text-purple-400 font-bold font-mono">{gameState.techPoints}</span><span className="text-[8px] opacity-40 font-black">科技感</span></div>
            <div className="flex flex-col items-center"><span className="text-green-400 font-bold font-mono">{Math.round(gameState.environmentalIndex)}%</span><span className="text-[8px] opacity-40 font-black">生态率</span></div>
            <div className="flex flex-col items-center"><span className="text-pink-400 font-bold font-mono">{Math.round(gameState.happinessIndex)}%</span><span className="text-[8px] opacity-40 font-black">幸福度</span></div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleNextTurn} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl text-sm font-black shadow-2xl shadow-blue-500/20 transition-all active:scale-90 uppercase tracking-widest">
            推进下一小时
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="存档同步中"></div>
            <button onClick={handleSettlement} className="w-12 h-12 flex items-center justify-center bg-red-500/10 border border-red-500/30 hover:bg-red-500/30 rounded-2xl text-red-400 transition-all">
              <span className="text-xl">🚪</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <Sidebar gameState={gameState} onAccelerate={handleAccelerate} />
        <div className="flex-1 relative bg-[#020617] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50"></div>
          <InteractiveMap gameState={gameState} onBuild={addBuilding} />
          {currentEvent && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 glass-panel p-6 rounded-[2rem] border-t-4 border-t-yellow-400 animate-bounce max-w-xl z-40 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-yellow-400 text-lg uppercase tracking-tight">⚠️ 实时动态通报: {currentEvent.name}</h3>
                    <button onClick={() => setCurrentEvent(null)} className="text-white/20 hover:text-white">✕</button>
                  </div>
                  <p className="text-sm text-blue-100/80 leading-snug mb-3">{currentEvent.description}</p>
                  <div className="text-[11px] font-black text-green-400 uppercase tracking-widest bg-green-400/10 px-3 py-1 rounded-full inline-block">系统修正：{currentEvent.effect}</div>
              </div>
          )}
        </div>
        <RightPanel gameState={gameState} onRedeem={() => setActiveAction('trade')} />
      </main>
      <BottomBar onAction={(id: string) => {
        if (id === 'techtree') {
          handleShowTechTree();
        } else {
          setActiveAction(id);
        }
      }} />
      {activeAction && <ActionCenter type={activeAction} gameState={gameState} onClose={() => setActiveAction(null)} onExecute={handleExecuteAction} />}
      {showScience && <ScienceModal topic={showScience} onClose={handleScienceComplete} />}
      {showSettlement && <SettlementModal data={showSettlement} onClose={resetGame} />}
    </div>
  );
};

export default App;
