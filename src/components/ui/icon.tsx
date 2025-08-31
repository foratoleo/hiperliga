import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Heroicons imports
import {
  // Navigation
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,

  // UI Elements  
  PlayIcon,
  PauseIcon,
  StopIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  StarIcon,
  ShareIcon,
  CheckIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,

  // Communication
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,

  // Business
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  CogIcon,
  DocumentIcon,
  FolderIcon,
  CameraIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,

  // Actions
  PlusIcon,
  MinusIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  PrinterIcon,
  LinkIcon,
  QrCodeIcon,
  
} from '@heroicons/react/24/outline'

import {
  // Filled versions for selected states
  HomeIcon as HomeIconSolid,
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
} from '@heroicons/react/24/solid'

const iconVariants = cva('inline-block', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
    },
    color: {
      default: 'text-current',
      muted: 'text-muted-foreground',
      primary: 'text-brand-primary',
      secondary: 'text-brand-secondary',
      success: 'text-brand-success',
      warning: 'text-yellow-500',
      danger: 'text-red-500',
      info: 'text-blue-500',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
})

export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'color'>,
    VariantProps<typeof iconVariants> {
  name: keyof typeof iconMap
  filled?: boolean
}

// Icon mapping
const iconMap = {
  // Navigation
  home: { outline: HomeIcon, filled: HomeIconSolid },
  menu: { outline: Bars3Icon, filled: Bars3Icon },
  close: { outline: XMarkIcon, filled: XMarkIcon },
  chevronDown: { outline: ChevronDownIcon, filled: ChevronDownIcon },
  chevronUp: { outline: ChevronUpIcon, filled: ChevronUpIcon },
  chevronLeft: { outline: ChevronLeftIcon, filled: ChevronLeftIcon },
  chevronRight: { outline: ChevronRightIcon, filled: ChevronRightIcon },
  arrowLeft: { outline: ArrowLeftIcon, filled: ArrowLeftIcon },
  arrowRight: { outline: ArrowRightIcon, filled: ArrowRightIcon },
  arrowUp: { outline: ArrowUpIcon, filled: ArrowUpIcon },
  arrowDown: { outline: ArrowDownIcon, filled: ArrowDownIcon },

  // Media
  play: { outline: PlayIcon, filled: PlayIcon },
  pause: { outline: PauseIcon, filled: PauseIcon },
  stop: { outline: StopIcon, filled: StopIcon },

  // UI Elements
  sun: { outline: SunIcon, filled: SunIcon },
  moon: { outline: MoonIcon, filled: MoonIcon },
  search: { outline: MagnifyingGlassIcon, filled: MagnifyingGlassIcon },
  eye: { outline: EyeIcon, filled: EyeIcon },
  eyeSlash: { outline: EyeSlashIcon, filled: EyeSlashIcon },
  heart: { outline: HeartIcon, filled: HeartIconSolid },
  star: { outline: StarIcon, filled: StarIconSolid },
  share: { outline: ShareIcon, filled: ShareIcon },
  check: { outline: CheckIcon, filled: CheckIcon },

  // Status
  checkCircle: { outline: CheckCircleIcon, filled: CheckCircleIconSolid },
  xCircle: { outline: XCircleIcon, filled: XCircleIconSolid },
  warning: { outline: ExclamationTriangleIcon, filled: ExclamationTriangleIconSolid },
  info: { outline: InformationCircleIcon, filled: InformationCircleIconSolid },

  // Communication
  phone: { outline: PhoneIcon, filled: PhoneIcon },
  email: { outline: EnvelopeIcon, filled: EnvelopeIcon },
  chat: { outline: ChatBubbleLeftRightIcon, filled: ChatBubbleLeftRightIcon },
  send: { outline: PaperAirplaneIcon, filled: PaperAirplaneIcon },

  // Business
  building: { outline: BuildingOfficeIcon, filled: BuildingOfficeIcon },
  location: { outline: MapPinIcon, filled: MapPinIcon },
  clock: { outline: ClockIcon, filled: ClockIcon },
  calendar: { outline: CalendarIcon, filled: CalendarIcon },
  user: { outline: UserIcon, filled: UserIcon },
  users: { outline: UsersIcon, filled: UsersIcon },
  settings: { outline: CogIcon, filled: CogIcon },
  document: { outline: DocumentIcon, filled: DocumentIcon },
  folder: { outline: FolderIcon, filled: FolderIcon },
  camera: { outline: CameraIcon, filled: CameraIcon },
  photo: { outline: PhotoIcon, filled: PhotoIcon },
  video: { outline: VideoCameraIcon, filled: VideoCameraIcon },
  music: { outline: MusicalNoteIcon, filled: MusicalNoteIcon },

  // Actions
  plus: { outline: PlusIcon, filled: PlusIcon },
  minus: { outline: MinusIcon, filled: MinusIcon },
  edit: { outline: PencilIcon, filled: PencilIcon },
  delete: { outline: TrashIcon, filled: TrashIcon },
  archive: { outline: ArchiveBoxIcon, filled: ArchiveBoxIcon },
  copy: { outline: DocumentDuplicateIcon, filled: DocumentDuplicateIcon },
  upload: { outline: CloudArrowUpIcon, filled: CloudArrowUpIcon },
  download: { outline: CloudArrowDownIcon, filled: CloudArrowDownIcon },
  print: { outline: PrinterIcon, filled: PrinterIcon },
  link: { outline: LinkIcon, filled: LinkIcon },
  qrCode: { outline: QrCodeIcon, filled: QrCodeIcon },
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size, color, filled = false, className, ...props }, ref) => {
    const iconConfig = iconMap[name]
    if (!iconConfig) {
      console.warn(`Icon "${name}" not found`)
      return null
    }

    const IconComponent = filled ? iconConfig.filled : iconConfig.outline

    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size, color }), className)}
        {...props}
      />
    )
  }
)
Icon.displayName = 'Icon'

