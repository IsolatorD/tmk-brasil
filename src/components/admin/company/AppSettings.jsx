import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Input, FormGroup, Label, Table, Form } from 'reactstrap';
import axios from 'axios';
import $ from 'jquery';
import swal from 'sweetalert2';
import config from "../../../config";
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
var Auth = new AuthService();
class AppSettings extends Component {
    constructor() {
        super();
        this.state = {
            campanas: [],
            resultados: [],
            contactabilidades: [],
            campoSI: false
        }
        this.addCampaign = this.addCampaign.bind(this);
        this.viewCampaign = this.viewCampaign.bind(this);
        this.editCampaign = this.editCampaign.bind(this);
        this.deleteCampaign = this.deleteCampaign.bind(this);
        this.getCampaigns = this.getCampaigns.bind(this);
        this.getResults = this.getResults.bind(this);
        this.addResult = this.addResult.bind(this);
        this.editResult = this.editResult.bind(this);
        this.deleteResult = this.deleteResult.bind(this);
        
        this.getContatactabilities = this.getContatactabilities.bind(this);
        this.addContactability = this.addContactability.bind(this);
        this.editContactability = this.editContactability.bind(this);
        this.deleteContactability = this.deleteContactability.bind(this);
        
    }

    componentDidMount() {
        this.getCampaigns(this.props.id);
        this.getResults(this.props.id);
        this.getContatactabilities(this.props.id);
    }

