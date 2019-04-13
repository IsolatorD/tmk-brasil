import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";

import axios from 'axios';
import config from '../../config';
import $ from 'jquery';
import swal from 'sweetalert2';
import AuthService from '../../AuthService';

var Auth = new AuthService();
var companyId = null;
var id = null;

class EditCancel extends Component {
  constructor() {
    super();
    this.getCancel = this.getCancel.bind(this);
    this.editCancel = this.editCancel.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  componentWillMount() {
    this.getCancel();
  }

  editCancel(e) {
    e.preventDefault();
    swal.showLoading();
    var form = document.getElementById('cancelForm');
    var formData = new FormData(form);
    axios.put(config.baseUrl+'cancelations/update/'+id, formData)
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
          });
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

  getCancel() {
    id = this.props.match.params.id;
    var user_id = Auth.getUserId();
    axios.get(config.baseUrl+'cancelations/view/'+id+'/'+user_id)
      .then( res => {
        var data = res.data.data;
        if( res.data.codeError === false) {
          console.log(data);
          companyId = data.company_id;
          $('#companyId').val(data.company_id);
          $('#cancelName').val(data.name);
          $('#form_id_mautic').val(data.form_id_mautic);
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

  cancelEdit() {
    window.location.replace('/dashboard/admin/company/info/'+companyId);
  }

  render() {
    return (
      <Container>
        <br/>
        <Row>
          <Col xs="12" sm="12">
            <h2>Administrador - Editar evento de Cancelamento</h2>
          </Col>
        </Row>
        <br/>
        <Card style={{width: '35em', marginLeft: '5em'}}>
          <CardBody>
            <Form id="cancelForm">
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
                    <Label for="form_id_mautic">Form ID Mautic</Label>
                    <Input type="number" name="form_id_mautic" id="form_id_mautic"/>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="8" sm="8">
                  <FormGroup>
                    <Label for="cancelName">Nome</Label>
                    <Input type="text" name="name" id="cancelName"/>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12">
                  <div className="float-right">
                    <Button 
                      color="success"
                      onClick={this.editCancel}
                    >
                      Atualização
                    </Button>
                    <Button 
                      color="danger"
                      onClick={this.cancelEdit}
                      className="margin"
                    >
                      Cancelar
                    </Button>
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

export default EditCancel;