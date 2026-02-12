import { createClient } from '@supabase/supabase-js';

async function getEvent(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  return data;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  
  if (!event) {
    return <div className="container mx-auto px-4 py-8">Event not found</div>;
  }
  
  const date = new Date(event.start_datetime);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      
      {event.image_url && (
        <img 
          src={event.image_url} 
          alt={event.title}
          className="w-full rounded-lg mb-6"
        />
      )}
      
      <div className="prose max-w-none mb-6">
        <p className="text-gray-700">{event.description}</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-3">
        <p><strong>When:</strong> {date.toLocaleString('en-AU')}</p>
        <p><strong>Where:</strong> {event.suburb}</p>
        <p><strong>Price:</strong> {event.price_type === 'free' ? 'FREE' : 'Paid'}</p>
        
        {event.source_url && (
          <a 
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mt-4"
          >
            More Info / Book
          </a>
        )}
      </div>
    </div>
  );
}