import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { debounce } from "lodash";
import { useConfigStore } from "./app";


const useGeolocationStore = defineStore('geolocation-store', () => {

    const configStore = useConfigStore();

    const coordinates = ref<GeolocationCoordinates>();
    // const position = ref<Position>();
    const positionLocked = ref(false);



    const canUpdatePosition = computed(() => {
        const coords = coordinates.value;
        const locked = positionLocked.value;

        return (!coords || !locked);
    })


    watch(coordinates, (coords) => {
        if (coords) {
        }
    });
    


    // REQUEST USER POSITION
    watchPositition();

    // watch(position, (position) => {
    //     if (position){

    //     }
    // });

    function watchPositition() {
        navigator.geolocation.getCurrentPosition((pos) => {
            // console.log("FETCHED COORDINATES: ", pos);
            updateCoordinates(pos.coords);
        }, null, { enableHighAccuracy: true });

        navigator.geolocation.watchPosition((pos) => {
            updateCoordinates(pos.coords);
        }, null, { enableHighAccuracy: true });
    }



    function updateCoordinates(pos: GeolocationCoordinates) {
        const canUpdate = canUpdatePosition.value;

        // console.log("CAN UPDATE: ", canUpdate);

        if (canUpdate) {
            coordinates.value = pos;
        }
    }

    function setCoordinates(coords: GeolocationCoordinates, {lock = false} = {}){
        coordinates.value = coords;
    }
    

    // function setPosition(pos: Position, { lock = false } = {}) {
    //     position.value = pos;
    //     coordinates.value = pos.coords?.toJson();
    //     positionLocked.value = lock;
    // }




    return {
        coordinates,
        setCoordinates,
        // position,
        //
        // setPosition,
    }

});


export default useGeolocationStore;


