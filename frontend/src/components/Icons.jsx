/* Lightweight, consistent line-icon set (no external icon package needed). */
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>
);
export const ChatIcon = (p) => (
  <svg {...base} {...p}><path d="M21 12c0 4.4-4 8-9 8-1.1 0-2.2-.16-3.2-.46L3 21l1.6-4.3A7.9 7.9 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z" /></svg>
);
export const ListIcon = (p) => (
  <svg {...base} {...p}><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r="1.5" /><circle cx="3.5" cy="12" r="1.5" /><circle cx="3.5" cy="18" r="1.5" /></svg>
);
export const ChartIcon = (p) => (
  <svg {...base} {...p}><path d="M4 19V5M4 19h16" /><rect x="7" y="11" width="3" height="8" rx="1" /><rect x="12.5" y="7" width="3" height="12" rx="1" /><rect x="18" y="14" width="3" height="5" rx="1" /></svg>
);
export const CpuIcon = (p) => (
  <svg {...base} {...p}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></svg>
);
export const SettingsIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.3-.9-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9c.5.4 1.1.8 1.7 1l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.3.9 2-3.4Z" /></svg>
);
export const GlobeIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" /></svg>
);
export const ArrowRightIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const SparkleIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>
);
export const BrainIcon = (p) => (
  <svg {...base} {...p}><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5.6 3 3 0 0 0 2 5.4h2v-12a3 3 0 0 0 0-3Z" /><path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5.6 3 3 0 0 1-2 5.4h-2v-12a3 3 0 0 1 0-3Z" /></svg>
);
export const CheckIcon = (p) => (
  <svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>
);
export const UserIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
);
export const LogoutIcon = (p) => (
  <svg {...base} {...p}><path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
);
export const MenuIcon = (p) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const InboxIcon = (p) => (
  <svg {...base} {...p}><path d="M3 12h4l2 3h6l2-3h4" /><path d="M5 12 3.5 6.5A1 1 0 0 1 4.5 5h15a1 1 0 0 1 1 1.5L19 12v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6Z" /></svg>
);
export const SmileIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9h.01M15 9h.01" /></svg>
);
export const GridIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>
);
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.3-4.3" /></svg>
);
export const LayersIcon = (p) => (
  <svg {...base} {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>
);
export const LightbulbIcon = (p) => (
  <svg {...base} {...p}><path d="M9 18h6M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.3h6c0-1.1.4-1.8 1-2.3A7 7 0 0 0 12 2Z" /></svg>
);
export const BellIcon = (p) => (
  <svg {...base} {...p}><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16l-2-3Z" /><path d="M9.5 21a2.5 2.5 0 0 0 5 0" /></svg>
);
export const FileIcon = (p) => (
  <svg {...base} {...p}><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></svg>
);
export const MegaphoneIcon = (p) => (
  <svg {...base} {...p}><path d="M3 10v4a1 1 0 0 0 1 1h2l9 4V5L6 9H4a1 1 0 0 0-1 1Z" /><path d="M21 9a4 4 0 0 1 0 6" /></svg>
);
export const TrendUpIcon = (p) => (
  <svg {...base} {...p}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const ShieldIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" /></svg>
);
export const ClockIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
);
export const DownloadIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3v12m0 0-4-4m4 4 4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
);
export const EyeIcon = (p) => (
  <svg {...base} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const EyeOffIcon = (p) => (
  <svg {...base} {...p}><path d="M3 3l18 18" /><path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a14.6 14.6 0 0 1-3.3 4.1M6.2 6.2C4 7.8 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 3.4-.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
);
export const IdCardIcon = (p) => (
  <svg {...base} {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="12" r="2" /><path d="M14 10h6M14 14h4" /></svg>
);
export const ThumbsUpIcon = (p) => (
  <svg {...base} {...p}><path d="M7 11v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Z" /><path d="M7 11l4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2l-1.5 7a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-2v-7.5Z" /></svg>
);
export const ImageIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m4 17 5-5 3 3 4-4 4 4" /></svg>
);
export const UploadIcon = (p) => (
  <svg {...base} {...p}><path d="M12 16V4m0 0-4 4m4-4 4 4" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
);
export const XCircleIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="m9.5 9.5 5 5m0-5-5 5" /></svg>
);
export const AlertTriangleIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4M12 17h.01" /></svg>
);