    getContatactabilities(id) {
        if(this.state.contactabilidades.length > 0) {
            var table = $('#Table2').DataTable();
            table.destroy();
        }
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'contactability/all/'+id+'/'+user_id)
        .then( res => {
            var data = res.data.data;
            if(res.data.codeError === false){
                this.setState({
                    contactabilidades: data
                });
                $('#Table2').DataTable({language: {
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
            } else {
                this.setState({
                    contactabilidades: []
                });
            }
        })
        .catch( err => {
            console.log(err);
        });
    }

    getResults(id) {
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'callstatus/all/'+id+'/'+user_id)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false){
                    this.setState({
                        resultados: data
                    });
                    $('#ResultsTable').DataTable({language: {
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
                } else {
                    this.setState({
                        resultados: []
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    getCampaigns(id) {
        if(this.state.campanas.length > 0) {
            var table = $('#Table1').DataTable();
            table.destroy();
        }
        var user_id = Auth.getUserId();
        axios.get(config.baseUrl+'campain/all/'+id+'/'+user_id)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    this.setState({
                        campanas: data
                    });
                    $('#Table1').DataTable({language: {
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
                } else {
                    this.setState({
                        campanas: []
                    });
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    addResult(e) {
        e.preventDefault();
        var form = document.getElementById('formResult');
        var formData = new FormData(form);
        swal.showLoading();
        if (this.state.resultados.length > 0) {
            var table = $('#ResultsTable').DataTable();
            table.destroy();
        }
        axios.post(config.baseUrl+'callstatus/add', formData)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    swal.hideLoading();
                    swal({
                        type: 'success',
                        title: data
                    });
                    $('#formResult')[0].reset();
                    this.getResults(this.props.id);
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

    addCampaign(e) {
        e.preventDefault();
        var form = document.getElementById('formCampañas');
        var formData = new FormData(form);
        swal.showLoading();
        axios.post(config.baseUrl+'campain/add', formData)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    swal.hideLoading()
                    swal({
                        type: 'success',
                        title: data
                    });
                    $('#formCampañas')[0].reset();
                    this.getCampaigns(this.props.id);
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

    addContactability(e) {
        e.preventDefault();
        var form = document.getElementById('formContactability');
        var formData = new FormData(form);
        swal.showLoading();
        axios.post(config.baseUrl+'contactability/add', formData)
            .then( res => {
                var data = res.data.data;
                if(res.data.codeError === false) {
                    swal.hideLoading()
                    swal({
                        type: 'success',
                        title: data
                    });
                    $('#formContactability')[0].reset();
                    this.getContatactabilities(this.props.id);
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

    viewCampaign(id, name, url, description) {
        swal({
            title: name,
            html: `
                <h3>Url: ${url}</h3>
                <h4>Descrição: ${description}</h4>`,
            confirmButtonText: 'Fechar'
        })
    }

    editCampaign(id) {
        window.location.replace('/dashboard/admin/campaign/edit/'+id);
    }

    editResult(id) {
        window.location.replace('/dashboard/admin/result/edit/'+id);
    }
    
    editContactability(id) {
        window.location.replace('/dashboard/admin/contact/edit/'+id);
    }
    
    deleteContactability(id) {
        var user_id = Auth.getUserId();
        swal({
            title: '¿Claro que você deseja excluir este evento de Contato?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, elimine!'
        }).then( result => {
            if(result.value) {
                swal.showLoading();
                var table = $('#Table2').DataTable();
                table.destroy();
                axios.delete(config.baseUrl+'contactability/delete/'+id+'/'+user_id)
                    .then( res => {
                        var data = res.data.data;
                        if(res.data.codeError === false) {
                            swal.hideLoading();
                            swal({
                                title: data,
                                type: 'success'
                            });
                            this.getContatactabilities(this.props.id);
                        } else {
                            swal.hideLoading();
                            swal({
                                title: 'Error',
                                text: res.data.error
                            });
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    });
            }
        });

    }

    deleteResult(id) {
        var user_id = Auth.getUserId();
        swal({
            title: '¿Claro que você deseja excluir este evento de resultado?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, elimine!'
        }).then( result => {
            if(result.value) {
                swal.showLoading();
                var table = $('#ResultsTable').DataTable();
                table.destroy();
                axios.delete(config.baseUrl+'callstatus/delete/'+id+'/'+user_id)
                    .then( res => {
                        var data = res.data.data;
                        if(res.data.codeError === false) {
                            swal.hideLoading();
                            swal({
                                title: data,
                                type: 'success'
                            });
                            this.getResults(this.props.id);
                        } else {
                            swal.hideLoading();
                            swal({
                                title: 'Error',
                                text: res.data.error
                            });
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    });
            }
        });
    }

    deleteCampaign(id) {
        var user_id = Auth.getUserId();
        swal({
            title: '¿Claro que você deseja excluir esta campanha?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, elimine!'
        }).then( result => {
            if(result.value) {
                swal.showLoading();
                var table = $('#Table1').DataTable();
                table.destroy();
                axios.delete(config.baseUrl+'campain/delete/'+id+'/'+user_id)
                    .then( res => {
                        var data = res.data.data;
                        if(res.data.codeError === false) {
                            swal.hideLoading();
                            swal({
                                title: data,
                                type: 'success'
                            });
                            this.getCampaigns(this.props.id);
                        } else {
                            swal.hideLoading();
                            swal({
                                title: 'Error',
                                text: res.data.error
                            });
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    });
            }
        })
    }

    

    render() {
        const contactabilidades = () => {
            if(this.state.contactabilidades !== null && this.state.contactabilidades.length > 0) {
                return this.state.contactabilidades.map((i, j) => {
                    return (
                        <tr key={j++} className="animated fadeIn">
                            <td>{j}</td>
                            <td>{i.name}</td>
                            <td>{i.form_id_mautic}</td>
                            <td>
                                <Button className="btn-actions" color="primary" onClick={() => this.editContactability(i.id)}>
                                    <i className="ion-edit icon-actions"></i>
                                </Button>
                                <Button className="btn-actions" color="danger" onClick={() => this.deleteContactability(i.id)}>
                                    <i className="ion-close-circled icon-actions"></i>
                                </Button>
                            </td>
                        </tr>
                    )
                });
            } else {
                return (
                    <tr>
                        <td colspan="4">
                            Sem registros.
                        </td>
                    </tr>
                )
            }
        }

        const resultados = () => {
            if(this.state.resultados !== null && this.state.resultados.length > 0) {
                return this.state.resultados.map((i, j) => {
                    return (
                        <tr key={j++} className="animated fadeIn">
                            <td>{j}</td>
                            <td>{i.effective ? 'Si' : 'No'}</td>
                            <td>{i.name}</td>
                            <td>{i.form_id_mautic}</td>
                            <td>
                                <Button className="btn-actions" color="primary" onClick={() => this.editResult(i.id)}>
                                    <i className="ion-edit icon-actions"></i>
                                </Button>
                                <Button className="btn-actions" color="danger" onClick={() => this.deleteResult(i.id)}>
                                    <i className="ion-close-circled icon-actions"></i>
                                </Button>
                            </td>
                        </tr>
                    )
                });
            } else {
                return (
                    <tr>
                        <td colspan="6">
                            Sem registros.
                        </td>
                    </tr>
                )
            }
        }

        const campanas = () => {
            if(this.state.campanas !== null && this.state.campanas.length > 0) {
                return this.state.campanas.map((i,j) => {
                    return (
                        <tr key={j++} className="animated fadeIn">
                            <td>{j}</td>
                            <td>{i.name}</td>
                            <td>{i.url}</td>
                            <td>{i.description}</td>
                            <td>
                                <Button color="primary" 
                                onClick={() => this.viewCampaign(i.id, i.name, i.url, i.description)} className="btn-actions" >
                                    <i className="ion-eye icon-actions"></i>
                                </Button>
                                <Button color="warning" onClick={() => this.editCampaign(i.id)} className="btn-actions">
                                    <i className="ion-edit icon-actions"></i>
                                </Button>
                                <Button color="danger" onClick={() => this.deleteCampaign(i.id)}className="btn-actions">
                                    <i className="ion-close-circled icon-actions"></i>
                                </Button>
                            </td>
                        </tr>
                    )
                });
            } else {
                return (
                    <tr>
                        <td colspan="5">
                            Sem registros.
                        </td>
                    </tr>
                )
            }
        }
        return (
            <Container className="animated fadeIn">
                 <Card className="box-shadow">
                     <CardBody>
                         <Row>
                             <Col xs="12" sm="12">
                                <i className="ion-speakerphone icon-size"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>
                                    Campanhas
                                </h3>
                             <hr/>
                             </Col>
                         </Row>
                         <br/>
                         <Row>
                             <Col xs="12" sm="12">
                                <FormGroup>
                                    <Label for="CampaignsTable">Campanhas</Label>
                                    <Table id="Table1">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Nome</th>
                                                <th>Url</th>
                                                <th>Descrição</th>
                                                <th>Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campanas()}
                                        </tbody>
                                    </Table>
                                    <hr/>
                                </FormGroup>
                             </Col>
                         </Row>
                         <br/>
                         <Form id="formCampañas" onSubmit={this.addCampaign}>
                            <Row>
                                <Col xs="12" sm="12">
                                    <p><b>Adicionar campanha</b></p>
                                </Col>
                                <Col xs="12" sm="12">
                                    <Input type="hidden" name="company_id" value={this.props.id}/>
                                    <Input type="hidden" name="user_id" value={Auth.getUserId()}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="5" sm="5">
                                    <FormGroup>
                                        <Label for="name">Nome da campanha</Label>
                                        <Input type="text" name="name" id="name"/>
                                    </FormGroup>
                                </Col>
                                <Col xs="3" sm="3">
                                    <FormGroup>
                                        <Label for="start_date">Data de início</Label>
                                        <Input type="date" id="start_date" name="start_date"/>
                                    </FormGroup>
                                </Col>
                                <Col xs="3" sm="3">
                                    <Label for="final_date">Data de finalização</Label>
                                    <Input type="date" id="final_date" name="final_date"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="10" sm="10">
                                    <FormGroup>
                                        <Label for="url">URL da campanha</Label>
                                        <Input type="url" name="url" id="url"/>
                                    </FormGroup>
                                </Col>
                                <Col xs="10" sm="10">
                                    <FormGroup>
                                        <Label for="description">Texto da campanha</Label>
                                        <Input type="textarea" name="description" id="description" style={{resize: 'none', height: '8em'}} maxlength="300"></Input>
                                    </FormGroup>
                                </Col>
                                <Col xs="12" sm="12">
                                    <Button color="primary">
                                        <span style={{marginRight: '0.5em', fontSize: '1.2em'}} >Adicionar </span>
                                        <i className="ion-plus-circled icon-actions"></i>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                     </CardBody>
                 </Card>                 
                 <br/>
                 <Card className="box-shadow">
                     <CardBody>
                         <Row>
                            <Col xs="12" sm="12">
                                <i className="ion-ios-telephone icon-size"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>
                                    Contato
                                </h3>
                                <hr/>
                            </Col>
                         </Row>
                         <Row>
                             <Col xs="12" sm="12">
                                <Table id="Table2">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nome</th>
                                            <th>Form ID Mautic</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactabilidades()}
                                    </tbody>
                                </Table>
                                <hr/>
                             </Col>
                        </Row>
                        <br/>
                        <Form id="formContactability" onSubmit={this.addContactability}>
                            <Row>
                                <Col xs="12" sm="12">
                                    <p><b>Adicionar Contato</b></p>
                                </Col>
                                <Col xs="12" sm="12">
                                    <Input type="hidden" name="company_id" value={this.props.id}/>
                                    <Input type="hidden" name="user_id" value={Auth.getUserId()}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="4" sm="4">
                                    <FormGroup>
                                        <Label htmlFor="form_id_mautic2">Form ID Mautic</Label>
                                        <Input type="number" name="form_id_mautic" id="form_id_mautic2"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label for="NameContactabilidad">Nome</Label>
                                        <Input type="text" name="name" id="NameContactabilidad"/>
                                    </FormGroup>
                                </Col>
                                <Col xs="12" sm="12">
                                    <Button color="primary">
                                        <span style={{marginRight: '0.5em', fontSize: '1.2em'}}>Adicionar </span>
                                        <i className="ion-plus-circled icon-actions"></i>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                     </CardBody>
                 </Card>
                 <br/>
                 <Card className="box-shadow">
                     <CardBody>
                         <Row>
                             <Col xs="12" sm="12">
                                <i className="ion-ios-telephone icon-size"></i>
                                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>
                                    Resultados
                                </h3>
                                <hr/>
                             </Col>
                         </Row>
                         <Row>
                             <Col xs="12" sm="12">
                                <Table id="ResultsTable">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Eficácia</th>
                                            <th>Nome</th>
                                            <th>Form ID Mautic</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados()}
                                    </tbody>
                                </Table>
                                <hr/>
                             </Col>
                         </Row>
                         <br/>
                         <Form id="formResult" onSubmit={this.addResult}>
                            <Row>
                                <Col xs="12" sm="12">
                                    <p><b>Adicionar Resultado</b></p>
                                </Col>
                                <Col xs="12" sm="12">
                                    <Input type="hidden" name="company_id" value={this.props.id}/>
                                    <Input type="hidden" name="user_id" value={Auth.getUserId()}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="4" sm="4">
                                    <FormGroup>
                                        <Label htmlFor="form_id_mautic">Form ID Mautic</Label>
                                        <Input type="number" name="form_id_mautic" id="form_id_mautic"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="3" sm="3">
                                    <FormGroup>
                                        <Label htmlFor="Efecctiveness">Eficácia</Label>
                                        <Input type="select" name="effective" id="Efecctiveness">
                                            <option value="">Selecione..</option>
                                            <option value="Si">Sim</option>
                                            <option value="No">Não</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col xs="8" sm="8">
                                    <FormGroup>
                                        <Label for="ResultName">Nome</Label>
                                        <Input type="text" name="name" id="ResultName"/>
                                    </FormGroup>
                                </Col>
                                <Col xs="12" sm="12">
                                    <Button color="primary">
                                        <span style={{marginRight: '0.5em', fontSize: '1.2em'}}>Adicionar </span>
                                        <i className="ion-plus-circled icon-actions"></i>
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

export default withPermission(AppSettings);