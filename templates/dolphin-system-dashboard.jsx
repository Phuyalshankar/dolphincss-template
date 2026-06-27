import React, { useState, useEffect } from 'react';
import { ub, map } from 'dolphincss/ub';
import { 
  Cpu, HardDrive, Thermometer, Battery, Menu, Search, Bell, 
  ChevronRight, TrendingUp, Activity, Users, Settings, RefreshCw,
  Terminal, Shield, Clock, Info
} from 'lucide-react';

export default function DolphinSystemDashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dolphin');
  const [themeMode, setThemeMode] = useState(localStorage.getItem('theme-mode') || 'dark');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/system-stats');
      const data = await res.json();
      setStats(data);
      if (data.load && data.load.currentLoad !== undefined) {
        setHistory(prev => {
          const next = [...prev.slice(1), data.load.currentLoad];
          return next;
        });
      }
    } catch (e) {
      console.error("Failed to fetch system stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
    const timer = setInterval(fetchStats, 1500);
    return () => clearInterval(timer);
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-background text-foreground flex-center flex-col gap-6">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin glow"></div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-wide">DolphinCSS Monitor</h2>
          <p className="opacity-40 text-sm mt-1">Connecting to hardware API...</p>
        </div>
      </div>
    );
  }

  const { cpu, mem, load, temp, battery, processes } = stats;

  const totalRAM = (mem.total / (1024 ** 3)).toFixed(1);
  const usedRAM = (mem.used / (1024 ** 3)).toFixed(1);
  const freeRAM = (mem.free / (1024 ** 3)).toFixed(1);
  const ramPercentage = parseFloat(((mem.used / mem.total) * 100).toFixed(1));

  const currentCpuLoad = load.currentLoad !== undefined ? parseFloat(load.currentLoad.toFixed(1)) : 0;
  const cpuTemp = temp.main !== null && temp.main !== undefined ? parseFloat(temp.main.toFixed(1)) : 0;
  const batteryPercent = battery.percent !== undefined ? battery.percent : 100;
  
  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m`;
  };

  const svgWidth = 460;
  const svgHeight = 130;
  const chartPoints = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * svgWidth;
    const y = svgHeight - 5 - (val / 100) * (svgHeight - 10);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const areaPoints = `M 0,${svgHeight} L ${chartPoints.join(' L ')} L ${svgWidth},${svgHeight} Z`;
  const linePoints = chartPoints.join(' ');

  const filteredProcesses = processes.list
    ? processes.list
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 7)
    : [];

  const getBackgroundClass = () => {
    if (theme === 'danphe') return 'bg-danphe';
    return 'bg-sagarmatha';
  };

  return (
    <div className={`min-h-screen flex overflow-hidden font-sans transition-all duration-700 ${getBackgroundClass()}`}>
      <div className={`flex w-full min-h-screen overflow-hidden ${themeMode === 'dark' ? 'bg-slate-950/40 text-white' : 'bg-white/10 text-slate-900'}`}>
        
        {/* Sidenav */}
        <aside className="glass border-r border-white/10 flex flex-col transition-all duration-300 shrink-0 w-60" style={{ backdropFilter: 'blur(24px)', width: sidebarOpen ? '240px' : '64px' }}>
          <div className="flex-between p-4 border-b border-white/10">
            {sidebarOpen && (
              <div className="flex-left gap-2 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex-center shadow-lg shadow-indigo-500/30">🐬</div>
                <span className="font-bold text-sm tracking-tight">DolphinMonitor</span>
              </div>
            )}
            {!sidebarOpen && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex-center shadow-lg mx-auto">🐬</div>
            )}
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="opacity-60 hover:opacity-100 transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                <Menu size={16} />
              </button>
            )}
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="opacity-60 hover:opacity-100 transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer mx-auto mt-2">
                <Menu size={16} />
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1.5 p-3 flex-grow">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Cpu },
              { id: 'specs', label: 'System Specs', icon: Info },
              { id: 'processes', label: 'Processes', icon: Terminal },
              { id: 'security', label: 'Security', icon: Shield }
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left w-full ${active ? 'bg-indigo-600/20 border border-indigo-500/30 font-medium shadow-md' : 'border border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                >
                  <Icon size={18} className={active ? 'text-indigo-500' : ''} />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/10">
            <div className="flex-left gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex-center font-bold text-xs text-indigo-500">SYS</div>
              {sidebarOpen && (
                <div className="min-w-0 animate-fade-in">
                  <p className="text-xs font-bold truncate">{cpu.manufacturer || 'System'}</p>
                  <p className="opacity-50 text-xs truncate">Host: {cpu.brand ? cpu.brand.split(' ')[0] : 'Windows'}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col overflow-y-auto" style={{ minWidth: 0 }}>
          <header className="flex-between flex-wrap gap-4 p-6 border-b border-white/10 bg-surface/20">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                System Admin Dashboard <span className="circle xs bg-emerald-500 inline-block animate-pulse"></span>
              </h1>
              <p className="opacity-50 text-xs mt-0.5">Windows PC Monitoring Center · Live Updates</p>
            </div>
            
            <div className="flex-right gap-3">
              <div className="flex-left gap-2 bg-surface/40 border border-white/10 px-3 py-1.5 rounded-xl w-60">
                <Search size={14} className="opacity-40" />
                <input 
                  type="text" 
                  placeholder="Search processes..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs w-full focus:outline-none placeholder:opacity-20"
                />
              </div>
              <button onClick={fetchStats} className="p-2 glass rounded-xl border border-white/10 opacity-70 hover:opacity-100 transition-all cursor-pointer">
                <RefreshCw size={16} className="animate-hover-spin" />
              </button>
            </div>
          </header>

          <div className="p-6 flex flex-col gap-6 flex-grow">
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* CPU Card */}
                  <div className="card p-5 rounded-2xl border border-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-500 relative overflow-hidden bg-surface">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">CPU Load</span>
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                        <Cpu size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black mb-2">{currentCpuLoad}%</p>
                    <div className="flex-between text-xs opacity-60 mb-2">
                      <span>{cpu.cores} Cores @ {cpu.speed}GHz</span>
                      <span>Load Rate</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800/10 dark:bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${ub(map.heat(currentCpuLoad, 0, 100))}`} style={{ width: `${currentCpuLoad}%` }}></div>
                    </div>
                  </div>

                  {/* RAM Card */}
                  <div className="card p-5 rounded-2xl border border-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-500 relative overflow-hidden bg-surface">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">Memory (RAM)</span>
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <HardDrive size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black mb-2">{ramPercentage}%</p>
                    <div className="flex-between text-xs opacity-60 mb-2">
                      <span>{usedRAM} GB / {totalRAM} GB</span>
                      <span>Used</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800/10 dark:bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${ub(map.heat(ramPercentage, 0, 100))}`} style={{ width: `${ramPercentage}%` }}></div>
                    </div>
                  </div>

                  {/* Temp Card */}
                  <div className="card p-5 rounded-2xl border border-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-500 relative overflow-hidden bg-surface">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">CPU Temp</span>
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                        <Thermometer size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black mb-2">{cpuTemp > 0 ? `${cpuTemp} °C` : 'N/A'}</p>
                    <div className="flex-between text-xs opacity-60 mb-2">
                      <span>Thermal Limit: 85°C</span>
                      <span>Status</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800/10 dark:bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${cpuTemp > 0 ? ub(map.heat(cpuTemp, 30, 85)) : 'bg-gray-500'}`} style={{ width: `${cpuTemp > 0 ? (cpuTemp / 85) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Battery Card */}
                  <div className="card p-5 rounded-2xl border border-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-500 relative overflow-hidden bg-surface">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">Battery Status</span>
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                        <Battery size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black mb-2">{batteryPercent}%</p>
                    <div className="flex-between text-xs opacity-60 mb-2">
                      <span>{battery.isCharging ? '🔌 Plugged In' : '🔋 Discharging'}</span>
                      <span>Capacity</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800/10 dark:bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${battery.isCharging ? 'bg-indigo-500' : ub(map.heat(100 - batteryPercent, 0, 100))}`} style={{ width: `${batteryPercent}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* SVG Chart */}
                  <div className="glass p-5 rounded-2xl border border-white/10 lg:col-span-2 flex flex-col bg-surface">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-sm">Real-time CPU Utilization</h4>
                        <p className="opacity-50 text-xs">Live chart updates every 1.5 seconds</p>
                      </div>
                      <span className="text-xs bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 px-2 py-0.5 rounded-md font-semibold">Active</span>
                    </div>
                    
                    <div className="w-full mt-auto">
                      <svg viewBox="0 0 460 130" className="w-full overflow-visible" style={{ height: '130px' }}>
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(99,102,241,0.4)" />
                            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                          </linearGradient>
                          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                        
                        {[0, 32, 65, 97, 130].map(y => (
                          <line key={y} x1="0" y1={y} x2="460" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        ))}
                        
                        <path d={areaPoints} fill="url(#areaGrad)" />
                        <polyline points={linePoints} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {history.map((val, idx) => {
                          const x = (idx / (history.length - 1)) * svgWidth;
                          const y = svgHeight - 5 - (val / 100) * (svgHeight - 10);
                          return (
                            <circle key={idx} cx={x} cy={y} r="3" fill="#6366f1" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Summary Specs */}
                  <div className="glass p-5 rounded-2xl border border-white/10 flex flex-col gap-4 bg-surface">
                    <h4 className="font-bold text-sm">System Specs Summary</h4>
                    <div className="flex flex-col gap-3 flex-grow justify-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-800/10 text-indigo-500">
                          <Cpu size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="opacity-40 text-xxs uppercase tracking-wider">Processor</p>
                          <p className="text-xs font-bold truncate">{cpu.brand}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-800/10 text-emerald-500">
                          <HardDrive size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="opacity-40 text-xxs uppercase tracking-wider">Installed RAM</p>
                          <p className="text-xs font-bold">{totalRAM} GB Virtual memory</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-800/10 text-amber-500">
                          <Clock size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="opacity-40 text-xxs uppercase tracking-wider">System Uptime</p>
                          <p className="text-xs font-bold">{formatUptime(stats.processes.list ? stats.processes.list[0]?.uptime || 3600 : 3600)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processes Table */}
                <div className="glass p-5 rounded-2xl border border-white/10 bg-surface">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-sm">Active System Processes</h4>
                      <p className="opacity-40 text-xs">Sorted by CPU consumption (Top 7)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold animate-pulse">Monitor</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr class="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                          <th className="pb-3 font-medium">Process Name</th>
                          <th className="pb-3 font-medium">PID</th>
                          <th className="pb-3 font-medium">CPU Utilization</th>
                          <th className="pb-3 font-medium">RAM Utilization</th>
                          <th className="pb-3 font-medium">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProcesses.map((p, idx) => (
                          <tr key={p.pid + '-' + idx} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                            <td className="py-3 font-semibold text-indigo-500">{p.name}</td>
                            <td className="py-3 opacity-60">{p.pid}</td>
                            <td className="py-3 font-bold">{p.cpu.toFixed(1)}%</td>
                            <td className="py-3">{p.mem.toFixed(1)}%</td>
                            <td className="py-3 opacity-80">{p.user || 'SYSTEM'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'specs' && (
              <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6 bg-surface">
                <h3 className="text-lg font-bold">System Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <h4 className="text-indigo-500 font-bold text-sm flex items-center gap-2">
                      <Cpu size={16} /> Processor Info
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="opacity-40">Manufacturer</p>
                        <p className="font-semibold mt-0.5">{cpu.manufacturer}</p>
                      </div>
                      <div>
                        <p className="opacity-40">Model/Brand</p>
                        <p className="font-semibold mt-0.5">{cpu.brand}</p>
                      </div>
                      <div>
                        <p className="opacity-40">Cores / Threads</p>
                        <p className="font-semibold mt-0.5">{cpu.cores} Physical Cores</p>
                      </div>
                      <div>
                        <p className="opacity-40">Clock Speed</p>
                        <p className="font-semibold mt-0.5">{cpu.speed} GHz</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <h4 className="text-emerald-500 font-bold text-sm flex items-center gap-2">
                      <HardDrive size={16} /> Memory (RAM) Info
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="opacity-40">Total Memory</p>
                        <p className="font-semibold mt-0.5">{totalRAM} GB</p>
                      </div>
                      <div>
                        <p className="opacity-40">Used Memory</p>
                        <p className="font-semibold mt-0.5">{usedRAM} GB</p>
                      </div>
                      <div>
                        <p className="opacity-40">Free Memory</p>
                        <p className="font-semibold mt-0.5">{freeRAM} GB</p>
                      </div>
                      <div>
                        <p className="opacity-40">Active State</p>
                        <p className="font-semibold mt-0.5">{(mem.active / (1024 ** 3)).toFixed(1)} GB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'processes' && (
              <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-4 bg-surface">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Process Explorer</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                        <th className="pb-3 font-medium">Process Name</th>
                        <th className="pb-3 font-medium">PID</th>
                        <th className="pb-3 font-medium">CPU %</th>
                        <th className="pb-3 font-medium">Mem %</th>
                        <th className="pb-3 font-medium">Command</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {processes.list && processes.list
                        .sort((a, b) => b.cpu - a.cpu)
                        .slice(0, 15)
                        .map((p, idx) => (
                          <tr key={p.pid + '-' + idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-2.5 font-semibold text-indigo-500">{p.name}</td>
                            <td className="py-2.5 opacity-60">{p.pid}</td>
                            <td className="py-2.5 font-bold">{p.cpu.toFixed(1)}%</td>
                            <td className="py-2.5">{p.mem.toFixed(1)}%</td>
                            <td className="py-2.5 opacity-40 truncate max-w-xs">{p.command || 'SYSTEM'}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-4 bg-surface">
                <h3 className="text-lg font-bold">System Security Status</h3>
                <div className="p-8 text-center bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-3">
                  <Shield size={48} className="text-emerald-500 glow" />
                  <h4 className="font-bold mt-2">Windows Security Active</h4>
                  <p className="opacity-40 text-sm max-w-md">Your OS security features are monitored. Anti-virus databases are active and firewall ports are fully secured.</p>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Floating Theme Bar */}
        <div>
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass bg-surface/60 backdrop-blur-2xl border border-border/50 p-1.5 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:bg-surface/80">
            <div className="flex items-center bg-surface-dark/10 rounded-full p-1 border border-white/10 shadow-inner">
              <button
                onClick={() => {
                  document.documentElement.setAttribute('data-theme', 'dolphin');
                  localStorage.setItem('theme', 'dolphin');
                  setTheme('dolphin');
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xl hover:bg-primary/20 hover:scale-110 transition-all focus:outline-none"
                title="Dolphin Theme"
              >
                🐬
              </button>
              <button
                onClick={() => {
                  document.documentElement.setAttribute('data-theme', 'danphe');
                  localStorage.setItem('theme', 'danphe');
                  setTheme('danphe');
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xl hover:bg-danphe/20 hover:scale-110 transition-all focus:outline-none"
                title="Danphe Theme"
              >
                🦚
              </button>
            </div>
            
            <div className="w-px h-7 bg-border/50 mx-1"></div>
            
            <div className="flex items-center bg-surface-dark/10 rounded-full p-1 border border-white/10 shadow-inner">
              <button
                onClick={() => {
                  document.documentElement.setAttribute('data-theme-mode', 'light');
                  localStorage.setItem('theme-mode', 'light');
                  setThemeMode('light');
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-text hover:bg-warning/20 hover:text-warning-500 hover:scale-110 transition-all focus:outline-none"
                title="Light Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
                </svg>
              </button>
              <button
                onClick={() => {
                  document.documentElement.setAttribute('data-theme-mode', 'dark');
                  localStorage.setItem('theme-mode', 'dark');
                  setThemeMode('dark');
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-text hover:bg-primary/20 hover:text-primary-400 hover:scale-110 transition-all focus:outline-none"
                title="Dark Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
