import { Star } from 'lucide-react';

const Stars = ({ rating = 0, max = 5, size = 4 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        className={`w-${size} h-${size} ${i < Math.round(rating) ? 'fill-accent-yellow text-accent-yellow' : 'fill-gray-200 text-gray-200'}`}
      />
    ))}
  </div>
);

export default Stars;
