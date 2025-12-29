import * as Location from 'expo-location';
import userImage from "@/assets/images/maps/user.png";
import dangerImage from "@/assets/images/maps/danger.png";
import positionImage from "@/assets/images/maps/position.png";
import { ImageToBase64 } from '@/app/utils/imageConvert';
import { useEffect, useState } from 'react';
import { SupabaseAPI } from '../server/supabase';

export default function useMapsHooks() {
    const [location, setLocation] = useState<any>(null);
    const [icons, setIcons] = useState<any>(null);
    const [zones, setZones] = useState<zoneProps[]>([]);

    const generateMapHTML = (lat: number, lng: number, icons: any) => `
    <!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <style>
                  body, html, #map { margin:0; padding:0; height:100%; }
                </style>
            </head>

            <body>
                <div id="map"></div>

                <script>
                  const map = L.map('map').setView([${lat}, ${lng}], 17);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      maxZoom: 19,
                      detectRetina: true,
                    }).addTo(map);

                    const userIcon = L.icon({
                       iconUrl: '${icons.user}',
                       iconSize: [40, 40],
                       iconAnchor: [20, 40],
                     });

                    const dangerIcon = L.icon({
                       iconUrl: '${icons.danger}',
                       iconSize: [32, 32],
                       iconAnchor: [16, 16],
                     });

                    L.marker([${lat}, ${lng}], { icon: userIcon }).addTo(map);                    
                    
                    const zones = ${JSON.stringify(zones)};
                    zones.forEach(item => {
                        L.circle([Number(item.latitude), Number(item.longitude)], {
                        radius: Number(item.radius),
                        color: 'red',
                        fillColor: 'red',
                        fillOpacity: 0.25,
                    }).addTo(map).bindPopup(item.name);

                    L.marker([Number(item.latitude), Number(item.longitude)], {
                      icon: dangerIcon
                    }).addTo(map);
                  });
                </script>
            </body>
        </html>
    `; 

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const loc = await Location.getCurrentPositionAsync({});

            const userBase64 = await ImageToBase64(userImage);
            const dangerBase64 = await ImageToBase64(dangerImage);

            setIcons({
                user: `data:image/png;base64,${userBase64}`,
                danger: `data:image/png;base64,${dangerBase64}`,
            });

            setLocation({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
            });
        })();
    }, []);

    useEffect(() => {
        const fetchZones = async() => {
            try {
                const { data } = await SupabaseAPI.from("zones").select();
                setZones(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchZones();
    }, []);

    return {
        location,
        icons,
        generateMapHTML,
    }
}
