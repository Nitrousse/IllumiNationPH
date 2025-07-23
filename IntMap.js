// This code runs after the HTML document has loaded
document.addEventListener('DOMContentLoaded', function () {

  // Get references to DOM elements
  const locationFilter = document.getElementById('location-filter');
  const areaInfoBox = document.getElementById('area-info-box');

  // Coordinates for the center of the Philippines
  const centerOfPH = [12.8797, 121.7740];

  // Create the map object and set its initial view
  const map = L.map('map').setView(centerOfPH, 6);

  // Add the map's background tiles from OpenStreetMap.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // An array of locations with electricity issues.
  const locations = [
    {
      position: [7.536, 124.834],
      name: 'Maguindanao del Sur',
      description: 'Many remote communities in this province have limited or no access to the main power grid.'
    },
    {
      position: [6.015, 121.157],
      name: 'Sulu Province',
      description: 'Experiences frequent power interruptions and many off-grid island communities rely on generators.'
    },
    {
      position: [9.834, 118.735],
      name: 'Rural Palawan',
      description: 'While cities have power, many remote barangays and indigenous communities have limited or no access to 24/7 electricity.'
    },
    {
      position: [12.366, 123.585],
      name: 'Masbate Province',
      description: 'As an island province, it experiences frequent power outages, especially in municipalities away from the main city.'
    },
    {
      position: [11.250, 125.000],
      name: 'Samar Province',
      description: 'Highly vulnerable to typhoons, leading to frequent and long-lasting power outages in many areas.'
    },
    {
      position: [17.150, 122.366],
      name: 'Palanan, Isabela',
      description: 'An isolated coastal town where access to reliable, round-the-clock electricity has been a long-standing challenge.'
    },
    {
      position: [10.298, 125.723],
      name: 'Dinagat Islands',
      description: 'A remote island province that faces challenges in power generation and distribution, leading to service interruptions.'
    },
    {
      position: [8.000, 124.250],
      name: 'Lanao del Sur',
      description: 'Significant portions of the population, especially in rural and post-conflict areas, remain unelectrified.'
    }
  ];
  
  // An object to store marker references by location name
  const markers = {};

  // Create a custom icon for our pins using an SVG
  const customIcon = L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">
                <path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-2.29 10.304C23.435 32.143 16 32 16 32z"/>
                <path fill="#F66B0E" stroke="#112B3C" stroke-width="1.5" d="M15.938 32S6 17.938 6 12C6 6.477 10.477 2 16 2s10 4.477 10 10c0 5.938-9.938 20-9.938 20zM16 14a2 2 0 110-4 2 2 0 010 4z"/>
                <text x="16" y="17" font-size="12" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="bold">⚡️</text>
             </svg>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
  });

  // Loop through the locations to create markers and dropdown options
  locations.forEach(location => {
    // Create and add marker to the map
    const marker = L.marker(location.position, { icon: customIcon }).addTo(map);
    
    // Create popup content
    const popupContent = `<h3>${location.name}</h3><p>${location.description}</p>`;
    marker.bindPopup(popupContent);

    // Store marker reference
    markers[location.name] = marker;

    // Add option to the dropdown
    const option = document.createElement('option');
    option.value = location.name;
    option.textContent = location.name;
    locationFilter.appendChild(option);

    // Update info box on marker click
    marker.on('click', () => {
        areaInfoBox.innerHTML = `<h3>${location.name}</h3><p>${location.description}</p>`;
    });
  });

  // Add event listener for the dropdown menu
  locationFilter.addEventListener('change', (e) => {
    const selectedLocationName = e.target.value;

    if (selectedLocationName === 'all') {
      // If user selects the default option, reset the view
      map.flyTo(centerOfPH, 6);
      areaInfoBox.innerHTML = `<h3>Area Name</h3><p>Brief description of the region and electricity situation.</p>`;
    } else {
      // Find the selected location's data
      const location = locations.find(loc => loc.name === selectedLocationName);
      if (location) {
        // Fly to the location on the map
        map.flyTo(location.position, 12, {
            animate: true,
            duration: 1.5
        });

        // Open the marker's popup
        markers[selectedLocationName].openPopup();

        // Update the info box on the right
        areaInfoBox.innerHTML = `<h3>${location.name}</h3><p>${location.description}</p>`;
      }
    }
  });

});
