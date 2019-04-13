import { baseUrl } from "./config";
import axios from 'axios';
import swal from 'sweetalert2';
import config from './config';

class AuthService {
    constructor() {
        this.login = this.login.bind(this);
        this.loggedIn = this.loggedIn.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
        this.isCompanyAdmin = this.isCompanyAdmin.bind(this);
        this.isTokenExpired = this.isTokenExpired.bind(this);
        this.getToken = this.getToken.bind(this);
        this.setToken = this.setToken.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
        this.getRole = this.getRole.bind(this);
        this.setRole = this.setRole.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.setUserId = this.setUserId.bind(this);
    }

    login(username, password) {
        swal.showLoading();
        var data = {
            email: username,
            password: password
        };
        return axios.post(baseUrl+'auth/login/'+window.IP, data)
            .then( res => {
                if(res.data.codeError === false) {
                    swal.closeModal();
                    this.setToken(res.data.jwt);
                    this.setUserInfo(res.data.data.first_name, res.data.data.last_name)
                    this.setRole(res.data.data.role_id);
                    this.setUserId(res.data.data.id);
                    return Promise.resolve(res);
                } else {
                    swal(res.data.error);
                    return Promise.reject(res);
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    getUserId() {
        return localStorage.getItem(config.userId);
    }

    getToken() {
        return localStorage.getItem(config.token);
    }

    getUserInfo() {
        return localStorage.getItem(config.user);
    }
    getRole() {
        return localStorage.getItem(config.role);
    }
    
    setUserId(userId) {
        return localStorage.setItem(config.userId, userId);
    }

    setToken(token) {
        return localStorage.setItem(config.token, token);
    }

    setRole(role) {
        return localStorage.setItem(config.role, role);
    }

    setUserInfo(firsname, lastname) {
        return localStorage.setItem(config.user, firsname + ' '+ lastname);
    }
    
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isAdmin() {
        const role = this.getRole();
        if(role === '1') {
            return true;
        } else {
            return false;
        }
    }

    isCompanyAdmin() {
        const role = this.getRole();
        if(role === '10') {
            return true;
        } else {
            return false;
        }
    }

    isTokenExpired(token) {
        try {
            if(token === null){
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

}

export default AuthService;