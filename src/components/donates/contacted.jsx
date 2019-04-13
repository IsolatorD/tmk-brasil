import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Badge, Button, ButtonGroup } from "reactstrap";
import swal from 'sweetalert2';
import $ from "jquery";
import axios from 'axios';
import config from '../../config';
import AuthService from '../../AuthService';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import Goals from '../others/Goals';

const Auth = new AuthService();

class Contacted extends Component {
    constructor() {
        super();
        this.state = {
            contactados: [],
            errorMsg: null,
            startDate: null,
            endDate: null,
            focusedInput: null,
        }
        this.getContacteds = this.getContacteds.bind(this);
        this.filterDataFromDate = this.filterDataFromDate.bind(this);
        this.verifyTwoDates = this.verifyTwoDates.bind(this);
    }

    componentDidMount() {
        var userId = Auth.getUserId();
        this.getContacteds(userId);
    }

    verifyTwoDates(startDate, endDate) {
        this.setState({ startDate, endDate })
        if(startDate !== null && endDate !== null) {
            var fechaInicial = new Date(startDate);
            var fechaFinal = new Date(endDate);
            var añoInicial = fechaInicial.getFullYear();
            var mesInicial = fechaInicial.getMonth()+1;
            var diaInicial = fechaInicial.getDate();
            var añoFinal = fechaFinal.getFullYear();
            var mesFinal = fechaFinal.getMonth()+1;
            var diaFinal = fechaFinal.getDate();
            if(mesInicial < 10) {
                mesInicial = `0${mesInicial}`;
            }
            if(mesFinal < 10) {
                mesFinal = `0${mesFinal}`;
            }
            if(diaInicial < 10) {
                diaInicial = `0${diaInicial}`;
            }
            if(diaFinal < 10) {
                diaFinal = `0${diaFinal}`;
            }
            var dateInicial = `${añoInicial}-${mesInicial}-${diaInicial} 00:00:00`;
            var dateFinal = `${añoFinal}-${mesFinal}-${diaFinal} 00:00:00`;
            this.filterDataFromDate('Btw', dateInicial, dateFinal);
        }
    }


    getContacteds(id) {
        axios.get(config.baseUrl+'client/contacts/'+id+'/Tmt')
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    this.setState({
                        contactados: data
                    });
                    $('#Table').DataTable({language: {
                        lengthMenu: 'Mostrar _MENU_ Registros por página',
                        zeroRecords: 'Nenhum resultado encontrado',
                        info: 'Mostrando página _PAGE_ de _PAGES_',
                        infoEmpty: 'Nenhum resultado encontrado',
                        paginate: {
                            first: 'Primeiro',
                            last: 'Último',
                            next: 'Próximo',
                            previous: 'Anterior'
                        },
                        search: 'Buscar:',
                        infoFiltered: 'Filtrado de _MAX_ registros'
                    }});
                } else {
                    console.log(res.data.error.sms);
                    this.setState({
                        errorMsg: res.data.error.sms
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    filterDataFromDate(option, date1 = null, date2 = null) {
        swal.showLoading();
        if (this.state.contactados.length > 0) {
            var table = $('#Table').DataTable();
            table.destroy();
        }
        var userId = Auth.getUserId();
        axios.get(config.baseUrl+'client/contacts/'+userId+'/'+option+'/'+date1+'/'+date2)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    swal.close();
                    this.setState({
                        contactados: data
                    });
                    $('#Table').DataTable({language: {
                        lengthMenu: 'Mostrar _MENU_ Registros por página',
                        zeroRecords: 'Nenhum resultado encontrado',
                        info: 'Mostrando página _PAGE_ de _PAGES_',
                        infoEmpty: 'Nenhum resultado encontrado',
                        paginate: {
                            first: 'Primeiro',
                            last: 'Último',
                            next: 'Próximo',
                            previous: 'Anterior'
                        },
                        search: 'Pesquisar:',
                        infoFiltered: 'Filtrado de _MAX_ registros'
                        },
                        lengthMenu: [100, 150, 200, 250, 300]
                    });
                } else {
                    swal.close();
                    this.setState({
                        errorMsg: res.data.error.sms
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    toContactLead(email) {
        window.location.replace('/dashboard/index/'+email);
    }

    render() {
        const contactados = () => {
            if(this.state.contactados.length > 0){
                return this.state.contactados.map((i,j) => {
                    return (
                        <tr key={j++}>
                            <td>{j}</td>
                            <td>{i.date}</td>
                            <td>{i.first_name}</td>
                            <td>{i.last_name}</td>
                            <td>{i.email}</td>
                            <td>{i.campain_name}</td>
                            <td>{i.origin_data}</td>
                            <td>
                                <Button color="primary" onClick={() => this.toContactLead(i.email)}>
                                    <i className="ion-chevron-right icon-actions"></i>
                                </Button>
                            </td>
                        </tr>
                    )
                });
            } else {
                return (
                    <tr>
                        <td colspan="6">
                            {this.state.errorMsg}
                        </td>
                    </tr>
                )
            }
        }

        return (
            <Container className="animated fadeIn">
                <Row>
                    <Goals/>
                </Row>
                <br/>
                <Row>
                    <Col xs="4" sm="4">
                        <h2>Contatados</h2>
                   </Col>
                   <Col xs="8" sm="8" className="datafilter">
                        <ButtonGroup className="margin5">
                            <Button size="md" color="light" onClick={() => this.filterDataFromDate('1w')}><b>1w</b></Button>
                            <Button size="md" color="light" onClick={() => this.filterDataFromDate('4w')}><b>4w</b></Button>
                            <Button size="md" color="light" onClick={() => this.filterDataFromDate('1y')}><b>1y</b></Button>
                            <Button size="md" color="light" onClick={() => this.filterDataFromDate('Tmt')}><b>Mtd</b></Button>
                            <Button size="md" color="light" onClick={() => this.filterDataFromDate('Qtd')}><b>Qtd</b></Button>
                            <Button size="md" color="light" onClick={() => this.filterDataFromDate('All')}><b>All</b></Button>
                        </ButtonGroup>
                        <div className="margin" style={{display: 'inline-block'}}>
                            <DateRangePicker
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onDatesChange={({ startDate, endDate }) => {this.verifyTwoDates(startDate, endDate)}}
                                focusedInput={this.state.focusedInput}
                                onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
                                small={true}
                                isOutsideRange={() => false}
                                hideKeyboardShortcutsPanel={true}
                                numberOfMonths={1}
                                showClearDates={true}
                                />
                        </div>
                    </Col>
                </Row>
                <br/>
                <Card className="box-shadow">
                    <CardBody>
                        <Row>
                            <Col xs="7" sm="7">
                                <i className="ion-ios-box icon-size"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em', marginRight: '0.5em'}}>
                                    Base de dados
                                </h3>
                                <Badge color="primary" pill className="text-white">contatados</Badge>
                            </Col>
                            <hr/>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <Table id="Table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Contatado</th>
                                            <th>Nome</th>
                                            <th>Sobrenome</th>
                                            <th>Email</th>
                                            <th>Campanha</th>
                                            <th>Origem</th>
                                            <th>Ver</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactados()}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

export default Contacted;