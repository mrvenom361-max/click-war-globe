// API endpoint for getting scores
export async function GET() {
  try {
    // Mock data - in real implementation would query Supabase
    const mockCountries = [
      { country_code: 'US', country_name: 'United States', score: 15420 },
      { country_code: 'CN', country_name: 'China', score: 12890 },
      { country_code: 'IN', country_name: 'India', score: 9560 },
      { country_code: 'BR', country_name: 'Brazil', score: 7320 },
      { country_code: 'RU', country_name: 'Russia', score: 6780 }
    ];
    
    return new Response(JSON.stringify(mockCountries), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch scores' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}