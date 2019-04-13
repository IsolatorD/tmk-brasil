import React, { Component } from 'react';
import { Container, Col, Row, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Fecha from '../../others/Fecha';
import axios from 'axios';
import swal from 'sweetalert2';
import $ from 'jquery';
import config from "../../../config";
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
var Auth = new AuthService();

class NewRole extends Component {
    constructor() {
        super();
        this.getPermissions = this.getPermissions.bind(this);
        this.createRole = this.createRole.bind(this);
    }

    componentDidMount() {
        this.getPermissions();
    }

    getPermissions() {
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'permission/all/'+user_id)
            .then( res => {
                var data = res.data.data;
                $.each(data, (i,j) => {
                    $('#permisos').append(`<option value="${j.id}">${j.name}</option>`)
                });
            })
            .catch( err => {
                console.log(err);
            });
    }

    createRole(e) {
        swal.showLoading();
        e.preventDefault();
        var formRole = document.getElementById('formRole');
        var formData = new FormData(formRole);
        formData.append('user_id', Auth.getUserId());
        axios.post(config.baseUrl+'role/add', formData)
            .then( res => {
                var data = res.data;
                if(res.data.codeError === false) {
                    swal.hideLoading();
                    swal(data.data);
                    $('#formRole')[0].reset();
                } else {
                    swal.hideLoading();
                    swal(data.error);
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    render() {
        return (
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="6" sm="6">
                        <h2>Administrador - Adicionar papel</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
               </Row>
               <br/>
               <Card style={{width: '50em'}} className="box-shadow">
                   <CardBody>
                       <Form id="formRole" onSubmit={this.createRole}>
                            <Row>
                                <Col xs="5" sm="5">
                                        <FormGroup>
                                            <Label for="roleName">Nome da Função</Label>
                                            <Input type="text" id="roleName" name="name" required/>
                                        </FormGroup>
                                </Col>
                                <Col xs="7" sm="7">
                                    <FormGroup>
                                        <Label for="permisos">Permissões para o papel</Label>
                                        <Input type="select" id="permisos" name="permisos" multiple required>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                   <Button color="primary" className="float-right">Salvar</Button>
                                </Col>
                            </Row>
                        </Form>
                   </CardBody>
               </Card>
            </Container>
        );
    }
}

export default withPermission(NewRole);