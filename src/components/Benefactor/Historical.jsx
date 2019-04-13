import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Jumbotron, Badge, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import config from '../../config';
import axios from 'axios';
import moment from 'moment';
import '../../App.css';

export default class Historical extends Component {
	constructor(props) {
		super(props);
		this.state = {
			historical: [],
			billing: [],
			loading: false,
			activeTab: '1'
		}
		this.getHistorical = this.getHistorical.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	componentDidMount() {
		this.getHistorical();
	}

	async getHistorical () {
		try {
			let { user_id, id } = this.props;
			this.setState({ loading: true });
			let query = await axios.get(`${config.baseUrl}client/historic/${id}/${user_id}`);
			let b = await axios.get(`${config.baseUrl}client/billing/${id}/${user_id}`);
			this.setState({
				historical: query.data.historical,
				billing: b.data.billing,
				loading: false
			});
		} catch (error) {
			return this.props.error();
		}
	}

	toggle(tab) {
    let { activeTab } = this.state;
    if (activeTab !== tab) this.setState({ activeTab: tab });
  }

	render() {
		let { historical, loading, activeTab, billing } = this.state;
		let historic, bill;
		let arrayToVerifyIsSuccesufull = ['Suscripción cancelada.', 'Suscripción no cargada satisfactoriamente.',
			'Suscripción expirada.', 'Suscripción vencida.'];
		if (loading) {
			historic = <div className="loader mx-auto" />
			bill = <div className="loader mx-auto" />
		} else {
			if (historical.length > 0) {
				historic = historical.map((el, i) => {
					return (
						<div key={i} className="animated fadeIn">
							<Jumbotron style={{padding: '1em', marginBottom: '1em'}}>
								<Row>
									<Col xs="6" sm="6">
										<h2>
											<Badge color={el.status ? 'success': 'danger'} >{el.title}</Badge>
										</h2>
									</Col>
									<Col xs="6" sm="6">
										<h3>
											<Badge color="info">{moment(el.date).format('h:mm:ss a DD-MM-YYYY')}</Badge>
										</h3>
									</Col>
								</Row>
								<Row>
									<Col xs="6" sm="6">
										<span><b>Operador:</b> {el.operator}</span>
									</Col>
									{ el.campaign ? 
										<Col xs="6" sm="6">
											<span><b>Campaña:</b> {el.campaign}</span>
										</Col>
										: ''
									}
									{ el.description ?
										<Col xs="6" sm="6">
											<span><b>{el.title === 'Resultado de Contacto' ? 'Descripción' : 'Descripción'}:</b> {el.description}</span>
										</Col>
										: ''
									}
									{ el.effective ? 
										<Col xs="6" sm="6">
											<span><b>Efectivo:</b> {el.effective ? 'Si' : 'No'}</span>
										</Col>
										: ''
									}
									{ el.action ? 
										<Col xs="6" sm="6">
											<span><b>Acción tomada:</b> {el.action}</span>
										</Col>
										: ''
									}
									{ el.petition ? 
										<Col xs="6" sm="6">
											<span><b>Petición de Oración:</b> {el.petition}</span>
										</Col>
										: ''
									}
									{ el.amount != 'null null' && el.amount ? 
										<Col xs="6" sm="6">
											<span><b>Monto:</b> {el.amount}</span>
										</Col>
										: ''
									}
									{ el.payment_method ? 
										<Col xs="6" sm="6">
											<span><b>Pasarela de Pago:</b> {el.payment_method}</span>
										</Col>
										: ''
									}
									{ el.observation ? 
										<Col xs="6" sm="6">
											<span><b>Observación:</b> {el.observation}</span>
										</Col>
										: ''
									}
								</Row>
							</Jumbotron>
						</div>
					);
				});
			} else {
				historic = <div className="animated fadeIn">
					<Jumbotron style={{padding: '1em', marginBottom: '1em'}}>
						<h2>El cliente no posee registros</h2>
					</Jumbotron>
				</div>
			}
			if (billing.length > 0) {
				bill = billing.map((el, i) => {
					return (
						<div key={i} className="animated fadeIn">
							<Jumbotron style={{padding: '1em', marginBottom: '1em'}}>
								<Row>
									<Col xs="6" sm="6">
										<h2>
											<Badge color={arrayToVerifyIsSuccesufull.indexOf(el.event) >= 0 ? 'danger' : 'success'}>{el.event}</Badge>
										</h2>
									</Col>
									<Col xs="6" sm="6">
										<h3>
											<Badge color="info">{moment(el.created_at).format('h:mm:ss a DD-MM-YYYY')}</Badge>
										</h3>
									</Col>
								</Row>
								<Row>
									<Col xs="6" sm="6">
										<span><b>Pasarela de Pago:</b> {`${el.payment_method}`}</span>
									</Col>
									<Col xs="6" sm="6">
										<span><b>Monto:</b> {`${el.amount} ${el.currency}`}</span>
									</Col>
								</Row>
							</Jumbotron>
						</div>
					);
				})
			} else {
				bill = <div className="animated fadeIn">
					<Jumbotron style={{padding: '1em', marginBottom: '1em'}}>
						<h3>El cliente no posee registros</h3>
					</Jumbotron>
				</div>
			}
		}
		
		return (
			<div>
				<Card className="box-shadow">
					<CardBody>
						<Row>
							<Col xs="12" sm="12">
								<Nav pills>
									<NavItem>
										<NavLink
											active={activeTab === '1' ? true : false}
											onClick={() => { this.toggle('1'); }}
											href="#">
											<span className="font-pill">Histórico</span>
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											active={activeTab === '2' ? true : false}
											onClick={() => { this.toggle('2'); }}
											href="#">
											<span className="font-pill">Facturación</span>
										</NavLink>
									</NavItem>
								</Nav>
								<hr/>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<TabContent activeTab={activeTab}>
									<TabPane tabId="1">
										{ historic }
									</TabPane>
									<TabPane tabId="2">
									{ bill }
									</TabPane>
								</TabContent>
							</Col>
						</Row>
					</CardBody>
				</Card>
				<br/>
			</div>
		);
	}
}
