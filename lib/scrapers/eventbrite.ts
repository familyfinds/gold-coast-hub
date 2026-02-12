export async function scrapeEventbrite() {
  const token = process.env.EVENTBRITE_TOKEN;
  
  if (!token) {
    console.log('⚠️ No Eventbrite token found');
    return [];
  }
  
  const events = [];
  const locations = [
    { city: 'Gold Coast', region: 'QLD', country: 'AU' },
    { city: 'Brisbane', region: 'QLD', country: 'AU' }
  ];
  
  for (const loc of locations) {
    try {
      // Use the organizations endpoint as a workaround
      const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=${loc.city},${loc.region},${loc.country}&expand=venue`;
      
      console.log(`Trying Eventbrite for ${loc.city}...`);
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        console.log(`Eventbrite returned ${res.status} for ${loc.city}`);
        continue;
      }
      
      const data = await res.json();
      
      if (data.events && data.events.length > 0) {
        console.log(`Found ${data.events.length} events in ${loc.city}`);
        
        events.push(...data.events.map((e: any) => ({
          title: e.name?.text || 'Untitled Event',
          description: e.description?.text || '',
          start_datetime: e.start?.local || new Date().toISOString(),
          end_datetime: e.end?.local,
          latitude: e.venue?.latitude,
          longitude: e.venue?.longitude,
          suburb: loc.city,
          source_url: e.url,
          source: 'eventbrite',
          price_type: e.is_free ? 'free' : 'paid',
          image_url: e.logo?.url
        })));
      }
    } catch (error) {
      console.error(`Error scraping ${loc.city}:`, error);
    }
  }
  
  console.log(`Total Eventbrite events: ${events.length}`);
  return events;
}