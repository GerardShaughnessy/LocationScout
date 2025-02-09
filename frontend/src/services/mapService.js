import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

class MapService {
  constructor() {
    this.mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
    mapboxgl.accessToken = this.mapboxToken;
    this.offlineRegions = new Set();
  }

  // Initialize map with offline support
  async initializeMap(containerId, center, zoom) {
    const map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom,
      maxZoom: 18,
      minZoom: 3
    });

    // Add offline control
    map.addControl(
      new mapboxgl.OfflineControl({
        onSave: this.saveRegionForOffline.bind(this),
        onDelete: this.deleteOfflineRegion.bind(this)
      })
    );

    return map;
  }

  // Save map region for offline use
  async saveRegionForOffline(region) {
    try {
      const bounds = region.bounds;
      const minZoom = region.minZoom || 10;
      const maxZoom = region.maxZoom || 15;

      // Calculate tile coverage
      const coverage = await this.calculateTileCoverage(bounds, minZoom, maxZoom);
      
      if (coverage.size > 50000) { // Limit tile count for initial version
        throw new Error('Selected area too large for offline use');
      }

      // Download and store tiles
      await this.downloadTiles(coverage);
      this.offlineRegions.add(region);

      return true;
    } catch (error) {
      console.error('Failed to save region:', error);
      throw error;
    }
  }

  // Custom marker management
  createCustomMarker(type, coordinates) {
    const markerElement = document.createElement('div');
    markerElement.className = `marker-${type}`;
    
    return new mapboxgl.Marker(markerElement)
      .setLngLat(coordinates);
  }
}

export default new MapService(); 