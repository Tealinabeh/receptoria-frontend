import { formatTime } from '../utils/formatTime';

export function Timer({ time = 0 }) {
  if (time <= 0) return null;

  return (
    <div className="flex items-center space-x-1">
      <img src="/timer.png" alt="timer icon" className="w-4 h-4" />
      <span>{formatTime(time)}</span>
    </div>
  )
}
