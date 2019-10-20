import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Axios from "axios";

//array of heatmap points
var heatPoints = [];
//Function to add a point to heatmap
function addTweetPoint(lat, lng, weight) {
    heatPoints.push({lat: lat, lng: lng, weight: weight})
}

function addTweetData(comp, location, keyword){
    Axios.get('http://localhost:3001/getaveragetone?location=' + location + '&keyword=' + keyword)
        .then(response => {
            console.log(response);
            var toneCount = comp.props.tone == "true" ? response.data.positive_count : response.data.negative_count;
            var toneAverage = comp.props.tone == "true" ? response.data.positive_average : response.data.negative_average;
            console.log('tone average: ' + toneAverage);
            console.log('tone count: ' + toneCount);
            var weight = toneAverage * toneCount;
            var long = 0;
            var lat = 0;
            console.log(weight);
            console.log(response.data.location);
            Axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + response.data.location + '&key=AIzaSyBqEJc6UcXXbk7xC4bE_zzn59OAamXa2Xc')
                .then(response => {
                    lat = response.data.results[0].geometry.location.lat;
                    long = response.data.results[0].geometry.location.lng;
                    console.log('lat: ' + lat + ', long: ' + long);
                    addTweetPoint(lat, long, weight);
                    comp.render();
                });
        });
}

//Heatmap component
class HeatMap extends Component {
    static defaultProps = {
        center: {
            lat: 32.6,
            lng: -99.2
        },
        zoom: 4
    };

    constructor(props) {
        super(props);
        this.state = {
            heatmapVisible: true,
            heatmapPoints: heatPoints,
        }

        console.log('map tone: '+ props.tone);

        heatPoints = [];

        addTweetData(this, 'losangeles', 'trump');
        addTweetData(this, 'oklahomacity', 'trump');
    }

    //Code run on render
    render() {
        //Calc HeatMap
        const heatMapData = {
            positions: this.state.heatmapPoints,
            options: {
                radius: 50,
                opacity: 0.5
            }
        };

        //Log State
        console.log(this.state);

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100vw', transform: 'translate(-5%, -5%)'}}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyBfyRSvPUUQHrjM3NHUldjdm4UA04lvd8k' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    heatmapLibrary={true}
                    heatmap={heatMapData}
                >
                </GoogleMapReact>
            </div>
        );
    }
}

//Export
export default HeatMap;
