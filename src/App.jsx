import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Gamepad2, 
  X, 
  Maximize2, 
  ExternalLink, 
  ChevronLeft, 
  TrendingUp, 
  Star, 
  Clock, 
  Flame,
  LayoutGrid,
  Trophy,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentGames, setRecentGames] = useState([]);

  // Mock trending games
  const trendingGames = useMemo(() => gamesData.slice(0, 3), []);
  const featuredGame = gamesData[5] || gamesData[0];

  const categories = useMemo(() => {
    return ['All', ...new Set(gamesData.map(g => g.category))];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setRecentGames(prev => {
      const filtered = prev.filter(g => g.id !== game.id);
      return [game, ...filtered].slice(0, 4);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black">
      {/* Navigation Rail / Sidebar (Desktop) */}
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-[#0a0a0a] border-r border-white/5 hidden xl:flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Gamepad2 className="text-black w-7 h-7" />
        </div>
        <nav className="flex flex-col gap-6">
          <button className="p-3 rounded-xl bg-white/5 text-orange-500 hover:bg-white/10 transition-colors" title="Home">
            <LayoutGrid className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors" title="Trending">
            <TrendingUp className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors" title="Favorites">
            <Star className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors" title="Leaderboard">
            <Trophy className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="xl:pl-20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 xl:hidden">
              <Gamepad2 className="text-orange-500 w-8 h-8" />
              <h1 className="text-xl font-black italic uppercase tracking-tighter">Unblocked</h1>
            </div>

            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input
                type="text"
                placeholder="Search over 1,000+ unblocked games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder:text-white/20"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-white/60">12,402 Online</span>
              </div>
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-black text-sm">
                DP
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {!selectedGame ? (
              <motion.div
                key="library"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {/* Hero Section */}
                {!searchQuery && activeCategory === 'All' && (
                  <section className="relative h-[400px] rounded-3xl overflow-hidden group">
                    <img 
                      src={featuredGame.thumbnail} 
                      className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-orange-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Featured Game</span>
                        <span className="flex items-center gap-1 text-xs text-white/60"><Flame className="w-3 h-3 text-orange-500" /> Trending Now</span>
                      </div>
                      <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">{featuredGame.title}</h2>
                      <p className="text-white/60 text-lg mb-8 line-clamp-2">Experience the ultimate {featuredGame.category.toLowerCase()} challenge. Play the original unblocked version of {featuredGame.title} right here.</p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleSelectGame(featuredGame)}
                          className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-tight hover:bg-orange-500 transition-colors flex items-center gap-2"
                        >
                          Play Now <ExternalLink className="w-5 h-5" />
                        </button>
                        <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tight hover:bg-white/20 transition-colors">
                          Add to Favorites
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* Categories & Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${
                          activeCategory === cat 
                            ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Main Games Grid */}
                  <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <LayoutGrid className="text-orange-500" /> 
                        {activeCategory === 'All' ? 'Discover Games' : `${activeCategory} Games`}
                      </h3>
                      <span className="text-white/20 text-sm font-mono">{filteredGames.length} Games Available</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredGames.map((game) => (
                        <motion.div
                          key={game.id}
                          layoutId={game.id}
                          onClick={() => handleSelectGame(game)}
                          className="group relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer"
                          whileHover={{ y: -8 }}
                        >
                          <div className="aspect-[4/3] relative overflow-hidden">
                            <img
                              src={game.thumbnail}
                              alt={game.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            <div className="absolute top-4 right-4">
                              <button className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-orange-500 transition-colors">
                                <Star className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xl font-black italic uppercase tracking-tight group-hover:text-orange-500 transition-colors">{game.title}</h4>
                              <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded uppercase">{game.category}</span>
                            </div>
                            <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1.2k</span>
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> 4.8</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {filteredGames.length === 0 && (
                      <div className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Search className="w-16 h-16 text-white/10 mx-auto mb-6" />
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-2">No Games Found</h4>
                        <p className="text-white/40">Try searching for something else or browse categories.</p>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Variety */}
                  <div className="space-y-10">
                    {/* Recently Played */}
                    {recentGames.length > 0 && (
                      <section className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Recently Played
                        </h3>
                        <div className="space-y-3">
                          {recentGames.map(game => (
                            <div 
                              key={game.id}
                              onClick={() => handleSelectGame(game)}
                              className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                              <img src={game.thumbnail} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate group-hover:text-orange-500 transition-colors">{game.title}</p>
                                <p className="text-[10px] text-white/40 uppercase font-bold">{game.category}</p>
                              </div>
                              <ChevronLeft className="w-4 h-4 text-white/20 rotate-180" />
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Trending Sidebar */}
                    <section className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" /> Hot Right Now
                      </h3>
                      <div className="space-y-4">
                        {trendingGames.map((game, i) => (
                          <div 
                            key={game.id}
                            onClick={() => handleSelectGame(game)}
                            className="relative group cursor-pointer"
                          >
                            <div className="aspect-video rounded-2xl overflow-hidden border border-white/5">
                              <img src={game.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                <span className="text-[10px] font-black text-orange-500 uppercase mb-1">#{i + 1} Trending</span>
                                <h4 className="font-black italic uppercase tracking-tight text-lg leading-none">{game.title}</h4>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Community Stats */}
                    <section className="p-6 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 text-black">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Join the Hub</h3>
                      <p className="text-sm font-bold mb-6 opacity-80 leading-tight">Create an account to save progress, earn trophies, and compete on leaderboards.</p>
                      <button className="w-full py-3 bg-black text-white rounded-xl font-black uppercase tracking-tight text-sm hover:bg-black/80 transition-colors">
                        Sign Up Free
                      </button>
                    </section>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="flex flex-col h-[calc(100vh-140px)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group px-4 py-2 bg-white/5 rounded-xl border border-white/5"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Library</span>
                  </button>
                  
                  <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{selectedGame.title}</h2>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">{selectedGame.category}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60">
                      <Star className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60"
                      onClick={() => {
                        const iframe = document.getElementById('game-frame');
                        if (iframe?.requestFullscreen) iframe.requestFullscreen();
                      }}
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedGame(null)}
                      className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-black rounded-[32px] overflow-hidden border border-white/10 relative shadow-2xl shadow-orange-500/5">
                  <iframe
                    id="game-frame"
                    src={selectedGame.iframeUrl}
                    className="w-full h-full border-none"
                    title={selectedGame.title}
                    allow="fullscreen"
                  />
                </div>
                
                <div className="mt-6 flex items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-white/10 flex items-center justify-center overflow-hidden">
                          <img src={`https://picsum.photos/seed/user${i}/40/40`} referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-[#050505] bg-orange-500 flex items-center justify-center text-[10px] font-black text-black">
                        +82
                      </div>
                    </div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Playing with 86 others</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Network Status</p>
                      <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Optimal Connection</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 mt-20">
          <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Gamepad2 className="text-orange-500 w-8 h-8" />
                <h1 className="text-xl font-black italic uppercase tracking-tighter">Unblocked</h1>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">The world's most advanced unblocked games platform. Built for performance, designed for gamers.</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white/20">Navigation</h4>
              <ul className="space-y-2 text-sm font-bold text-white/60">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Library</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Trending</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Leaderboards</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white/20">Support</h4>
              <ul className="space-y-2 text-sm font-bold text-white/60">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Report Bug</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white/20">Newsletter</h4>
              <div className="flex gap-2">
                <input type="text" placeholder="Email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500/50 flex-1" />
                <button className="bg-orange-500 text-black px-4 py-2 rounded-xl font-black uppercase text-xs">Join</button>
              </div>
            </div>
          </div>
          <div className="max-w-[1600px] mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            <p>&copy; 2026 Unblocked Games Hub. All Rights Reserved.</p>
            <div className="flex gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
