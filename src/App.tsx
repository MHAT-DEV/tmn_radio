import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Radio, 
  Search, 
  Share2, 
  Calendar, 
  ListMusic, 
  Users, 
  Languages, 
  ExternalLink, 
  Clock, 
  Music2, 
  AlertCircle, 
  CheckCircle2, 
  Heart, 
  RefreshCw, 
  Menu, 
  X,
  Volume1,
  Sparkles,
  Layers,
  Copy,
  Code
} from 'lucide-react';

// ==========================================
// CONFIGURATION & TRANSLATIONS
// ==========================================

interface Station {
  id: string;
  name: string;
  stream: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
}

const STATIONS: Station[] = [
  { 
    id: 'trymenow_2', 
    name: 'สถานีหลัก TryMeNow', 
    stream: 'https://radio.sotyai.com/listen/trymenow_2/radio.mp3',
    bgColor: 'from-indigo-600/20 to-zinc-950',
    borderColor: 'border-indigo-500/20',
    textColor: 'text-indigo-400',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
  },
  { 
    id: 'trymenow_-_90s', 
    name: 'TryMeNow 90s', 
    stream: 'https://radio.sotyai.com/listen/trymenow_-_90s/radio.mp3',
    bgColor: 'from-amber-600/20 to-zinc-950',
    borderColor: 'border-amber-500/20',
    textColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  },
  { 
    id: 'trymenow_-_hook', 
    name: 'TryMeNow Hook', 
    stream: 'https://radio.sotyai.com/listen/trymenow_-_hook/radio.mp3',
    bgColor: 'from-rose-600/20 to-zinc-950',
    borderColor: 'border-rose-500/20',
    textColor: 'text-rose-400',
    badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
  },
  { 
    id: 'trymenow_-_lukthong', 
    name: 'TryMeNow Lukthong', 
    stream: 'https://radio.sotyai.com/listen/trymenow_-_lukthong/radio.mp3',
    bgColor: 'from-emerald-600/20 to-zinc-950',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  }
];

const LANGUAGES = [
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  th: {
    appTitle: "TryMeNow Radio",
    stations: "สถานีทั้งหมด",
    poweredBy: "ขับเคลื่อนโดย AzuraCast API",
    homeMenu: "หน้าหลัก TMN",
    portMenu: "ระบบจัดการพอร์ต",
    chatMenu: "ห้องแชท TMN",
    tabPlayer: "เครื่องเล่นเพลง",
    tabRequest: "ขอเพลง",
    tabSchedule: "ตารางออกอากาศ",
    tabWidget: "สร้างวิดเจ็ต Embed",
    nowPlaying: "กำลังเล่นขณะนี้",
    upNext: "เพลงถัดไป",
    listenersCount: "ผู้ฟังสดขณะนี้: {count} คน",
    playbackHistory: "รายการเพลงที่เพิ่งเล่นไป",
    noHistory: "ไม่มีประวัติเพลงล่าสุด",
    requestThis: "ขอเพลงนี้",
    copiedTitle: "คัดลอกชื่อเพลงแล้ว!",
    searchPlaceholder: "ค้นหาชื่อเพลงหรือศิลปิน...",
    requestBtn: "ขอเพลง",
    requesting: "กำลังส่งคำขอ...",
    requestSuccess: "ส่งคำขอเพลงสำเร็จ! เพลงของคุณจะถูกจัดคิวในไม่ช้า",
    requestError: "เกิดข้อผิดพลาดในการขอเพลง: {error}",
    noRequestable: "ไม่พบเพลงที่สามารถขอได้ในขณะนี้",
    scheduleTitle: "ตารางออกอากาศของสถานี",
    onAir: "กำลังออกอากาศขณะนี้",
    noSchedule: "ไม่มีรายการตามผังในขณะนี้",
    loading: "กำลังโหลดข้อมูล...",
    chooseStation: "กรุณาเลือกสถานี",
    streamStatus: "สถานะการเชื่อมต่อ",
    connected: "เชื่อมต่อสำเร็จ",
    connecting: "กำลังโหลดสัญญาณสตรีม...",
    stalled: "สัญญาณขาดหาย กำลังเชื่อมต่อใหม่...",
    upcomingQueue: "คิวเพลงถัดไป",
    volume: "ระดับเสียง",
    webRadio: "วิทยุออนไลน์",
    shareBtn: "แชร์เพลง",
    lyricsTitle: "เนื้อเพลง / คลื่นเสียง",
    noQueue: "ไม่มีเพลงในคิวถัดไป",
    aboutStation: "เกี่ยวกับสถานีนี้",
    listeners: "ผู้ฟัง",
    duration: "ความยาว",
    searchBoxLabel: "พิมพ์เพื่อกรองตามชื่อเพลงหรือนักร้อง",
    listenRadio: "ฟังวิทยุ",
    reloadRadio: "รีโหลดวิทยุ",
    widgetTitle: "เครื่องมือสร้างวิดเจ็ต (Embed Widget Builder)",
    widgetDesc: "ปรับแต่งและสร้างโค้ด Embed Widget เพื่อนำเครื่องเล่นวิทยุนี้ไปแปะในเว็บไซต์หรือบล็อกของคุณได้อย่างง่ายดาย",
    widgetTheme: "ธีมเครื่องเล่น",
    widgetAutoplay: "เล่นอัตโนมัติ (Autoplay)",
    widgetVolume: "เสียงเริ่มต้น",
    widgetWidth: "ความกว้าง",
    widgetHeight: "ความสูง",
    widgetPreview: "ตัวอย่างวิดเจ็ตสด (Live Preview)",
    widgetCode: "โค้ด Embed HTML (คัดลอกไปใช้งาน)",
    widgetCopyBtn: "คัดลอกโค้ด Embed",
    widgetUsageGuide: "คำแนะนำการนำไปใช้งาน",
    widgetWaveform: "แสดงคลื่นเสียงอนิเมชั่น",
    widgetCover: "แสดงภาพปกเพลง"
  },
  en: {
    appTitle: "TryMeNow Radio",
    stations: "All Stations",
    poweredBy: "Powered by AzuraCast API",
    homeMenu: "TMN Home",
    portMenu: "Port Manager",
    chatMenu: "TMN Chat",
    tabPlayer: "Player",
    tabRequest: "Song Request",
    tabSchedule: "Schedule",
    tabWidget: "Widget Builder",
    nowPlaying: "Now Playing",
    upNext: "Up Next",
    listenersCount: "Active listeners: {count}",
    playbackHistory: "Recently Played Songs",
    noHistory: "No recent songs",
    requestThis: "Request This",
    copiedTitle: "Copied song title to clipboard!",
    searchPlaceholder: "Search song or artist...",
    requestBtn: "Request",
    requesting: "Requesting...",
    requestSuccess: "Song request submitted! It will be queued shortly.",
    requestError: "Error requesting song: {error}",
    noRequestable: "No requestable songs available at the moment.",
    scheduleTitle: "Broadcast Schedule",
    onAir: "Currently On Air",
    noSchedule: "No scheduled shows at the moment.",
    loading: "Loading data...",
    chooseStation: "Please choose a station",
    streamStatus: "Stream Status",
    connected: "Connected",
    connecting: "Loading stream signal...",
    stalled: "Connection lost. Reconnecting...",
    upcomingQueue: "Upcoming Queue",
    volume: "Volume",
    webRadio: "Web Radio",
    shareBtn: "Share Song",
    lyricsTitle: "Lyrics / Waveform",
    noQueue: "No upcoming tracks in queue",
    aboutStation: "About This Station",
    listeners: "Listeners",
    duration: "Duration",
    searchBoxLabel: "Type to filter by song title or artist",
    listenRadio: "Listen Radio",
    reloadRadio: "Reload Radio",
    widgetTitle: "Player Embed Widget Builder",
    widgetDesc: "Customize and generate an embeddable radio player widget to place on your website or blog easily.",
    widgetTheme: "Player Theme",
    widgetAutoplay: "Autoplay Stream",
    widgetVolume: "Default Volume",
    widgetWidth: "Width",
    widgetHeight: "Height",
    widgetPreview: "Live Preview",
    widgetCode: "HTML Embed Code (Copy to use)",
    widgetCopyBtn: "Copy Embed Code",
    widgetUsageGuide: "Usage Instructions & Guidelines",
    widgetWaveform: "Show Waveform Animation",
    widgetCover: "Show Song Cover Art"
  },
  zh: {
    appTitle: "TryMeNow 广播电台",
    stations: "所有电台",
    poweredBy: "由 AzuraCast API 提供技术支持",
    homeMenu: "TMN 首页",
    portMenu: "端口管理",
    chatMenu: "TMN 聊天室",
    tabPlayer: "播放器",
    tabRequest: "点歌系统",
    tabSchedule: "节目表",
    tabWidget: "小组件生成器",
    nowPlaying: "正在播放",
    upNext: "下一首",
    listenersCount: "当前听众: {count} 人",
    playbackHistory: "播放历史记录",
    noHistory: "暂无播放历史",
    requestThis: "点播此曲",
    copiedTitle: "歌名已复制到剪贴板！",
    searchPlaceholder: "搜索歌曲或歌手...",
    requestBtn: "点歌",
    requesting: "正在提交请求...",
    requestSuccess: "点歌请求已提交！您的歌曲很快就会排队播放。",
    requestError: "点歌失败: {error}",
    noRequestable: "目前没有可请求的歌曲",
    scheduleTitle: "电台节目表",
    onAir: "正在直播",
    noSchedule: "暂无节目表安排。",
    loading: "正在加载数据...",
    chooseStation: "请选择电台",
    streamStatus: "信号流状态",
    connected: "已连接",
    connecting: "正在加载音频流...",
    stalled: "连接中断，正在重新连接...",
    upcomingQueue: "即将播放队列",
    volume: "音量",
    webRadio: "在线广播",
    shareBtn: "分享歌曲",
    lyricsTitle: "歌词 / 音频波形",
    noQueue: "队列中没有下一首歌曲",
    aboutStation: "关于此电台",
    listeners: "听众",
    duration: "时长",
    searchBoxLabel: "输入以过滤歌曲名称或歌手",
    listenRadio: "收听广播",
    reloadRadio: "重新加载",
    widgetTitle: "播放器嵌入小组件生成器",
    widgetDesc: "自定义并生成可嵌入的电台播放器，以便轻松放置在您的网站或博客中。",
    widgetTheme: "播放器主题",
    widgetAutoplay: "自动播放流",
    widgetVolume: "默认音量",
    widgetWidth: "宽度",
    widgetHeight: "高度",
    widgetPreview: "实时预览",
    widgetCode: "HTML 嵌入代码（复制使用）",
    widgetCopyBtn: "复制嵌入代码",
    widgetUsageGuide: "使用说明和指南",
    widgetWaveform: "显示波形动画",
    widgetCover: "显示歌曲封面"
  },
  vi: {
    appTitle: "Đài TryMeNow",
    stations: "Tất cả các đài",
    poweredBy: "Hỗ trợ bởi AzuraCast API",
    homeMenu: "Trang chủ TMN",
    portMenu: "Quản lý cổng",
    chatMenu: "Phòng chat TMN",
    tabPlayer: "Trình phát",
    tabRequest: "Yêu cầu bài hát",
    tabSchedule: "Lịch phát sóng",
    tabWidget: "Tạo Widget Embed",
    nowPlaying: "Đang phát",
    upNext: "Bài tiếp theo",
    listenersCount: "Người nghe trực tiếp: {count}",
    playbackHistory: "Bài hát vừa phát",
    noHistory: "Không có lịch sử bài hát",
    requestThis: "Yêu cầu bài này",
    copiedTitle: "Đã sao chép tên bài hát vào bộ nhớ tạm!",
    searchPlaceholder: "Tìm bài hát hoặc ca sĩ...",
    requestBtn: "Yêu cầu",
    requesting: "Đang gửi yêu cầu...",
    requestSuccess: "Yêu cầu bài hát đã gửi! Bài hát của bạn sẽ sớm được xếp hàng.",
    requestError: "Lỗi gửi yêu cầu: {error}",
    noRequestable: "Hiện không có bài hát nào có thể yêu cầu",
    scheduleTitle: "Lịch phát sóng của đài",
    onAir: "Đang phát sóng",
    noSchedule: "Hiện tại không có lịch phát sóng nào.",
    loading: "Đang tải dữ liệu...",
    chooseStation: "Vui lòng chọn đài",
    streamStatus: "Trạng thái luồng",
    connected: "Đã kết nối",
    connecting: "Đang kết nối tín hiệu...",
    stalled: "Mất kết nối. Đang kết nối lại...",
    upcomingQueue: "Hàng đợi tiếp theo",
    volume: "Âm lượng",
    webRadio: "Radio trực tuyến",
    shareBtn: "Chia sẻ",
    lyricsTitle: "Lời bài hát / Sóng âm",
    noQueue: "Không có bài hát tiếp theo",
    aboutStation: "Giới thiệu về đài này",
    listeners: "Người nghe",
    duration: "Thời lượng",
    searchBoxLabel: "Nhập để lọc theo tên bài hát hoặc ca sĩ",
    listenRadio: "Nghe đài",
    reloadRadio: "Tải lại đài",
    widgetTitle: "Công cụ tạo Widget Embed trình phát",
    widgetDesc: "Tùy chỉnh và tạo mã widget trình phát radio nhúng để dễ dàng đưa lên trang web hoặc blog của bạn.",
    widgetTheme: "Giao diện trình phát",
    widgetAutoplay: "Tự động phát trực tuyến",
    widgetVolume: "Âm lượng mặc định",
    widgetWidth: "Chiều rộng",
    widgetHeight: "Chiều cao",
    widgetPreview: "Xem trước trực tiếp",
    widgetCode: "Mã HTML nhúng (Sao chép để sử dụng)",
    widgetCopyBtn: "Sao chép mã nhúng",
    widgetUsageGuide: "Hướng dẫn sử dụng & Quy định",
    widgetWaveform: "Hiển thị sóng âm động",
    widgetCover: "Hiển thị ảnh bìa bài hát"
  }
};

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface Song {
  id: string;
  text: string;
  artist: string;
  title: string;
  album: string;
  art: string;
}

