import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import "../index.css";
import logo from "../images/tailMeLogo.png";
import Footer from "../components/Footer";

const title = 'Log Into';

class Login extends Component {
    // Setting the initial state values
    state = {
        username: '',
        password: '',
        loggedIn: false,
        showError: false,
        showNullError: false
    };
    handleInputChange = event => {
        // Getting the value and name of the input which triggered the change
        let value = event.target.value;
        const name = event.target.name;
        // Updating the input's state
        this.setState({
            [name]: value
        });
    };

    loginUser = event => {
        event.preventDefault();
        if (this.state.username === '' || this.state.password === '') {
            this.setState({
                showError: false,
                showNullError: true,
                loggedIn: false,
            });
        } else {
            axios
                .post('/user/signin', {
                    username: this.state.username,
                    password: this.state.password
                })
                .then(response => {
                    localStorage.setItem('JWT', response.data.token);
                    this.setState({
                        loggedIn: true,
                        showError: false,
                        showNullError: false,
                    });
                })
                .catch(error => {
                    console.log(error.response.data);
                    if (
                        error.response.data === 'bad username' ||
                        error.response.data === 'passwords do not match'
                    ) {
                        this.setState({
                            showError: true,
                            showNullError: false,
                        });
                    }
                });
        }
    };
    render() {
        const {
            username,
            showError,
            loggedIn,
            showNullError,
        } = this.state;

        if (!loggedIn) {
            return (
                <div className="login">
                    <p className="login__title">{title}</p>
                    <img className="login__logo" src={logo} alt="tailME logo" ></img>
                    <form className="login__form" onSubmit={this.loginUser}>
                    <label className="login__form--usernameLabel">Enter your user name</label>
                        <input className="login__form--usernameInput"
                            value={this.state.username}
                            name="username"
                            onChange={this.handleInputChange}
                            type="text"
                            placeholder="UserName"
                        />
                         <label className="login__form--passwordLabel">Enter your password</label>
                        <input className="login__form--passwordInput"
                            value={this.state.password}
                            name="password"
                            onChange={this.handleInputChange}
                            type="password"
                            placeholder=""
                        />
                        <button type="submit" className="login__form--submitButton">Log in</button>
                    </form>
                    {showNullError && (
                        <div>
                            <p>The username or password cannot be null.</p>
                        </div>
                    )}
                    {showError && (
                        <div>
                            <p>That username or password isn't recognized. Please try again or register now.</p>
                            <p><a href="/walker/signup">Sign up as a Walker</a></p>
                        </div>
                    )}
                    <a className="login__form--homeButton" href="/">Return to Home</a>
                    <div className="login__form--footer">
                    <Footer/>
                    </div>
                </div>
            );
        } else {
            return <Redirect to={`/userProfile/${username}`} />;
        }
    }
}

export default Login;
