import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

//array of heatmap points
var heatPoints = [];
//Function to add a point to heatmap
function addTweetPoint(lat, lng, weight) {
    heatPoints.push({lat: lat, lng: lng, weight: weight})
}

//Heatmap component
class HeatMap extends Component {
    static defaultProps = {
        center: {
            lat: 32.6,
            lng: -99.2
        },
        zoom: 7
    };

    constructor(props) {
        super(props);
        this.state = {
            heatmapVisible: true,
            heatmapPoints: heatPoints,
        }
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

        addTweetPoint(33.0,-99.2,6);
        addTweetPoint(32.5,-99.2,1);
        addTweetPoint(32.0,-99.2,3);
        addTweetPoint(31.5,-99.2,20);

        //Log State
        console.log(this.state);

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
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