interface NowPlaying {
  title: string;
  artist: string;
  art: string;
  listeners: number;
  elapsed: number;
  duration: number;
  sh_id: number;
  song_id: string;
}

interface HistoryItem {
  sh_id: number;
  played_at: number;
  duration: number;
  song: {
    title: string;
    artist: string;
    art: string;
  };
}

interface RequestableSong {
  request_id: string;
  request_url: string;
  song: {
    id: string;
    text: string;
    title: string;
    artist: string;
    art: string;
  };
}

interface QueueItem {
  id: string | number;
  cued_at?: number;
  played_at?: number;
  duration?: number;
  playlist?: string;
  is_request?: boolean;
  song: {
    id: string;
    title: string;
    artist: string;
    art: string;
    album?: string;
  };
}

interface ScheduleItem {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  days: number[];
  is_active: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ==========================================
// CANVAS AUDIO VISUALIZER COMPONENT
// ==========================================

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  volume: number;
  themeColor: string;
}

function AudioWaveVisualizer({ isPlaying, volume, themeColor }: AudioWaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let phase = 0;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, width, height);
      
      const waveCount = 4;
      const colors = [
        themeColor, // Main theme color
        '#a855f7', // Purple Accent
        '#3b82f6', // Blue Accent
        '#10b981'  // Emerald Accent
      ];
      
      if (isPlaying) {
        phase += 0.045;
      } else {
        phase += 0.003; // Tiny atmospheric drift when paused
      }
      
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = i === 0 ? 3 : 1.5;
        
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0)');
        grad.addColorStop(0.25, colors[i % colors.length] + (i === 0 ? 'df' : '40'));
        grad.addColorStop(0.75, colors[i % colors.length] + (i === 0 ? 'df' : '40'));
        grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        
        ctx.strokeStyle = grad;
        
        // Base amplitude modulated by play/pause and user's volume
        const baseAmp = isPlaying ? (28 - i * 6) * (0.15 + volume * 0.85) : 3;
        const frequency = 0.007 + i * 0.0025;
        
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * frequency + phase + (i * Math.PI) / 3) * baseAmp * Math.sin((x * Math.PI) / width);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, volume, themeColor]);
  
  return (
    <div id="visualizer-container" className="relative w-full bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/40 overflow-hidden mb-4">
      <div className="absolute top-2 left-3 flex items-center space-x-1.5">
        <span className="flex h-1.5 w-1.5 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 ${!isPlaying && 'hidden'}`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isPlaying ? 'bg-indigo-500' : 'bg-zinc-600'}`}></span>
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">Real-time Audio Matrix</span>
      </div>
      <canvas 
        ref={canvasRef} 
        className="w-full h-16 block opacity-90"
      />
    </div>
  );
}

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================

const AZURACAST_API_KEY = (import.meta as any).env?.VITE_AZURACAST_API_KEY || "b177e426f4707583:84de7a846082980231784fb51f18d5fc";

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const isPost = options.method && options.method.toUpperCase() === 'POST';
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>)
  };
  
  if (isPost) {
    headers['X-API-Key'] = AZURACAST_API_KEY;
  }

  return fetch(url, {
    ...options,
    headers
  });
};

