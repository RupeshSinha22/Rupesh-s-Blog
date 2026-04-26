import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ReadingProgress() {
  const progress = useScrollProgress();
  if (progress <= 0) return null;
  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}
