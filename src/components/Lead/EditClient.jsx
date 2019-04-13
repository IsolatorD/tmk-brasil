import React, { Component } from 'react';
import { Label, Input, FormGroup, Modal, Button, Col, Row, ModalHeader, ModalBody, Form,
	ModalFooter, FormText } from "reactstrap";
import swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';
import $ from 'jquery';
import Inputmask from "inputmask";

export default class Campaigns extends Component {
	constructor({ email, cpf, birth_date, address, city, sex, firstName,	lastName,
		phone, cep, state, urbanization, complement, number, type }) {
		super();
		this.state = {
			emailM: email,
			cpfM: cpf,
			birth_dateM: birth_date,
			sexM: sex,
			first_nameM: firstName,
			last_nameM: lastName,
			phoneM: phone,
			addressM: address,
			cityM: city,
			cepM: cep,
			stateM: state,
			urbanizationM: urbanization,
			complementM: complement,
			numberM: number,
			typeM: type

		}
		this.handleChange = this.handleChange.bind(this);
		this.updateClient = this.updateClient.bind(this);
	}

	componentWillReceiveProps () {
		let { email, cpf, birth_date, address, city, sex, firstName,	lastName,
			phone, cep, state, urbanization, complement, number, type } = this.props;
		this.setState({
			emailM: email,
			cpfM: cpf,
			birth_dateM: birth_date,
			sexM: sex,
			first_nameM: firstName,
			last_nameM: lastName,
			phoneM: phone,
			addressM: address,
			cityM: city,
			cepM: cep,
			stateM: state,
			urbanizationM: urbanization,
			complementM: complement,
			numberM: number,
			typeM: type
		});
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	async updateClient (e) {
		e.preventDefault();
		swal.showLoading();
		let { client_id, errorCustom, error, successMessage, refreshClientData,
			openModal, user_id, resetCompanies } = this.props;
		let { emailM, first_nameM, last_nameM, sexM, phoneM, cpfM, birth_dateM, addressM, cityM, stateM, cepM, complementM, numberM, typeM, urbanizationM } = this.state;
		try {
			let q = await axios.put(`${config.baseUrl}client/update/${client_id}`, {
				user_id,
				email: emailM,
				first_name: first_nameM,
				last_name: last_nameM,
				sex: sexM,
				phone: phoneM.replace("+", ""),
				cpf: cpfM,
				birth_date: birth_dateM,
				address: addressM,
				city: cityM,
				state: stateM,
				cep: cepM,
				complement: complementM,
				number: numberM,
				type: typeM,
				urbanization: urbanizationM 
			});
			if (q.data.codeError) return errorCustom(q.data.error);
			if (q.data.data.client !== null) {
				openModal();
				successMessage(q.data.data.sms);
				resetCompanies()
				refreshClientData();
			} else {
				swal({
					type: 'success',
					title: q.data.data.sms,
					text: 'Os novos dados não foram obtidos, execute novamente a pesquisa do cliente.'
				});
			}
		} catch (err) {
			console.log(err)
			return error();
		}
	}

	render () {
		let { modal, openModal, OnModalOpen, maxYear } = this.props;
		let { emailM, cpfM, birth_dateM, addressM, cityM, sexM, first_nameM,
			last_nameM, phoneM, cepM, stateM, complementM, numberM, typeM, urbanizationM } = this.state;
		
		var im = new Inputmask('(99)-999999999');
		var im2 = new Inputmask('999999999-99');
		var im3 = new Inputmask('99999-999');
		im.mask($('#phoneM'));
		im2.mask($('#dniM'));
		im3.mask($('#zip_codeM'));
		return (
			<Modal isOpen={modal} toggle={openModal} onOpened={OnModalOpen}>
				<ModalHeader toggle={openModal}>Editar informações do Doador</ModalHeader>
				<ModalBody>
					<Form>
						<Row>
							<Col xs="12" sm="12">
								<FormGroup>
									<h5><b>Campos com <b class="obrigado">*</b> são obrigatórios</b></h5>
									<hr/>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<FormGroup>
									<Label for="emailM">Email <b class="obrigado">*</b></Label>
									<Input type="email"
										placeholder="Email"
										id="emailM"
										name="emailM"
										onChange={this.handleChange.bind(this)}
										value={emailM}
										bsSize="lg" />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="first_nameM">Nome <b class="obrigado">*</b></Label>
									<Input type="text"
										id="first_nameM"
										name="first_nameM"
										placeholder="Nome do lead"
										onChange={this.handleChange.bind(this)}
										value={first_nameM}
										bsSize="lg" />
								</FormGroup>
							</Col>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="last_nameM">Sobrenome <b class="obrigado">*</b></Label>
									<Input type="text"
										id="last_nameM"
										name="last_nameM"
										placeholder="Sobrenome"
										onChange={this.handleChange.bind(this)}
										value={last_nameM}
										bsSize="lg" />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="5" sm="5">
								<FormGroup>
									<Label for="treatmentM">Sex</Label>
									<Input type="select"
										id="treatmentM"
										name="sexM"
										onChange={this.handleChange.bind(this)}
										value={sexM}
										bsSize="lg">
										<option value="" disabled>Seleccione:</option>
										<option value="M">M</option>
										<option value="F">F</option>
									</Input>
								</FormGroup>
							</Col>
							<Col xs="7" sm="7">
								<FormGroup>
									<Label for="phoneM">Telefone</Label>
									<Input type="text"
										id="phoneM"
										placeholder="DDD-123456789"
										name="phoneM"
										onChange={this.handleChange.bind(this)}
										value={phoneM}
										bsSize="lg" />
									<FormText>Número completo com o código DDD</FormText>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="dniM">CPF <b class="obrigado">*</b></Label>
									<Input type="text"
										min="1"
										placeholder="000000000-00"
										name="cpfM"
										id="dniM"
										onChange={this.handleChange.bind(this)}
										value={cpfM}
										bsSize="lg" />
								</FormGroup>
							</Col>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="birth_dateM">Data de Nascimiento</Label>
									<Input type="date"
										name="birth_dateM"
										id="birth_dateM"
										bsSize="lg"
										onChange={this.handleChange.bind(this)}
										value={birth_dateM}
										max={maxYear} />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="zip_codeM">CEP</Label>
									<Input type="text"
										placeholder="CEP"
										name="cepM"
										id="zip_codeM"
										onChange={this.handleChange.bind(this)}
										value={cepM}
										bsSize="lg" />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="stateM">Estado</Label>
									<Input type="text"
										name="stateM"
										placeholder="Estado"
										id="stateM"
										onChange={this.handleChange.bind(this)}
										value={stateM}
										bsSize="lg" />
								</FormGroup>
							</Col>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="cityM">Cidade</Label>
									<Input type="text"
										placeholder="Cidade"
										name="cityM"
										id="cityM"
										onChange={this.handleChange.bind(this)}
										value={cityM}
										bsSize="lg" />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="bairroM">Bairro</Label>
									<Input type="text"
										name="urbanizationM"
										placeholder="Bairro"
										id="bairroM"
										onChange={this.handleChange.bind(this)}
										value={urbanizationM}
										bsSize="lg" />
								</FormGroup>
							</Col>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="addressM">Endereço</Label>
									<Input type="text"
										name="addressM"
										placeholder="Endereço"
										id="addressM"
										onChange={this.handleChange.bind(this)}
										value={addressM}
										bsSize="lg" />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="complemento">Complemento</Label>
									<Input type="text"
										name="complementM"
										id="complemento"
										placeholder="Complemento"
										bsSize="lg"
										onChange={this.handleChange.bind(this)}
										value={complementM} />
								</FormGroup>
							</Col>
							<Col xs="6" sm="6">
								<FormGroup>
									<Label for="numero">Numero</Label>
									<Input type="text"
										name="numberM"
										id="number"
										placeholder="Numero"
										bsSize="lg"
										onChange={this.handleChange.bind(this)}
										value={numberM} />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<FormGroup>
									<Label for="type">Tipo de Lead <b class="obrigado">*</b></Label>
									<Input
										type="select"
										id="type"
										value={typeM}
										name="typeM"
										bsSize="lg"
										onChange={this.handleChange.bind(this)}
									>
										<option value="">Selecione</option>
										<option value="Intenção de doação">Intenção de doação</option>
										<option value="Encomendas">Encomendas</option>
										<option value="Baixe">Baixe</option>
									</Input>
								</FormGroup>
						</Col>
					</Row>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="success"
						onClick={this.updateClient}
						disabled={emailM && first_nameM && last_nameM && cpfM && typeM ? false : true}
						size="lg">Atualização</Button>
					<Button color="danger"
					onClick={openModal}
					size="lg">Cancelar</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
