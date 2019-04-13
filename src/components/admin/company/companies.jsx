import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import config from "../../../config";
import Fecha from '../../others/Fecha';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
var Auth = new AuthService();

class Companies extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'company/all/'+user_id)
        .then( res => {
            var data = res.data.data;
            if(res.data.codeError === false) {
                this.setState({
                    data: data
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
                }});
            }
        })
        .catch( err => {
            console.log(err);
        });
    }

    render() {

        const companies = () => {
            if(this.state.data !== null) {
                return this.state.data.map((i,j) => {
                    return (
                        <tr key={j++}>
                            <td>{j}</td>
                            <td>{i.name}</td>
                            <td>
                            <Link to={"/dashboard/admin/company/info/"+i.id}>
                                <Button color="primary">
                                    <i className="ion-eye icon-actions"></i>
                                </Button>
                            </Link>
                            </td>
                        </tr>
                    )
                });
            } else {
                return (
                    <tr>
                        <td colspan="4">
                            Não existem Organizações
                        </td>
                    </tr>
                )
            }
        }

        return (
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="6" sm="6">
                        <h2>Administrador - Lista de Organizações</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
               </Row>
               <br/>
               <Card className="box-shadow">
                   <CardBody>
                       <Row>
                           <Col xs="10" sm="10">
                                <i className="fa fa-building"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>Todas as Organizações</h3>
                           </Col>
                           <Col xs="2" sm="2">
                                <Link to="/dashboard/admin/company/new">
                                    <Button color="primary">Adicionar Organização</Button>
                                </Link>
                           </Col>
                       </Row>
                       <hr/>
                       <br/>
                       <Row>
                           <Col xs="12" sm="12">
                                <Table id="Table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nome</th>
                                            <th>informação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies()}
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

export default withPermission(Companies);