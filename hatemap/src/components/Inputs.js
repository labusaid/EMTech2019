import React, { Component } from 'react';
import Axios from "axios";

class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        keyword: '',
        locations: ''
        };

        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleLocationsChange = this.handleLocationsChange.bind(this);

    }

    handleKeywordChange(event){
        this.setState({keyword: event.target.value});
    }

    handleLocationsChange(event){
        this.setState({locations: event.target.value});
    }

    onSetLocationsPressed(){
        console.log(this.state.locations);
        Axios.get('http://localhost:3001/setlocations?locations=' + this.state.locations, (result) => {
        if(result == 'success'){
            console.log('locations set');
        }
        });
    }

    onGetTweetsPressed(){
        Axios.get('http://localhost:3001/setkeyword?keyword=' + this.state.keyword, (result) => {
            if(result == 'success'){
                console.log('keyword set');
            }
        });
        Axios.get('http://localhost:3001/gettweets?keyword=' + this.state.keyword, (result) => {
            if(result == 'success'){
                console.log('keyword set');
            }
        });
    }

    onGetAnalyze(){
        Axios.get('http://localhost:3001/gettweettone?keyword=' + this.state.keyword, (result) => {
            if(result == 'success'){
                console.log('tones retrieved');
            }
        });
    }


  render() {
    return (
    <div>
        <input className="home-page-form-field form-control" onChange={this.handleKeywordChange} placeholder="Enter keyword"/>
        <input className="home-page-form-field form-control" onChange={this.handleLocationsChange} placeholder='Enter location list (no spaces, seperated by commas. ex: "losangeles,dallas")'/>
        <button type="button" onClick={(e) => this.onGetTweetsPressed(e)} className="btn btn-primary home-page-button">Get Tweets</button>
        <button type="button" onClick={(e) => this.onGetAnalyze(e)} className="btn btn-primary home-page-button">Analyze</button>
        <button type="button" onClick={(e) => this.onSetLocationsPressed(e)} className="btn btn-primary home-page-button">Set Locations</button>
    </div>
    );
  }
}

export default Inputs;
