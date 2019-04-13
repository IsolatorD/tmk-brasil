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

class EditResult extends Component {
    constructor() {
        super();
        this.state = {
            campoSI: false
        }
        this.getResult = this.getResult.bind(this);
        this.editResult = this.editResult.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    componentWillMount() {
        this.getResult();
    }

    getResult() {
        id = this.props.match.params.id;
        var userId = Auth.getUserId();
        axios.get(config.baseUrl+'callstatus/view/'+id+'/'+userId)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    console.log(data);
                    companyId = data.company_id;
                    if(data.effective == true && data.is_link == true) {
                        $('#Efecctiveness').val('Si');
                        this.setState({
                            campoSI: true
                        });
                    } else if(data.effective == true && data.is_link == false) {
                            $('#Efecctiveness').val('Si');
                            this.setState({
                                campoSI: true
                            });
                    } else if(data.effective == false) {
                        this.setState({
                            campoSI: false
                        });
                        $('#Efecctiveness').val('No');
                    }
                    
                    $('#companyId').val(data.company_id);
                    $('#resultName').val(data.name);
                    $('#form_id_mautic').val(data.form_id_mautic);

                } else {
                    swal({
                        type: 'info',
                        title: res.data.error
                    });
                }
            })
            .catch( err => {

            });
    }

    editResult() {
        swal.showLoading();
        var form = document.getElementById('formResult');
        var formData = new FormData(form);

        axios.put(config.baseUrl+'callstatus/update/'+id, formData)
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
            <Container>
                <br/>
               <Row>
                   <Col xs="12" sm="12">
                        <h2>Administrador - Editar evento do resultado</h2>
                   </Col>
               </Row>
               <br/>
               <Card style={{width: '35em', marginLeft: '5em'}}>
                   <CardBody>
                       <Form id="formResult">
                            <Row>
                                <Col xs="12" sm="12">
                                    <FormGroup>
                                        <Input type="hidden" id="companyId" name="company_id"/>
                                        <Input type="hidden" id="userId" name="user_id" value={Auth.getUserId()}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="4" sm="4">
                                    <FormGroup>
                                        <Label for="form_id_mautic">Form ID Mautic</Label>
                                        <Input type="number" name="form_id_mautic" id="form_id_mautic"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="4" sm="4">
                                    <FormGroup>
                                        <Label for="Efecctiveness">Eficácia</Label>
                                        <Input type="select" name="effective" id="Efecctiveness" >
                                            <option value="Si">Sim</option>
                                            <option value="No">Não</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col xs="8" sm="8">
                                    <FormGroup>
                                        <Label for="resultName">Nome</Label>
                                        <Input type="text" name="name" id="resultName"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <div className="float-right">
                                        <Button color="success" onClick={this.editResult}>Atualização</Button>
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

export default EditResult;