export default function App() {
  // Persistence & Internationalization
  const [lang, setLang] = useState<string>(() => {
    const saved = localStorage.getItem('tmn_selected_lang');
    if (saved && ['th', 'en', 'zh', 'vi'].includes(saved)) return saved;
    return 'th';
  });

  const t = useMemo(() => {
    return (key: string, replacements?: Record<string, string | number>) => {
      let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['th']?.[key] || key;
      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    };
  }, [lang]);

  // Player & Stream state
  const [currentStation, setCurrentStation] = useState<Station>(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<'connected' | 'connecting' | 'stalled'>('connected');

  // API Data States
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    title: '',
    artist: '',
    art: 'https://radio.sotyai.com/static/img/logo.png',
    listeners: 0,
    elapsed: 0,
    duration: 0,
    sh_id: 0,
    song_id: ''
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [requestableSongs, setRequestableSongs] = useState<RequestableSong[]>([]);
  const [upcomingQueue, setUpcomingQueue] = useState<QueueItem[]>([]);
  const [queueError, setQueueError] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  
  // Dynamic Station Info Specs State (GET /api/station/{station_id})
  const [stationInfo, setStationInfo] = useState<any>(null);
  const [isLoadingStationInfo, setIsLoadingStationInfo] = useState<boolean>(false);

  // Player Embed Widget Builder state variables
  const [widgetStation, setWidgetStation] = useState<string>(STATIONS[0].id);
  const [widgetTheme, setWidgetTheme] = useState<'dark' | 'light' | 'glass' | 'neon'>('dark');
  const [widgetAutoplay, setWidgetAutoplay] = useState<boolean>(false);
  const [widgetVolume, setWidgetVolume] = useState<number>(0.8);
  const [widgetShowWaveform, setWidgetShowWaveform] = useState<boolean>(true);
  const [widgetShowCover, setWidgetShowCover] = useState<boolean>(true);
  const [widgetWidth, setWidgetWidth] = useState<string>('100%');
  const [widgetHeight, setWidgetHeight] = useState<number>(180);

  // Interactive Front-end States
  const [currentTab, setCurrentTab] = useState<'player' | 'request' | 'schedule' | 'widget'>('player');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Real-time progressive track timeline
  const [trackElapsed, setTrackElapsed] = useState<number>(0);
  const [trackDuration, setTrackDuration] = useState<number>(0);

  // Audio HTML5 Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to trigger custom toasts
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4500);
  };

  // -------------------------------------------------------------
  // DATA FETCHERS
  // -------------------------------------------------------------

  const fetchNowPlaying = async () => {
    try {
      const res = await fetchWithAuth(`https://radio.sotyai.com/api/nowplaying/${currentStation.id}`);
      if (!res.ok) throw new Error('API Response failure');
      const data = await res.json();
      
      const title = data?.now_playing?.song?.title || '';
      const artist = data?.now_playing?.song?.artist || '';
      const art = data?.now_playing?.song?.art || 'https://radio.sotyai.com/static/img/logo.png';
      const listeners = data?.listeners?.current || 0;
      const elapsed = data?.now_playing?.elapsed || 0;
      const duration = data?.now_playing?.duration || 0;
      const sh_id = data?.now_playing?.sh_id || 0;
      const song_id = data?.now_playing?.song?.id || '';

      setNowPlaying({ title, artist, art, listeners, elapsed, duration, sh_id, song_id });
      setTrackElapsed(elapsed);
      setTrackDuration(duration);

      // Map song history safely
      if (data?.song_history) {
        setHistory(data.song_history.map((item: any) => ({
          sh_id: item.sh_id || Math.random(),
          played_at: item.played_at || 0,
          duration: item.duration || 0,
          song: {
            title: item.song?.title || 'Unknown',
            artist: item.song?.artist || 'Unknown Artist',
            art: item.song?.art || 'https://radio.sotyai.com/static/img/logo.png'
          }
        })));
      }
    } catch (err) {
      console.error('Error fetching now playing status:', err);
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await fetchWithAuth(`https://radio.sotyai.com/api/station/${currentStation.id}/queue`);
      if (res.ok) {
        const data = await res.json();
        setUpcomingQueue(data.map((item: any) => ({
          id: item.song?.id || Math.random().toString(),
          cued_at: item.cued_at,
          played_at: item.played_at,
          duration: item.duration,
          playlist: item.playlist,
          is_request: !!item.is_request,
          song: {
            id: item.song?.id || '',
            title: item.song?.title || 'Unknown Title',
            artist: item.song?.artist || 'Unknown Artist',
            art: item.song?.art || 'https://radio.sotyai.com/static/img/logo.png',
            album: item.song?.album || ''
          }
        })));
        setQueueError(false);
      } else {
        setUpcomingQueue([]);
        setQueueError(true);
      }
    } catch (err) {
      console.error('Error fetching station queue:', err);
      setUpcomingQueue([]);
      setQueueError(true);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetchWithAuth(`https://radio.sotyai.com/api/station/${currentStation.id}/schedule`);
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.map((item: any) => ({
          id: item.id,
          name: item.name || 'Special Broadcast Playlist',
          start_time: item.start_time || '00:00',
          end_time: item.end_time || '23:59',
          days: item.days || [0,1,2,3,4,5,6],
          is_active: !!item.is_active
        })));
      } else {
        setSchedule([]);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setSchedule([]);
    }
  };

  const fetchRequestableSongs = async () => {
    try {
      const res = await fetchWithAuth(`https://radio.sotyai.com/api/station/${currentStation.id}/requests`);
      if (res.ok) {
        const data = await res.json();
        setRequestableSongs(data.map((item: any) => ({
          request_id: item.request_id,
          request_url: item.request_url,
          song: {
            id: item.song?.id || '',
            text: item.song?.text || '',
            title: item.song?.title || 'Unknown Title',
            artist: item.song?.artist || 'Unknown Artist',
            art: item.song?.art || 'https://radio.sotyai.com/static/img/logo.png'
          }
        })));
      } else {
        setRequestableSongs([]);
      }
    } catch (err) {
      console.error('Error fetching requestable songs list:', err);
      setRequestableSongs([]);
    }
  };

  const fetchStationInfo = async () => {
    setIsLoadingStationInfo(true);
    try {
      const res = await fetchWithAuth(`https://radio.sotyai.com/api/station/${currentStation.id}`);
      if (res.ok) {
        const data = await res.json();
        setStationInfo(data);
      } else {
        setStationInfo(null);
      }
    } catch (err) {
      console.error('Error fetching station details:', err);
      setStationInfo(null);
    } finally {
      setIsLoadingStationInfo(false);
    }
  };

  // -------------------------------------------------------------
  // EFFECT HOOKS
  // -------------------------------------------------------------

  // Save selected language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('tmn_selected_lang', lang);
  }, [lang]);

  // Periodically fetch now playing and queue stats
  useEffect(() => {
    fetchNowPlaying();
    fetchQueue();
    fetchSchedule();
    fetchStationInfo();

    const mainInterval = setInterval(() => {
      fetchNowPlaying();
      fetchQueue();
    }, 15000); // 15-second loop

    return () => clearInterval(mainInterval);
  }, [currentStation]);

  // Fetch request list only if request tab is open
  useEffect(() => {
    if (currentTab === 'request') {
      fetchRequestableSongs();
    }
  }, [currentTab, currentStation]);

  // Local second-by-second progressive track timer
  useEffect(() => {
    const tick = setInterval(() => {
      setTrackElapsed((prev) => {
        if (trackDuration > 0 && prev >= trackDuration) {
          // Estimated track finished, refresh soon
          setTimeout(fetchNowPlaying, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [trackDuration]);

  // Setup HTML5 Audio element & handlers
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'none';
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setStreamStatus('connecting');
    const onPlaying = () => setStreamStatus('connected');
    const onStalled = () => setStreamStatus('stalled');
    const onError = () => {
      setStreamStatus('stalled');
      // Auto-reconnect flow on network drop
      if (isPlaying) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = currentStation.stream;
            audioRef.current.load();
            audioRef.current.play().catch(() => {});
          }
        }, 3000);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('stalled', onStalled);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('stalled', onStalled);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Update audio volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update Media Session Metadata for Lock Screen Controls
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: nowPlaying.title || currentStation.name,
        artist: nowPlaying.artist || 'TryMeNow Radio',
        album: currentStation.name,
        artwork: [
          { src: nowPlaying.art || 'https://radio.sotyai.com/static/img/logo.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        handlePlayToggle();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        handlePlayToggle();
      });
    }
  }, [nowPlaying, currentStation]);

  // -------------------------------------------------------------
  // INTERACTIVE CONTROLS & SUBMISSIONS
  // -------------------------------------------------------------

  const selectStation = (station: Station) => {
    setCurrentStation(station);
    setStreamStatus('connecting');
    
    if (audioRef.current) {
      audioRef.current.src = station.stream;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Playback gesture required:', err);
          setIsPlaying(false);
        });
      }
    }
    setSearchQuery('');
  };

  const handlePlayToggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setStreamStatus('connecting');
      if (!audioRef.current.src || audioRef.current.src !== currentStation.stream) {
        audioRef.current.src = currentStation.stream;
        audioRef.current.load();
      }
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setStreamStatus('connected');
        })
        .catch((err) => {
          console.error('Audio play error:', err);
          setStreamStatus('stalled');
          setIsPlaying(false);
        });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const submitSongRequest = async (requestId: string, songTitle: string) => {
    if (isSubmittingRequest) return;
    setIsSubmittingRequest(requestId);

    try {
      const res = await fetchWithAuth(`https://radio.sotyai.com/api/station/${currentStation.id}/request/${requestId}`, {
        method: 'POST'
      });
      
      if (res.ok) {
        showToast(t('requestSuccess'), 'success');
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMsg = errorData?.message || 'Request cooldown active / limit reached';
        showToast(t('requestError', { error: errorMsg }), 'error');
      }
    } catch (err) {
      console.error('Error submitting song request:', err);
      showToast(t('requestError', { error: 'Connection failure' }), 'error');
    } finally {
      setIsSubmittingRequest(null);
    }
  };

  const copyToClipboard = (song: { title: string; artist: string }) => {
    const text = `${song.title} - ${song.artist}`;
    navigator.clipboard.writeText(text)
      .then(() => showToast(t('copiedTitle'), 'success'))
      .catch(() => showToast('Failed to copy', 'error'));
  };

  const triggerHistorySearch = (title: string) => {
    setSearchQuery(title);
    setCurrentTab('request');
    showToast(`Searching for "${title}" in Request catalog`, 'info');
  };

  // Filter Requestable Songs list
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return requestableSongs;
    const q = searchQuery.toLowerCase();
    return requestableSongs.filter((item) => 
      item.song.title.toLowerCase().includes(q) ||
      item.song.artist.toLowerCase().includes(q)
    );
  }, [searchQuery, requestableSongs]);

  // Extract top artists from requestable list for smart filters
  const topArtists = useMemo(() => {
    const counts: Record<string, number> = {};
    requestableSongs.forEach((item) => {
      const artist = item.song.artist?.trim() || '';
      if (artist && artist.toLowerCase() !== 'unknown' && artist.toLowerCase() !== 'unknown artist') {
        counts[artist] = (counts[artist] || 0) + 1;
      }
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 artists
  }, [requestableSongs]);

  // Format second counts beautifully (MM:SS)
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Convert Epoch unix seconds to readable local string
  const formatPlayedTime = (timestamp: number) => {
    if (!timestamp) return '--:--';
    const d = new Date(timestamp * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Progress Bar Percentage
  const progressPercent = useMemo(() => {
    if (!trackDuration) return 0;
    return Math.min(100, (trackElapsed / trackDuration) * 100);
  }, [trackElapsed, trackDuration]);

  // Color mappings based on selected station theme
  const getStationThemeColor = () => {
    switch (currentStation.id) {
      case 'trymenow_-_90s': return '#f59e0b';
      case 'trymenow_-_hook': return '#f43f5e';
      case 'trymenow_-_lukthong': return '#10b981';
      default: return '#6366f1';
    }
  };

  const activeThemeColor = getStationThemeColor();

  // Check if we are in embed mode
  const urlParams = new URLSearchParams(window.location.search);
  const isEmbedMode = urlParams.get('embed') === 'true';

  if (isEmbedMode) {
    return <EmbedPlayer />;
  }

  return (
    <div id="radio-app-root" className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none relative">
      
      {/* BACKGROUND FLOATING AMBIENT GLOW */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl transition-all duration-1000"
          style={{ backgroundColor: activeThemeColor }}
        />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION (DESKTOP) */}
      {/* ========================================================= */}
      <aside id="sidebar-panel" className="hidden lg:flex w-80 bg-zinc-900 border-r border-zinc-850 flex-col justify-between z-10 flex-shrink-0">
        <div className="p-6 flex flex-col h-full overflow-hidden">
          {/* Logo Heading */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg transition-transform duration-500 hover:rotate-12"
                style={{ backgroundImage: `linear-gradient(135deg, ${activeThemeColor}, #09090b)` }}
              >
                <Radio className="w-5.5 h-5.5 text-white animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-zinc-900">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-100"></span>
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold font-title tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                TRYMENOW
              </h1>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold" style={{ color: activeThemeColor }}>
                Premium Stream
              </span>
            </div>
          </div>

          {/* Quick External Links Segment */}
          <div className="mb-6 bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/40">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1.5 block mb-2 font-bold">
              TMN Quick Portals
            </span>
            <div className="space-y-1.5">
              <a 
                id="portal-home"
                href="https://tmn.sotyai.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition group"
              >
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>{t('homeMenu')}</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
              </a>
              <a 
                id="portal-port"
                href="https://radio.sotyai.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition group"
              >
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{t('portMenu')}</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
              </a>
              <a 
                id="portal-chat"
                href="https://xat.com/trymenow" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition group"
              >
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{t('chatMenu')}</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
              </a>
            </div>
          </div>

          {/* Station Selector Segment */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                {t('stations')}
              </h2>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
                {STATIONS.length} Live
              </span>
            </div>

            <div className="space-y-2">
              {STATIONS.map((st) => {
                const isActive = currentStation.id === st.id;
                return (
                  <button
                    key={st.id}
                    id={`station-select-${st.id}`}
                    onClick={() => selectStation(st)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                      isActive 
                        ? 'bg-zinc-800 border-l-4 border-indigo-500 shadow-md' 
                        : 'bg-zinc-900/30 border border-zinc-800/40 hover:bg-zinc-800/50 hover:border-zinc-800'
                    }`}
                    style={{ borderLeftColor: isActive ? activeThemeColor : undefined }}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-zinc-500'
                      }`}
                      style={{ color: isActive ? activeThemeColor : undefined }}
                      >
                        <Radio className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate transition-colors ${
                          isActive ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'
                        }`}>
                          {st.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-wide truncate">
                          {st.id}
                        </p>
                      </div>
                    </div>

                    {/* Active Visualizer Bar inside sidebar item */}
                    {isActive && isPlaying ? (
                      <div className="flex items-end space-x-0.5 h-4 mb-1">
                        <div className="w-0.75 bg-indigo-400 visualizer-bar" style={{ animationDelay: '0.1s', backgroundColor: activeThemeColor }} />
                        <div className="w-0.75 bg-indigo-400 visualizer-bar" style={{ animationDelay: '0.3s', backgroundColor: activeThemeColor }} />
                        <div className="w-0.75 bg-indigo-400 visualizer-bar" style={{ animationDelay: '0.5s', backgroundColor: activeThemeColor }} />
                      </div>
                    ) : isActive ? (
                      <span className="text-[9px] bg-zinc-950 text-zinc-400 px-1.5 py-0.5 rounded-md font-bold border border-zinc-800">
                        ACTIVE
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector inside Sidebar */}
          <div className="mt-4 pt-4 border-t border-zinc-850">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-zinc-500 flex items-center space-x-1.5 font-bold">
                <Languages className="w-3.5 h-3.5" />
                <span>Language / ภาษา</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  id={`lang-select-${l.code}`}
                  onClick={() => setLang(l.code)}
                  className={`flex items-center space-x-2 p-2 rounded-lg text-xs transition border ${
                    lang === l.code 
                      ? 'bg-zinc-800 border-zinc-700 text-white font-bold' 
                      : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span className="truncate">{l.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Brand Info */}
        <div className="p-4 bg-zinc-950/40 border-t border-zinc-850/50 flex items-center justify-between">
          <div className="text-[10px] text-zinc-500 font-mono">
            {t('poweredBy')}
          </div>
          <span className="text-[9px] text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full font-mono font-bold" style={{ color: activeThemeColor, backgroundColor: activeThemeColor + '10' }}>
            v2.1
          </span>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main id="main-content-panel" className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto pb-32 relative z-10">
        
        {/* TOP NAVBAR HEADER */}
        <header className="p-4 md:p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/75 sticky top-0 backdrop-blur-md z-30">
          <div className="flex items-center space-x-3">
            {/* Hamburger for Mobile Screen */}
            <button 
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-mono font-bold text-[10px] border border-red-500/20 tracking-wider uppercase animate-pulse">
                  ON AIR
                </span>
                <span className="text-xs text-zinc-500 hidden md:inline">|</span>
                <h2 className="text-sm md:text-base font-bold font-title tracking-wide text-zinc-100 truncate max-w-xs md:max-w-md">
                  {currentStation.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Tabs and Controllers */}
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800/50">
              <button 
                id="tab-select-player"
                onClick={() => setCurrentTab('player')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentTab === 'player' 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('tabPlayer')}</span>
              </button>
              <button 
                id="tab-select-request"
                onClick={() => setCurrentTab('request')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentTab === 'request' 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('tabRequest')}</span>
              </button>
              <button 
                id="tab-select-schedule"
                onClick={() => setCurrentTab('schedule')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentTab === 'schedule' 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('tabSchedule')}</span>
              </button>
              <button 
                id="tab-select-widget"
                onClick={() => setCurrentTab('widget')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentTab === 'widget' 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('tabWidget')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: PLAYER & HISTORY & UPCOMING QUEUE */}
        {/* ------------------------------------------------------------- */}
        {currentTab === 'player' && (
          <div id="player-tab-content" className="p-4 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* Now Playing Widget Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Premium Vinyl / Case Box */}
              <div id="now-playing-card" className="glass-premium p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 group">
                
                {/* Backlit glow matching cover color */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                
                {/* Album Cover wrapper */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-xl border border-zinc-800 group-hover:scale-102 transition duration-500 bg-zinc-950 flex items-center justify-center">
                    {nowPlaying.art ? (
                      <img 
                        src={nowPlaying.art} 
                        alt="Album Cover" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://radio.sotyai.com/static/img/logo.png';
                        }}
                      />
                    ) : (
                      <Music2 className="w-16 h-16 text-zinc-700 animate-pulse" />
                    )}
                    {/* Tiny visualizer badge on top of art */}
                    {isPlaying && (
                      <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center space-x-1 border border-zinc-800">
                        <span className="flex h-1.5 w-1.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[8px] font-bold font-mono uppercase tracking-wider text-emerald-400">Stream Live</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Song info and stats */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full text-center md:text-left">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 font-bold block mb-1">
                      {t('nowPlaying')}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-100 truncate w-full group-hover:text-white transition-colors" title={nowPlaying.title || 'Live Stream'}>
                      {nowPlaying.title || 'กำลังโหลดสัญญาณเสียง...'}
                    </h3>
                    <p className="text-zinc-400 mt-1 truncate text-sm md:text-base" title={nowPlaying.artist || 'TryMeNow Radio'}>
                      {nowPlaying.artist || 'TryMeNow Station'}
                    </p>
                  </div>

                  {/* Real-time Progressive Timer Timeline */}
                  <div className="mt-6 w-full space-y-1">
                    <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden relative">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                        style={{ 
                          width: `${progressPercent}%`,
                          backgroundColor: activeThemeColor
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                      <span>{formatTime(trackElapsed)}</span>
                      <span>{trackDuration > 0 ? formatTime(trackDuration) : 'Live Stream'}</span>
                    </div>
                  </div>

                  {/* Interactive Status Badges */}
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                    <div className="text-[11px] text-zinc-300 font-mono flex items-center bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800/40">
                      <Users className="w-3.5 h-3.5 text-indigo-400 mr-2" style={{ color: activeThemeColor }} />
                      <span>{t('listeners')}: <strong className="text-white">{nowPlaying.listeners}</strong></span>
                    </div>
                    <button 
                      id="share-current-song"
                      onClick={() => copyToClipboard(nowPlaying)}
                      className="text-[11px] text-zinc-400 font-mono hover:text-white flex items-center bg-zinc-900/80 hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-800/40 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 mr-1.5" />
                      <span>{t('shareBtn')}</span>
                    </button>
                  </div>

                  {/* Listen and Reload Quick Controls */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start border-t border-zinc-800/20 pt-4">
                    <button 
                      id="btn-listen-radio"
                      onClick={handlePlayToggle}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1.5 cursor-pointer shadow-lg hover:scale-102 ${
                        isPlaying 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/20'
                      }`}
                      style={{ backgroundColor: !isPlaying ? activeThemeColor : undefined }}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
                          <span>หยุดฟัง ({t('listenRadio')})</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current text-white" />
                          <span>{t('listenRadio')}</span>
                        </>
                      )}
                    </button>

                    <button 
                      id="btn-reload-radio"
                      onClick={async () => {
                        setStreamStatus('connecting');
                        if (audioRef.current) {
                          audioRef.current.pause();
                          audioRef.current.src = currentStation.stream + (currentStation.stream.includes('?') ? '&' : '?') + 'cb=' + Date.now();
                          audioRef.current.load();
                          try {
                            await audioRef.current.play();
                            setIsPlaying(true);
                            setStreamStatus('connected');
                          } catch (err) {
                            console.error('Playback reload failed', err);
                            setIsPlaying(false);
                            setStreamStatus('stalled');
                          }
                        }
                        
                        await Promise.all([
                          fetchNowPlaying(),
                          fetchQueue(),
                          fetchSchedule(),
                          fetchStationInfo()
                        ]);
                        showToast(lang === 'th' ? 'รีโหลดสัญญาณวิทยุและข้อมูลเรียบร้อยแล้ว!' : 'Radio stream and metadata reloaded successfully!', 'success');
                      }}
                      className="text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1.5 cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50 hover:scale-102 shadow-md"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${streamStatus === 'connecting' ? 'animate-spin' : ''}`} />
                      <span>{t('reloadRadio')}</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Glowing Waves Canvas Container */}
              <AudioWaveVisualizer 
                isPlaying={isPlaying} 
                volume={volume} 
                themeColor={activeThemeColor} 
              />

              {/* Station General Info Segment */}
              <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-850 flex flex-col shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 flex-shrink-0" style={{ color: activeThemeColor, backgroundColor: activeThemeColor + '10' }}>
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">{t('aboutStation')}</h4>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Station Specifications</p>
                  </div>
                </div>

                {isLoadingStationInfo ? (
                  <div className="flex items-center justify-center py-6 space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" style={{ color: activeThemeColor }} />
                    <span className="text-xs text-zinc-500">{t('loading')}</span>
                  </div>
                ) : stationInfo ? (
                  <div className="space-y-4">
                    {/* Station Description */}
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                      {stationInfo.description || 'ไม่มีข้อมูลอธิบายสถานีในขณะนี้ (No description available for this station)'}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-zinc-950/30 p-2.5 rounded-xl border border-zinc-850/40 text-center md:text-left">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">Frontend Stream</span>
                        <span className="text-xs font-bold text-zinc-200 mt-0.5 block capitalize">{stationInfo.frontend || 'Icecast'}</span>
                      </div>
                      <div className="bg-zinc-950/30 p-2.5 rounded-xl border border-zinc-850/40 text-center md:text-left">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">Backend AutoDJ</span>
                        <span className="text-xs font-bold text-zinc-200 mt-0.5 block capitalize">{stationInfo.backend || 'Liquidsoap'}</span>
                      </div>
                      <div className="bg-zinc-950/30 p-2.5 rounded-xl border border-zinc-850/40 text-center md:text-left col-span-2 md:col-span-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">Timezone / เวลา</span>
                        <span className="text-xs font-bold text-zinc-200 mt-0.5 block truncate" title={stationInfo.timezone}>{stationInfo.timezone || 'UTC'}</span>
                      </div>
                    </div>

                    {/* Stream Mounts & Streams list */}
                    {stationInfo.mounts && stationInfo.mounts.length > 0 && (
                      <div className="bg-zinc-950/20 rounded-xl p-3 border border-zinc-900">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2 block">
                          จุดเชื่อมต่อสัญญาณเสียง (Audio Mountpoints)
                        </span>
                        <div className="space-y-1.5">
                          {stationInfo.mounts.map((mount: any) => (
                            <div key={mount.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 text-xs">
                              <span className="font-mono text-zinc-300 font-bold truncate pr-2">{mount.name}</span>
                              <div className="flex items-center space-x-2 flex-shrink-0 font-mono text-[10px]">
                                <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase">{mount.format}</span>
                                <span className="text-indigo-400 font-bold" style={{ color: activeThemeColor }}>{mount.bitrate} kbps</span>
                                {mount.listeners && (
                                  <span className="text-emerald-400 font-bold">● {mount.listeners.current}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Playlist downloads links */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {stationInfo.playlist_m3u_url && (
                        <a 
                          href={stationInfo.playlist_m3u_url}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-700/40 flex items-center transition"
                        >
                          <ExternalLink className="w-3 h-3 mr-1.5" />
                          <span>Download .M3U Playlist</span>
                        </a>
                      )}
                      {stationInfo.playlist_pls_url && (
                        <a 
                          href={stationInfo.playlist_pls_url}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-700/40 flex items-center transition"
                        >
                          <ExternalLink className="w-3 h-3 mr-1.5" />
                          <span>Download .PLS Playlist</span>
                        </a>
                      )}
                      {stationInfo.public_player_url && (
                        <a 
                          href={stationInfo.public_player_url}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-mono font-bold bg-zinc-900 hover:bg-indigo-950 text-indigo-400 hover:text-white px-3 py-1.5 rounded-lg border border-indigo-500/20 flex items-center transition"
                          style={{ borderColor: activeThemeColor + '30', color: activeThemeColor }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1.5" />
                          <span>AzuraCast Public Page</span>
                        </a>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-zinc-950/20 p-4 rounded-xl border border-zinc-900 text-center">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      เชื่อมต่อกับข้อมูลจำเพาะของสถานีหลักเรียบร้อย สตรีมเสียงผ่านเซิร์ฟเวอร์สำรองมาตรฐาน TMN Audio Direct เข้ารหัสแบบสเตอริโอความละเอียดสูง
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar Column: Queue & Playback History (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              
              {/* Upcoming Queue Segments (Enhances session times) */}
              {!queueError && (
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-850 flex flex-col shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ListMusic className="w-4 h-4 text-indigo-400" style={{ color: activeThemeColor }} />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                        {t('upcomingQueue')}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold" style={{ color: activeThemeColor, backgroundColor: activeThemeColor + '15' }}>
                      {upcomingQueue.length} {t('upNext')}
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
                    {upcomingQueue.length > 0 ? (
                      upcomingQueue.map((item, idx) => (
                        <div 
                          key={item.id || idx} 
                          className="flex items-center space-x-3 p-2 bg-zinc-950/50 rounded-xl hover:bg-zinc-950 transition border border-zinc-850/20 group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 shadow-sm border border-zinc-900">
                            <img 
                              src={item.song.art || 'https://radio.sotyai.com/static/img/logo.png'} 
                              className="w-full h-full object-cover"
                              alt="Up next"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://radio.sotyai.com/static/img/logo.png';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <p className="text-xs font-bold text-zinc-100 truncate flex-1">{item.song.title}</p>
                              {item.is_request && (
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] px-1 py-0.2 rounded font-bold font-mono uppercase tracking-wider scale-90 flex-shrink-0">
                                  REQUEST
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-400 truncate mt-0.5">{item.song.artist || 'ศิลปินนิรนาม'}</p>
                            
                            {/* Extra info from real API */}
                            <div className="flex items-center space-x-2 mt-1">
                              {item.playlist && (
                                <span className="text-[8px] bg-zinc-900 text-zinc-500 border border-zinc-800/80 px-1 py-0.2 rounded font-mono truncate max-w-[80px]">
                                  📁 {item.playlist}
                                </span>
                              )}
                              {item.duration ? (
                                <span className="text-[8px] text-zinc-500 font-mono">
                                  ⏱️ {formatTime(item.duration)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <span className="text-[9px] font-mono text-zinc-500 font-bold bg-zinc-900 px-1.5 py-1 rounded border border-zinc-850 block text-center">
                              #{idx + 1}
                            </span>
                            {item.played_at ? (
                              <span className="text-[8px] font-mono text-indigo-400 font-bold block mt-1" style={{ color: activeThemeColor }}>
                                {formatPlayedTime(item.played_at)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-zinc-500 text-xs flex flex-col items-center justify-center space-y-1">
                        <Music2 className="w-5 h-5 text-zinc-600 mb-1" />
                        <span>{t('noQueue')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Playback History List Segment */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-850 flex flex-col shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                    {t('playbackHistory')}
                  </h3>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[290px] pr-1">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <div 
                        key={item.sh_id} 
                        className="flex items-center justify-between p-2 hover:bg-zinc-950/70 rounded-xl border-b border-zinc-850/50 transition group"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 shadow-md">
                            <img 
                              src={item.song.art || 'https://radio.sotyai.com/static/img/logo.png'} 
                              className="w-full h-full object-cover" 
                              alt="Cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://radio.sotyai.com/static/img/logo.png';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p 
  className="text-xs font-bold text-zinc-200 truncate group-hover:text-[var(--hover-color)] transition-colors" 
  style={{ '--hover-color': activeThemeColor } as React.CSSProperties}
>
                              {item.song.title}
                            </p>
                            <p className="text-[10px] text-zinc-400 truncate mt-0.5">{item.song.artist}</p>
                          </div>
                        </div>

                        {/* Request action or played time badge */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-zinc-500 font-bold bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-900">
                            {formatPlayedTime(item.played_at)}
                          </span>
                          <button
                            id={`request-from-history-${item.sh_id}`}
                            onClick={() => triggerHistorySearch(item.song.title)}
                            className="opacity-0 group-hover:opacity-100 bg-zinc-800 hover:bg-indigo-600 text-zinc-200 hover:text-white p-1.5 rounded-lg transition-all duration-300 cursor-pointer"
                            title={t('requestThis')}
                          >
                            <Search className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    ))
                  ) : (
                    <p className="text-center text-zinc-500 py-8 text-xs">{t('noHistory')}</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: SONG REQUEST PANEL */}
        {/* ------------------------------------------------------------- */}
        {currentTab === 'request' && (
          <div id="request-tab-content" className="p-4 md:p-8 max-w-4xl mx-auto w-full animate-fade-in">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-850 shadow-xl space-y-6">
              
              {/* Search Heading & Stats */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-850 pb-5">
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
                    <Search className="w-5.5 h-5.5 text-indigo-400 animate-pulse" style={{ color: activeThemeColor }} />
                    <span>{t('tabRequest')}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    ค้นหาเพลงโปรดแล้วกดขอเพลงเพื่อส่งเข้าคิว AutoDJ ของสถานีได้ทันที
                  </p>
                </div>
                
                {/* Stats badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold font-mono bg-zinc-950 text-zinc-400 px-3 py-1.5 rounded-xl border border-zinc-850">
                    🎵 คลังเพลงทั้งหมด: <span className="text-zinc-200" style={{ color: activeThemeColor }}>{requestableSongs.length}</span> เพลง
                  </span>
                  {searchQuery && (
                    <span className="text-[11px] font-bold font-mono bg-indigo-950/40 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-900/50" style={{ borderColor: activeThemeColor + '30', color: activeThemeColor }}>
                      🔍 ค้นพบ: <span className="font-extrabold">{filteredSongs.length}</span> เพลง
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Artist pills & Popular Tags */}
              <div className="space-y-3">
                
                {/* Top Artists Pills */}
                {topArtists.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      🧑‍🎤 ศิลปินยอดนิยมในคลัง (Popular Artists)
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                      <button
                        onClick={() => setSearchQuery('')}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex-shrink-0 border ${
                          !searchQuery 
                            ? 'bg-zinc-100 text-zinc-950 border-zinc-100' 
                            : 'bg-zinc-950/50 text-zinc-400 border-zinc-850 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        ทั้งหมด (All)
                      </button>
                      {topArtists.map((artist) => {
                        const isSelected = searchQuery.toLowerCase() === artist.name.toLowerCase();
                        return (
                          <button
                            key={artist.name}
                            onClick={() => setSearchQuery(isSelected ? '' : artist.name)}
                            style={{
                              backgroundColor: isSelected ? activeThemeColor : undefined,
                              borderColor: isSelected ? activeThemeColor : undefined,
                              color: isSelected ? '#ffffff' : undefined,
                            }}
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex-shrink-0 border flex items-center space-x-1 ${
                              isSelected
                                ? ''
                                : 'bg-zinc-950/50 text-zinc-300 border-zinc-850 hover:bg-zinc-800 hover:text-zinc-100'
                            }`}
                          >
                            <span>{artist.name}</span>
                            <span className={`text-[9px] font-mono px-1 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-zinc-900 text-zinc-500'}`}>
                              {artist.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Genre/Keyword tags */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                    🏷️ คำค้นหายอดนิยม:
                  </span>
                  {['Cover', 'Acoustic', 'Live', '90', '2000', 'Remix'].map((tag) => {
                    const isSelected = searchQuery.toLowerCase().includes(tag.toLowerCase());
                    return (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition border cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                            : 'bg-zinc-900/40 text-zinc-400 border-zinc-850/60 hover:text-zinc-200 hover:bg-zinc-800/40'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Live search input filter */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input 
                  id="song-search-input"
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="พิมพ์ชื่อเพลง หรือชื่อศิลปิน เพื่อค้นหาได้ทันที..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-20 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)]/30 transition-all shadow-inner"
                  style={{ '--focus-border': activeThemeColor } as React.CSSProperties}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
                  {searchQuery && (
                    <button 
                      id="clear-search-query"
                      onClick={() => setSearchQuery('')}
                      className="text-[11px] font-extrabold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              
              {/* Song List Results */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => {
                    const isRequestingThis = isSubmittingRequest === song.request_id;
                    return (
                      <div 
                        key={song.request_id} 
                        className="flex items-center justify-between p-3 bg-zinc-950/40 rounded-xl hover:bg-zinc-950/90 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/[0.02]"
                        style={{
                          '--hover-border': activeThemeColor + '25'
                        } as any}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-4">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 shadow border border-zinc-900/60 group-hover:scale-105 transition-transform duration-300">
                            <img 
                              src={song.song.art || 'https://radio.sotyai.com/static/img/logo.png'} 
                              className="w-full h-full object-cover" 
                              alt="Cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://radio.sotyai.com/static/img/logo.png';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-zinc-200 truncate group-hover:text-white transition-colors">
                              {song.song.title}
                            </p>
                            <p className="text-xs text-zinc-400 truncate mt-0.5 flex items-center space-x-1">
                              <span>👤 {song.song.artist || 'ไม่ระบุศิลปิน (Unknown)'}</span>
                            </p>
                          </div>
                        </div>

                        {/* Request trigger Button */}
                        <button 
                          id={`submit-request-${song.request_id}`}
                          onClick={() => submitSongRequest(song.request_id, song.song.title)}
                          disabled={!!isSubmittingRequest}
                          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center space-x-1.5 cursor-pointer select-none ${
                            isRequestingThis 
                              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:scale-[1.03] active:scale-[0.98]'
                          }`}
                          style={{ backgroundColor: !isRequestingThis ? activeThemeColor : undefined }}
                        >
                          {isRequestingThis ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>{t('requesting')}</span>
                            </>
                          ) : (
                            <>
                              <Music2 className="w-3.5 h-3.5" />
                              <span>{t('requestBtn')}</span>
                            </>
                          )}
                        </button>

                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-zinc-500 py-16 flex flex-col items-center justify-center space-y-3 bg-zinc-950/20 rounded-2xl border border-zinc-900 border-dashed">
                    <Music2 className="w-10 h-10 text-zinc-700 animate-pulse" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-400">ไม่พบเพลงที่ต้องการค้นหา</p>
                      <p className="text-xs text-zinc-500">ลองใช้คำสำคัญอื่นหรือกดปุ่มเพื่อล้างค่าตัวกรอง</p>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-2 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      ล้างคำค้นหาทั้งหมด (Reset Search)
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: SCHEDULE TIMETABLE */}
        {/* ------------------------------------------------------------- */}
        {currentTab === 'schedule' && (
          <div id="schedule-tab-content" className="p-4 md:p-8 max-w-4xl mx-auto w-full">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-850 shadow-xl">
              
              {/* Timetable Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-400" style={{ color: activeThemeColor }} />
                  <h3 className="text-lg font-bold text-zinc-100">{t('scheduleTitle')}</h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  Weekly Timetable
                </span>
              </div>

              {/* Active Timetable List */}
              <div className="space-y-4">
                {schedule.length > 0 ? (
                  schedule.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        item.is_active 
                          ? 'bg-indigo-600/10 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.05)]' 
                          : 'bg-zinc-950/40 border-zinc-900 hover:bg-zinc-950'
                      }`}
                      style={{ 
                        backgroundColor: item.is_active ? activeThemeColor + '10' : undefined,
                        borderColor: item.is_active ? activeThemeColor + '30' : undefined
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3.5">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            item.is_active ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500'
                          }`}
                          style={{ backgroundColor: item.is_active ? activeThemeColor : undefined }}
                          >
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-zinc-100">{item.name}</h4>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                                const isIncluded = item.days.includes(idx);
                                return (
                                  <span 
                                    key={day} 
                                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                      isIncluded 
                                        ? 'bg-zinc-800 text-zinc-200 font-bold' 
                                        : 'bg-zinc-950 text-zinc-600'
                                    }`}
                                  >
                                    {day}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Timing and badge info */}
                        <div className="flex items-center justify-between md:justify-end gap-3 border-t border-zinc-900 md:border-0 pt-3 md:pt-0">
                          <div className="text-right">
                            <span className="text-xs text-zinc-400 font-mono uppercase block tracking-wider">ON AIR TIME</span>
                            <span className="text-sm font-bold text-zinc-200 font-mono mt-0.5 block">
                              {item.start_time} - {item.end_time}
                            </span>
                          </div>
                          {item.is_active && (
                            <span className="text-[10px] bg-emerald-500 text-zinc-950 font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                              {t('onAir')}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  // Elegant default fallbacks for stations without custom schedule setup
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-indigo-400" style={{ color: activeThemeColor }}>
                            <Radio className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-zinc-200">TMN Daily Power Beats</h4>
                            <span className="text-[10px] text-zinc-500">Everyday Playlist</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-400 font-mono block">06:00 - 12:00</span>
                          <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase font-mono font-bold mt-1 inline-block">Scheduled</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5" style={{ borderColor: activeThemeColor + '30', backgroundColor: activeThemeColor + '05' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-500 text-zinc-950 flex items-center justify-center" style={{ backgroundColor: activeThemeColor }}>
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-zinc-100">TryMeNow Non-Stop Hits</h4>
                            <span className="text-[10px] text-indigo-400" style={{ color: activeThemeColor }}>AutoDJ Active</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-400 font-mono block">12:00 - 20:00</span>
                          <span className="text-[9px] text-zinc-950 bg-emerald-400 px-2 py-0.5 rounded-full uppercase font-mono font-bold mt-1 inline-block animate-pulse">ACTIVE NOW</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-zinc-200">Midnight Chillout Deck</h4>
                            <span className="text-[10px] text-zinc-500">Night owls special mix</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-400 font-mono block">20:00 - 06:00</span>
                          <span className="text-[9px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full uppercase font-mono font-bold mt-1 inline-block">Scheduled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: PLAYER EMBED WIDGET BUILDER */}
        {/* ------------------------------------------------------------- */}
        {currentTab === 'widget' && (
          <div id="widget-tab-content" className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-fade-in">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-850 shadow-xl">
              
              {/* Widget Builder Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-indigo-400" style={{ color: activeThemeColor }} />
                  <h3 className="text-lg font-bold text-zinc-100">{t('widgetTitle')}</h3>
                </div>
                <span className="text-xs bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold" style={{ color: activeThemeColor, backgroundColor: activeThemeColor + '15' }}>
                  Widget Builder v1.0
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                
                {/* Options Panel (6 cols) */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block mb-3">1. Select Radio Station</span>
                    <div className="grid grid-cols-1 gap-2">
                      {STATIONS.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setWidgetStation(st.id)}
                          className={`flex items-center justify-between p-3 rounded-lg text-xs font-bold border transition ${
                            widgetStation === st.id
                              ? 'bg-zinc-800 border-indigo-500 text-white'
                              : 'bg-zinc-900/30 border-zinc-850 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                          }`}
                          style={{ borderColor: widgetStation === st.id ? activeThemeColor : undefined }}
                        >
                          <span className="truncate">{st.name}</span>
                          <span className="text-[9px] font-mono bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-500 uppercase">{st.id.replace('trymenow_-_', '')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850/60 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block mb-2">2. Color Preset Theme</span>
                      <select
                        value={widgetTheme}
                        onChange={(e: any) => setWidgetTheme(e.target.value)}
                        className="w-full bg-zinc-900 text-xs text-zinc-200 p-2.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="dark">Cosmic Dark</option>
                        <option value="light">Crisp Light</option>
                        <option value="glass">Ice Glass</option>
                        <option value="neon">Laser Neon</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block mb-2">3. Width Resolution</span>
                      <input 
                        type="text" 
                        value={widgetWidth}
                        onChange={(e) => setWidgetWidth(e.target.value)}
                        placeholder="e.g., 100%, 400px"
                        className="w-full bg-zinc-900 text-xs text-zinc-200 p-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850/60 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block mb-1">4. Feature Flags</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={widgetAutoplay}
                          onChange={(e) => setWidgetAutoplay(e.target.checked)}
                          className="rounded border-zinc-800 bg-zinc-900 accent-indigo-500 w-3.5 h-3.5"
                          style={{ accentColor: activeThemeColor }}
                        />
                        <span>Enable Autoplay</span>
                      </label>

                      <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={widgetShowWaveform}
                          onChange={(e) => setWidgetShowWaveform(e.target.checked)}
                          className="rounded border-zinc-800 bg-zinc-900 accent-indigo-500 w-3.5 h-3.5"
                          style={{ accentColor: activeThemeColor }}
                        />
                        <span>Show Audio Waveform</span>
                      </label>

                      <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={widgetShowCover}
                          onChange={(e) => setWidgetShowCover(e.target.checked)}
                          className="rounded border-zinc-800 bg-zinc-900 accent-indigo-500 w-3.5 h-3.5"
                          style={{ accentColor: activeThemeColor }}
                        />
                        <span>Show Album Art</span>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Live Preview and Code output Column (6 cols) */}
                <div className="lg:col-span-6 flex flex-col space-y-4">
                  {/* Title Preview */}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block px-1">Live Widget Preview</span>
                  
                  {/* Generated Iframe element inside preview box */}
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850/70 flex items-center justify-center min-h-[220px]">
                    <iframe
                      src={`${window.location.origin}${window.location.pathname}?embed=true&station=${widgetStation}&theme=${widgetTheme}&autoplay=${widgetAutoplay}&volume=${widgetVolume}&waveform=${widgetShowWaveform}&cover=${widgetShowCover}`}
                      className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300"
                      style={{
                        width: widgetWidth,
                        height: `${widgetHeight}px`
                      }}
                      title="TryMeNow Player Widget"
                    />
                  </div>

                  {/* Generated Embed Code Output */}
                  <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-850/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Generated Iframe Code</span>
                      <button
                        onClick={() => {
                          const code = `<iframe src="${window.location.origin}${window.location.pathname}?embed=true&station=${widgetStation}&theme=${widgetTheme}&autoplay=${widgetAutoplay}&volume=${widgetVolume}&waveform=${widgetShowWaveform}&cover=${widgetShowCover}" width="${widgetWidth}" height="${widgetHeight}" frameborder="0" allow="autoplay"></iframe>`;
                          navigator.clipboard.writeText(code);
                          showToast(lang === 'th' ? 'คัดลอกโค้ดฝังวิดเจ็ตสำเร็จ!' : 'Widget embed code copied!', 'success');
                        }}
                        className="text-[10px] font-bold font-mono bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 px-2.5 py-1 rounded border border-zinc-750 flex items-center space-x-1 cursor-pointer transition"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                    
                    <textarea
                      readOnly
                      value={`<iframe src="${window.location.origin}${window.location.pathname}?embed=true&station=${widgetStation}&theme=${widgetTheme}&autoplay=${widgetAutoplay}&volume=${widgetVolume}&waveform=${widgetShowWaveform}&cover=${widgetShowCover}" width="${widgetWidth}" height="${widgetHeight}" frameborder="0" allow="autoplay"></iframe>`}
                      className="w-full bg-zinc-900/50 p-3 rounded-lg border border-zinc-850 font-mono text-[10px] text-zinc-300 h-24 focus:outline-none select-all"
                    />
                  </div>

                  {/* Usage Manual Guide */}
                  <div className="bg-zinc-950/20 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold block mb-1">คู่มือการใช้งาน (Widget Usage Instructions)</span>
                    <ul className="text-[11px] text-zinc-500 list-disc list-inside space-y-1 leading-relaxed">
                      <li>Copy the generated iframe code snippet.</li>
                      <li>Paste it into any HTML web page or block builder (WordPress, Wix, custom site).</li>
                      <li>Adjust width or height attributes to fit your host design grid.</li>
                      <li>Secure stream connections require SSL/HTTPS enabled on your page.</li>
                    </ul>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MOBILE DRAWER NAVIGATION MENU */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div id="mobile-sidebar-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-start lg:hidden">
          <div className="w-80 bg-zinc-900 h-full p-6 flex flex-col justify-between border-r border-zinc-850 relative">
            
            {/* Close Button absolute */}
            <button 
              id="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col h-full overflow-hidden">
              {/* Brand Heading */}
              <div className="flex items-center space-x-3 mb-8">
                <div 
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg"
                  style={{ backgroundImage: `linear-gradient(135deg, ${activeThemeColor}, #09090b)` }}
                >
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-base font-bold font-title tracking-wider text-zinc-100">
                    TRYMENOW
                  </h1>
                  <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase font-bold" style={{ color: activeThemeColor }}>
                    Premium Mobile
                  </span>
                </div>
              </div>

              {/* External Links */}
              <div className="mb-6 bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1.5 block mb-2 font-bold">
                  TMN Portals
                </span>
                <div className="space-y-1">
                  <a 
                    href="https://tmn.sotyai.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <span>{t('homeMenu')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  </a>
                  <a 
                    href="https://radio.sotyai.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <span>{t('portMenu')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  </a>
                  <a 
                    href="https://xat.com/trymenow" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <span>{t('chatMenu')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  </a>
                </div>
              </div>

              {/* Stations segment */}
              <div className="flex-1 overflow-y-auto pr-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-1.5 block mb-2 font-bold">
                  {t('stations')}
                </span>
                <div className="space-y-1.5">
                  {STATIONS.map((st) => {
                    const isActive = currentStation.id === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => {
                          selectStation(st);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${
                          isActive 
                            ? 'bg-zinc-800 border-l-4 text-white font-bold' 
                            : 'bg-zinc-900/30 text-zinc-400 hover:bg-zinc-800/50'
                        }`}
                        style={{ borderLeftColor: isActive ? activeThemeColor : undefined }}
                      >
                        <span className="text-xs truncate">{st.name}</span>
                        {isActive && isPlaying ? (
                          <span className="text-[8px] bg-white text-zinc-900 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                            LIVE
                          </span>
                        ) : isActive ? (
                          <span className="text-[8px] bg-zinc-950 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                            ACTIVE
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Languages switcher */}
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2 font-bold">
                  Language / ภาษา
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`flex items-center space-x-2 p-2 rounded-lg text-xs transition border ${
                        lang === l.code 
                          ? 'bg-zinc-800 border-zinc-700 text-white font-bold' 
                          : 'bg-zinc-900/40 border-zinc-900 text-zinc-400'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span className="truncate">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STICKY BOTTOM PLAYER CONTROLLER BAR */}
      {/* ========================================================= */}
      <footer id="bottom-sticky-player" className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-850/60 px-4 md:px-6 flex items-center justify-between z-40 shadow-2xl">
        
        {/* Left Side: Selected Station Info and track metadata */}
        <div className="flex items-center space-x-3.5 w-1/3 min-w-0">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 shadow border border-zinc-800">
            <img 
              src={nowPlaying.art || 'https://radio.sotyai.com/static/img/logo.png'} 
              className="w-full h-full object-cover" 
              alt="Track Artwork"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://radio.sotyai.com/static/img/logo.png';
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-bold text-zinc-100 truncate" title={nowPlaying.title || 'Live Stream'}>
              {nowPlaying.title || currentStation.name}
            </p>
            <p className="text-[10px] md:text-xs text-zinc-400 truncate mt-0.5" title={nowPlaying.artist || 'TryMeNow Radio'}>
              {nowPlaying.artist || 'TryMeNow Radio'}
            </p>
          </div>
        </div>
        
        {/* Center Side: Main Playback Ring controls */}
        <div className="flex flex-col items-center w-1/3">
          <button 
            id="play-pause-toggle"
            onClick={handlePlayToggle} 
            className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg text-zinc-950 cursor-pointer relative"
            style={{ 
              backgroundColor: activeThemeColor,
              boxShadow: isPlaying ? `0 0 16px ${activeThemeColor}40` : undefined
            }}
            title={isPlaying ? 'Pause Stream' : 'Play Stream'}
          >
            {streamStatus === 'connecting' ? (
              <RefreshCw className="w-5.5 h-5.5 animate-spin text-white" />
            ) : isPlaying ? (
              <Pause className="w-5.5 h-5.5 fill-current text-white" />
            ) : (
              <Play className="w-5.5 h-5.5 fill-current ml-0.5 text-white" />
            )}
          </button>
          
          {/* Signal Indicator */}
          <div className="mt-1.5 flex items-center space-x-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${
              streamStatus === 'connected' && isPlaying 
                ? 'bg-emerald-500' 
                : streamStatus === 'connecting'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-zinc-600'
            }`} />
            <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-500 font-bold">
              {streamStatus === 'connected' ? t('connected') : streamStatus === 'connecting' ? t('connecting') : t('stalled')}
            </span>
          </div>
        </div>

        {/* Right Side: Volume slide overlay controls */}
        <div className="flex items-center justify-end space-x-3 w-1/3 select-none">
          <button 
            id="mute-unmute-toggle"
            onClick={toggleMute} 
            className="text-zinc-400 hover:text-white transition cursor-pointer"
            title="Mute / Unmute"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4.5 h-4.5" />
            ) : volume < 0.4 ? (
              <Volume1 className="w-4.5 h-4.5" />
            ) : (
              <Volume2 className="w-4.5 h-4.5" />
            )}
          </button>
          
          <input 
            id="volume-slider-input"
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange} 
            className="w-16 md:w-24 accent-indigo-500 bg-zinc-800 h-1 rounded-full appearance-none cursor-pointer hover:accent-indigo-400 transition"
            style={{ accentColor: activeThemeColor }}
          />
        </div>

      </footer>

      {/* ========================================================= */}
      {/* CUSTOM PREMIUM FLOATING TOAST LIST */}
      {/* ========================================================= */}
      <div id="toast-overlay-container" className="fixed top-5 right-5 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="flex items-center space-x-3 p-3.5 rounded-xl border shadow-2xl glass backdrop-blur-xl animate-fade-in pointer-events-auto"
            style={{
              borderColor: toast.type === 'success' ? '#10b98130' : toast.type === 'error' ? '#ef444430' : '#3b82f630'
            }}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            {toast.type === 'info' && <Radio className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />}
            
            <p className="text-xs font-bold text-zinc-100">{toast.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

// ==========================================
// EMBEDDABLE RADIO PLAYER WIDGET
// ==========================================

function EmbedPlayer() {
  const urlParams = new URLSearchParams(window.location.search);
  const stationId = urlParams.get('station') || 'trymenow_2';
  const theme = urlParams.get('theme') || 'dark';
  const autoplay = urlParams.get('autoplay') === 'true';
  const initialVolume = parseFloat(urlParams.get('volume') || '0.8');
  const showWaveform = urlParams.get('waveform') !== 'false';
  const showCover = urlParams.get('cover') !== 'false';

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [metadata, setMetadata] = useState({
    title: 'Loading...',
    artist: 'TryMeNow Radio',
    art: 'https://radio.sotyai.com/static/img/logo.png',
    listeners: 0
  });
  const [streamStatus, setStreamStatus] = useState<'connected' | 'connecting' | 'stalled'>('connected');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Find stream URL from STATIONS
  const stationObj = STATIONS.find(s => s.id === stationId) || STATIONS[0];
  const streamUrl = stationObj.stream;

  const fetchEmbedMetadata = async () => {
    try {
      const res = await fetch(`https://radio.sotyai.com/api/nowplaying/${stationId}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setMetadata({
          title: data?.now_playing?.song?.title || 'Live Stream',
          artist: data?.now_playing?.song?.artist || 'TryMeNow Station',
          art: data?.now_playing?.song?.art || 'https://radio.sotyai.com/static/img/logo.png',
          listeners: data?.listeners?.current || 0
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmbedMetadata();
    const interval = setInterval(fetchEmbedMetadata, 15000);
    return () => clearInterval(interval);
  }, [stationId]);

  useEffect(() => {
    const audio = new Audio(streamUrl);
    audio.crossOrigin = 'anonymous';
    audio.preload = 'none';
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setStreamStatus('connecting');
    const onPlaying = () => setStreamStatus('connected');
    const onStalled = () => setStreamStatus('stalled');
    const onError = () => setStreamStatus('stalled');

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('stalled', onStalled);
    audio.addEventListener('error', onError);

    if (autoplay) {
      audio.play().then(() => {
        setIsPlaying(true);
        setStreamStatus('connected');
      }).catch(err => {
        console.warn('Autoplay blocked by browser policy:', err);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('stalled', onStalled);
      audio.removeEventListener('error', onError);
    };
  }, [streamUrl, autoplay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setStreamStatus('connecting');
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setStreamStatus('connected');
      }).catch(err => {
        console.error(err);
        setIsPlaying(false);
        setStreamStatus('stalled');
      });
    }
  };

  // Determine theme styling classes
  let bgClass = 'bg-zinc-950 text-zinc-100 border border-zinc-850';
  let accentColor = '#6366f1'; // Indigo default
  if (stationId === 'trymenow_-_90s') accentColor = '#f59e0b';
  if (stationId === 'trymenow_-_hook') accentColor = '#f43f5e';
  if (stationId === 'trymenow_-_lukthong') accentColor = '#10b981';

  if (theme === 'light') {
    bgClass = 'bg-white text-zinc-800 border border-zinc-200 shadow-md';
  } else if (theme === 'glass') {
    bgClass = 'bg-zinc-900/70 backdrop-blur-md text-zinc-100 border border-white/10';
  } else if (theme === 'neon') {
    bgClass = 'bg-black text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]';
  }

  return (
    <div className={`w-full h-full p-4 flex flex-col justify-between overflow-hidden select-none ${bgClass}`} style={{ fontFamily: 'Kanit, sans-serif' }}>
      <div className="flex items-center space-x-3.5 min-w-0">
        {showCover && (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800 bg-zinc-950 shadow-md">
            <img 
              src={metadata.art} 
              className="w-full h-full object-cover" 
              alt="Art"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://radio.sotyai.com/static/img/logo.png';
              }}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isPlaying ? '#10b981' : '#71717a' }} />
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-bold">
              {isPlaying ? 'ON AIR' : 'PAUSED'}
            </span>
          </div>
          <p className="text-sm font-bold truncate pr-2" style={{ color: theme === 'light' ? '#18181b' : '#f4f4f5' }}>
            {metadata.title}
          </p>
          <p className="text-xs truncate text-zinc-400 mt-0.5">
            {metadata.artist}
          </p>
        </div>
      </div>

      {/* Embedded Live Waveform Visualizer */}
      {showWaveform && (
        <div className="flex items-center space-x-1 h-6 w-full px-2 my-1.5 overflow-hidden justify-center opacity-75">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full animate-pulse"
              style={{
                backgroundColor: accentColor,
                height: isPlaying ? `${Math.floor(Math.random() * 20) + 4}px` : '3px',
                transition: isPlaying ? 'height 0.15s ease-in-out' : 'all 0.5s ease',
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-850/30">
        <button
          onClick={handlePlayToggle}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white flex items-center space-x-1.5 shadow-md hover:scale-103 transition cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'LISTEN'}</span>
        </button>

        {/* Volume controller */}
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (parseFloat(e.target.value) > 0) setIsMuted(false);
            }}
            className="w-16 accent-indigo-500 bg-zinc-800 h-1 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: accentColor }}
          />
        </div>
      </div>
    </div>
  );
}
