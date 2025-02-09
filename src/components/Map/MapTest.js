import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Add your token here directly for testing (we'll move it to .env later)
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VyYXJkc2giLCJhIjoiY202eDVyNnppMHFnbDJqb2xmb2N1aDRzMyJ9.t9e66pQp_Wkk4m1Sc213hw';

function MapTest() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      <h2>Map Test</h2>
      <div ref={mapContainer} style={{ 
        width: '100%',
        height: '500px',
        border: '2px solid black'
      }} />
    </div>
  );
}

export default MapTest;
