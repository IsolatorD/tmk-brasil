import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Input, Label, FormGroup, Button, Form, Badge,
	CustomInput } from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import swal from 'sweetalert2';
import { Socket } from '../../helpers';

export default class Contacted extends Component {
	constructor() {
		super();
		this.state = {
			effective: '',
			call_status_id: '',
			observation: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.sendResult = this.sendResult.bind(this);
		this.handleChangeOptions = this.handleChangeOptions.bind(this);
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	
	handleChangeOptions (event) {
		this.setState({
			call_status_id: '',
			effective: event.target.value
		});
	}

	async sendResult(e) {
		e.preventDefault();
		swal.showLoading();
		let { effective, call_status_id, observation } = this.state;
		let { campaign, user_id, company_id, id, errorCustom, successMessage, error, refreshClientData } = this.props;
		try {
			let q = await axios.post(`${config.baseUrl}donation/contactresult`, {
				company_id,
				client_id: id,
				user_id,
				call_status_id,
				campaign_id: campaign,
				description: observation,
				effective: effective == 'Sí' ? true : false,
			});
			if (q.data.codeError) return errorCustom(q.data.error);
			Socket.emit('contacts', user_id);
			Socket.emit('benefactor', user_id);
			Socket.emit('toContact', user_id);
			this.setState({
				effective: '',
				call_status_id: '',
				observation: ''
			});
			successMessage(q.data.data);
			refreshClientData();
		} catch (err) {
			return error();
		}
	}

	render() {
		let { effective, call_status_id, observation } = this.state;
		let { campaign, yesList, noList } = this.props;
		const options = () => {
			if (effective === "Sí") {
				return yesList;
			} else if (effective === "No") {
					return noList;		
			} else {
				return null;
			}
		}

		return (
			<Card className="box-shadow mb-4">
				<CardBody>
					<Form id="formResult" onSubmit={this.sendResult}>
						<Row>
							<Col xs="12" sm="12">
								<i className="fa fa-phone clead-icons"></i>	
								<h1 className="inline-block margin">
									<Badge color="info">Contatados</Badge>
								</h1>
								<hr/>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<FormGroup>
									<Label for="exampleCheckbox">¿Você quer doar?</Label>
									<div>
										<CustomInput type="radio"
											id="effective"
											name="effective"
											label="Sí"
											inline
											onChange={this.handleChangeOptions.bind(this)}
											checked={effective === 'Sí'}
											value="Sí" />
										<CustomInput type="radio"
											id="effective2"
											name="effective"
											label="Não"
											inline
											checked={effective === 'No'}
											onChange={this.handleChangeOptions.bind(this)}
											value="No" />
									</div>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<FormGroup>
									<Label for="call_status_id">Escolha um status</Label>
									<Input type="select"
										name="call_status_id"
										id="call_status_id"
										onChange={this.handleChange.bind(this)}
										value={call_status_id}
										required
										disabled={effective === '' ? true : false}
										bsSize="lg">
										<option value="" disabled>Selecione:</option>
										{ options() }
									</Input>
								</FormGroup>
							</Col>
						</Row>
						<hr/>
						<Row>
							<Col xs="12" sm="12">
								<FormGroup>
									<Label for="observation">Observação</Label>
									<Input type="textarea"
										name="observation"
										id="observation"
										onChange={this.handleChange.bind(this)}
										value={observation}
										style={{resize: 'none', height: '8em'}}
										bsSize="lg" />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<Button color="primary"
									id="btnSendResult"
									block
									size="lg"
									disabled={effective && call_status_id && campaign ? false : true}>
										Terminar
								</Button>
							</Col>
						</Row>
					</Form>
				</CardBody>
			</Card>
		);
	}
}
