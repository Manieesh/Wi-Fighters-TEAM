import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Map,
  BarChart3,
  Building2,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  FileText,
  TrendingUp,
  Check,
  Send,
  UserPlus,
  Eye,
  SlidersHorizontal,
  Layers,
  MapPin,
  FolderOpen
} from "lucide-react";

const iconMap = {
  dashboard: LayoutDashboard,
  requests: ClipboardList,
  assigned: UserCheck,
  map: Map,
  pin: MapPin,
  analytics: BarChart3,
  trending: TrendingUp,
  departments: Building2,
  notifications: Bell,
  bell: Bell,
  profile: User,
  user: User,
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  close: X,
  x: X,
  search: Search,
  filter: Filter,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevron: ChevronDown,
  check: CheckCircle,
  checkMark: Check,
  alert: AlertTriangle,
  warning: AlertTriangle,
  clock: Clock,
  shield: ShieldCheck,
  external: ExternalLink,
  arrowRight: ArrowRight,
  refresh: RotateCcw,
  document: FileText,
  file: FileText,
  send: Send,
  assign: UserPlus,
  eye: Eye,
  sliders: SlidersHorizontal,
  layers: Layers,
  folder: FolderOpen
};

export default function Icon({ name, size = 18, className = "", "aria-label": ariaLabel, ...rest }) {
  const IconComponent = iconMap[String(name).toLowerCase()] || FileText;
  return (
    <IconComponent
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      strokeWidth={1.8}
      {...rest}
    />
  );
}

export { iconMap, Icon };
