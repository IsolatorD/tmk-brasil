import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Badge, Table, InputGroup, InputGroupAddon, Input, Button, Label } from "reactstrap";
import Fecha from '../others/Fecha';
import AuthService from '../../AuthService';
import axios from 'axios';
import config from '../../config';
import $ from 'jquery';
import swal from 'sweetalert2';

const Auth = new AuthService();

class AdminDash extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            display: 'block',
            display2: 'none',
            operadores: [],
            currency: 'USD',
            year: new Date().getFullYear(),
        }
        this.myChart = this.myChart.bind(this);
        this.myChartAdmin = this.myChartAdmin.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.getChartAdminData = this.getChartAdminData.bind(this);
        this.getCurrencies = this.getCurrencies.bind(this);
        this.verifyCurrency = this.verifyCurrency.bind(this);
        this.verifyMeses = this.verifyMeses.bind(this);
    }

    componentDidMount() {
        if(Auth.isAdmin()) {
            this.setState({
                title: 'Operadores',
                display: 'block',
                display2: 'none'
            });
            this.getCurrencies();
            this.getChartAdminData(new Date().getFullYear());
        } else if(Auth.isCompanyAdmin()) {
            this.setState({
                title: 'Operadores',
                display: 'block',
                display2: 'none'
            });
            this.getCurrencies();
            this.getChartAdminData(new Date().getFullYear());
        } else {
            this.setState({
                title: 'Usuario: '+Auth.getUserInfo(),
                display: 'none',
                display2: 'block'
            });
            this.getCurrencies();
            this.getChartData(new Date().getFullYear());
        }
    }

    getCurrencies() {
        var companyId = Auth.getCompanyId();
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'graphic/currencies/'+companyId+'/'+user_id)
        .then( res => {
            var data = res.data.data;
            if(res.data.codeError === false) {
                $.each(data, (i, j) => {
                    $('#currency_type').append(`<option value="${j.currency}">${j.currency}</option>`);
                });
            }
        })
        .catch( err => {
            console.log(err);
        });
    }

    verifyCurrency() {
        var currency = $('#currency_type').val();
        this.setState({
            currency: currency,
        });
    }

    verifyMeses() {
        swal.showLoading();
        var companyId = Auth.getCompanyId();
        var user_id = Auth.getUserId();
        var month = $('#meses').val();
        axios.get(config.baseUrl+'graphic/update_operators/'+companyId+'/'+this.state.year+'/'+month+'/'+this.state.currency+'/'+user_id)
        .then( res => {
            var data = res.data.data;
            if(res.data.codeError === false) {
                this.setState({
                    operadores: data.operadores
                });
                swal.close();
            } else {
                swal({
                    type: 'warning',
                    title: res.data.error
                });
            }
        })
        .catch( err => {
            console.log(err);
        });
    }

    getChartAdminData(year) {
        swal.showLoading();
        var companyId = Auth.getCompanyId();
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'graphic/admin/'+companyId+'/'+year+'/'+this.state.currency+'/'+user_id)
            .then( res => {
                if(res.data.codeError === false) {
                    var data = res.data.data;
                    this.setState({
                        operadores: data.operadores,
                        year: year,
                    })
                    swal.close()
                    this.myChartAdmin(data.grafica);
                } else {
                    swal({
                        type: 'warning',
                        title: res.data.error
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }
    
    getChartData(year) {
        swal.showLoading();
        var userId = Auth.getUserId();
        axios.get(config.baseUrl+'graphic/operator/'+userId+'/'+year)
            .then( res => {
                if(res.data.codeError === false) {
                    var data = res.data.data;
                    swal.close()
                    this.myChart(data);
                } else {
                    swal({
                        type: 'warning',
                        title: res.data.error
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    myChart(datos) {
        return window.Highcharts.chart('GraphContainer', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: `Grafica General de Benefactores efectivos ${datos.year}`
            },
            subtitle: {
                text: 'Donaciones realizadas por el sistema (no se toman en cuenta las donaciones por link)'
            },
            xAxis: [{
                categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: window.Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Donantes',
                    style: {
                        color: window.Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Monto',
                    style: {
                        color: window.Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: window.Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: (window.Highcharts.theme && window.Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'Monto',
                type: 'column',
                yAxis: 1,
                data: [datos.enero.monto, datos.febrero.monto, datos.marzo.monto, datos.abril.monto, datos.mayo.monto, datos.junio.monto, datos.julio.monto, datos.agosto.monto, datos.septiembre.monto, datos.octubre.monto, datos.noviembre.monto, datos.diciembre.monto],
                tooltip: {
                    valueSuffix: ' '
                }
        
            }, {
                name: 'Donantes',
                type: 'spline',
                data: [datos.enero.efectivos, datos.febrero.efectivos, datos.marzo.efectivos, datos.abril.efectivos, datos.mayo.efectivos, datos.junio.efectivos, datos.julio.efectivos, datos.agosto.efectivos, datos.septiembre.efectivos, datos.octubre.efectivos, datos.noviembre.efectivos, datos.diciembre.efectivos],
                tooltip: {
                    valueSuffix: ' '
                }
            }]
        });
    }

    myChartAdmin(datos) {
        return window.Highcharts.chart('GraphContainerAdmin', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: `Grafica General de Operadores ${datos.year}`
            },
            subtitle: {
                text: 'Donaciones realizadas por el sistema (no se toman en cuenta las donaciones por link)'
            },
            xAxis: [{
                categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: window.Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Donantes',
                    style: {
                        color: window.Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Monto',
                    style: {
                        color: window.Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: window.Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: (window.Highcharts.theme && window.Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'Monto',
                type: 'column',
                yAxis: 1,
                data: [datos.enero.monto, datos.febrero.monto, datos.marzo.monto, datos.abril.monto, datos.mayo.monto, datos.junio.monto, datos.julio.monto, datos.agosto.monto, datos.septiembre.monto, datos.octubre.monto, datos.noviembre.monto, datos.diciembre.monto],
                tooltip: {
                    valueSuffix: ' '
                }
        
            }, {
                name: 'Donantes',
                type: 'spline',
                data: [datos.enero.efectivos, datos.febrero.efectivos, datos.marzo.efectivos, datos.abril.efectivos, datos.mayo.efectivos, datos.junio.efectivos, datos.julio.efectivos, datos.agosto.efectivos, datos.septiembre.efectivos, datos.octubre.efectivos, datos.noviembre.efectivos, datos.diciembre.efectivos],
                tooltip: {
                    valueSuffix: ' '
                }
            }]
        });
    }

    render() {
        const status = (i) => {
            if(i.contacted >= i.monthly_goals) {
                return (
                    <Badge color="success" pill>{i.contacted}</Badge>
                );
            } else if (i.contacted >= (i.monthly_goals/2)) {
                return(
                    <Badge color="warning" pill>{i.contacted}</Badge>
                );
            } else if(i.contacted < (i.monthly_goals/2)) {
                return(
                    <Badge color="danger" pill>{i.contacted}</Badge>
                );
            }
        };

        const operadores = () => {
            if(this.state.operadores != null) {
                return this.state.operadores.map((i ,j) => {
                    return (
                        <tr key={i.id}>
                            <td>{j++}</td>
                            <td>{i.first_name + ' ' + i.last_name}</td>
                            <td><Badge color="secondary" pill>{i.monthly_goals}</Badge></td>
                            <td>{status(i)}</td>
                            <td><Badge color="primary" pill>{i.link}</Badge></td>
                            <td><Badge color="success" pill>{i.effective}</Badge></td>
                            <td><Badge color="secondary" pill>{i.sum}</Badge></td>
                            <td><Badge color="secondary" pill>{i.avg}</Badge></td>
                        </tr>
                    );
                });
            } else {
                return null;
            }
        }
        const tabla = () => {
            if(Auth.isAdmin()) {
                return(
                    <Row>
                        <Col xs="12" sm="12">
                            <center>
                                <h2><b>Tabla general de metas mensuales</b></h2>
                            </center>
                        </Col>
                        <Col xs="4" sm="4" style={{marginLeft: '17em'}}>
                            <InputGroup>
                                <Label for="meses">Meses: </Label>
                                <Input type="select" id="meses" name="meses" onChange={this.verifyMeses}>
                                    <option value="">Seleccione...</option>
                                    <option value="01">Enero</option>
                                    <option value="02">Febrero</option>
                                    <option value="03">Marzo</option>
                                    <option value="04">Abril</option>
                                    <option value="05">Mayo</option>
                                    <option value="06">Junio</option>
                                    <option value="07">Julio</option>
                                    <option value="08">Agosto</option>
                                    <option value="09">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </Input>
                            </InputGroup>
                        </Col>
                        <Col xs="12" sm="12">
                            <Table id="tableOperadores" striped>
                                <thead>
                                    <th>#</th>
                                    <th>Operador</th>
                                    <th>Meta del mes</th>
                                    <th>Contactados</th>
                                    <th>Donación por link</th>
                                    <th>Efectivos</th>
                                    <th>Monto de Donaciones</th>
                                    <th>Promedio de Donaciones</th>
                                </thead>
                                <tbody>
                                    {operadores()}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                );
            } else if(Auth.isCompanyAdmin()) {
                return(
                    <Row>
                        <Col xs="12" sm="12">
                            <center>
                                <h2><b>Tabla general de metas mensuales</b></h2>
                            </center>
                        </Col>
                        <Col xs="12" sm="12">
                            <InputGroup>
                                <Label for="meses">Meses</Label>
                                <Input type="select" id="meses" name="meses" onChange={this.verifyMeses}>
                                    <option value="">Seleccione...</option>
                                    <option value="01">Enero</option>
                                    <option value="02">Febrero</option>
                                    <option value="03">Marzo</option>
                                    <option value="04">Abril</option>
                                    <option value="05">Mayo</option>
                                    <option value="06">Junio</option>
                                    <option value="07">Julio</option>
                                    <option value="08">Agosto</option>
                                    <option value="09">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </Input>
                            </InputGroup>
                        </Col>
                        <Col xs="12" sm="12">
                            <Table id="tableOperadores" striped>
                                <thead>
                                    <th>#</th>
                                    <th>Operador</th>
                                    <th>Meta del mes</th>
                                    <th>Contactados</th>
                                    <th>Donación por link</th>
                                    <th>Efectivos</th>
                                    <th>Monto de Donaciones</th>
                                    <th>Promedio de Donaciones</th>
                                </thead>
                                <tbody>
                                    {operadores()}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                );
            }else {
                return null;
            }
        }

        return (
            <Container className="animated fadeIn">
                <br/>
                <Row>
                    <Col xs="6" sm="6">
                        <h2>Status</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
                </Row>
                <br/>
                <Card className="box-shadow">
                    <CardBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <i className="ion-ios-box icon-size"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em', marginRight: '0.5em'}}>
                                    {this.state.title}
                                </h3>
                                <hr/>
                            </Col>
                        </Row>
                        <div style={{display: this.state.display}}>
                            <Row>
                                <Col xs="6" sm="6">
                                    <InputGroup>
                                        <Label for="currency_type">Moneda: </Label>
                                        <Input type="select" id="currency_type" name="currency_type" onChange={this.verifyCurrency}>
                                            <option value="">Seleccione...</option>
                                        </Input>
                                    </InputGroup>
                                </Col>
                                <Col xs="6" sm="6">
                                    <InputGroup>
                                        <Input type="number" min="2000" max="2030" name="graphfilter" id="graphFilterAdmin" />
                                        <InputGroupAddon addonType="append">
                                            <Button color="primary" type="button" onClick={() => {this.getChartAdminData($('#graphFilterAdmin').val())}}>
                                                <i className="ion-search"></i>
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col xs="12" sm="12">
                                    <div id="GraphContainerAdmin" style={{width:"100%", height:"300px"}}></div>
                                </Col>
                            </Row>
                        </div>
                        <div style={{display: this.state.display2}}>
                            <Row>
                                <Col xs="4" sm="4" style={{marginLeft: '30%'}}>
                                    <InputGroup>
                                        <Input type="number" min="2000" max="2030" name="graphfilter" id="graphfilter" />
                                        <InputGroupAddon addonType="append">
                                            <Button color="primary" type="button" onClick={() => {this.getChartData($('#graphFilter').val())}}>
                                                <i className="ion-search"></i>
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col xs="12" sm="12">
                                    <div id="GraphContainer" style={{width:"100%", height:"300px"}}></div>
                                </Col>
                            </Row>
                        </div>
                        <br/>
                        {tabla()}   
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

export default AdminDash;