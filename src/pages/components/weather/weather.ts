import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Platform, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { } from 'bingmaps';

@IonicPage()
@Component({
    selector: 'page-weather',
    templateUrl: 'weather.html'
})
export class WeatherPage {

    isStatic: boolean = false;
    @ViewChild('map') mapElement: ElementRef;

    temp: number;

    weatherInfo: any = {};
    cityName: string = "Miami, US";
    weatherTaps: string = "info"

    constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, public platform: Platform) {
        this.platform = platform;
    }

    ionViewDidEnter() {
        this.getDataWhenPlatformIsReady();
    }

    runMaps() {
        let that = this;
        setTimeout(function () {
            if (that.isStatic) {
                that.generateBingMap(that.weatherInfo.coord.lon, that.weatherInfo.coord.lat);
            } else {
                that.getBingAnimatedMap(that.weatherInfo.coord.lon, that.weatherInfo.coord.lat);
            }
        }, 400);
    }

    getData() {
        let loading = this.loadingCtrl.create();
        loading.present();
        this.http.get("https://api.openweathermap.org/data/2.5/weather?q=" + this.cityName + "&appId=53591a412c95932221df665561b01151").subscribe((data) => {
            console.log(data.json())
            this.weatherInfo = data.json();
            this.temp = Math.round(9 / 5 * (parseInt(this.weatherInfo.main.temp) - 273.15) + 32); //temp is in kelvin, used formula to convert it to fahrenheit

            if (this.weatherTaps == 'maps') {
                this.runMaps();
            }

            loading.dismiss();
        }, (error) => {
            console.log(error);
            alert(error.statusText)
            loading.dismiss();
        })
    }

    generateBingMap(lon, lat) {
        //http://mesonet.agron.iastate.edu/ogc/
        var map = new Microsoft.Maps.Map(this.mapElement.nativeElement, {
            /* No need to set credentials if already passed in URL */
            credentials: 'AnbpfmCAAYuHBlPdsVikFSVd9Ey8v4v8_2ByXc7BzTKDu2a9_x8-aPLFa5dqK0Uu',
            center: new Microsoft.Maps.Location(lat, lon),
            zoom: 7
        });
        // weather radar tiles from Iowa Environmental Mesonet of Iowa State University
        var weatherTileSource = new Microsoft.Maps.TileSource({
            uriConstructor: 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{zoom}/{x}/{y}.png'
        });
        var weatherTileLayer = new Microsoft.Maps.TileLayer({
            mercator: weatherTileSource,
        });
        map.layers.insert(weatherTileLayer);
    }

    getBingAnimatedMap(lon, lat) {
        //http://mesonet.agron.iastate.edu/ogc/
        var map = new Microsoft.Maps.Map(this.mapElement.nativeElement, {
            /* No need to set credentials if already passed in URL */
            credentials: 'AnbpfmCAAYuHBlPdsVikFSVd9Ey8v4v8_2ByXc7BzTKDu2a9_x8-aPLFa5dqK0Uu',
            center: new Microsoft.Maps.Location(lat, lon),
            zoom: 7
        });
        var urlTemplate = 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-{timestamp}/{zoom}/{x}/{y}.png';
        var timestamps = ['900913-m50m', '900913-m45m', '900913-m40m', '900913-m35m', '900913-m30m', '900913-m25m', '900913-m20m', '900913-m15m', '900913-m10m', '900913-m05m', '900913'];
        var tileSources = [];
        for (var i = 0; i < timestamps.length; i++) {
            var tileSource = new Microsoft.Maps.TileSource({
                uriConstructor: urlTemplate.replace('{timestamp}', timestamps[i])
            });
            tileSources.push(tileSource);
        }
        var animatedLayer = new Microsoft.Maps.AnimatedTileLayer({ mercator: tileSources, frameRate: 500 });
        map.layers.insert(animatedLayer);
    }

    getDataWhenPlatformIsReady() {
        let that = this;
        this.platform.ready().then(() => {
            that.getData();
        })
    }

    updateItem(item) {
        console.log(this.isStatic);
        this.runMaps();
    }

    getDeviceLocation() {
        this.platform.ready().then(() => {
            navigator.geolocation.getCurrentPosition((location) => {
                if (!!location) {
                    if (this.weatherTaps == 'maps') {
                        if (this.isStatic) {
                            this.generateBingMap(location.coords.longitude, location.coords.latitude);
                        } else {
                            this.getBingAnimatedMap(location.coords.longitude, location.coords.latitude);
                        }
                    }
                } else {
                    alert("Couldn't access device location");
                }
            });
        });
    }

}