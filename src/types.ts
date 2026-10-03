export type AirQualityLevel = 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

export interface ApimsStation {
  id: string;
  name: string;
  state: string;
  region: 'Central' | 'Northern' | 'Southern' | 'East Coast' | 'Sarawak' | 'Sabah';
  lat: number;
  lng: number;
  ipu: number;
  level: AirQualityLevel;
  statusMalay: string;
  statusEnglish: string;
  pm25: number; // ug/m3
  pm10: number;
  dominantPollutant: 'PM2.5' | 'PM10' | 'O3' | 'NO2';
  tempC: number;
  humidity: number;
  windSpeedKmH: number;
  windDirectionDeg: number;
  hourlyHistory: number[]; // last 12 hours IPU
  lastUpdated: string;
}

export interface Hotspot {
  id: string;
  region: 'Sumatra' | 'Kalimantan' | 'Peninsular Malaysia' | 'Sarawak' | 'Sabah';
  subLocation: string;
  lat: number;
  lng: number;
  confidence: number; // %
  frp: number; // Fire Radiative Power in MW
  satellite: 'MODIS (Aqua)' | 'MODIS (Terra)' | 'VIIRS (Suomi-NPP)' | 'Himawari-9';
  detectedTime: string;
  fuelType: 'Peatland (Tanah Gambut)' | 'Oil Palm Plantation' | 'Primary Forest' | 'Agricultural Debris';
  smokeDispersion: 'North-East toward Malacca Strait & Klang Valley' | 'East toward Kuching' | 'Localized plume';
}

export interface CitizenFireReport {
  id: string;
  referenceNo: string;
  timestamp: string;
  reporterName: string;
  contactNumber: string;
  locationName: string;
  state: string;
  coords: { lat: number; lng: number };
  fireType: 'peat' | 'open_trash' | 'agricultural' | 'forest_brush' | 'industrial';
  fireTypeMalay: string;
  severity: 'low' | 'moderate' | 'critical';
  description: string;
  photoUrl?: string;
  status: 'submitted' | 'dispatched_bomba' | 'jas_investigating' | 'extinguished';
  bombaUnitAssigned?: string;
  jasCaseId?: string;
}

export interface HealthProfile {
  category: 'general' | 'asthma_respiratory' | 'elderly' | 'pregnancy' | 'child' | 'delivery_rider' | 'outdoor_worker';
  hasAsthmaInhaler: boolean;
  hasAirPurifierAtHome: boolean;
  dailyWaterGlasses: number;
  targetWaterGlasses: number;
  recordedSymptoms: string[];
}

export interface CleanAirShelter {
  id: string;
  name: string;
  type: 'Klinik Kesihatan' | 'Hospital Kerajaan' | 'Perpustakaan / Mall' | 'Community Hall';
  state: string;
  district: string;
  address: string;
  hepaFiltered: boolean;
  freeN95Available: boolean;
  distanceKm?: number;
  operatingHours: string;
  phone: string;
}

export interface HazeNewsAlert {
  id: string;
  title: string;
  source: 'JAS' | 'METMalaysia' | 'KPM' | 'KKM' | 'ASMC';
  time: string;
  severity: 'info' | 'warning' | 'critical';
  summary: string;
  actionRequired: string;
}
