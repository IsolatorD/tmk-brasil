import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Form, Label, Input, FormGroup, Button } from 'reactstrap';
import axios from 'axios';
import $ from 'jquery';
import swal from 'sweetalert2';
import config from '../../../config';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';

const Auth = new AuthService();

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            display: 'none',
            display2: 'block'
        }
        this.getUserInfo = this.getUserInfo.bind(this);
        this.editUser = this.editUser.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.getRoles = this.getRoles.bind(this);
        this.verify = this.verify.bind(this);
    }

    updateUser(e) {
        e.preventDefault();
        var userId = this.state.user.id;
        var firstname = document.getElementById('firstname').value;
        var lastname = document.getElementById('lastname').value;
        var email = document.getElementById('email').value;
        var role = document.getElementById('role').value;
        var monthlyGoals = document.getElementById('monthlyGoals').value;
        var status = document.getElementById('status').value;

        var formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('email', email);
        formData.append('role_id', role);
        formData.append('monthly_goals', monthlyGoals);
        formData.append('user_id', Auth.getUserId());
        formData.append('estatus', status);

        swal.showLoading();
        axios.put(config.baseUrl+'user/update/'+userId, formData)
            .then( res => {
                    if(res.data.codeError === false) {
                        this.getUserInfo();
                        this.handleCancel();
                        swal.hideLoading();
                        swal({title: res.data.data, type: 'success'})
                    } else {
                        swal.hideLoading();
                        swal({type: 'info', title: res.data.error})
                    }
            })
            .catch( err => {
                console.log(err);
            });
    }

    editUser() {
        this.setState({
            display: 'block',
            display2: 'none'
        });
        $('#firstname').removeAttr('disabled');
        $('#lastname').removeAttr('disabled');
        $('#email').removeAttr('disabled');
        $('#pass').hide();
        $('#role').removeAttr('disabled');
        $('#monthlyGoals').removeAttr('disabled');
    }

    deleteUser(id){
        var user_id = Auth.getUserId();
        swal({
            type: 'warning',
            title:'Atenção', 
            text:'¿Tem certeza de que deseja excluir este usuário?',
            showCancelButton: true,
            confirmButtonText: 'Sim, Excluir!'
        }).then( result => {
            if(result.value) {
                swal.showLoading();
                axios.delete(config.baseUrl+'user/delete/'+id+'/'+user_id)
                    .then( res => {
                        if( res.data.codeError === false) {
                            swal.hideLoading();
                            this.props.history.replace('/dashboard/admin/user/list');
                        }else {
                            swal({
                                type:'warning',
                                title: res.data.error
                            });
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    });
            }
        })
        .catch( err => {
            console.log(err);
        });
    }

    handleCancel() {
        this.setState({
            display: 'none',
            display2: 'block'
        })
        $('#firstname').attr('disabled', 'disabled');
        $('#lastname').attr('disabled', 'disabled');
        $('#email').attr('disabled', 'disabled');
        $('#pass').show();
        $('#role').attr('disabled', 'disabled');
        $('#monthlyGoals').attr('disabled', 'disabled');
        $('#status').attr('disabled', 'disabled');
    }

    getRoles() {
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'role/all/'+user_id)
            .then( res => {
                var data = res.data.data;
                $.each(data, (i,j) => {
                    $('#role').append(`<option value="${j.id}">${j.name}</option>`)
                });
                this.getUserInfo();
            })
            .catch( err => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getRoles();
        this.verify();
        var deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteUser(this.state.user.id);
        });

        
    }

    getUserInfo() {
        var user_id = Auth.getUserId();
        var userId = this.props.match.params.id;
        axios.get(config.baseUrl+'user/view/'+userId+'/'+user_id)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    this.setState({
                        user: data
                    });

                    $('#firstname').val(data.first_name);
                    $('#lastname').val(data.last_name);
                    $('#email').val(data.email);
                    $('#pass').val(data.encrypted_password);
                    $('#monthlyGoals').val(data.monthly_goals);
                    $('#role').val(data.role_id);
                    $('#status').val(data.estatus == true ? 'true': 'false');
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    verify(e) {
        if($('#firstname').val() !== '' && $('#lastname').val() !== '' && $('#email').val() !== '' && $('#monthlyGoals').val() !== '' && $('#role').val() !== '') {
            $('#btnUp').removeAttr('disabled');
        } else {
            $('#btnUp').attr('disabled', 'disabled');
        }
    }

    render() {
        const activo = () => {
            return(<span style={{color: 'blue'}}><b>Ativo</b></span>);
        }
        const inactivo = () => {
            return(<span style={{color: 'red'}}><b>Inativo</b></span>);
        }
        
        return (
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="12" sm="12">
                        <h2>Administrador - Informação do Usuário</h2>
                   </Col>
               </Row>
               <br/>
               <Card style={{width: '35em', marginLeft: '15%'}} className="box-shadow">
                   <CardBody>
                       <Form>
                           <Row>
                               <Col xs="6" sm="6">
                                    <span>Papel: {this.state.user.role_name}</span>
                               </Col>
                               <Col xs="6" sm="6">
                                    <span>Última sessão: {this.state.user.last_sign_in_at}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <span>Status: {this.state.user.estatus == true ? activo(): inactivo() }</span>
                                </Col>
                            </Row>
                           <br/>
                           <Form>
                                <Row>
                                    <Col xs="6" sm="6">
                                            <FormGroup>
                                                <Label for="firstname">Nome</Label>
                                                <Input type="text" name="firstname" id="firstname" disabled="true" required onChange={this.verify}/>
                                            </FormGroup>
                                    </Col>
                                    <Col xs="6" sm="6">
                                            <FormGroup>
                                                <Label for="lastname">Sobrenome</Label>
                                                <Input type="text" name="lastname" id="lastname" disabled="true" required onChange={this.verify}/>
                                            </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="6" sm="6">
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input type="email" name="email" id="email" disabled="true" required onChange={this.verify}/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="6" sm="6">
                                        <FormGroup>
                                            <Label for="pass">Password</Label>
                                            <span id="mensaje" style={{display:this.state.display}}>Campo não editável</span>
                                            <Input type="password" name="pass" id="pass" disabled="true"/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="6" sm="6">
                                        <FormGroup>
                                            <Label for="monthlyGoals">Metas mensais</Label>
                                            <Input type="number" name="monthlyGoals" id="monthlyGoals" min="1" disabled="true" required onChange={this.verify}/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="6" sm="6" style={{display: this.state.display}}>
                                        <FormGroup>
                                            <Label for="role">Papel</Label>
                                            <Input type="select" name="role" id="role" disabled="true" required onChange={this.verify}>   
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="6" sm="6" style={{display: this.state.display}}>
                                        <FormGroup>
                                            <Label for="status">Status</Label>
                                            <Input type="select" name="estatus" id="status" onChange={this.verify} >
                                                <option value="true">Ativo</option>
                                                <option value="false">Inativo</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                            <br/>
                            <Row>
                                <Col xs="12" sm="12">
                                    <div className="float-right">
                                        <div style={{display: this.state.display}}>
                                            <Button id="btnUp" color="success" type="button" onClick={this.updateUser}>Atualização</Button>
                                            <Button color="danger" className="margin" onClick={this.handleCancel}>Cancelar</Button>
                                        </div>
                                        <div style={{display: this.state.display2}}>
                                            <Button color="warning" className="text-white" onClick={this.editUser}>Editar</Button>
                                            <Button color="danger" className="margin" id="deleteBtn">Excluir</Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                       </Form>
                   </CardBody>
               </Card>
            </Container>
        );
    }
}

export default withPermission(UserInfo);