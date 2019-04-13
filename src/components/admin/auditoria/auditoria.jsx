import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import config from '../../../config';
import $ from 'jquery';
import axios from 'axios';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
import Fecha from '../../others/Fecha';

const Auth = new AuthService();

class Auditoria extends Component {
    constructor() {
        super();
        this.state = {
            auditorias: []
        };
    }

    componentDidMount() {
        var userId = Auth.getUserId();
        axios.get(config.baseUrl+'audit/all/'+userId).then(res => {
            var data = res.data.data;
            if(res.data.codeError === false) {
                this.setState({
                    auditorias: data
                });
                $('#Table').DataTable({
					language: {
						"sProcessing": "Processando...",
						"sLengthMenu": "Mostrar _MENU_ registros",
						"sZeroRecords": "Nenhum resultado encontrado",
						"sEmptyTable": "Não há dados disponíveis nesta tabela",
						"sInfo": "Mostrando registros del _START_ al _END_ de um total de _TOTAL_ registros",
						"sInfoEmpty": "Mostrando registros del 0 al 0 de um total de 0 registros",
						"sInfoFiltered": "(filtrando um total de _MAX_ registros)",
						"sInfoPostFix": "",
						"sSearch": "Pesquisar:",
						"sUrl": "",
						"sInfoThousands": ",",
						"sLoadingRecords": "Carregando...",
						"oPaginate": {
							"sFirst": "Primeiro",
							"sLast": "Último",
							"sNext": "Próximo",
							"sPrevious": "Anterior"
						},
						"oAria": {
							"sSortAscending": ": Ative para ordenar a coluna ascendente",
							"sSortDescending": ": Ativar para ordenar a coluna em ordem decrescente"
						}
					},
					"iDisplayLength": 100
				});
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const auditoria = () => {
            if(this.state.auditorias.length != null) {
                return this.state.auditorias.map((i, j) => {
                    return (
                        <tr key={j++} className='animated fadeIn'>
                            <td>{j}</td>
                            <td>{moment(i.date).format('h:mm:ss a DD-MM-YYYY')}</td>
                            <td>{i.first_name} {i.last_name}</td>
                            <td>{i.controller}</td>
                            <td>{i.action}</td>
                            <td>{i.navigator}</td>
                            <td>{i.ip}</td>
                            <td>{i.note}</td>
                        </tr>
                    );
                });
            } else {
                return (
                    <tr>
                        <td colspan="8">
                            Sem registros.
                        </td>
                    </tr>
                );
            }
        };

        return(
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="6" sm="6">
                        <h2>Administrador - Auditoria</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
               </Row>
               <br/>
                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <Table id="Table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Data</th>
                                            <th>Usuário</th>
                                            <th>Controlador</th>
                                            <th>Ação</th>
                                            <th>Navegador</th>
                                            <th>IP</th>
                                            <th width="50px">Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditoria()}
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

export default withPermission(Auditoria);