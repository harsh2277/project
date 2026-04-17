import React from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  CheckSquare, Users, Plus, Calendar as CalendarIcon,
  HelpCircle, PieChart, Clock, ChevronDown, Download,
  Check, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── Activity Hours Bar Chart ──────────────────────────────── */
const HOURS_DATA = [
  { month: 'Jan', logged: 38, manual: 8 },
  { month: 'Feb', logged: 22, manual: 6 },
  { month: 'Mar', logged: 55, manual: 14 },
  { month: 'Apr', logged: 30, manual: 4 },
  { month: 'May', logged: 20, manual: 10 },
  { month: 'Jun', logged: 68, manual: 18 },
  { month: 'Jul', logged: 48, manual: 9 },
  { month: 'Aug', logged: 28, manual: 13 },
  { month: 'Sep', logged: 42, manual: 7 },
  { month: 'Oct', logged: 75, manual: 22 },
  { month: 'Nov', logged: 50, manual: 16 },
  { month: 'Dec', logged: 33, manual: 9 },
];

const ActivityHoursChart = () => {
  const [activeBar, setActiveBar] = React.useState<string | null>(null);

  return (
    <div
      className="flex items-end justify-between gap-6 mt-6"
      style={{ height: '240px' }}
      onMouseLeave={() => setActiveBar(null)}
    >
      {HOURS_DATA.map((item) => {
        const isActive = activeBar === item.month;
        return (
          <div
            key={item.month}
            className="flex flex-col items-center gap-2 relative h-full cursor-pointer flex-1"
            onMouseEnter={() => setActiveBar(item.month)}
          >
            {/* Tooltip */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 bg-card p-2.5 rounded-[14px] shadow-lg border border-border text-xs z-20 w-28 transition-all duration-200 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 invisible'
                }`}
              style={{
                bottom: `${item.logged + item.manual + 5}%`,
                transform: `translateX(-50%) translateY(${isActive ? '0' : '10px'})`
              }}
            >
              <p className="text-text-muted mb-1.5 font-medium">{item.month} hours</p>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-sm bg-primary" />
                <span>Logged: {item.logged}h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-border" />
                <span>Manual: {item.manual}h</span>
              </div>
            </div>

            {/* Stacked bar */}
            <div
              className={`w-full flex flex-col justify-end rounded-[10px] overflow-hidden flex-1 transition-colors ${isActive ? 'bg-page shadow-md' : 'bg-page'
                }`}
            >
              {/* Manual segment — lighter striped layer on top */}
              <motion.div
                className="w-full"
                initial={{ height: 0 }}
                whileInView={{ height: `${item.manual}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "circOut", delay: HOURS_DATA.indexOf(item) * 0.05 }}
                style={{
                  background:
                    'repeating-linear-gradient(45deg, transparent, transparent 2px, #AAAAAA 2px, #AAAAAA 4px)',
                  opacity: 0.55,
                }}
              />
              {/* Logged segment — solid dark */}
              <motion.div
                className={`w-full rounded-b-[10px] ${isActive ? 'bg-text-main' : 'bg-primary'
                  }`}
                initial={{ height: 0 }}
                whileInView={{ height: `${item.logged}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "circOut", delay: HOURS_DATA.indexOf(item) * 0.05 }}
              >
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full mx-auto mt-1 opacity-80"
                  />
                )}
              </motion.div>
            </div>

            <span
              className={`text-[11px] font-semibold shrink-0 transition-colors ${isActive ? 'text-text-main' : 'text-text-muted'
                }`}
            >
              {item.month}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const CustomDateRangePicker = ({ isOpen, onClose, selectedRange, onSelectRange }: any) => {
  const [currentMonthDate, setCurrentMonthDate] = React.useState(new Date(2023, 4, 1)); // Default to May 2023 context
  const [selectionStart, setSelectionStart] = React.useState<Date | null>(new Date(2023, 4, 28));
  const [selectionEnd, setSelectionEnd] = React.useState<Date | null>(new Date(2023, 5, 3));

  if (!isOpen) return null;

  const presets = [
    "Last 7 days", "Last 4 weeks", "Last 3 months",
    "Last 12 months", "Month to date", "Quarter to date", "Year to date"
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const padZero = (n: number) => n < 10 ? '0' + n : n;

  const formatDate = (date: Date | null) => {
    if (!date) return "-- / -- / ----";
    return `${padZero(date.getDate())} / ${padZero(date.getMonth() + 1)} / ${date.getFullYear()}`;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const generateDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ d: prevMonthDays - firstDay + i + 1, gray: true, date: new Date(year, month - 1, prevMonthDays - firstDay + i + 1) });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      let sel = null;

      if (selectionStart && isSameDay(date, selectionStart)) {
        sel = selectionEnd ? 'start' : 'start-only';
      } else if (selectionEnd && isSameDay(date, selectionEnd)) {
        sel = 'end';
      } else if (selectionStart && selectionEnd && date > selectionStart && date < selectionEnd) {
        sel = 'mid';
      }
      days.push({ d: i, gray: false, date, sel });
    }

    const totalCurrentDays = firstDay + daysInMonth;
    const remainingDays = 42 - totalCurrentDays;
    for (let i = 1; i <= remainingDays; i++) {
      if (i > 7 && totalCurrentDays <= 35) break;
      days.push({ d: i, gray: true, date: new Date(year, month + 1, i) });
    }

    return days;
  };

  const leftYear = currentMonthDate.getFullYear();
  const leftMonth = currentMonthDate.getMonth();
  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  const leftMonthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const rightMonthName = rightDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const leftDays = generateDays(leftYear, leftMonth);
  const rightDays = generateDays(rightYear, rightMonth);

  const prevMonth = () => setCurrentMonthDate(new Date(leftYear, leftMonth - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(leftYear, leftMonth + 1, 1));

  const handleDayClick = (day: any) => {
    if (day.gray) return;
    const date = day.date;

    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(date);
      setSelectionEnd(null);
      onSelectRange("Custom date");
    } else if (selectionStart && !selectionEnd) {
      if (date >= selectionStart) {
        setSelectionEnd(date);
      } else {
        setSelectionStart(date);
      }
    }
  };

  const renderDay = (day: any, i: number) => {
    let bgClasses = "text-text-main hover:bg-page rounded-md";
    let innerContent = <>{day.d}</>;

    if (day.gray) {
      bgClasses = "text-text-muted/30";
    } else if (day.sel) {
      if (day.sel === 'start-only') {
        bgClasses = "bg-primary text-white rounded-md relative z-10";
      } else if (day.sel === 'start') {
        bgClasses = "bg-primary text-white rounded-l-md rounded-r-none relative z-10";
      } else if (day.sel === 'mid') {
        bgClasses = "bg-primary text-white rounded-none relative z-10";
      } else if (day.sel === 'end') {
        bgClasses = "bg-primary-dark text-white rounded-r-lg rounded-l-none relative z-10";
        innerContent = (
          <>
            {day.d}
            <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-white rotate-180 mix-blend-overlay opacity-30"></div>
          </>
        );
      }
    }

    return (
      <div
        key={i}
        onClick={() => handleDayClick(day)}
        className={`flex items-center justify-center py-[7px] text-[13px] font-semibold cursor-pointer ${bgClasses}`}
      >
        {innerContent}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col md:flex-row overflow-hidden max-w-[90vw]"
      >
        {/* Left Sidebar Preset Ranges */}
        <div className="w-56 border-r border-border bg-card py-2 shrink-0 flex flex-col">
          {presets.map((preset) => (
            <div
              key={preset}
              className="px-6 py-[14px] flex items-center justify-between cursor-pointer hover:bg-page transition-colors"
              onClick={() => {
                onSelectRange(preset);
                onClose();
              }}
            >
              <span className="text-[14.5px] text-text-muted">{preset}</span>
              {selectedRange === preset && <Check size={18} className="text-primary" strokeWidth={2.5} />}
            </div>
          ))}
        </div>

        {/* Right Main Calendar Area */}
        <div className="flex-1 flex flex-col w-[640px] bg-card">
          <div className="flex px-5 pt-5 pb-1 gap-8">
            {/* Left Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <button onClick={prevMonth} className="p-1.5 hover:bg-page rounded-md text-text-muted transition-colors"><ChevronLeft size={20} /></button>
                <span className="text-[15px] font-bold text-text-main">{leftMonthName}</span>
                <div className="w-6"></div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-0 mb-4 px-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[13px] font-semibold text-text-muted">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 gap-x-0 outline-none select-none px-1">
                {leftDays.map((day, i) => renderDay(day, i))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1px] bg-border self-stretch my-2"></div>

            {/* Right Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <div className="w-6"></div>
                <span className="text-[15px] font-bold text-text-main">{rightMonthName}</span>
                <button onClick={nextMonth} className="p-1.5 hover:bg-page rounded-md text-text-muted transition-colors"><ChevronRight size={20} /></button>
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-0 mb-4 px-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[13px] font-semibold text-text-muted">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 gap-x-0 outline-none select-none px-1">
                {rightDays.map((day, i) => renderDay(day, i))}
              </div>
            </div>
          </div>

          {/* Footer Dates */}
          <div className="border-t border-border p-5 flex items-center justify-center gap-6 mt-auto">
            <div className="px-5 py-2.5 border border-border rounded-lg text-[15.5px] tracking-wide text-text-main bg-page min-w-[150px] text-center shadow-sm">
              {formatDate(selectionStart)}
            </div>
            <span className="text-text-muted font-bold text-lg">→</span>
            <div className="px-5 py-2.5 border border-border rounded-lg text-[15.5px] tracking-wide text-text-main bg-page min-w-[150px] text-center shadow-sm">
              {formatDate(selectionEnd)}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SidebarItem = ({ icon: Icon, label, active = false, badge, hasDropdown = false, isCollapsed = false }: any) => (
  <div
    className={`flex items-center ${isCollapsed ? 'justify-center mx-2' : 'justify-between px-4'} py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-primary/10 text-primary font-semibold' : 'text-text-muted hover:bg-page hover:text-text-main font-medium'}`}
    title={isCollapsed ? label : undefined}
  >
    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
      <Icon size={20} className={active ? 'text-primary' : 'text-text-muted'} />
      {!isCollapsed && <span className="text-sm">{label}</span>}
    </div>
    {!isCollapsed && badge && (
      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-page text-text-muted">
        {badge}
      </span>
    )}
    {!isCollapsed && hasDropdown && (
      <Plus size={16} className="text-text-muted" />
    )}
  </div>
);

const StatCard = ({ icon: Icon, title, value, change, isPositive }: any) => (
  <div className="bg-card p-5 rounded-2xl border border-border flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={20} />
        </div>
        <span className="text-sm font-semibold text-text-muted">{title}</span>
      </div>
    </div>
    <div className="flex items-end gap-3">
      <h3 className="text-2xl font-bold text-text-main">{value}</h3>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 mb-1 ${isPositive ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
    </div>
    <p className="text-xs text-text-muted mt-2">{isPositive ? 'Increase' : 'Decrease'} from Last Month</p>
  </div>
);


const DonutChartMockup = () => {
  const [activeSegment, setActiveSegment] = React.useState<string | null>(null);

  return (
    <div className="relative w-48 h-48 mx-auto my-8 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
        {/* 20% Late (Gray) */}
        <g transform="rotate(0 50 50)">
          <motion.circle
            onMouseEnter={() => setActiveSegment('late')}
            onMouseLeave={() => setActiveSegment(null)}
            cx="50" cy="50" r="40" fill="transparent" stroke="#E11D48" // Rose-600
            initial={{ pathLength: 0, strokeWidth: 16 }}
            animate={{ pathLength: 0.185, strokeWidth: activeSegment === 'late' ? 22 : 16 }}
            transition={{ duration: activeSegment ? 0.2 : 1.5, ease: "easeOut" }}
            className="cursor-pointer"
            style={{ strokeLinecap: 'butt' }}
          />
        </g>
        {/* 10% Pending */}
        <g transform="rotate(72 50 50)">
          <motion.circle
            onMouseEnter={() => setActiveSegment('pending')}
            onMouseLeave={() => setActiveSegment(null)}
            cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" // Amber-500
            initial={{ pathLength: 0, strokeWidth: 16 }}
            animate={{ pathLength: 0.085, strokeWidth: activeSegment === 'pending' ? 22 : 16 }}
            transition={{ duration: activeSegment ? 0.2 : 1.5, ease: "easeOut" }}
            className="cursor-pointer"
            style={{ strokeLinecap: 'butt' }}
          />
        </g>
        {/* 70% Done */}
        <g transform="rotate(108 50 50)">
          <motion.circle
            onMouseEnter={() => setActiveSegment('done')}
            onMouseLeave={() => setActiveSegment(null)}
            cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)"
            initial={{ pathLength: 0, strokeWidth: 16 }}
            animate={{ pathLength: 0.685, strokeWidth: activeSegment === 'done' ? 22 : 16 }}
            transition={{ duration: activeSegment ? 0.2 : 1.5, ease: "easeOut" }}
            className="cursor-pointer"
            style={{ strokeLinecap: 'butt' }}
          />
        </g>
      </svg>
      <div className="absolute text-center pointer-events-none">
        <h2 className="text-3xl font-bold text-text-main transition-all duration-300">
          {activeSegment === 'late' ? '20%' : activeSegment === 'pending' ? '10%' : activeSegment === 'done' ? '70%' : '70%'}
        </h2>
        <p className="text-xs text-text-muted font-medium mt-1 transition-all duration-300">
          {activeSegment === 'late' ? 'Late' : activeSegment === 'pending' ? 'Pending' : 'Completed'}
        </p>
      </div>
    </div>
  );
};

const LineChartMockup = () => {
  const [hoverPos, setHoverPos] = React.useState<{ x: number, y: number, width: number } | null>(null);

  const mockData = [
    { booked: 12, available: 5 }, { booked: 14, available: 8 }, { booked: 16, available: 15 },
    { booked: 15, available: 25 }, { booked: 14, available: 32 }, { booked: 18, available: 35 },
    { booked: 24, available: 30 }, { booked: 28, available: 20 }, { booked: 26, available: 12 },
    { booked: 20, available: 8 }, { booked: 15, available: 5 }, { booked: 16, available: 7 },
    { booked: 20, available: 12 }, { booked: 25, available: 18 }, { booked: 30, available: 25 },
    { booked: 32, available: 32 }, { booked: 28, available: 38 }, { booked: 24, available: 35 },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width
    });
  };

  const activeIndex = hoverPos ? Math.min(17, Math.max(0, Math.floor((hoverPos.x / hoverPos.width) * 18))) : 0;
  const currentData = mockData[activeIndex];

  return (
    <div
      className="relative h-40 mt-6 px-4 group cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPos(null)}
    >
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
        {/* Grid lines */}
        <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="0" y1="100" x2="1000" y2="100" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />

        {/* Booked Hours (Violet for contrast with primary) */}
        <motion.path whileHover={{ strokeWidth: 5 }} d="M0,150 C100,100 200,180 300,140 C400,100 500,40 600,100 C700,160 800,40 900,50 C950,55 1000,80 1000,80" fill="none" stroke="#8B5CF6" strokeWidth="3" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} className="transition-all" />

        {/* Available (Primary) */}
        <motion.path whileHover={{ strokeWidth: 5 }} d="M0,180 C100,160 200,90 300,60 C400,30 500,130 600,150 C700,170 800,120 900,100 C950,90 1000,110 1000,110" fill="none" stroke="var(--primary)" strokeWidth="3" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }} className="transition-all" />
      </svg>

      {/* Tooltip Tracking */}
      {hoverPos && (
        <>
          <div
            className="absolute top-0 bottom-6 border-l-2 border-border border-dashed pointer-events-none"
            style={{ left: hoverPos.x }}
          ></div>
          <div
            className="absolute bg-card p-3 rounded-xl shadow-2xl border border-border text-xs w-36 pointer-events-none z-20 transition-transform"
            style={{
              left: hoverPos.x + 160 > hoverPos.width ? hoverPos.x - 160 : hoverPos.x + 15,
              top: Math.max(hoverPos.y - 60, 0)
            }}
          >
            <p className="text-text-muted mb-2 font-medium">Nov {activeIndex + 11}, 2024</p>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-violet-500"></div> Booked :</div>
              <span className="font-bold text-text-main">{currentData.booked}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-primary"></div> Available :</div>
              <span className="font-bold text-text-main">{currentData.available}</span>
            </div>
          </div>
        </>
      )}

      {/* X-axis labels */}
      <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-text-muted font-semibold px-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [isDateMenuOpen, setIsDateMenuOpen] = React.useState(false);
  const [selectedDateRange, setSelectedDateRange] = React.useState("Last 7 days");

  return (
    <Layout>

      <div className="w-full">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Dashboard</h1>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl shadow-sm border border-border text-sm font-semibold text-text-muted hover:bg-page transition-colors">
              <Download size={16} /> Export
            </button>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl shadow-sm border border-border text-sm font-semibold text-text-muted hover:bg-page transition-colors"
                onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
              >
                <CalendarIcon size={16} /> {selectedDateRange} <ChevronDown size={14} className={`ml-1 transition-transform ${isDateMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <CustomDateRangePicker
                isOpen={isDateMenuOpen}
                onClose={() => setIsDateMenuOpen(false)}
                selectedRange={selectedDateRange}
                onSelectRange={setSelectedDateRange}
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard icon={PieChart} title="Projects" value="850" change="10%" isPositive={true} />
          <StatCard icon={CheckSquare} title="Tasks" value="100" change="5%" isPositive={false} />
          <StatCard icon={Users} title="Resources" value="850" change="5%" isPositive={true} />
          <StatCard icon={Clock} title="Time Spent" value="752" change="10%" isPositive={false} />
        </div>

        {/* Main Grid Area */}
        <div className="flex flex-col gap-4 w-full">

          {/* Top Row: Working Hours & Overall Progress */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Working Hours */}
            <div className="xl:col-span-2 bg-card rounded-3xl border border-border p-6 pb-0 flex flex-col h-full z-10">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="text-[18px] font-bold text-text-main">Activity Hours</h2>
                  <p className="text-[13px] font-medium text-text-muted mt-1">Logged vs manual hours — this year</p>
                </div>
                <span className="text-[12px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full transition-all hover:scale-105">+14% vs last year</span>
              </div>
              <div className="flex items-center gap-6 text-[12px] font-bold text-text-muted mb-2 mt-4">
                <div className="flex items-center gap-2 group cursor-pointer transition-colors hover:text-text-main">
                  <div className="w-4 h-4 rounded-full border-2 border-primary group-hover:scale-110 transition-transform" />
                  Logged
                </div>
                <div className="flex items-center gap-2 group cursor-pointer transition-colors hover:text-text-main">
                  <div className="w-4 h-4 rounded-full border-2 border-border group-hover:scale-110 transition-transform" />
                  Manual
                </div>
              </div>

              <div className="flex-1 min-h-[300px]">
                <ActivityHoursChart />
              </div>
            </div>

            {/* Overall Progress Donut */}
            <div className="xl:col-span-1 bg-card p-6 rounded-3xl border border-border h-full flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text-main">Overall Progress</h2>
                  <HelpCircle size={14} className="text-text-muted" />
                </div>
                <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-text-muted flex items-center gap-1 hover:bg-page">
                  See All <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <DonutChartMockup />
              </div>

              <div className="flex items-center justify-around mt-8 border-t border-border pt-6 px-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-semibold text-text-muted">8 Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-semibold text-text-muted">4 Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-600"></div>
                  <span className="text-sm font-semibold text-text-muted">3 Late</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Project Summary & Workload Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {/* Project Summary Table */}
            <div className="bg-card p-6 rounded-3xl border border-border flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text-main">Project Summary</h2>
                  <HelpCircle size={14} className="text-text-muted" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-page rounded-lg text-[11px] font-semibold text-text-muted flex items-center gap-1 hover:bg-card border border-border">Project <ChevronDown size={12} /></button>
                  <button className="px-2 py-1 bg-page rounded-lg text-[11px] font-semibold text-text-muted flex items-center gap-1 hover:bg-card border border-border">Status <ChevronDown size={12} /></button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left" style={{ borderSpacing: '0 8px', borderCollapse: 'separate' }}>
                  <thead>
                    <tr className="text-xs font-bold text-text-main bg-page">
                      <th className="py-3 px-4 rounded-l-xl">Project Name</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 rounded-r-xl text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold text-text-muted">
                    <tr className="bg-page/50">
                      <td className="py-3 px-4 rounded-l-xl w-1/2 text-text-main">BoostApp Social Revamp</td>
                      <td className="py-3 px-4 w-1/4 text-text-muted font-medium">Nov 07, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl w-1/4 text-center">
                        <span className="inline-block px-3 py-1.5 bg-emerald-500/10 text-emerald-600 text-[11px] rounded-lg font-bold w-full">Completed</span>
                      </td>
                    </tr>
                    <tr className="bg-card">
                      <td className="py-3 px-4 rounded-l-xl text-text-main">Brainbubble Research</td>
                      <td className="py-3 px-4 text-text-muted font-medium">Nov 23, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl text-center">
                        <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary text-[11px] rounded-lg font-bold w-full">In Progress</span>
                      </td>
                    </tr>
                    <tr className="bg-page/50">
                      <td className="py-3 px-4 rounded-l-xl text-text-main">EcoLeadpunt Website</td>
                      <td className="py-3 px-4 text-text-muted font-medium">Nov 12, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl text-center">
                        <span className="inline-block px-3 py-1.5 bg-orange-500/10 text-orange-600 text-[11px] rounded-lg font-bold w-full">Delayed</span>
                      </td>
                    </tr>
                    <tr className="bg-card">
                      <td className="py-3 px-4 rounded-l-xl text-text-main">Drip Page A/B Test</td>
                      <td className="py-3 px-4 text-text-muted font-medium">Nov 24, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl text-center">
                        <span className="inline-block px-3 py-1.5 bg-rose-500/10 text-rose-600 text-[11px] rounded-lg font-bold w-full">At Risk</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workload Summary Line Chart */}
            <div className="bg-card p-6 rounded-3xl border border-border flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text-main">Workload Summary</h2>
                  <HelpCircle size={14} className="text-text-muted" />
                </div>
                <button className="px-3 py-1.5 bg-page rounded-lg text-xs font-semibold text-text-muted flex items-center gap-1 hover:bg-card border border-border">
                  This Month <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-text-muted mb-2 px-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-primary"></div> Available
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-violet-500"></div> Booked Hours
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end min-h-[160px]">
                <LineChartMockup />
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

