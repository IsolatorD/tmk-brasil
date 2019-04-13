import React, { Component } from 'react';
import {Card, CardBody, Row, Col, Form, Label, Input, FormGroup, Badge, Button } from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import swal from 'sweetalert2';

export default class Cancels extends Component {
  constructor() {
    super();
    this.state = {
      cancelation_id: '',
      donation_id: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendCancel = this.sendCancel.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

	async sendCancel(e) {
		e.preventDefault();
		swal.showLoading();
		let { id, campaign, user_id, company_id, errorCustom, successMessage,
			clearCampaign, error } = this.props;
		let { cancelation_id, donation_id } = this.state;
		try {
			let q = await axios.post(`${config.baseUrl}donation/cancelations`, {
				client_id: id,
				campaign_id: campaign,
				user_id,
				company_id,
        cancelation_id,
        donation_id
			});
			if (q.data.codeError) return errorCustom(q.data.error);
			successMessage(q.data.data);
			this.setState({ cancelation_id: '', donation_id: '' });
			clearCampaign();
		} catch (err) {
			console.log(err);
			return error();
		}
  }

  render() {
    let { cancelation_id, donation_id } = this.state;
		let { campaign, cancelsList, suscripciones } = this.props;		
    return(
      <Card className="box-shadow mb-4">
				<CardBody>
					<Form id="formCancels" onSubmit={this.sendCancel}>
						<Row>
							<Col xs="12" sm="12">
								<i className="ion-email-unread clead-icons"></i>
								<h1 className="inline-block margin">
									<Badge color="info">Razão pela qual cancela</Badge>
								</h1>
								<hr/>
							</Col>
						</Row>
            <Row>
              <Col xs="12" sm="12">
								<FormGroup>
									<Label for="donation_id">Assinatura para cancelar</Label>
									<Input type="select"
										name="donation_id"
										id="donation_id"
										value={donation_id}
										onChange={this.handleChange.bind(this)}
										bsSize="lg">
										<option value="" disabled>Selecione:</option>
										{ suscripciones }
									</Input>
								</FormGroup>
							</Col>
            </Row>
						<Row>
							<Col xs="12" sm="12">
								<FormGroup>
									<Label for="cancelation_id">Razão para o cancelamento</Label>
									<Input type="select"
										name="cancelation_id"
										id="cancelation_id"
										value={cancelation_id}
										onChange={this.handleChange.bind(this)}
										bsSize="lg">
										<option value="" disabled>Selecione:</option>
										{ cancelsList }
									</Input>
								</FormGroup>
							</Col>
            </Row>
            <Row>
							<Col xs="12" sm="12">
								<Button color="primary"
									style={{marginTop: '1.6em'}}
                  id="sendContactability"
                  block
									size="lg"
									disabled={campaign && cancelation_id && donation_id ? false : true}>Enviar email</Button>
							</Col>
						</Row>
					</Form>
				</CardBody>
			</Card>
    )
  }
}