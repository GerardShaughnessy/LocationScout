module.exports = {
  mapbox: {
    style: 'mapbox://styles/mapbox/streets-v11',
    clusterRadius: 50,
    clusterMaxZoom: 14,
    markerTypes: {
      LOCATION: 'location',
      STUDIO: 'studio',
      EQUIPMENT: 'equipment',
      PARKING: 'parking',
      CUSTOM: 'custom'
    },
    offlineTileLimit: 10000 // Limit for offline map tiles
  }
}; 