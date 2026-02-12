import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  start_datetime: string;
  suburb: string;
  price_type: string;
  image_url?: string;
}

export default function EventCard({ event }: { event: Event }) {
  const date = new Date(event.start_datetime);
  
  return (
    <Link 
      href={`/events/${event.id}`} 
      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      {event.image_url && (
        <img 
          src={event.image_url} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p>📅 {date.toLocaleDateString('en-AU', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
          })}</p>
          
          <p>📍 {event.suburb}</p>
          
          {event.price_type === 'free' && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              FREE
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}