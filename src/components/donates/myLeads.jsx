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

class MyLeads extends Component {
    constructor() {
        super();
        this.state = {
            contactados: [],
            errorMsg: null,
            startDate: null,
            endDate: null,
            focusedInput: null,
        }
        this.getMyLeads = this.getMyLeads.bind(this);
    }

    componentDidMount() {
        var userId = Auth.getUserId();
        this.getMyLeads(userId);
    }

    getMyLeads(id) {
        axios.get(`${config.baseUrl}client/user_with_assigned/${id}/${id}`)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    this.setState({
                        contactados: data
                    });
                    $('#Table').DataTable({language: {
                        lengthMenu: 'Mostrar _MENU_ Registros por página',
                        zeroRecords: 'No hay registros',
                        info: 'Mostrando página _PAGE_ de _PAGES_',
                        infoEmpty: 'No hay registros',
                        paginate: {
                            first: 'Primero',
                            last: 'Ultimo',
                            next: 'Siguiente',
                            previous: 'Anterior'
                        },
                        search: 'Buscar:',
                        infoFiltered: 'Filtrado de _MAX_ registros'
                        },
                        lengthMenu: [100, 150, 200, 250, 300]
                    });
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
                        <h2>Mis Leads</h2>
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
                                <Badge color="primary" pill className="text-white">leads</Badge>
                            </Col>
                            <hr/>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <Table id="Table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <td>Data de admissão</td>
                                            <th>Nome</th>
                                            <th>Sobrenome</th>
                                            <th>Email</th>
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

export default MyLeads;