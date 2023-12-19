<template>
    <!-- <v-card-subtitle>
        {{ coords }}
    </v-card-subtitle> -->
    <GoogleMap ref="map" :api-key="GOOGLE_MAPS_API_KEY" :style="`width: 100%; height: ${height}`" :center="coords"
        :zoom="15">
        <Marker :options="{
            position: coords,
            draggable,
            title
        }" @dragend="(event) => dragged(event)" />

    </GoogleMap>
</template>
<script lang="ts" setup>
import { GoogleMap, Marker } from "vue3-google-map";
import { GOOGLE_MAPS_API_KEY } from '@/common/constants';
import { useDisplay } from 'vuetify';
import { computed, ref } from "vue";
import Coords from "@/model/addressing/coordinate";
import { reactive } from "vue";
import { onMounted } from "vue";
import { watch } from "vue";

const COORDINATES = {
    lat: 0,
    lng: 0
};
// AddressCoordinateMapInput
const props = defineProps({
    coordinate: {
        type: Coords,
        required: false,
    },
    draggable: {
        type: Boolean,
        required: false,
        default: true,
    },
    title: {
        type: String,
        required: false,
    },
    height: {
        type: [String, Number],
        required: false,
    }
});
const emit = defineEmits(['update:coordinate']);


const { xs } = useDisplay();
const coords = ref(COORDINATES);

watch(() => props.coordinate, coords => updateCoords(coords));





watch(coords, (coords) => {
    let data: Coords | undefined = undefined;
    if (coords) {
        data = Coords.fromJson({
            latitude: coords.lat,
            longitude: coords.lng,
        })
    }
    emit('update:coordinate', data);
})

const height = computed(() => {
    if (props.height) {
        return props.height;
    }
    return xs.value ? '100vh' : '600px';
});



function dragged({domEvent, latLng}: { domEvent: any, latLng: google.maps.LatLng}) {
    updateCoords({
        latitude: latLng.lat(),
        longitude: latLng.lng(),
    });
}


let coordsInitialized = false;

let coords_updatable = true;
function updateCoords(coordinate?: CoordinateInput) {
    if(!coords_updatable){
        return;
    }

    coords_updatable = false;

    if (coordinate) {
        const _coords = {
            lat: coordinate.latitude,
            lng: coordinate.longitude,
        }
        coords.value = _coords;
        coordsInitialized = true;
    } else {
        coords.value = {lat: 0, lng: 0};
        coordsInitialized = false;
    }
    setTimeout(() => coords_updatable = true,10);
}

interface CoordinateInput {
    latitude: number;
    longitude: number;
}
</script>