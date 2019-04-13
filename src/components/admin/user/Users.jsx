import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Fecha from '../../others/Fecha';
import axios from 'axios';
import config from '../../../config';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';

const Auth = new AuthService();

class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        }
    }
    
    componentDidMount() {
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'user/all/'+user_id)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    this.setState({
                        users: data
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
            .catch(err => {
                console.log(err);
            });
    }
        
    
    render() {
        const activo = () => {
            return(<span style={{color: 'blue', marginTop: '.5em'}}><b>Ativo</b></span>);
        }
        const inactivo = () => {
            return(<span style={{color: 'red'}}><b>Inativo</b></span>);
        }
        const users = () => {
            if(this.state.users !== null){
                return this.state.users.map((i,j) => {
                    return (
                        <tr key={j++} className="animated fadeIn">
                            <td>{j}</td>
                            <td>{i.first_name}</td>
                            <td>{i.last_name}</td>
                            <td>{i.email}</td>
                            <td>{i.monthly_goals}</td>
                            <td>{i.assigned}</td>
                            <td>{i.estatus ? activo() : inactivo() }</td>
                            <td>
                                <Link to={"/dashboard/admin/user/info/"+i.id}>
                                    <Button color="primary">
                                        <i className="fa fa-arrow-right icon-actions"></i>
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    )
                });
            } else {
                return (
                    <tr>
                        <td colspan="6">
                            Não há usuários.
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
                        <h2>Administrador - Usuários</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
                </Row>
                <br/>
                <Card className="box-shadow">
                    <CardBody>
                        <Row>
                            <Col xs="6" sm="6">
                                <i className="ion-ios-people icon-size"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>Todos os Usuários</h3>
                            </Col>
                            <Col xs="6" sm="6">
                                <Link to="/dashboard/admin/user/new">
                                    <Button color="primary" style={{float: 'right'}}>
                                        <span style={{marginRight: '0.5em', fontSize: '1.2em'}}>
                                            Adicionar Novo
                                        </span>
                                        <i className="ion-person icon-actions"></i>
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
                                            <th>Sobrenome</th>
                                            <th>Email</th>
                                            <th>Metas mensais</th>
                                            <th>Leads Atribuidos</th>
                                            <th>Status</th>
                                            <th>Ver</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users()}
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

export default withPermission(Users);