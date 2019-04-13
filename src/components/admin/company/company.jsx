import React, { Component } from 'react';
import { Container, Form, Row, Col, Card, CardBody, Input, Label, FormGroup, Button } from "reactstrap";
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert2';
import config from '../../../config';
import Fecha from '../../others/Fecha';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
var Auth = new AuthService();

class Company extends Component {
    constructor() {
        super();
        this.state = {
            file: '',
            imagePreviewUrl: null
        };
        this.handleImageChange = this.handleImageChange.bind(this);
        this.createCompany = this.createCompany.bind(this);
        this.verify = this.verify.bind(this);
    }

    componentDidMount(){
        this.verify();
    }

    createCompany() {
        var imagen = document.getElementById('companyLogo').files[0];
        var name = document.getElementById('companyName').value;
        var url_mautic = document.getElementById('UrlMautic').value;
        var formData = new FormData();
        var configHeader = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        formData.append('logo', imagen);
        formData.append('name', name);
        formData.append('user_id', Auth.getUserId());
        formData.append('url_mautic', url_mautic);
        swal.showLoading();
        axios.post(config.baseUrl+'company/add', formData, configHeader)
                .then( res => {
                    if(res.data.codeError === false) {
                        swal.hideLoading();
                        swal({title: res.data.data, type: 'success'})
                        $('#formCompany')[0].reset();
                        $('.logo').hide();
                    } else {
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

    verify(e) {
        if($('#companyName').val() !== '' && $('#UrlMautic').val() !== '') {
            $('#saveCompany').removeAttr('disabled');
        }else {
            $('#saveCompany').attr('disabled', 'disabled');
        }
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl !== null) {
            $imagePreview = (<img className="logo" src={imagePreviewUrl} alt="logo"/>);
        } else {
            let $imagePreview = null;
        }

        return (
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="6" sm="6">
                        <h2>Administrador - Organizações</h2>
                   </Col>
                   <Col xs="6" sm="6">
                        <Fecha/>
                   </Col>
               </Row>
               <br/>
               <Card className="box-shadow">
                   <CardBody>
                       <Row>
                           <Col xs="12" sm="12">
                                <i className="fa fa-building"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>Adicionar Organização</h3>
                           </Col>
                       </Row>
                        <hr/>
                       <br/>
                       <Row>
                           <Col xs="12" sm="12">
                                <center>
                                    {$imagePreview}
                                </center>
                           </Col>
                       </Row>
                       <br/>
                       <Form id="formCompany">
                            <Row>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="companyLogo">Carregar um logotipo</Label>
                                        <Input type="file" name="logo" id="companyLogo" onChange={this.handleImageChange}/>
                                    </FormGroup>
                                </Col>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="companyName">Nome da Organização</Label>
                                        <Input type="text" name="companyName" id="companyName" onKeyUp={this.verify}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="UrlMautic">Url para Mautic</Label>
                                        <Input type="text" name="url_mautic" id="UrlMautic" onKeyUp={this.verify}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col xs="12" sm="12">
                                    <Button className="float-right" color="primary" id="saveCompany" onClick={this.createCompany} >Salvar</Button>
                                </Col>
                            </Row>
                        </Form>
                   </CardBody>
               </Card>
            </Container>
        );
    }
}

export default withPermission(Company);