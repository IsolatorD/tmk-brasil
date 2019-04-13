import React, { Component } from 'react';
import { Container, Col, Row, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from 'axios';
import config from '../../config';
import $ from 'jquery';
import swal from 'sweetalert2';
import AuthService from '../../AuthService';
var Auth = new AuthService();
var companyId = null;
var id = null;

class EditCampaign extends Component {
    constructor() {
        super();
        this.getCampaign = this.getCampaign.bind(this);
        this.editCampaign = this.editCampaign.bind(this);
    }

    componentWillMount() {
        this.getCampaign();
    }

    getCampaign() {
        var userId = Auth.getUserId();
        id = this.props.match.params.id;
        axios.get(config.baseUrl+'campain/view/'+id+'/'+userId)
            .then( res => {
                var data = res.data.data;
                if( res.data.codeError === false) {
                    console.log(data);
                    companyId = data.company_id;
                    var fechaI = data.start_date.split('T');
                    var fechaF = data.final_date.split('T');
                    $('#companyId').val(data.company_id);
                    $('#campaignName').val(data.name);                    
                    $('#campaignUrl').val(data.url);
                    $('#campaignDescription').val(data.description);
                    $('#startDate').val(fechaI[0]);
                    $('#endDate').val(fechaF[0]);
                } else {
                    swal({
                        type: 'info',
                        title: res.data.error
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }
    
    editCampaign() {
        swal.showLoading();
        var form = document.getElementById('campaignForm');
        var formData = new FormData(form);

        axios.put(config.baseUrl+'campain/update/'+id, formData)
            .then( res => {
                console.log(res.data);
                var data = res.data.data;
                if(res.data.codeError === false) {
                    swal.hideLoading();
                    swal({
                        type: 'success',
                        title: data
                    }).then( result => {
                        if(result.value) {
                            window.location.replace('/dashboard/admin/company/info/'+companyId);
                        }
                    })
                    ;
                } else {
                    swal.hideLoading();
                    swal({
                        type: 'info',
                        title: res.data.error
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    cancelEdit() {
        window.location.replace('/dashboard/admin/company/info/'+companyId);
    }
    
    render() {
        return (
            <Container className="animated fadeIn">
                <br/>
               <Row>
                   <Col xs="12" sm="12">
                        <h2>Administrador - Editar campanha</h2>
                   </Col>
               </Row>
               <br/>
                <Card style={{width: '35em', marginLeft: '5em'}}>
                    <CardBody>
                        <Form id="campaignForm">
                            <Row>
                                <Col xs="12" sm="12">
                                    <FormGroup>
                                        <Input type="hidden" id="companyId" name="company_id"/>
                                        <Input type="hidden" name="user_id" value={Auth.getUserId()}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="4" sm="4">
                                    <FormGroup>
                                        <Label for="campaignName">Nome</Label>
                                        <Input type="text" name="name" id="campaignName"/>
                                    </FormGroup>
                                </Col>
                                <Col xs="4" sm="4">
                                    <FormGroup>
                                        <Label for="">Data de início</Label>
                                        <Input type="date" name="start_date" id="startDate" required/>
                                    </FormGroup>
                                </Col>
                                <Col xs="4" sm="4">
                                    <FormGroup>
                                        <Label for="">Data de finalização</Label>
                                        <Input type="date" name="final_date" id="endDate" required/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <FormGroup>
                                        <Label for="">Url</Label>
                                        <Input type="url" name="url" id="campaignUrl"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <FormGroup>
                                        <Label for="">Descrição</Label>
                                        <Input type="textarea" name="description" id="campaignDescription" style={{resize: 'none', height: '8em'}} maxlength="300"></Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <div className="float-right">
                                        <Button color="success" onClick={this.editCampaign}>Atualização</Button>
                                        <Button color="danger" onClick={this.cancelEdit} className="margin">Cancelar</Button>
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

export default EditCampaign;