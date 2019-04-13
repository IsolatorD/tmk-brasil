import React, { Component } from 'react';
import { Container, Row, Col, Form, Input, Button, Badge, Table, TabPane } from 'reactstrap';

const Braintree = ({currencies, handleChange, handleSubmit, merchantToAdd, currencyToAdd}) => {
	let currencyTable;
	if (currencies.length > 0) {
		currencyTable = currencies.map(el => {
			return (
				<tr key={el.id}>
					<td>{el.merchant_id}</td>
					<td>{el.currency}</td>
					<td><Button color="danger" onClick={e => handleSubmit(e, 'Braintree', el.id)}>Eliminar</Button></td>
				</tr>
			);
		});
	}
	return (
		<TabPane tabId="1" className="animated fadeIn">
			<Form onSubmit={e => handleSubmit(e, 'Braintree', null)}>
				<Row>
					<Col xs="6" sm="6" md="6" className="mx-auto my-4">
						<Row>
						<Col xs="2" sm="2">
								<img src="/assets/img/braintree logo.png" alt="Braintree Logo" style={{width: '2.5em', height: '2.5em'}}/>
						</Col>
						<Col xs="8" sm="8">
								<h1><Badge color="dark">Braintree</Badge></h1>
						</Col>
						</Row>
						<Table hover responsive>
							<thead>
								<tr>
									<th>Merchant Account ID</th>
									<th>Moneda</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{ currencyTable }
								<tr>
									<td>
										<Input type="text"
											name="merchantToAdd"
											id="merchantToAdd"
											onChange={handleChange.bind(this)}
											value={merchantToAdd} />
									</td>
									<td>
										<Input type="text"
											name="currencyToAdd"
											id="currencyToAdd"
											onChange={handleChange.bind(this)}
											value={currencyToAdd} />
									</td>
									<td>
										<Button disabled={merchantToAdd !== '' && currencyToAdd !== '' ? false : true}
											color="primary">Agregar</Button>
									</td>
								</tr>
							</tbody>
						</Table>
					</Col>
				</Row>
			</Form>
		</TabPane>
	);
}

export default Braintree;
