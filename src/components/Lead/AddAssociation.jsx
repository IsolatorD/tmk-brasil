import React, { Component } from 'react';
import { Label, Input, FormGroup, Modal, Button, Col, Row, ModalHeader, ModalBody, Form,
	ModalFooter } from "reactstrap";
import swal from 'sweetalert2';
import $ from 'jquery';
import axios from 'axios';
import config from '../../config';
import AuthService from '../../AuthService';
const Auth = new AuthService();

export default class Campaigns extends Component {
	constructor() {
		super();
		this.state = {
			box: {height: '20em'},
		}
		this.updateOrgs = this.updateOrgs.bind(this);
		this.verify = this.verify.bind(this);
  }
  
	async updateOrgs (e) {
		e.preventDefault();
		let { openModal2, error, successMessage, errorCustom, client_id, refreshClientData } = this.props;
    var toAsignar = [];
    var a1 = $('#orgs_ids').val();
    var a2 = $('#orgs').val()
    if(a1.length > 0) {
      a1.forEach(element => {
        toAsignar.push(element);
      });
    }
    if(a2.length > 0) {
      a2.forEach(element => {
        toAsignar.push(element);
      });
    }
    console.log(toAsignar);
    swal.showLoading();
    var data = {
      user_id: Auth.getUserId(),
			client_id,
			companies_id: toAsignar
    }
    try {
      let q = await axios.put(`${config.baseUrl}client/add_companies`, data);
			if(q.data.codeError) return errorCustom(q.data.error);
			refreshClientData();
			successMessage(q.data.data)
			openModal2();
    } catch (err) {
      console.log(err);
      error();
    }
		
	}

	verify(e) {
    if($('#orgs_ids').val() != '') {
      $('#addOrgs').removeAttr('disabled');
    } else {
      $('#addOrgs').attr('disabled', 'disabled');
    }
  }
	render () {
		let { modal2, openModal2, noOrgs, companies } = this.props;
		var noList = [], siList = [];

		if (companies.length > 0) {
			siList = companies.map(el => {
				return <option selected="true" value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			siList = null;
		}
		if (noOrgs.length > 0) {
			noList = noOrgs.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			noList = null;
    }
		return (
			<Modal isOpen={modal2} toggle={openModal2}>
				<ModalHeader toggle={openModal2}>Adicionar Associações</ModalHeader>
				<ModalBody>
					<Form>
						<Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="orgs">Organizações Designadas</Label>
                  <Input type="select" name="orgs" id="orgs" multiple style={this.state.box}>
                    {siList}
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="client_ids">Organizações Não Designadas</Label>
                  <Input type="select" name="orgs_ids" id="orgs_ids" onChange={this.verify} multiple style={this.state.box}>
                    {noList}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="success"
						id="addOrgs"
						onClick={this.updateOrgs}
						size="lg">Atualização</Button>
					<Button color="danger"
					onClick={openModal2}
					size="lg">Cancelar</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
