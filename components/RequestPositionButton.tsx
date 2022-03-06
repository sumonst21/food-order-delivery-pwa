import {setCookieLocation} from '../lib/cookies';
// import { watchGeolocation } from '../helpers/geolocation';
import {MapPin} from './icons';
import {fetchGetRestaurants} from "../lib/apollo";

const requestGeolocation = (props: any) => {
    const geolocation = navigator.geolocation.getCurrentPosition(
        (location) => {
            console.log(location.coords.latitude, location.coords.longitude)
            const GetRestaurantsByLocationQuery = `
              query GetNearbyRestaurants {
                nearby_restaurants(args: {
                lat: "${location.coords.latitude}",
                lon: "${location.coords.longitude}",
                bound: 1000
                }, order_by: {
                distance: asc
                }, limit: 9, offset: 0) {
                  id
                  name
                  address
                  distance
                }
              }
`;
            console.log(GetRestaurantsByLocationQuery, props)
            setCookieLocation(location);
            fetchGetRestaurants(GetRestaurantsByLocationQuery)
                .then(({data, errors}) => {
                    if (errors) {
                        console.error(errors);
                    }
                    console.log(data);
                    props.setRestaurants(data.nearby_restaurants)
                })
                .catch(error => {
                    console.error(error);
                });

        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 15000,
            timeout: 12000,
        },
    );
    // const locationState = watchGeolocation();

    return geolocation;
};

const RequestPositionButton = (props: any) => {
    return (
        <button
            onClick={() => {
                requestGeolocation(props);
            }}
        >
            <MapPin/>
            Use current location
        </button>
    );
};

export default RequestPositionButton;