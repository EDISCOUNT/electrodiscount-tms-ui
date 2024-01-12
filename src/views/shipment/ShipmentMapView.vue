<template>
    <v-card :height="height" :color="inlineBg" flat>
        <!-- {{ { markers, mapCenter } }} -->
        <GoogleMap v-bind:zoom="zoom" v-if="mapCenter" :center="mapCenter" ref="map" :api-key="GOOGLE_MAPS_API_KEY"
            :style="`height: ${height};`">
            <Marker v-for="{ position, label, title, info, address, } in markers" :key="address.id" :options="{
                // animation: google.maps.Animation.DROP,
                position,
                title,
                label,
                // info: undefined,
                clickable: true,
                draggable: false,
                // icon: {
                //     path: google.maps.SymbolPath.CIRCLE,
                //     scale: 10,
                //     fillColor: '#4285F4',
                //     fillOpacity: 1,
                //     strokeWeight: 1,
                //     strokeColor: '#4285F4',
                // },

            }" />
        </GoogleMap>

    </v-card>
</template>
<script lang="ts" setup>
import { GOOGLE_MAPS_API_KEY } from '@/common/constants';
import Address from '@/model/addressing/address';
import Shipment from '@/model/shipment/shipment';
import { useColorScheme } from '@/utils/color';
import { loader } from '@/utils/google/maps';
import { onMounted } from 'vue';
import { computed, ref, watch } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { useNotifier } from 'vuetify-notifier';
import { Loader, LoaderOptions, } from 'google-maps';


interface MarkerData {
    position: google.maps.LatLngLiteral;
    title?: string;
    label?: string;
    info?: string;
    address: Address;
}

const props = defineProps<{
    shipment: Shipment;
    height?: string | number;
}>();

const notifier = useNotifier();
const { secondaryBg, inlineBg } = useColorScheme();

const height = computed(() => props.height ?? '400px');
const zoom = ref(15);

const addresses = computed(() => {
    const addresses: Address[] = [];

    if (props.shipment.originAddress) {
        addresses.push(props.shipment.originAddress);
    }
    if (props.shipment.destinationAddress) {
        addresses.push(props.shipment.destinationAddress);
    }
    return addresses;
});


const markers = ref<MarkerData[]>([]);
const direction = ref<google.maps.DirectionsResult>();
// const mapCenter = ref<google.maps.LatLngLiteral | null>(null);
// const map = ref<google.maps.Map | null>(null);
const map = ref<typeof GoogleMap>();

const mapCenter = computed(() => {
    if (markers.value.length > 0) {
        return markers.value[0].position;
    }
    return null;
});

watch(addresses, async () => {
    markers.value = await buildMakers();
});
onMounted(async () => {
    markers.value = await buildMakers();
});

watch(markers, async () => {
    await resolveDirection();
});

async function buildMakers() {
    const markers: MarkerData[] = [];

    for (const address of addresses.value) {
        const position = await resolveAddressCoords(address);
        if (position) {
            markers.push({
                position: position.toJSON(),
                title: address.formatted,
                // label: address.formatted,
                address: address,
            });
        }
    }

    return markers;
}


async function resolveAddressLocation(address: Address) {
    try {
        const google = await loader.load();
        console.log("GOOGLE: ", { google });
        return new Promise<google.maps.GeocoderResult>((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: address.formatted }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    resolve(results[0]);
                } else {
                    reject(status);
                }
            });
        });
    }
    catch (err) {
        const message = `Failed to load google Maps: ${err}`;
        notifier.toastError(message);
        throw err;
    }
}

async function resolveAddressCoords(address: Address) {
    try {
        const result = await resolveAddressLocation(address);
        return result.geometry?.location;
    }
    catch (err) {
        const message = `Failed to resolve address location: ${err}`;
        notifier.toastError(message);
    }
}


async function resolveDirection() {
    try {
        const google = await loader.load();
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        if(addresses.value.length < 2) {
            return;
        }
        const request: google.maps.DirectionsRequest = {
            origin: addresses.value[0].formatted,
            destination: addresses.value[1].formatted,
            waypoints: markers.value.slice(1, -1).map(marker => ({ location: marker.address.formatted })),
            travelMode: google.maps.TravelMode.DRIVING,
        };
        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                direction.value = result;
                directionsRenderer.setDirections(result);
                if (map.value?.map) {
                    directionsRenderer.setMap(map.value.map);
                }
            }
        });
    }
    catch (err) {
        const message = `Failed to load google Maps: ${err}`;
        notifier.toastError(message);
    }
}

</script>