// Specialized icon components
interface StatusIconProps extends Omit<IconProps, 'name'> {
  status: 'success' | 'error' | 'warning' | 'info'
}

const StatusIcon = React.forwardRef<SVGSVGElement, StatusIconProps>(
  ({ status, color, filled = true, ...props }, ref) => {
    const statusConfig = {
      success: { name: 'checkCircle' as const, color: 'success' as const },
      error: { name: 'xCircle' as const, color: 'danger' as const },
      warning: { name: 'warning' as const, color: 'warning' as const },
      info: { name: 'info' as const, color: 'info' as const },
    }

    const config = statusConfig[status]

    return (
      <Icon
        ref={ref}
        name={config.name}
        color={color || config.color}
        filled={filled}
        {...props}
      />
    )
  }
)
StatusIcon.displayName = 'StatusIcon'

// Loading spinner component
interface SpinnerProps extends Omit<IconProps, 'name'> {
  spinning?: boolean
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ spinning = true, size = 'md', className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn(
          iconVariants({ size }),
          spinning && 'animate-spin',
          className
        )}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }
)
Spinner.displayName = 'Spinner'

// Brand/Logo icons
const BrandIcon = React.forwardRef<
  SVGSVGElement,
  Omit<React.SVGProps<SVGSVGElement>, 'children'> & { size?: VariantProps<typeof iconVariants>['size'] }
>(({ size = 'md', className, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      className={cn(iconVariants({ size }), className)}
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      {/* Hiperliga brand icon - simplified representation */}
      <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
      <path 
        d="M30 35h40v10H55v20h-10V45H30V35z" 
        fill="currentColor"
      />
      <circle cx="35" cy="65" r="3" fill="currentColor" />
      <circle cx="50" cy="65" r="3" fill="currentColor" />
      <circle cx="65" cy="65" r="3" fill="currentColor" />
    </svg>
  )
})
BrandIcon.displayName = 'BrandIcon'

// Export types and components
export type { IconProps, StatusIconProps, SpinnerProps }
export { Icon, iconVariants, StatusIcon, Spinner, BrandIcon }
export default Icon