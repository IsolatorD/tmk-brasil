import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, FormGroup, Label, Input, Table, Button, Form } from "reactstrap";

import axios from 'axios';
import swal from 'sweetalert2';
import $ from 'jquery';
import config from "../../../config";

import AppSettings from './AppSettings';
import Cancelaciones from './Cancelaciones';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';

const Auth = new AuthService();

class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyInfo: [],
            campanas: [],
            activeTab: '1',
            display: 'none',
            display2: 'block',
            file: '',
            imagePreviewUrl: null,
            companyId: this.props.match.params.id
        };
        this.getCompanyData = this.getCompanyData.bind(this);
        this.verify = this.verify.bind(this);
        this.toggle = this.toggle.bind(this);
        this.updateCompany = this.updateCompany.bind(this);
        this.editCompany = this.editCompany.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.deleteCompany = this.deleteCompany.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.upkey = this.upkey.bind(this);
    }

    componentDidMount(){
        var deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteCompany(this.state.companyInfo.id);
        });
        this.getCompanyData();
    }

    getCompanyData() {
        var id = this.props.match.params.id;
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'company/view/'+id+'/'+user_id)
            .then(res=>{
                var data = res.data.data;
                console.log(data)
                if(res.data.codeError === false) {
                    this.setState({
                        companyInfo: data,
                        campanas: data.campains
                    });
                    
                    $('#companyName').val(data.name);
                    $('#urlMautic').val(data.url_mautic);
                    $('#api_key').val(data.api_key);
                }
            })
            .catch(err=>{
                console.log(err);
            });
    }
    updateCompany() {
        var companyId = null;
        if(Auth.isAdmin()) {
            companyId = this.props.match.params.id;
        } else if(Auth.isCompanyAdmin()) {
            companyId = this.props.match.params.id;
        }
        var imagen = document.getElementById('logo').files[0];
        var name = document.getElementById('companyName').value;
        var urlMautic = document.getElementById('urlMautic').value;
        var update_api_key = $('#update_api_key').prop('checked');
        var formData = new FormData();
        var configHeader = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        formData.append('logo', imagen);
        formData.append('name', name);
        formData.append('user_id', Auth.getUserId());
        formData.append('url_mautic', urlMautic);
        formData.append('update_api_key', update_api_key);
        swal.showLoading();
        axios.put(config.baseUrl+'company/update/'+companyId, formData, configHeader)
                .then( res => {
                    if(res.data.codeError === false) {
                        swal.hideLoading();
                        swal({title: res.data.data, type: 'success'})
                        $('#imgPreview').hide();
                        var table = $('#UsersTable').DataTable();
                        table.destroy();
                        this.getCompanyData();
                        this.handleCancel();
                    } else {
                        swal.hideLoading();
                        swal({type: 'info', title: res.data.error})
                    }
                })
                .catch( err => {
                    console.log(err);
                });
    }

    handleImageChange(e) {
        e.preventDefault();
        let file = e.target.files[0];  
        if(file !== undefined && file.name !== undefined) {
            let reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
            }
            return reader.readAsDataURL(file);
        } else {
            this.setState({
                file: null,
                imagePreviewUrl: null
            });
            return;
        }
    }

    editCompany() {
        this.verify()
        $('#companyName').removeAttr('disabled');
        $('#urlMautic').removeAttr('disabled');
        $('#imgPreview').show();
        this.setState({
            imagePreviewUrl: null,
            display: 'block',
            display2: 'none'
        });
    }
    
    handleCancel() {
        $('#companyName').attr('disabled', 'disabled');
        $('#urlMautic').attr('disabled', 'disabled');
        this.setState({
            display: 'none',
            display2: 'block'
        });
    }

    deleteCompany(id) {
        var user_id = Auth.getUserId();
        swal({
            type: 'warning',
            title:'Atenção', 
            text:'¿Certamente você deseja excluir esta organização?',
            showCancelButton: true,
            confirmButtonText: 'Sim, Excluir!'
        }).then( result => {
            if(result.value) {
                swal.showLoading();
                axios.delete(config.baseUrl+'company/delete/'+id+'/'+user_id)
                    .then( res => {
                        if( res.data.codeError === false) {
                            swal.hideLoading();
                            this.props.history.replace('/dashboard/admin/company/list');
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

    toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }

    verify(e) {
        if($('#companyName').val() !== '' && $('#urlMautic').val() !== '') {
            $('#updateBtn').removeAttr('disabled');
        }else {
            $('#updateBtn').attr('disabled', 'disabled');
        }
    }

    upkey(e) {
        console.log(e);
    }

    render() {

        var { imagePreviewUrl } = this.state;
        var $imagePreview = null;
        if (imagePreviewUrl !== null) {
            $imagePreview = (<img className="newlogo" id="imgPreview" src={imagePreviewUrl} alt="logo"/>);
        } else {
            $imagePreview = null;
        }

        
        return(
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="12" sm="12">
                        <h2>Administrador -Informações sobre a Organização</h2>
                   </Col>
               </Row>
               <br/>
               <Card className="box-shadow">
                   <CardBody>
                        <Nav tabs>
                            <NavItem className="tab-links">
                                <NavLink className={{ active: this.state.activeTab === '1' }} onClick={() => { this.toggle('1'); }}>
                                    <i className="fa fa-building"></i>{' '}
                                    Organização
                                </NavLink>
                            </NavItem>
                            <NavItem className="tab-links">
                                <NavLink
                                className={{ active: this.state.activeTab === '2' }}
                                onClick={() => { this.toggle('2'); }}
                                >
                                    <i className="ion-settings"></i>{' '}
                                    Settings
                                </NavLink>
                            </NavItem>
                            <NavItem className="tab-links">
                                <NavLink
                                className={{ active: this.state.activeTab === '3' }}
                                onClick={() => { this.toggle('3'); }}
                                >
                                    <i className="ion-email"></i>{' '}
                                    Cancelamentos
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Container className="animated fadeIn">
                                    <br/>
                                    <Row>
                                        <Col xs="5" sm="5">
                                            <img src={this.state.companyInfo ? config.baseUrl+this.state.companyInfo.logo : ''} alt="Logo" className="company-logo"/>
                                        </Col>
                                        <Col xs="2" sm="2">
                                            <i className="fa fa-arrow-right" style={{display: this.state.display, marginTop: '3em' }}></i>
                                        </Col>
                                        <Col xs="5" sm="5">
                                            {$imagePreview}
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Form>
                                        <Row style={{display:this.state.display}}>
                                            <Col xs="12" sm="12">
                                                <FormGroup>
                                                    <Label for="logo">Carregar um novo logotipo</Label>
                                                    <Input type="file" name="logo" id="logo" onChange={this.handleImageChange}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="6" sm="6">
                                                <FormGroup>
                                                    <Label for="companyName">Nome da Organização</Label>
                                                    <Input type="text" name="companyName" id="companyName" disabled={true} onKeyUp={this.verify}/>
                                                </FormGroup>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <FormGroup>
                                                    <Label for="api_key">Api Key</Label>
                                                    <Input type="text" name="api_key" id="api_key" disabled={true}/>
                                                </FormGroup> 
                                            </Col>
                                            <Col xs="2" sm="2" style={{marginTop: '1.5em', display: this.state.display}}>
                                                <FormGroup>
                                                    <Label>
                                                        <Input type="checkbox" name="update_api_key" id="update_api_key" onChange={this.upkey} />{' '}
                                                        Atualizar a chave da API
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="6" sm="6">
                                                <FormGroup>
                                                    <Label for="urlMautic">Url para Mautic</Label>
                                                    <Input type="text" name="url_mautic" id="urlMautic" disabled={true} onKeyUp={this.verify}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <div className="float-right">
                                                    <div style={{display: this.state.display}}>
                                                        <Button color="success" id="updateBtn" onClick={this.updateCompany}>Atualização</Button>
                                                        <Button className="margin" color="danger" onClick={this.handleCancel}>Cancelar</Button>
                                                    </div>
                                                    <div style={{display: this.state.display2}}>
                                                        <Button color="warning" className="text-withe" onClick={this.editCompany}>Editar</Button>
                                                        <Button id="deleteBtn" className="margin" color="danger">Excluir</Button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Container>
                            </TabPane>
                            <TabPane tabId="2">
                                <Container className="animated fadeIn">
                                    <br/>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <AppSettings id={this.props.match.params.id} campanas={this.state.campanas}/>
                                        </Col>
                                    </Row>
                                </Container>
                            </TabPane>
                            <TabPane tabId="3">
                                <Container className="animated fadeIn">
                                    <br/>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <Cancelaciones id={this.props.match.params.id}/>
                                        </Col>
                                    </Row>
                                </Container>
                            </TabPane>
                        </TabContent>
                   </CardBody>
               </Card>
            </Container>
        )
    }
}

export default withPermission(CompanyInfo);