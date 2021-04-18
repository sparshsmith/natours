console.log('Hello from the client side')



export const displayMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhcnNoc2luZ2giLCJhIjoiY2tuamEyOGQ5Mjg2djJub2FpN210bDd6YyJ9.WNVenUoXO8Q9reN6oYDExg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/sparshsingh/cknjaazlp15ue17mi3gx5l9nh',
        scrollZoom: false
        // center: [-118.113491, 34.1111745],
        // zoom: 10,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach(loc => {
        // create marker
        const el = document.createElement('div');
        el.className = "marker";

        // add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current locations
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}

