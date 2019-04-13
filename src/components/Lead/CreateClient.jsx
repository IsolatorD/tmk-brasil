import React, { Component } from 'react';
import {
  Row, Col, Label, Input, Form, FormGroup, FormText, Button, Badge
 } from "reactstrap";
import $ from 'jquery';
import Inputmask from "inputmask";

export default class SearchLead extends Component {
	constructor() {
		super();
	}
	componentDidMount() {
		var im = new Inputmask('(99)-999999999');
		var im2 = new Inputmask('999999999-99');
		var im3 = new Inputmask('99999-999');
		im.mask($('#phone'));
		im2.mask($('#dni'));
		im3.mask($('#zipcode'));
	}
	render () {
		let { handleCancel, handleChange, createClient, email, cpf, firstName, lastName,
			sex, phone, birth_date, address, city, cep,
			state, maxYear, company_id, urbanization, complement, number, type, orgsList } = this.props;
		return (
			<div>
				<Row>
					<Col xs="12" sm="12">
						<Button color="danger"
							className="float-right"
							size="lg"
							onClick={handleCancel}>
							<i className="fa fa-close"></i>
						</Button>
						<i className="fa fa-user clead-icons"></i>
						<h1 className="inline-block margin">
							<Badge color="info">Dados do lead</Badge>
						</h1>
						<hr/>
					</Col>
				</Row>
				<Form id="formClient" onSubmit={createClient}>
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
								<Label for="org">Organização <b class="obrigado">*</b></Label>
									<Input
										type="select"
										id="org"
										value={company_id}
										name="company_id"
										bsSize="lg"
										onChange={handleChange.bind(this)}
									>
										<option value="">Selecione</option>
										{orgsList}
								</Input>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="7" sm="7" md="7" xl="7">
							<FormGroup>
								<Label for="email">Email</Label>
								<Input
									type="email"
									placeholder="Email"
									id="email"
									name="email"
									onChange={handleChange.bind(this)}
									readonly="readonly"
									value={email}
									bsSize="lg" />
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="6" sm="6" md="6" xl="6">
							<FormGroup>
								<Label for="firstName">Nome <b class="obrigado">*</b></Label>
								<Input type="text"
									id="firstName"
									name="firstName"
									placeholder="Nome do lead"
									onChange={handleChange.bind(this)}
									value={firstName}
									bsSize="lg" />
							</FormGroup>
						</Col>
						<Col xs="6" sm="6" md="6" xl="6">
							<FormGroup>
								<Label for="lastName">Sobrenome <b class="obrigado">*</b></Label>
								<Input type="text"
									id="lastName"
									name="lastName"
									placeholder="Sobrenome"
									onChange={handleChange.bind(this)}
									value={lastName}
									bsSize="lg" />
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="5" sm="5" md="5" xl="5">
							<FormGroup>
								<Label for="treatment">Sex</Label>
								<Input type="select"
									id="treatment"
									name="sex"
									onChange={handleChange.bind(this)}
									value={sex}
									bsSize="lg">
									<option value="">Selecione:</option>
									<option value="M">M</option>
									<option value="F">F</option>
								</Input>
							</FormGroup>
						</Col>
						<Col xs="7" sm="7" md="7" xl="7">
							<FormGroup>
								<Label for="phone">Telefone</Label>
								<Input type="text"
									min="1"
									id="phone"
									placeholder="DDD-345678901"
									onChange={handleChange.bind(this)}
									name="phone"
									value={phone}
									bsSize="lg" />
								<FormText>Número completo com o código DDD</FormText>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="6" sm="6" md="6" xl="6">
							<FormGroup>
								<Label for="birth_date">Data de Nascimiento</Label>
								<Input type="date"
									name="birth_date"
									id="birth_date"
									max={maxYear}
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={birth_date} />
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="dni">CPF <b class="obrigado">*</b></Label>
								<Input type="text"
									min="1"
									name="cpf"
									placeholder="0000.00000-00"
									id="dni"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={cpf} />
							</FormGroup>
						</Col>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="zipcode">CEP</Label>
								<Input type="text"
									name="cep"
									placeholder="00000-000"
									id="zipcode"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={cep} />
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="state">Estado</Label>
								<Input type="text"
									name="state"
									id="state"
									placeholder="Estado"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={state} />
							</FormGroup>
						</Col>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="city">Cidade</Label>
								<Input type="text"
									name="city"
									id="city"
									placeholder="Cidade"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={city} />
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="bairro">Bairro</Label>
								<Input type="text"
									name="urbanization"
									id="bairro"
									placeholder="Bairro"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={urbanization} />
							</FormGroup>
						</Col>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="address">Endereço</Label>
								<Input type="text"
									name="address"
									id="address"
									placeholder="Endereço"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={address} />
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="complemento">Complemento</Label>
								<Input type="text"
									name="complement"
									id="complemento"
									placeholder="Complemento"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={complement} />
							</FormGroup>
						</Col>
						<Col xs="6" sm="6">
							<FormGroup>
								<Label for="numero">Numero</Label>
								<Input type="text"
									name="number"
									id="number"
									placeholder="Numero"
									bsSize="lg"
									onChange={handleChange.bind(this)}
									value={number} />
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
									value={type}
									name="type"
									bsSize="lg"
									onChange={handleChange.bind(this)}
								>
									<option value="">Selecione</option>
									<option value="Intenção de doação">Intenção de doação</option>
									<option value="Encomendas">Encomendas</option>
									<option value="Baixe">Baixe</option>
								</Input>
								</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs="12" sm="12" md="12" xl="12">
							<FormGroup>
								<Button id="btnRegistrar"
									block
									color="success"
									disabled={company_id && firstName && lastName	&& cpf && type ? false : true}>Cadastrar cliente</Button>
							</FormGroup>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}
