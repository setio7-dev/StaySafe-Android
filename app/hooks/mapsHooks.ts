import * as Location from 'expo-location';
import userImage from "@/assets/images/maps/user.png";
import dangerImage from "@/assets/images/maps/danger.png";
import positionImage from "@/assets/images/maps/position.png";
import { ImageToBase64 } from '@/app/utils/imageConvert';
import { useEffect, useRef, useState } from 'react';
import { SupabaseAPI } from '../server/supabase';
import { usePathname } from 'expo-router';
import { Animated, PanResponder } from 'react-native';
import WebView from 'react-native-webview';

export default function useMapsHooks() {
    const [location, setLocation] = useState<any>(null);
    const [icons, setIcons] = useState<any>(null);
    const [zones, setZones] = useState<zoneProps[]>([]);
    const [myLocation, setMyLocation] = useState<string>("");
    const [heightActive, setHeightActive] = useState(false);
    const heightAnim = useRef(new Animated.Value(240)).current;
    const webViewRef = useRef<WebView>(null);
    const [isWarning, setIsWarning] = useState(false);
    const pathname = usePathname();
    const [suggestionPlace, setSuggestionPlace] = useState<suggestionPlaceProps[]>([]);
    const GEOAPIFY_KEY = "24f813a682d2497e89d434b817408858"

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
                    iconSize: [30, 30],
                    iconAnchor: [20, 40],
                  });

                  const dangerIcon = L.icon({
                    iconUrl: '${icons.danger}',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                  });

                  const positionIcon = L.icon({
                    iconUrl: '${icons.position}',
                    iconSize: [24, 32],
                    iconAnchor: [14, 28],
                  });

                  const userMarker = L.marker([${lat}, ${lng}], { icon: userIcon, draggable: true  })
                    .addTo(map)
                    .bindPopup('Posisi kamu');

                  const zones = ${JSON.stringify(zones)};
                  zones.forEach(item => {
                    const lat = Number(item.latitude);
                    const lng = Number(item.longitude);

                    L.circle([lat, lng], {
                      radius: Number(item.radius),
                      color: 'red',
                      fillColor: 'red',
                      fillOpacity: 0.25,
                    }).addTo(map);

                    L.marker([lat, lng], { icon: dangerIcon })
                      .addTo(map)
                      .bindPopup(item.name);
                  });

                  const suggestions = ${JSON.stringify(suggestionPlace)};
                  suggestions.forEach(item => {
                    const lat = item.properties.lat;
                    const lng = item.properties.lon;
                    const name = item.properties.name || 'Lokasi';

                    L.marker([lat, lng], { icon: positionIcon })
                      .addTo(map)
                      .bindPopup(name);
                  });

                  function checkDangerZone(latUser, lngUser) {
                    let inDanger = false;
                    zones.forEach(zone => {
                      const distance = map.distance([latUser, lngUser], [Number(zone.latitude), Number(zone.longitude)]);
                      if (distance <= Number(zone.radius)) {
                        inDanger = true;
                      }
                    });
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'DANGER_ZONE',
                      value: inDanger
                    }));
                  }     

                  checkDangerZone(${lat}, ${lng});
                  userMarker.on('dragend', function(e) {
                    const pos = e.target.getLatLng();
                    checkDangerZone(pos.lat, pos.lng);
                  });
                </script>
            </body>
        </html>
    `;

    const fetchZones = async () => {
        try {
            const { data } = await SupabaseAPI.from("zones").select();
            setZones(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchMaps = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const loc = await Location.getCurrentPositionAsync({});
            const address = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            if (address.length > 0) {
                const a = address[0];
                let location = "";

                if (pathname === "/pages/maps/maps") {
                    location = `${a.formattedAddress ?? ''}`;
                } else {
                    location = `${a.district ?? ''}`;
                }
                setMyLocation(location);
            }

            const categories = "service.police,service.fire_station,service.post.office,healthcare.hospital,healthcare.clinic_or_praxis,office.government";
            const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${loc.coords.longitude},${loc.coords.latitude},700&limit=50&apiKey=${GEOAPIFY_KEY}`;
            const responsePlace = await fetch(url);
            const resData = await responsePlace.json();
            setSuggestionPlace(resData.features)


            const userBase64 = await ImageToBase64(userImage);
            const dangerBase64 = await ImageToBase64(dangerImage);
            const positionBase64 = await ImageToBase64(positionImage);

            setIcons({
                user: `data:image/png;base64,${userBase64}`,
                danger: `data:image/png;base64,${dangerBase64}`,
                position: `data:image/png;base64,${positionBase64}`,
            });

            setLocation({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
            });
        }

        fetchMaps();
        fetchZones();
    }, [pathname]);

    const handleGoToPlace = (lat: number, lng: number, name: string) => {
        const jsCode = `
            map.flyTo([${lat}, ${lng}], 18, { animate: true, duration: 1.2 });
            L.popup()
              .setLatLng([${lat}, ${lng}])
              .setContent("${name}")
              .openOn(map);
            true;
        `;
        webViewRef.current?.injectJavaScript(jsCode);

        Animated.timing(heightAnim, {
            toValue: 240,
            duration: 200,
            useNativeDriver: false,
        }).start();
        setHeightActive(false);
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                let newHeight = heightActive ? 500 - gestureState.dy : 240 - gestureState.dy;
                if (newHeight < 240) newHeight = 240;
                if (newHeight > 500) newHeight = 500;
                heightAnim.setValue(newHeight);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -50) {
                    Animated.timing(heightAnim, {
                        toValue: 560,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                    setHeightActive(true);
                } else if (gestureState.dy > 50) {
                    Animated.timing(heightAnim, {
                        toValue: 240,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                    setHeightActive(false);
                } else {
                    Animated.timing(heightAnim, {
                        toValue: heightActive ? 500 : 240,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const handleMessageDistance = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'DANGER_ZONE') {
                setIsWarning(data.value);
            }
        } catch { }
    }

    useEffect(() => {
        let subscriber: Location.LocationSubscription;
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            subscriber = await Location.watchPositionAsync(
                { distanceInterval: 1 },
                (loc) => {
                    const js = `checkDangerZone(${loc.coords.latitude}, ${loc.coords.longitude}); true;`;
                    webViewRef.current?.injectJavaScript(js);
                }
            );
        })();

        return () => subscriber?.remove();
    }, []);

    return {
        location,
        icons,
        generateMapHTML,
        myLocation,
        suggestionPlace,
        heightAnim,
        handleGoToPlace,
        webViewRef,
        panResponder,
        fetchZones,
        handleMessageDistance,
        isWarning
    }
}
