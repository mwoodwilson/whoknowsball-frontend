// Quick test script to verify Odds API is working
const API_KEY = process.env.ODDS_API_KEY || '[REDACTED_ODDS_API_KEY]';
const BASE_URL = 'https://api.the-odds-api.com/v4';

async function testAPI() {
  console.log('Testing Odds API...\n');

  try {
    // Test 1: Get sports
    console.log('1. Fetching sports list...');
    const sportsUrl = `${BASE_URL}/sports?apiKey=${API_KEY}`;
    const sportsRes = await fetch(sportsUrl);
    const sports = await sportsRes.json();
    console.log(`✅ Found ${sports.length} total sports`);

    const activeSports = sports.filter(s => s.active);
    console.log(`✅ Found ${activeSports.length} active sports\n`);

    // Test 2: Get NBA games
    console.log('2. Fetching NBA games...');
    const nbaUrl = `${BASE_URL}/sports/basketball_nba/odds?apiKey=${API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
    const nbaRes = await fetch(nbaUrl);
    const nbaGames = await nbaRes.json();
    console.log(`✅ Found ${nbaGames.length} NBA games\n`);

    if (nbaGames.length > 0) {
      console.log('Sample NBA game:');
      console.log(`  ${nbaGames[0].away_team} @ ${nbaGames[0].home_team}`);
      console.log(`  Starts: ${new Date(nbaGames[0].commence_time).toLocaleString()}\n`);
    }

    console.log('✅ API is working correctly!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
