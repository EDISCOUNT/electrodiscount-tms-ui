import { GOOGLE_MAPS_API_KEY } from '@/common/constants';
import Address from '@/model/addressing/address';
import { Loader, LoaderOptions,  } from 'google-maps';
// or const {Loader} = require('google-maps'); without typescript




const map = document.createElement('div');

export function getPlaceDetailsById(placeId: string): Promise<google.maps.places.PlaceResult> {
    return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(map);
        service.getDetails({ placeId: placeId }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const coordinates = place.geometry?.location;
                if (coordinates) {
                    resolve(place);
                } else {
                    reject("Coordinates not available for this place.");
                }
            } else {
                reject(`Place details request failed: ${status}`);
            }
        });
    });
}

export function getPlaceDetails({ location, address, placeId }: google.maps.GeocoderRequest): Promise<google.maps.places.PlaceResult> {
    return new Promise((resolve, reject) => {
        const service = new google.maps.Geocoder();
        service.geocode({ location: location, placeId, address }, (result, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                const entry = result[0];
                getPlaceDetailsById(entry.place_id)
                    .then(details => resolve(details))
                    .catch(err => reject(err));
            } else {
                reject(`Place details request failed: ${status}`);
            }
        });
    });
}


export async function getAddressWithGoogle({ location, address, placeId }: google.maps.GeocoderRequest): Promise<Address> {
    const details = await getPlaceDetails({ location, address, placeId });
    return Address.fromPlaceDetails(details);
}



const options: LoaderOptions = {
    /* todo */
    libraries: [
        'places',// google.maps.PlacesLibrary
        // 'directions',
        // 'directions'
    ]
};


let loadPromise: Promise<typeof google> | undefined = undefined;

class ChainedLoader extends Loader {
    async load(): ReturnType<Loader['load']> {
        if ('google' in window) {
            return window['google'];
        }
        try {
            loadPromise = super.load();
            return await loadPromise;
        }
        catch (err) {
            loadPromise = undefined;
            throw err;
        }
    }
}


const loader = new ChainedLoader(GOOGLE_MAPS_API_KEY, options);

export { loader };