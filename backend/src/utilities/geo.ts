// utilities/geo.ts
import { Tags } from 'exiftool-vendored';

export interface GeoData {
  latitude: number;
  longitude: number;
  altitude?: number;
  latitudeSpan?: number;
  longitudeSpan?: number;
}

export function extractGeoFromTags(tags: Tags): GeoData | null {
  const lat = tags.GPSLatitude as number | undefined;
  const lon = tags.GPSLongitude as number | undefined;
  if (lat == null || lon == null) return null;

  const altitude = (tags.GPSAltitude as number | undefined) ?? undefined;

  return {
    latitude: lat,
    longitude: lon,
    altitude,
  };
}
