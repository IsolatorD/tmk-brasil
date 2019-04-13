import React, { Component } from 'react';
import AuthService from '../AuthService';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    return class AuthWrapper extends Component {
        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentWillMount() {
            this.setState({
                user: Auth.getToken()
            });
            if(!Auth.loggedIn()) {
                this.props.history.replace('/');
            }
        }

        render() {
            if(this.state.user) {
                return(
                    <AuthComponent {...this.props} {...this.state} />
                );
            } else {
                return null;
            }
        }
    }
}