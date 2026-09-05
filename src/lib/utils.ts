export function cn(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) result.push(key);
      }
    }
  }

  return result.join(' ');
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'critical':
    case 'high':
    case 'delayed':
    case 'disrupted':
      return '#EF4444';
    case 'elevated':
    case 'medium':
    case 'warning':
    case 'rerouted':
      return '#F97316';
    case 'watch':
    case 'moderate':
    case 'low':
      return '#EAB308';
    case 'healthy':
    case 'optimal':
    case 'on-schedule':
    case 'normal':
    default:
      return '#22C55E';
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'bg-red-500/10 text-red-400 border border-red-500/30';
    case 'elevated':
    case 'delayed':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    case 'watch':
      return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30';
    case 'healthy':
    case 'optimal':
    case 'on-schedule':
    default:
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
  }
}
