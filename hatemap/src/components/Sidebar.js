import React from 'react';
import Axios from "axios";

import styled from "styled-components";

import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
/* This defines the actual bar going down the screen */
const StyledSideNav = styled.div`
  position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 75px;     /* Set the width of the sidebar */
  z-index: 1;      /* Stay on top of everything */
  top: 3.4em;      /* Stay at the top */
  background-color: #222; /* Black */
  overflow-x: hidden;     /* Disable horizontal scroll */
  padding-top: 10px;
`;

class SideNav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePath: props.location.pathname,
            items: [
                {
                    path: '/',
                    name: 'Home',
                    css: 'fa fa-fw fa-home',
                    key: 1
                },
                {
                    path: '/Stoked',
                    name: 'Stoked',
                    css: 'far fa-smile',
                    key: 2
                },
                {
                    path: '/Pissed',
                    name: 'Pissed',
                    css: 'fas fa-angry',
                    key: 3
                },
                {
                    path: '/Tweets',
                    name: 'Tweets',
                    css: 'fab fa-twitter',
                    key: 4
                },
            ],
            locations: '',
            keyword: ''
        };


        }

        setLocationsOnServer(){
            // Axios.get('http://localhost:3001/setlocations?locations=')
            //     .then(response => {
            //
            // });
        }

    changeLocationText(event){
        this.setState({
           locations: event.target.value
        });
        console.log('locations set to: ' + event.target.value);
    }

    onItemClick = (path) => {
        this.setState(   { activePath: path }); /* Sets activePath which causes rerender which causes CSS to change */
    }

    render() {
        const { items, activePath } = this.state;
        return (
            <StyledSideNav>
                {
                    /* items = just array AND map() loops thru that array AND item is param of that loop */
                    items.map((item) => {
                        /* Return however many NavItems in array to be rendered */
                        return (
                            <NavItem path={item.path} name={item.name} css={item.css} onItemClick={this.onItemClick} /* Simply passed an entire function to onClick prop */ active={item.path === activePath} key={item.key}/>
                        )
                    })
                }
            </StyledSideNav>
        );
    }
}

const RouterSideNav = withRouter(SideNav);

class NavItem extends React.Component {
    handleClick = () => {
        const { path, onItemClick } = this.props;
        onItemClick(path);
    };

    render() {
        const { active } = this.props;

        return (
            <StyledNavItem active={active}>
                <Link to={this.props.path} className={this.props.css} onClick={this.handleClick}>
                    <NavIcon></NavIcon>
                </Link>
            </StyledNavItem>
        );
    }
}

const NavIcon = styled.div`
`;

const StyledNavItem = styled.div`
  height: 70px;
  width: 75px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin-bottom: 0;   /* Puts space between NavItems */
  a {
    font-size: 2.7em;
    color: ${(props) => props.active ? "white" : "#26b3ff"};
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
    }  
  }
\`;
`;

export default class Sidebar extends React.Component {
    render() {
        return (
            <RouterSideNav></RouterSideNav>
        );
    }
}
