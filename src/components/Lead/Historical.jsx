import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Jumbotron, Badge, Input, Button } from 'reactstrap';
import config from '../../config';
import axios from 'axios';
import moment from 'moment';
import '../../App.css';

export default class Historico extends Component {
	constructor(props) {
		super(props);
		this.state = {
			historical: [],
			loading: false,
			interval: ''
		}
		this.setTimer = this.setTimer.bind(this);
		this.getHistorical = this.getHistorical.bind(this);
	}

	componentDidMount() {
		this.setTimer();
	}

	setTimer () {
		this.getHistorical();
		let interval = setInterval(() => {
			this.getHistorical();
		}, 30000);
		this.setState({
			interval
		});
	}

	async getHistorical () {
		let { user_id, id } = this.props;
		this.setState({
			loading: true
		});
		try {
			let query = await axios.get(`${config.baseUrl}client/historic/${id}/${user_id}`);
			if(query.data.codeError) {
				this.setState({
					historical: [],
					loading: false
				});
			} else {
				this.setState({
					historical: query.data.data,
					loading: false
				});
			}
		} catch(err) {
			console.log(err);
		}
	}

	componentWillUnmount () {
		clearInterval(this.state.interval);
	}

	render() {
		let { historical, loading } = this.state;
		let { id } = this.props;
		let historic;

		const status = (status, title) => {
			if(status == true || status == false) {
				return(
					<Col xs="6" sm="6">
						<h2>
							<Badge color={status ? 'success': 'danger'} >{title}</Badge>
						</h2>
					</Col>
				)
			} else {
				return '';
			}
		}
		const confirmed = (confirmed) => {
			if(confirmed == true || confirmed == false) {
				return(
					<Col xs="6" sm="6">
						<span><b>Confirmou:</b> {confirmed ? 'Si' : 'No'}</span>
					</Col>
				);
			} else {
				return '';
			}
		}
		const effective = (effective) => {
			if(effective == true || effective == false) {
				return(
					<Col xs="6" sm="6">
						<span><b>Efectivo:</b> {effective ? 'Si' : 'No'}</span>
					</Col>
				);
			} else {
				return '';
			}
		}
		if (loading) {
			historic = <div className="loader mx-auto"></div>
		} else {
			if (historical.length > 0) {
				historic = historical.map((el, i) => {
					return (
						<div key={i} className="animated fadeIn">
							<Jumbotron style={{padding: '1em', marginBottom: '1em'}}>
								<Row>
									{
										status(el.status, el.title)
									}
									<Col xs="6" sm="6">
										<h3>
											<Badge color="info">{moment(el.date).format('h:mm:ss a DD-MM-YYYY')}</Badge>
										</h3>
									</Col>
								</Row>
								<Row>
									<Col xs="12" sm="12">
										<h5><b>Organização: </b>{el.company_name}</h5>
									</Col>
									<Col xs="6" sm="6">
										<span><b>Operador:</b> {el.user}</span>
									</Col>
									{ el.description ?
										<Col xs="6" sm="6">
											<span><b>Descrição:</b> {el.description}</span>
										</Col>
										: ''
									}
									{ el.campaign_name ? 
										<Col xs="6" sm="6">
											<span><b>Campanha:</b> {el.campaign_name}</span>
										</Col>
										: ''
									}
									<Col xs="6" sm="6">
										<span><b>Origem:</b> {el.origin_data}</span>
									</Col>
									{ el.amount ? 
										<Col xs="6" sm="6">
											<span><b>Quantidade:</b> {el.amount}</span>
										</Col>
										: ''
									}
									{ el.method ? 
										<Col xs="6" sm="6">
											<span><b>Método:</b> {el.method}</span>
										</Col>
										: ''
									}
									{ 
										confirmed(el.confirmed)
									}
									{ 
										effective(el.effective)
									}
									{ el.call_status_name ? 
										<Col xs="6" sm="6">
											<span><b>Contatado:</b> {el.call_status_name}</span>
										</Col>
										: ''
									}
									{ el.contactability_name ? 
										<Col xs="6" sm="6">
											<span><b>Não contatado:</b> {el.contactability_name}</span>
										</Col>
										: ''
									}
									{ el.cancelation_name ? 
										<Col xs="6" sm="6">
											<span><b>Cancelamento:</b> {el.cancelation_name}</span>
										</Col>
										: ''
									}
								</Row>
							</Jumbotron>
						</div>
					);
				})
			} else {
				historic = <div className="animated fadeIn">
											<Jumbotron style={{padding: '1em', marginBottom: '1em'}}>
												<h2>O cliente não possui registros</h2>
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
								<i className="ion-clipboard clead-icons"></i>
								<h1 className="inline-block margin">
									<Badge color="info">Histórico</Badge>
								</h1>
								<Button color="danger"
									className="float-right"
									size="lg"
									disabled={loading ? true : false}
									onClick={this.getHistorical}>
									Atualizar
								</Button>{' '}
								<hr/>
								<Input type="hidden" value={id} id="clientId"/>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								{ historic }
							</Col>
						</Row>
					</CardBody>
				</Card>
				<br/>
			</div>
		);
	}
}
