import React, { Component } from 'react';
import { Label, Input, FormGroup, Badge, Button, Col, Row, CardBody, Card } from "reactstrap";

export default class Campaigns extends Component {
	render () {
		let { campaignsList, campaign, handleCancel, handleChangeCampaign } = this.props;
		
		return (
			<Card className="box-shadow mb-4">
				<CardBody className="animated fadeIn">
					<Row>
						<Col xs="12" sm="12" md="12" xl="12">
							<Button color="danger"
								className="float-right margin"
								onClick={handleCancel}
								size="lg">
								<i className="fa fa-close"></i>
							</Button>
							<i className="fa fa-bell clead-icons"></i>
							<h1 className="inline-block margin">
								<Badge color="info">Campanha</Badge>
							</h1>
							<hr/>
							<FormGroup>
								<Label for="campaign">Escolha a campanha que será promovida:</Label>
								<Input type="select"
									id="campaign"
									name="campaign"
									value={campaign}
									onChange={handleChangeCampaign.bind(this)}
									required
									bsSize="lg">
									<option value="" disabled>Selecione:</option>
									{ campaignsList }
								</Input>
							</FormGroup>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}