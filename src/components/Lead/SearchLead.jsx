import React, { Component } from 'react';
import {
  Row, Col, Label, Input, Form, FormGroup, InputGroup, InputGroupAddon, Button, Badge
 } from "reactstrap";

export default class SearchLead extends Component {
	render () {
		let { getLead, handleChange, email } = this.props;
		return (
			<div>
				<Row>
					<Col xs="12" sm="12">
						<i className="fa fa-user clead-icons"></i>
						<h1 className="inline-block margin">
							<Badge color="info">Pesquisar lead</Badge>
						</h1>
						<hr/>
					</Col>
				</Row>
				<Row>
					<Col xs="12" sm="12">
						<Form id="formSearch" onSubmit={getLead}>
							<Col xs="12" sm="12">
								<FormGroup>
									<Label for="email">Email</Label>
									<InputGroup>
										<Input
											type="email"
											id="email"
											name="email"
											placeholder="Digite um email"
											onChange={handleChange.bind(this)}
											bsSize="lg"
											value={email} />
										<InputGroupAddon addonType="append">
											<Button color="info"
												id="search"
												size="lg"
												disabled={email ? false : true}>Go!</Button>
										</InputGroupAddon>
									</InputGroup>
								</FormGroup>
							</Col>
						</Form>
					</Col>
				</Row>
			</div>
		);
	}
}
