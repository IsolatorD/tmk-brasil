import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, Form, Badge } from 'reactstrap';
import $ from 'jquery';
import axios from 'axios';
import config from "../../../config";
import swal from 'sweetalert2';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
var Auth = new AuthService();

class RoleInfo extends Component {
    constructor() {
        super();
        this.state = {
            role: [],
            permisos: [],
            display: 'none',
            display2: 'block',
        }
        this.getPermissions = this.getPermissions.bind(this);
        this.editRole = this.editRole.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.verify = this.verify.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.getRoleInfo = this.getRoleInfo.bind(this);
        this.updateRole = this.updateRole.bind(this);
    }

    componentDidMount() {
        this.getPermissions();
        this.getRoleInfo();
        var deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteRole(this.props.match.params.id);
        });

    }

    verify(e) {
        if($('#roleName').val() !== '') {
            $('#updateBtn').removeAttr('disabled');
        }else {
            $('#updateBtn').attr('disabled', 'disabled');
        }
    }
    updateRole(e) {
        e.preventDefault();
        var form = document.getElementById('formUpdateRole');
        var formData = new FormData(form);
        formData.append('user_id', Auth.getUserId());
        var roleId = this.props.match.params.id;
        swal.showLoading();
        axios.put(config.baseUrl+'role/update/'+roleId, formData)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    swal.hideLoading();
                    swal({title: data, type: 'success'});
                    this.getRoleInfo();
                    this.handleCancel();
                } else {
                    swal.hideLoading();
                    swal({title: res.data.error, type: 'info'});
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    editRole() {
        this.verify()
        $('#roleName').removeAttr('disabled');
        this.setState({
            display: 'block',
            display2: 'none'
        });
    }
    
    handleCancel() {
        this.getRoleInfo();
        $('#roleName').attr('disabled', 'disabled');
        this.setState({
            display: 'none',
            display2: 'block'
        });
    }

    deleteRole(id) {
        var user_id = Auth.getUserId();
        swal({
            type: 'warning',
            title:'Atenção', 
            text:'¿Tem certeza de que deseja excluir esta função?',
            showCancelButton: true,
            confirmButtonText: 'Sim, Excluir!'
        }).then( result => {
            if(result.value) {
                swal.showLoading();
                axios.delete(config.baseUrl+'role/delete/'+id+'/'+user_id)
                    .then( res => {
                        if(res.data.codeError === false) {
                            swal.hideLoading();
                            this.props.history.replace('/dashboard/admin/roles/list');
                        }else {
                            swal({
                                type:'warning',
                                title: res.data.error
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);                        
                    });
            }
        })
        .catch(err => {
            console.log(err);            
        })
    }

    getRoleInfo() {
        var id = this.props.match.params.id;
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'role/view/'+id+'/'+user_id)
            .then(res=>{
                var data = res.data.data;
                if(res.data.codeError === false) {
                    this.setState({
                        role: data,
                        permisos: data.permission
                    });
                    $('#roleName').val(data.role.name);
                }
            })
            .catch(err=>{
                console.log(err);
            })
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

    render() {

        const permisosRol = () => {
            if(this.state.permisos !== null) {
                return this.state.permisos.map((i,j) => {
                    return (
                        <Badge color="primary" className="inline-block margin" key={i.id}>
                            {i.name}
                        </Badge>
                    );
                });
            } else {
                return (
                    <h4>Esta função não tem permissões.</h4>
                )
            }
        }

        return (
            <Container>
               <br/>
               <Row>
                   <Col xs="12" sm="12">
                        <h2>Administrador - Informação de função</h2>
                   </Col>
               </Row>
               <br/>
               <Card style={{width: '35em', marginLeft: '15%'}} className="box-shadow">
                   <CardBody>
                       <Form id="formUpdateRole" onSubmit={this.updateRole}>
                            <Row>
                                <Col xs="5" sm="5">
                                    <FormGroup>
                                        <Label for="roleName">Nome da Função</Label>
                                        <Input type="text" disabled='true' name="name" id="roleName" required/>
                                    </FormGroup>
                                </Col>
                                <Col xs="7" sm="7" style={{display: this.state.display}}>
                                    <FormGroup>
                                        <Label for="permisos">Permissões para o papel</Label>
                                        <Input type="select" id="permisos" name="permisos" multiple required>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <ul style={{display: this.state.display2}}>
                                       {permisosRol()}
                                    </ul>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <div className="float-right">
                                        <div style={{display: this.state.display}}>
                                            <Button color="success" id="updateBtn">Atualização</Button>
                                            <Button color="danger" onClick={this.handleCancel} className="margin">Cancelar</Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                       </Form>
                       <Row>
                           <Col xs="12" sm="12">
                                <div style={{display: this.state.display2}}>
                                    <Button color="warning" onClick={this.editRole}>Editar</Button>
                                    <Button color="danger" className="margin" id="deleteBtn">Excluir</Button>
                                </div>
                           </Col>
                       </Row>
                   </CardBody>
               </Card>
            </Container>
        );
    }
}

export default withPermission(RoleInfo);