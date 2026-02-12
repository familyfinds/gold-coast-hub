import { createClient } from '@supabase/supabase-js';
import EventCard from '@/components/EventCard';

export const revalidate = 3600; // Revalidate every hour

async function getEvents() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data } = await supabase
    .from('events')
    .select('*')
    .gte('start_datetime', new Date().toISOString())
    .order('start_datetime', { ascending: true })
    .limit(50);
  
  return data || [];
}

export default async function Home() {
  const events = await getEvents();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">
        Family Events - Gold Coast & Brisbane
      </h1>
      <p className="text-gray-600 mb-8">
        Discover fun activities and events for families
      </p>
      
      {events.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No events yet. Run the scraper to populate events.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}