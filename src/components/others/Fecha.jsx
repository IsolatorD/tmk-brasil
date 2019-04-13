import React, { Component } from 'react';

class Fecha extends Component {

    render() {
        var fecha = new Date();
        var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return (
            <div>
                <h5 style={{float: 'right'}}>
                    {meses[fecha.getMonth()] + ' / ' + fecha.getFullYear()}
                </h5>
            </div>
        );
    }
}

export default Fecha;