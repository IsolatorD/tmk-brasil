import React, { Component } from 'react';
import AuthService from '../AuthService';

export default function withPermission(PermissionComponent) {
    const Auth = new AuthService();
    return class PermissionWrapper extends Component {
        constructor() {
            super();
            this.state = {
                userRole: null
            }
        }

        componentWillMount() {
            this.setState({
                userRole: Auth.getRole()
            });
            if(!Auth.isAdmin()) {
                if(!Auth.isCompanyAdmin()) {
                    window.location.replace('/dashboard/index');
                }
            }
        }

        render() {
            return(
                <PermissionComponent {...this.props} {...this.state} />
            );
        }
    }
}