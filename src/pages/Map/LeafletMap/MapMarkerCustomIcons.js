import React, { Component } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Define custom icons for markers
const greenIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default class MapMarkerCustomIcons extends Component {
  state = {
    markers: [
      { id: 1, lat: 18.49281938003922, lng: 73.86893546616035, name: "Nexapp Tech", city: "Pune" },
      { id: 2, lat: 18.481633492716952, lng: 73.87630952198128, name: "Nano Stuff", city: "Pune" },
      { id: 3, lat: 18.526344369814215, lng: 73.92802097462858, name: "TCS ", city: "Pune" },
      { id: 4, lat: 18.57516703576563, lng: 73.88476230894517, name: "Marker 4", city: "London" }
    ],
    zoom: 13,
  };

  render() {
    const { markers, zoom } = this.state;

    return (
      <MapContainer center={[18.49281938003922, 73.86893546616035]} zoom={zoom} style={{ height: "500px" }}>
        {/* <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={greenIcon} // Use custom icon
          >
            <Popup>
              {marker.name} <br /> {marker.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>



    );
  }
}
