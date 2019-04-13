import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button } from "reactstrap";
import Fecha from '../../others/Fecha';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import { baseUrl } from "../../../config";
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
var Auth = new AuthService();

class Roles extends Component {
    constructor() {
        super();
        this.state = {
            roles: []
        }
    }

    componentDidMount() {
        var user_id = Auth.getUserId();
        axios.get(baseUrl+'role/all/'+user_id)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    this.setState({
                        roles: data
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
        const roles = () => {
            if(this.state.roles !== null) {
                return this.state.roles.map((i,j) => {
                    return(
                        <tr>
                            <td>{j++}</td>
                            <td>{i.name}</td>
                            <td>
                                <Link to={"/dashboard/admin/roles/info/"+i.id}>
                                    <Button color="primary" className="float-right">
                                        <i className="fa fa-arrow-right icon-actions"></i>
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    )
                });
            } else {
                return(
                    <tr>
                        <td colspan="3">Não há papéis.</td>
                    </tr>
                )
            }
        }
        return (
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="6" sm="6">
                        <h2>Administrador - Lista de funções</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
               </Row>
               <br/>
               <Card style={{width: '40em', marginLeft: '13%'}} className="box-shadow">
                   <CardBody>
                        <Row>
                            <Col xs="6" sm="6">
                                <i className="fa fa-tag icon-size"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>Todos os papéis</h3>
                            </Col>
                            <Col xs="6" sm="6">
                                <Link to="/dashboard/admin/roles/new">
                                    <Button color="primary" style={{float: 'right'}}>
                                        <span style={{marginRight: '0.5em', fontSize: '1.2em'}}>
                                            Adicionar novo
                                        </span>
                                        <i className="fa fa-tag icon-actions"></i>
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                        <br/>
                       <Row>
                           <Col xs="12" sm="12">
                                <Table id="Table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nome</th>
                                            <th>Informação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles()}
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

export default withPermission(Roles);