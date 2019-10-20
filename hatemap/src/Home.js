import React from 'react';
import styled from 'styled-components';
import Inputs from './components/Inputs';


const GridWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(25px, auto);
`;

export const Home = (props) => (
    <GridWrapper>
        <div className='container'>
            <img src='/images/mapbg.jpg' id='bgimg'/>
            <div className='title-div'>
                <h1 id='title-text'>HateMap</h1>
                <h1 id='subtitle-text'>An easy way to determine popular opinion of a topic geographically.</h1>

                <Inputs/>
            </div>

        </div>
    </GridWrapper>
);
