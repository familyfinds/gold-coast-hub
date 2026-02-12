import { scrapeEventbrite } from './eventbrite';
import { scrapeGoldCoast } from './goldcoast';

export async function scrapeAllEvents() {
  console.log('📡 scrapeAllEvents called');
  
  console.log('Starting Eventbrite scraper...');
  const eventbrite = await scrapeEventbrite().catch(e => { 
    console.error('Eventbrite error:', e); 
    return []; 
  });
  console.log('Eventbrite done:', eventbrite.length);
  
  console.log('Starting Gold Coast scraper...');
  const goldcoast = await scrapeGoldCoast().catch(e => { 
    console.error('GC Council error:', e); 
    return []; 
  });
  console.log('Gold Coast done:', goldcoast.length);
  
  const allEvents = [...eventbrite, ...goldcoast];
  console.log('Total events collected:', allEvents.length);
  
  return allEvents;
}