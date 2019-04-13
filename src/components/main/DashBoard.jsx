import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button, ButtonGroup } from 'reactstrap';
import $ from 'jquery';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import swal from 'sweetalert2';
import axios from 'axios';
import withPermission from '../withPermission';
import AuthService from '../../AuthService';
import config from '../../config';
const Auth = new AuthService();
5830, 5834, 15984
class DashBoardCentral extends Component {
    constructor() {
        super();
        this.state = {
            startDate: null,
            endDate: null,
            focusedInput: null,
            orgs: [],
            users: [],
            display: 'block',
            display2: 'none',
            display3: 'block',
            display4: 'none',
            color: 'primary',
            color2: 'light',
            color3: 'primary',
            color4: 'light',
            tarjeta: 0,
            bancaria: 0, 
            asignados: 0,
            noAsignados: 0,
            totalDeDonaciones: 0,
            montoTotalDeDonaciones: 0
        }
        this.filterDataFromDate = this.filterDataFromDate.bind(this);
        this.verifyTwoDates = this.verifyTwoDates.bind(this);
        this.successMessage = this.successMessage.bind(this);
        this.error = this.error.bind(this);
        this.errorCustom = this.errorCustom.bind(this);
        this.handleChangeDisplays = this.handleChangeDisplays.bind(this);
        this.handleChangeDisplays2 = this.handleChangeDisplays2.bind(this);
        this.handleChangeDisplays3 = this.handleChangeDisplays3.bind(this);
        this.handleChangeDisplays4 = this.handleChangeDisplays4.bind(this);
    }

    handleChangeDisplays() {
        this.setState({ display: 'block', display2: 'none',color: 'primary', color2: 'light'});
    }
    handleChangeDisplays2() {
        this.setState({ display: 'none', display2: 'block',color: 'light', color2: 'primary'});
    }
    handleChangeDisplays3() {
        this.setState({ display3: 'block', display4: 'none', color3: 'primary', color4: 'light'});
    }
    handleChangeDisplays4() {
        this.setState({ display3: 'none', display4: 'block', color3: 'light', color4: 'primary'});
    }

    componentDidMount() {
        this.filterDataFromDate('All');
    }
    
    successMessage (msg) {
        swal({
            type: 'success',
            title: msg
        })
    }
    
    errorCustom (msg) {
        swal({
            type: 'error',
            title: msg
        })
    }
    
    error () {
        swal({
            type: 'error',
            title: 'Houve um erro ao entrar em contato com o servidor. Recarregue a página e tente novamente.'
        })
    }

