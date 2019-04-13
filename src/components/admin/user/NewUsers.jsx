import React, { Component } from 'react';
import { Container, Card, CardBody, Col, Row, Label, Input, FormGroup, Button, Form } from 'reactstrap';
import config from '../../../config';
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert2';
import Fecha from '../../others/Fecha';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';

const Auth = new AuthService();

class NewUsers extends Component {
    constructor() {
        super();
        this.verify = this.verify.bind(this);
        this.state = {
            companies: []
        };
        this.getCompanies = this.getCompanies.bind(this);
        this.getRoles = this.getRoles.bind(this);
    }
    
    getCompanies() {
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'company/all/'+user_id)
            .then( res => {
                var data = res.data.data
                $.each(data, (i,j) => {
                    $('#companyId').append(`<option value="${j.id}">${j.name}</option>`)
                });
        }).catch(err => {
            console.log(err);
        });
    }

    getRoles() {
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'role/all/'+user_id)
            .then( res => {
                var data = res.data.data;
                $.each(data, (i,j) => {
                    $('#role').append(`<option value="${j.id}">${j.name}</option>`)
                });
            })
            .catch( err => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getCompanies();
        this.getRoles();
        this.verify();
        var saveUserButton = document.getElementById('btnSaveUser');
        saveUserButton.addEventListener('click', (e) => {
            e.preventDefault();
            swal.showLoading();
            var data = {
                user_id: Auth.getUserId(),
                first_name: $('#firstname').val(),
                last_name: $('#lastname').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                monthly_goals: $('#MonthlyGoals').val(),
                role_id: $('#role').val()
            };

            axios.post(config.baseUrl+'user/add', data)
                    .then( res => {
                        if(res.data.codeError === false) {
                            swal.hideLoading();
                            swal({type:'success', title: res.data.data});
                            $('#formUserNew')[0].reset();
                        } else {
                            swal.hideLoading();
                            swal({type: 'info', title: res.data.error });
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    });
        });
    }

    verify(e) {
        if($('#firstname').val() !== '' && $('#lastname').val() !== '' && $('#email').val() !== '' && $('#password').val() !== '' && $('#role').val() !== '' && $('#MonthlyGoals').val() !== '') {
            $('#btnSaveUser').removeAttr('disabled');
        } else {
            $('#btnSaveUser').attr('disabled', 'disabled');
        }
    }
    
    render() {
        return (
            <Container className="animated fadeIn">
               <br/>
               <Row>
                   <Col xs="6" sm="6">
                        <h2>Administrador - Adicionar Usuário</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
               </Row>
               <br/>
               <Card style={{width: '30em', marginLeft: '25%'}} className="box-shadow">
                    <CardBody>
                        <Form id="formUserNew">
                            <Row>
                                <Col xs="12" sm="12">
                                    <i className="ion-person icon-size"></i>
                                    <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>
                                        Novo Usuário
                                    </h3>
                                    <hr/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="firstname">Nome</Label>
                                        <Input type="text" name="firstname" id="firstname" onKeyUp={this.verify}/>
                                    </FormGroup>
                                </Col>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="lastname">Sobrenome</Label>
                                        <Input type="text" name="lastname" id="lastname" onKeyUp={this.verify}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input type="email" name="email" id="email" onKeyUp={this.verify}/>
                                    </FormGroup>
                                </Col>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input type="password" name="password" id="password" onKeyUp={this.verify}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="MonthlyGoals">Metas mensais</Label>
                                        <Input type="number" name="monthly_goals" id="MonthlyGoals" min="1" onKeyUp={this.verify}/>
                                    </FormGroup>
                                </Col>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="GroupPermissions">Papel</Label>
                                        <Input type="select" name="GroupPermissions" id="role" onChange={this.verify} >
                                            <option value="true">Selecione...</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <Button color="primary" size="lg" id="btnSaveUser" style={{float: 'right'}}>
                                        Salvar
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
               </Card>
            </Container>
        );
    }
}

export default withPermission(NewUsers);