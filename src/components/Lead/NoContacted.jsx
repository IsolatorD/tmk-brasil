import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Input, Label, Button, FormGroup, Form,
	Badge } from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import swal from 'sweetalert2';

export default class NoContacted extends Component {
	constructor() {
		super();
		this.state = {
			contactability_id: '',
		}
		this.sendContactability = this.sendContactability.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

	async sendContactability(e) {
		e.preventDefault();
		swal.showLoading();
		let { id, campaign, user_id, company_id, errorCustom, successMessage,
					clearCampaign, error } = this.props;
		let { contactability_id } = this.state;
		try {
			let q = await axios.post(`${config.baseUrl}donation/contactability`, {
				client_id: id,
				campaign_id: campaign,
				user_id,
				company_id,
				contactability_id
			});
			if (q.data.codeError) {
				return errorCustom(q.data.error);
			} else {
				successMessage(q.data.data);
				this.setState({ contactability_id: '' });
				clearCampaign();
			}
		} catch (err) {
			return error();
		}
	}

	render() {
		let { contactability_id } = this.state;
		let { campaign, contactabilityList } = this.props;		
		return (
			<Card className="box-shadow mb-4">
				<CardBody>
					<Form id="formContactability" onSubmit={this.sendContactability}>
						<Row>
							<Col xs="12" sm="12">
								<i className="ion-email-unread clead-icons"></i>
								<h1 className="inline-block margin">
									<Badge color="info">Não Contatado</Badge>
								</h1>
								<hr/>
							</Col>
						</Row>
						<Row>
							<Col xs="8" sm="8">
								<FormGroup>
									<Label for="contactability_id">Não foi possível entrar em contato porque:</Label>
									<Input type="select"
										name="contactability_id"
										id="contactability_id"
										value={contactability_id}
										onChange={this.handleChange.bind(this)}
										bsSize="lg">
										<option value="" disabled>Selecione:</option>
										{ contactabilityList }
									</Input>
								</FormGroup>
							</Col>
							<Col xs="4" sm="4">
								<Button color="primary"
									style={{marginTop: '1.6em'}}
									id="sendContactability"
									size="lg"
									disabled={campaign && contactability_id ? false : true}>Enviar email</Button>
							</Col>
						</Row>
					</Form>
				</CardBody>
			</Card>
		);
	}
}
