import * as cheerio from 'cheerio';

export async function scrapeGoldCoast() {
  try {
    const res = await fetch('https://www.goldcoast.qld.gov.au/Services/Events');
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const events = [];
    
    // Adjust selectors based on actual HTML structure
    $('.event-item, .event-card, article').each((i, elem) => {
      const title = $(elem).find('h2, h3, .title, .event-title').first().text().trim();
      const date = $(elem).find('.date, .event-date, time').first().text().trim();
      const link = $(elem).find('a').first().attr('href');
      
      if (title && date) {
        events.push({
          title,
          description: $(elem).find('p, .description').first().text().trim(),
          start_datetime: new Date(date).toISOString(),
          suburb: 'Gold Coast',
          source_url: link?.startsWith('http') ? link : `https://www.goldcoast.qld.gov.au${link}`,
          source: 'gc-council',
          price_type: 'free'
        });
      }
    });
    
    return events.filter(e => e.title);
  } catch (error) {
    console.error('Gold Coast scraper error:', error);
    return [];
  }
}