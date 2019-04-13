import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import swal from 'sweetalert2';
import axios from 'axios';
import $ from 'jquery';
import config from '../../../config';

import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
const Auth = new AuthService();

class Cancelaciones extends Component {
  constructor() {
    super();
    this.state = {
      cancels: []
    }
    this.getCancels = this.getCancels.bind(this);
    this.addCancels = this.addCancels.bind(this);
    this.editCancel = this.editCancel.bind(this);
    this.deleteCancel = this.deleteCancel.bind(this);
  }

  componentDidMount() {
    let { id } = this.props;
    this.getCancels(id)
  }

  getCancels(id) {
    if(this.state.cancels.length > 0) {
      var table = $('#TableCancels').DataTable();
      table.destroy();
    }
    var user_id = Auth.getUserId();
    axios.get(config.baseUrl+'cancelations/all/'+id+'/'+user_id)
      .then( res => {
        var data = res.data.data;
        if(res.data.codeError === false){
          this.setState({
            cancels: data
          });
          $('#TableCancels').DataTable({language: {
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
            cancels: []
          });
        }
      })
      .catch( err => {
        console.log(err);
      });
  }

  addCancels(e) {
    e.preventDefault();
    var form = document.getElementById('formCancelaciones');
    var formData = new FormData(form);
    swal.showLoading();
    axios.post(config.baseUrl+'cancelations/add', formData)
      .then( res => {
        var data = res.data.data;
        if(res.data.codeError === false) {
          swal.hideLoading()
          swal({
            type: 'success',
            title: data
          });
          $('#formCancelaciones')[0].reset();
          this.getCancels(this.props.id);
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

  editCancel(id) {
    window.location.replace('/dashboard/admin/cancel/edit/'+id);
  }

  deleteCancel(id) {
    var user_id = Auth.getUserId();
    swal({
      title: '¿Claro que você deseja excluir este evento de Cancelamento?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, elimine!'
    }).then( result => {
      if(result.value) {
        swal.showLoading();
        var table = $('#TableCancels').DataTable();
        table.destroy();
        axios.delete(config.baseUrl+'cancelations/delete/'+id+'/'+user_id)
          .then( res => {
            var data = res.data.data;
            if(res.data.codeError === false) {
              swal.hideLoading();
              swal({
                title: data,
                type: 'success'
              });
              this.getCancels(this.props.id);
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


  render() {
    const cancelaciones = () => {
      if(this.state.cancels !== null && this.state.cancels.length > 0) {
        return this.state.cancels.map((i, j) => {
          return (
            <tr key={j++} className="animated fadeIn">
              <td>{j}</td>
              <td>{i.name}</td>
              <td>{i.form_id_mautic}</td>
              <td>
                <Button className="btn-actions" color="primary" onClick={() => this.editCancel(i.id)}>
                  <i className="ion-edit icon-actions"></i>
                </Button>
                <Button className="btn-actions" color="danger" onClick={() => this.deleteCancel(i.id)}>
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
    return(
      <Container className="animated fadeIn">
        <Card className="box-shadow">
          <CardBody>
            <Row>
              <Col xs="12" sm="12">
                <i className="ion-email icon-size"></i>
                <h3 style={{display: 'inline-block', marginLeft: '0.3em'}}>
                  Cancelamentos
                </h3>
                <hr/>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12">
                <Table id="TableCancels">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Form ID Mautic</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelaciones()}
                  </tbody>
                </Table>
                <hr/>
              </Col>
            </Row>
            <br/>
            <Form id="formCancelaciones" onSubmit={this.addCancels}>
              <Row>
                <Col xs="12" sm="12">
                  <p><b>Adicionar Cancelamento</b></p>
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
                    <Label for="nameCancelamento">Nome</Label>
                    <Input type="text" name="name" id="nameCancelamento"/>
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
    )
  }
}

export default withPermission(Cancelaciones);