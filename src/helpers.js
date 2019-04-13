import AuthService from './AuthService';
import io from "socket.io-client";
var swal = require('sweetalert2');
var $ = require('jquery');
var config = require('./config');
var axios = require('axios');
const Auth = new AuthService();
const Socket = io(config.baseUrl);
export { Socket };
export function Cierre() {
    
    window.addEventListener('beforeunload', (e) => {
        var ConfirmationMessage = '\o/';
        (e || window.event).returnValue = ConfirmationMessage;
        cerrarSesion();
        return ConfirmationMessage;
    });
}

function cerrarSesion() {
    var id = Auth.getUserId();
    axios.get(config.baseUrl+'auth/logout/'+id+'/'+window.IP)
        .then( res => {
        if(res.data.codeError === false) {
            localStorage.clear();
            window.location.replace('/');
        }
    })
    .catch( err => {
        console.log(err);
    });
}

export function inactividad() {
    var temp = setTimeout(confirmarCierre, 3600000);
   
    function confirmarCierre() {
        var cerrar = setTimeout(cerrarSesion, 10000);
        swal(
            {title:'Cierre de sesion por inactividad', 
            text:'presione OK para prolongar su sesion', 
            type:'info', })
            .then(result => {
                if(result.value) {
                    clearTimeout(cerrar);
                    clearTimeout(temp);
                    temp = setTimeout(confirmarCierre, 3600000)
                    swal('Su sesión ha sido prolongada una hora');
                } else {
                    cerrarSesion();
                }
        });
    }
    
    $(document).on("click", function(e) {
        e.stopPropagation();
      });
      
      $( document ).on('click keyup keypress keydown blur change', function(e) {
          console.log('actividad detectada');
      });
}