const axios = require('axios');
const turf = require('@turf/turf');

class MapService {
  constructor() {
    this.mapboxToken = process.env.MAPBOX_TOKEN;
    this.tileSize = 256;
  }

  calculateTileCount(bounds, zoom) {
    const { sw, ne } = bounds;
    const tiles = this.getTileRange(sw, ne, zoom);
    return (tiles.x.max - tiles.x.min + 1) * 
           (tiles.y.max - tiles.y.min + 1);
  }

  async getOfflineMapData(bounds, zoom) {
    const tiles = [];
    const tileRange = this.getTileRange(bounds.sw, bounds.ne, zoom);

    for (let x = tileRange.x.min; x <= tileRange.x.max; x++) {
      for (let y = tileRange.y.min; y <= tileRange.y.max; y++) {
        const tileUrl = this.getTileUrl(x, y, zoom);
        try {
          const response = await axios.get(tileUrl, {
            responseType: 'arraybuffer'
          });
          tiles.push({
            x,
            y,
            zoom,
            data: response.data.toString('base64')
          });
        } catch (error) {
          console.error(`Failed to fetch tile: ${x},${y},${zoom}`);
        }
      }
    }

    return {
      tiles,
      bounds,
      zoom
    };
  }

  getTileRange(sw, ne, zoom) {
    const swTile = this.latLngToTile(sw.lat, sw.lng, zoom);
    const neTile = this.latLngToTile(ne.lat, ne.lng, zoom);

    return {
      x: { min: Math.min(swTile.x, neTile.x), max: Math.max(swTile.x, neTile.x) },
      y: { min: Math.min(swTile.y, neTile.y), max: Math.max(swTile.y, neTile.y) }
    };
  }

  getTileUrl(x, y, zoom) {
    return `https://api.mapbox.com/v4/mapbox.streets/${zoom}/${x}/${y}.png?access_token=${this.mapboxToken}`;
  }
}

module.exports = new MapService(); 