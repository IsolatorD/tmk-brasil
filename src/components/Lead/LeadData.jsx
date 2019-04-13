import React, { Component } from 'react';
import { Label, FormGroup, Badge, Button, Row, Col, CardBody, Card, Input } from "reactstrap";
import moment from 'moment';
import axios from 'axios';
import config from '../../config';
import swal from 'sweetalert2';
import AuthService from '../../AuthService';
import { Socket } from '../../helpers';

const Auth = new AuthService();

export default class Campaigns extends Component {
	constructor() {
		super()
		this.state = {
			display: 'none'
		}
		this.returnToPool = this.returnToPool.bind(this);
	}

	returnToPool() {
		swal({
			title: '¿Volte para a pool?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText:'Sim, vá!'
		})
		.then( result => {
				if(result.value) {
					var user_id = Auth.getUserId();
					let { successMessage, error, errorCustom, client_id, refreshClientData, company_id } = this.props
					var data = {
						user_id,
						client_id
					}
					axios.put(`${config.baseUrl}client/pool_return`, data)
						.then(q => {
							if(q.data.codeError) return errorCustom(q.data.error);
							Socket.emit('myLeads', user_id);
							this.setState({ display: 'none' });
							refreshClientData(company_id)
							successMessage(q.data.data);
						})
						.catch( er => {
							error();
						})
				}
		});
  }
	render () { 
		let { openModal, openModal2, sex, firstName, lastName, email, cpf, phone, birth_date, address, city, state, cep, companiesList, company_id, urbanization, type, complement, number, user_email, handleChangeCompany, assigned } = this.props;
		
		return (
			<Card className="box-shadow mb-4">
				<CardBody className="animated fadeIn">
					<Row>
						<Col xs="12" sm="12" md="12" xl="12">
							<Row>
								<Col xs="9" sm="9">
									<i className="fa fa-address-card-o clead-icons"></i>
									<h1 className="inline-block margin">
										<Badge color="info">Dados do lead</Badge>
									</h1>
								</Col>
								<Col xs="1" sm="1">
									<Button color="primary"
										style={{ display: assigned ? 'block' : 'none' }}
										className="float-right mt1"
										onClick={this.returnToPool}
										size="md">
										<i className="ion-pull-request"></i>
									</Button>
								</Col>
								<Col xs="2" sm="2">
									<Button color="primary"
										className="float-right mt1"
										onClick={openModal}
										size="md">
										<i className="ion-edit"></i>
									</Button>
								</Col>
								<hr/>
							</Row>
							<br/>
							<Row>
								<Col xs="10" sm="10">
										<FormGroup>
											<Label for="org"><b>Organização</b></Label>
												<Input
													type="select"
													id="org"
													value={company_id}
													name="company_id"
													bsSize="lg"
													onChange={handleChangeCompany.bind(this)}
												>
													<option value="">Selecione</option>
													{companiesList}
											</Input>
										</FormGroup>
								</Col>
								<Col xs="2" sm="2">
									<Button color="primary"
										className="float-right mt2"
										onClick={openModal2}
										size="md">
										<i className="ion-plus-round"></i>
									</Button>
								</Col>
							</Row>
							<Row>
								{
									user_email ?
									<Col xs="12" sm="12">
										<FormGroup>
											<h5><b>Atribuído a: </b> {user_email}</h5>
										</FormGroup>
									</Col>
									:
									<Col xs="12" sm="12">
										<FormGroup>
											<h5><b>Atribuído a:</b> No Atribuído</h5>
										</FormGroup>
									</Col>
								}
							</Row>
							<Row>
								{ type ?
									<Col xs="12" sm="12">
										<FormGroup>
											<Label><b>Tipo de Lead:</b> {type}</Label>
										</FormGroup>
									</Col> : ''
								}
							</Row>
							<Row>
								<Col xs='12' sm='12'>
									<FormGroup>
										<Label>
											<b>Doador: </b>{`${sex}. ${firstName} ${lastName}`}
										</Label>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col xs='6' sm='6'>
									<FormGroup>
										<Label><b>Email:</b> {email}</Label>
									</FormGroup>
								</Col>
								{phone ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>Telefone:</b> {phone}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ cpf ? 
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>CPF:</b> {cpf}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ birth_date != null ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label>
												<b>Data de Nascimento:</b> {moment(birth_date).format('DD-MM-YYYY')}
											</Label>
										</FormGroup>
									</Col> : ''
								}
								{ cep ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>CEP:</b> {cep}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ state ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>Estado:</b> {state}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ city ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>Cidade:</b> {city}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ urbanization ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>Bairro:</b> {urbanization}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ address ?
									<Col xs='6'sm='6'>
										<FormGroup>
											<Label><b>Endereço:</b> {address}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ complement ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>Complemento:</b> {complement}</Label>
										</FormGroup>
									</Col> : ''
								}
								{ number ?
									<Col xs="6" sm="6">
										<FormGroup>
											<Label><b>Numero:</b> {number}</Label>
										</FormGroup>
									</Col> : ''
								}
							</Row>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}
