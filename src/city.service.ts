import {from, Observable, of} from 'rxjs';
import axios from 'axios';
import {map, mergeMap, zipAll} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";

const OPEN_WEATHER_API_BASE = 'http://api.openweathermap.org/data/2.5/weather';
const OPEN_WEATHER_API_KEY = '77baf54ce994f02f16f6003288daad17';

const TIME_ZONE_DB_API_BASE = 'http://api.timezonedb.com/v2.1/get-time-zone';
const TIME_ZONE_DB_API_KEY = '1HL0KXL0KFGA';


export function getCitiesInfo(cities: []): Observable<any> {

    return from(cities).pipe(
        mergeMap(city => fromPromise(getWeatherAndTime(city))),
        map(val => of(val)),
        zipAll(),
    );

}


async function getWeatherAndTime(locationName) {

    const res = await axios.get(OPEN_WEATHER_API_BASE, {
        params: {
            q: locationName,
            appid: OPEN_WEATHER_API_KEY
        }
    });
    const weather = res.data['weather'];
    const time = await getLocationTime(res.data['coord']);

    return {name: locationName, weather, time};

}


async function getLocationTime(coord) {

    const response = await axios.get(TIME_ZONE_DB_API_BASE, {
        params: {
            key: TIME_ZONE_DB_API_KEY,
            format: 'json',
            by: 'position',
            lng: coord['lon'],
            lat: coord['lat'],
        }
    });

    return response.data;

}
