import React from 'react';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isNewYear, setIsNewYear] = React.useState(false);

  React.useEffect(() => {
    // Alvo: 01 de Janeiro de 2026
    const targetDate = new Date(`January 1, 2026 00:00:00`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsNewYear(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setIsNewYear(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full py-32 md:py-48 overflow-hidden flex flex-col items-center justify-center bg-transparent">
        
        {/* Background Elements (Theme Aware) */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] border border-slate-300 dark:border-white/5 rounded-full opacity-30 dark:opacity-20 animate-[spin_120s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[700px] h-[400px] md:h-[700px] border border-slate-300 dark:border-white/5 rounded-full opacity-40 dark:opacity-30 animate-[spin_80s_linear_infinite_reverse]"></div>
        </div>

        {isNewYear ? (
           <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-in zoom-in-90 duration-1000 slide-in-from-bottom-10">
               
               <div className="mb-6 flex flex-col items-center">
                   <span className="text-xs md:text-sm font-bold uppercase tracking-[0.6em] text-slate-500 dark:text-amber-500/80 mb-4 animate-pulse">
                       O Futuro Chegou
                   </span>
                   <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
               </div>

               <h2 className="text-5xl md:text-9xl font-editorial font-bold text-slate-900 dark:text-white leading-none mb-2 drop-shadow-xl">
                   BEM-VINDO
               </h2>
               
               <div className="relative inline-block">
                    <h3 className="text-6xl md:text-[10rem] font-editorial italic text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 leading-none pb-4 drop-shadow-2xl animate-[pulse_3s_infinite]">
                        2026
                    </h3>
                    
                    {/* Decorative Stars */}
                    <div className="absolute -top-4 -right-8 w-8 h-8 text-amber-400 animate-spin-slow">
                         <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10z"/></svg>
                    </div>
                    <div className="absolute -bottom-4 -left-8 w-6 h-6 text-amber-400 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
                         <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10z"/></svg>
                    </div>
               </div>

               <p className="mt-8 text-lg md:text-2xl font-light text-slate-600 dark:text-gray-300 tracking-wide max-w-2xl mx-auto leading-relaxed">
                   "A excelência não é um ato, mas um hábito. Que este novo ciclo na <span className="font-bold text-slate-900 dark:text-amber-500">RCC</span> seja o palco da sua maior vitória."
               </p>

               <div className="mt-12 flex justify-center gap-6 opacity-80">
                   <div className="w-16 h-[1px] bg-slate-400 dark:bg-white/20 my-auto"></div>
                   <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-gray-500">Polícia RCC</span>
                   <div className="w-16 h-[1px] bg-slate-400 dark:bg-white/20 my-auto"></div>
               </div>
           </div>
        ) : (
            <>
                <div className="relative z-10 mb-16 md:mb-20 text-center px-4">
                    <h3 className="text-3xl md:text-6xl text-slate-900 dark:text-white font-editorial tracking-wide">
                        Contagem <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-300 dark:to-amber-600">Final</span>
                    </h3>
                </div>

                <div className="flex flex-wrap justify-center items-center relative z-10 gap-2 md:gap-0">
                    
                    <div className="flex flex-col items-center mx-2 md:mx-6 group cursor-default">
                        <span className="text-5xl md:text-9xl font-editorial text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-500 drop-shadow-xl tabular-nums">
                            {timeLeft.days.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-500 dark:text-gray-500 mt-2 md:mt-4 border-t border-slate-300 dark:border-white/10 pt-3 w-full text-center">Dias</span>
                    </div>

                    <span className="text-3xl md:text-7xl text-amber-500/40 font-light -mt-8 md:-mt-10">:</span>

                    <div className="flex flex-col items-center mx-2 md:mx-6 group cursor-default">
                        <span className="text-5xl md:text-9xl font-editorial text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-500 drop-shadow-xl tabular-nums">
                            {timeLeft.hours.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-500 dark:text-gray-500 mt-2 md:mt-4 border-t border-slate-300 dark:border-white/10 pt-3 w-full text-center">Horas</span>
                    </div>

                    <span className="text-3xl md:text-7xl text-amber-500/40 font-light -mt-8 md:-mt-10">:</span>

                    <div className="flex flex-col items-center mx-2 md:mx-6 group cursor-default">
                        <span className="text-5xl md:text-9xl font-editorial text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-500 drop-shadow-xl tabular-nums">
                            {timeLeft.minutes.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-500 dark:text-gray-500 mt-2 md:mt-4 border-t border-slate-300 dark:border-white/10 pt-3 w-full text-center">Min</span>
                    </div>

                    <span className="text-3xl md:text-7xl text-amber-500/40 font-light -mt-8 md:-mt-10">:</span>

                    <div className="flex flex-col items-center mx-2 md:mx-6 group cursor-default relative">
                        <span className="text-5xl md:text-9xl font-editorial text-transparent bg-clip-text bg-gradient-to-b from-amber-500 to-amber-800 dark:from-amber-300 dark:to-amber-600 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-pulse tabular-nums">
                            {timeLeft.seconds.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-amber-700 dark:text-amber-500 mt-2 md:mt-4 border-t border-amber-500/30 pt-3 w-full text-center font-bold">Seg</span>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default Countdown;