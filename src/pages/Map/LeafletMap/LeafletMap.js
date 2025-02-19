import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster"; // Import marker clustering
import { toast } from "react-toastify";
import { getAPI } from "../../../Services/Apis";

// Define custom marker icons
const companyIcon = new L.Icon({
  iconUrl:
    "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000", // Red color for company
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const individualIcon = new L.Icon({
  iconUrl:
    "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0000FF", // Blue color for individual
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LeafletMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const map = L.map("map").setView([21.1458, 79.0882], 5); // Center on Surat

    // 🗺️ Define different map layers
    const openStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    );

    const googleMaps = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "Google Maps",
      }
    );

    const satelliteMap = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "Google Satellite",
      }
    );

    // Add OpenStreetMap as default
    googleMaps.addTo(map);

    // 🛠️ Layer control (switch between maps)
    L.control
      .layers(
        {
          "Google Maps": googleMaps,
          OpenStreetMap: openStreetMap,
          "Satellite View": satelliteMap,
        },
        null,
        { collapsed: false }
      )
      .addTo(map);

    // Create a marker cluster group
    const markers = L.markerClusterGroup();

    const getAllUsers = async () => {
      try {
        const response = await getAPI("auth/all-user");
        if (response.statusCode === 200) {
          const output = response.users;

          // Filter only company and individual users
          const filteredUsers = output.filter(
            (user) => user.role === "company" || user.role === "individual"
          );
          setData(filteredUsers);

          filteredUsers.forEach((user) => {
            user.locationData.forEach((location) => {
              let { latitude, longitude } = location;

              // Custom marker icon
              const customIcon = new L.Icon({
                iconUrl:
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                iconSize: [25, 41], // Default size
                iconAnchor: [12, 41], // Center point at the bottom of the icon
                popupAnchor: [1, -34], // Popup anchor offset
              });

              // Create marker and add to cluster
              const marker = L.marker([latitude, longitude], {
                icon: customIcon,
              }).bindPopup(
                `<b>${
                  location.city || location.name || "Unknown City"
                }</b><br>${user.companyName || user.email}`
              );
              markers.addLayer(marker);
            });
          });

          // Add the clustered markers to the map
          map.addLayer(markers);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getAllUsers();
  }, []);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default LeafletMap;
