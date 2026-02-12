import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scrapeAllEvents } from '@/lib/scrapers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔥 Scraper endpoint hit!');
  
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  console.log('Auth header:', authHeader);
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('❌ Unauthorized');
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  console.log('✅ Auth passed, creating Supabase client...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  console.log('📡 Starting scrapers...');
  const events = await scrapeAllEvents();
  console.log(`Found ${events.length} events`);
  
  let inserted = 0;
  let skipped = 0;
  
  for (const event of events) {
    // Check for duplicates
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('title', event.title)
      .eq('start_datetime', event.start_datetime)
      .maybeSingle();
    
    if (!existing) {
      await supabase.from('events').insert(event);
      inserted++;
    } else {
      skipped++;
    }
  }
  
  console.log(`✅ Done! Inserted: ${inserted}, Skipped: ${skipped}`);
  
  return NextResponse.json({ 
    success: true, 
    inserted, 
    skipped,
    total: events.length 
  });
}