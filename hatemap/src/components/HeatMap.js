import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

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
            heatmapPoints: [
                {lat: 32.6, lng: -99.2},
                {lat: 32.55, lng: -99}
            ]
        }
    }

    render() {
        //Calc HeatMap
        const heatMapData = {
            positions: this.state.heatmapPoints,
            options: {
                radius: 50,
                opacity: 0.6
            }
        };

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

export default HeatMap;
