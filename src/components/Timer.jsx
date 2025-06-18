import { minutesToTime } from '../utils/timeUtils';

export function Timer({ time = 0 }) {
  return (
    <div className="flex items-center space-x-1">
      <img src="/timer.png" alt="timer icon" className="w-4 h-4" />
      <span>{minutesToTime(time, true)}</span>
    </div>
  )
}