    verifyTwoDates(startDate, endDate) {
        let { users } = this.state;
        if (users.length > 0) {
            var table = $('#Table').DataTable();
            table.destroy();
        }
        this.setState({ 
            startDate, 
            endDate,
            orgs: [],
            users: [],
            tarjeta: 0,
            bancaria: 0, 
            asignados: 0,
            noAsignados: 0,
            totalDeDonaciones: 0,
            montoTotalDeDonaciones: 0
        });
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
            var dateInicial = `${añoInicial}-${mesInicial}-${diaInicial}`;
            var dateFinal = `${añoFinal}-${mesFinal}-${diaFinal}`;
            this.filterDataFromDate('customized', dateInicial, dateFinal);
        }
    }

    async filterDataFromDate(option, date1 = null, date2 = null) {
        swal.showLoading();
        var userId = Auth.getUserId();
        let { users } = this.state;
        if (users.length > 0) {
            var table = $('#Table').DataTable();
            table.destroy();
        }
        try {
            let q = await axios.get(`${config.baseUrl}donation/dashboard/${option}/${date1}/${date2}/${userId}`);
            if(q.data.codeError) {
                this.setState({ orgs: [], users: [], tarjeta: 0, bancaria: 0,  asignados: 0, noAsignados: 0, totalDeDonaciones: 0, montoTotalDeDonaciones: 0 });
                return this.errorCustom(q.data.error);
            } else {
                var dat = q.data.data;
                swal.close();
                this.setState({ 
                    orgs: dat.asociaciones.length > 0 ? dat.asociaciones : [],
                    users: dat.usuarios.length > 0 ? dat.usuarios : [], 
                    tarjeta: dat.tarjeta, 
                    bancaria: dat.bancaria, 
                    asignados: dat.asignados, 
                    noAsignados: dat.noAsignados,
                    totalDeDonaciones: dat.totalDeDonaciones,
                    montoTotalDeDonaciones: dat.montoDeTotalDeDonaciones
                });
                if(dat.usuarios.length > 0) {
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
                        lengthMenu: [10, 20, 30, 50, 100]
                    });
                }
            }
        } catch(err) {
            console.log(err);
            this.error()
        }        
    }

    render() {
        let { orgs, users, color, color2, color3, color4, display, display2, display3, display4, startDate, endDate, focusedInput, tarjeta, bancaria, asignados, noAsignados, totalDeDonaciones, montoTotalDeDonaciones } = this.state;
        
        const orgCard = () => {
            if(orgs.length > 0) {
                return orgs.map((i, j) => {
                    return (
                        <Col xs="4" sm="4" className="inline-block2 mb1">
                            <Card className="box-shadow animated fadeIn">
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <h4 className="text1">
                                                <center>
                                                    <b>
                                                        {i.company_name}
                                                    </b>
                                                </center>
                                            </h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <span>
                                                <center>
                                                    <b>
                                                        Quantidade de doações
                                                    </b>
                                                </center>
                                            </span>
                                            <h5 className="text1">
                                                <center>
                                                    <b>
                                                        {i.cantidadDeDonaciones}
                                                    </b>
                                                </center>
                                            </h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <span>
                                                <center>
                                                    <b>
                                                        Valor de doações
                                                    </b>
                                                </center>
                                            </span>
                                            <h5 className="text2">
                                                <center>
                                                    <b>
                                                        R$ {i.valorDeDonaciones}
                                                    </b>
                                                </center>
                                            </h5>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    )
                })
            } else {
                return(
                    <Col xs="12" sm="12">
                        <Card>
                            <CardBody>
                                <h4>No hay datos de compañias</h4>
                            </CardBody>
                        </Card>
                    </Col>
                )
            }
        }
        
        const usuarios = () => {
            if(users.length > 0) {
                return users.map((i, j) => {
                    return(
                        <tr key={j++}>
                            <td>{j}</td>
                            <td>{i.email}</td>
                            <td>{i.cantidadDeDonaciones}</td>
                            <td>R$ {i.valorDeDonaciones}</td>
                        </tr>
                    );
                });
            } else {
                return(
                    <tr>
                        <td colspan="4">
                            Sem registros.
                        </td>
                    </tr>
                );
            }
        }

        return (
            <Container className="animated fadeIn">
                <br/>
                <Row>
                    <Col xs="6" sm="6">
                        <h2>Dashboard / Relatórios</h2>
                   </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs="6" sm="6">
                        <ButtonGroup className="margin5">
                            <Button 
                                size="lg" 
                                color="light" 
                                onClick={() => this.filterDataFromDate('Tmt')}
                            >
                                <b>
                                    Mtd
                                </b>
                            </Button>
                            <Button 
                                size="lg" 
                                color="light" 
                                onClick={() => this.filterDataFromDate('Tyt')}
                            >
                                <b>
                                    YTD
                                </b>
                            </Button>
                            <Button 
                                size="lg" 
                                color="light" 
                                onClick={() => this.filterDataFromDate('Mtd')}
                            >
                                <b>
                                    1M
                                </b>
                            </Button>
                            <Button 
                                size="lg" 
                                color="light" 
                                onClick={() => this.filterDataFromDate('Ttd')}
                            >
                                <b>
                                    3M
                                </b>
                            </Button>
                            <Button 
                                size="lg" 
                                color="light" 
                                onClick={() => this.filterDataFromDate('Std')}
                            >
                                <b>
                                    6M
                                </b>
                            </Button>
                            <Button 
                                size="lg" 
                                color="light" 
                                onClick={() => this.filterDataFromDate('1y')}
                            >
                                <b>
                                    1Y
                                </b>
                            </Button>
                            <Button 
                                size="lg" 
                                color="light" 
                                onClick={() => this.filterDataFromDate('All')}
                            >
                                <b>
                                    All
                                </b>
                            </Button>
                        </ButtonGroup>
                    </Col>
                    <Col xs="6" sm="6" className="mt1">
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onDatesChange={({ startDate, endDate }) => {this.verifyTwoDates(startDate, endDate)}}
                            focusedInput={focusedInput}
                            onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
                            small={true}
                            isOutsideRange={() => false}
                            hideKeyboardShortcutsPanel={true}
                            numberOfMonths={1}
                            showClearDates={true}
                        />
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs="4" sm="4">
                        <ButtonGroup>
                            <Button 
                                size="lg" 
                                color={color3} 
                                onClick={this.handleChangeDisplays3}
                            >
                                <b>
                                    Individuales
                                </b>
                            </Button>
                            <Button 
                                size="lg" 
                                color={color4} 
                                onClick={this.handleChangeDisplays4}
                            >
                                <b>
                                    Totais
                                </b>
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <br/>
                <Row style={{display: display3}} className="animated fadeIn">
                    <Col xs="6" sm="6" className="inline-block2">
                        <Card className="box-shadow">
                            <CardBody>
                                <Row>
                                    <Col xs="6" sm="6">
                                        <h4>
                                            <center>
                                                Domicílio bancário
                                            </center>
                                        </h4>
                                        <br/>
                                        <h3 className="text1">
                                            <center>
                                                <b>
                                                    {bancaria}
                                                </b>
                                            </center>
                                        </h3>
                                    </Col>
                                    <Col xs="6" sm="6">
                                        <h4>
                                            <center>
                                                Cartão
                                            </center>
                                        </h4>
                                        <br/>
                                        <h3 className="text2">
                                            <center>
                                                <b>
                                                    {tarjeta}
                                                </b>
                                            </center>
                                        </h3>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="6" sm="6" className="inline-block2">
                        <Card className="box-shadow">
                            <CardBody>
                                <Row>
                                    <Col xs="6" sm="6">
                                        <h4>
                                            <center>
                                                Atribuído
                                            </center>
                                        </h4>
                                        <br/>
                                        <h3 className="text1">
                                            <center>
                                                <b>
                                                    {asignados}
                                                </b>
                                            </center>
                                        </h3>
                                    </Col>
                                    <Col xs="6" sm="6">
                                        <h4>
                                            <center>
                                                Não atribuído
                                            </center>
                                        </h4>
                                        <br/>
                                        <h3 className="text2">
                                            <center>
                                                <b>
                                                    {noAsignados}
                                                </b>
                                            </center>
                                        </h3>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row style={{display: display4}} className="animated fadeIn">
                    <Col xs="6" sm="6" className="inline-block2">
                        <Card className="box-shadow">
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12">
                                        <h4>
                                            <center>
                                                Quantidade total de doações
                                            </center>
                                        </h4>
                                        <h3 className="text1">
                                            <center>
                                                <b>
                                                    R$ {montoTotalDeDonaciones}
                                                </b>
                                            </center>
                                        </h3>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="6" sm="6" className="inline-block2">
                        <Card className="box-shadow">
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12">
                                        <h4>
                                            <center>
                                                Doações totais
                                            </center>
                                        </h4>
                                        <h3 className="text2">
                                            <center>
                                                <b>
                                                    {totalDeDonaciones}
                                                </b>
                                            </center>
                                        </h3>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <br/>
                <br/>
                <Row>
                    <Col xs="4" sm="4">
                        <ButtonGroup>
                            <Button size="lg" color={color} onClick={this.handleChangeDisplays}><b>Orgs</b></Button>
                            <Button size="lg" color={color2} onClick={this.handleChangeDisplays2}><b>Users</b></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <br/>
                <Row style={{display: display }} className="animated fadeIn">
                    <Col xs="12" sm="12">
                        <h3><b>Organizações</b></h3>
                    </Col>
                    <br/>
                    { orgCard() }
                </Row>
                <Row style={{display: display2 }} className="animated fadeIn">
                    <Col xs="12" sm="12">
                        <h3><b>Usuários</b></h3>
                    </Col>
                    <br/>
                    <Col xs="12" sm="12">
                        <Card className="box-shadow">
                            <CardBody>
                                <Table id="Table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Email</th>
                                            <th>Quantidade de doações</th>
                                            <th>Valor de doações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios()}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default withPermission(DashBoardCentral);