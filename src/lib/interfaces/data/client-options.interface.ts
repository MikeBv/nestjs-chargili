export interface ChargiliOpions {
  apiKey: string;
  mode?: 'test' | 'live'; // Optional, defaults to false
  baseUrl?: string; // Optional, defaults to CHARGILY_LIVE_URL
  version?: string; // Optional, defaults to 'v2'
}
