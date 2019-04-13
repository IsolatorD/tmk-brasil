import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button, ButtonGroup,
	Input } from "reactstrap";
import swal from 'sweetalert2';
import moment from 'moment';
import $ from "jquery";
import axios from 'axios';
import config from '../../config';
import AuthService from '../../AuthService';
import { DateRangePicker } from 'react-dates';
import { Link } from "react-router-dom";

const Auth = new AuthService();

export default class Perfomance extends Component {
	constructor() {
		super();
		this.state = {
			donations: [],
			errorMsg: null,
			startDate: null,
			endDate: null,
			focusedInput: null,
			range: '',
			date1: '',
			date2: ''
		}
		this.filterDataFromDate = this.filterDataFromDate.bind(this);
		this.verifyTwoDates = this.verifyTwoDates.bind(this);
		this.error = this.error.bind(this);
		this.downloadDonations = this.downloadDonations.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
	}

	componentDidMount() {
		if(Auth.getRole() !== '10') {
			if (!Auth.isCompanyAdmin()) {
				if (!Auth.isAdmin()) {
					window.location.replace('/dashboard/index');
				}
			}
		}
		this.filterDataFromDate('mtd');
	}

	verifyTwoDates(startDate, endDate) {
		this.setState({ startDate, endDate });
		if(startDate !== null && endDate !== null) {
			let fechaInicial = new Date(startDate);
			let fechaFinal = new Date(endDate);
			let añoInicial = fechaInicial.getFullYear();
			let mesInicial = fechaInicial.getMonth()+1;
			let diaInicial = fechaInicial.getDate();
			let añoFinal = fechaFinal.getFullYear();
			let mesFinal = fechaFinal.getMonth()+1;
			let diaFinal = fechaFinal.getDate();
			if (mesInicial < 10) {
				mesInicial = `0${mesInicial}`;
			}
			if (mesFinal < 10) {
				mesFinal = `0${mesFinal}`;
			}
			if (diaInicial < 10) {
				diaInicial = `0${diaInicial}`;
			}
			if (diaFinal < 10) {
				diaFinal = `0${diaFinal}`;
			}
			let dateInicial = `${añoInicial}-${mesInicial}-${diaInicial} 00:00:00`;
			let dateFinal = `${añoFinal}-${mesFinal}-${diaFinal} 00:00:00`;
			this.setState({ date1: dateInicial, date2: dateFinal });
			this.filterDataFromDate('Btw', dateInicial, dateFinal);
		}
	}

	async filterDataFromDate(option, date1 = null, date2 = null) {
		swal.showLoading();
		try {
			if (this.state.donations.length > 0) {
				let table = $('#Table').DataTable();
				table.destroy();
			}
			let userId = Auth.getUserId();
			let q = await axios.get(`${config.baseUrl}donation/summary/${userId}/${option}/${window.IP}/${date1}/${date2}`);
			if (!q.data.codeError) {
				this.setState({
					donations: q.data.data,
					range: option
				});
				$('#Table').DataTable({
					language: {
						"sProcessing": "Procesando...",
						"sLengthMenu": "Mostrar _MENU_ registros",
						"sZeroRecords": "No se encontraron resultados",
						"sEmptyTable": "Ningún dato disponible en esta tabla",
						"sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
						"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
						"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
						"sInfoPostFix": "",
						"sSearch": "Buscar:",
						"sUrl": "",
						"sInfoThousands": ",",
						"sLoadingRecords": "Cargando...",
						"oPaginate": {
							"sFirst": "Primero",
							"sLast": "Último",
							"sNext": "Siguiente",
							"sPrevious": "Anterior"
						},
						"oAria": {
							"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
							"sSortDescending": ": Activar para ordenar la columna de manera descendente"
						}
					},
					"iDisplayLength": 100
				});
				swal.close();
			} else {
				this.setState({
					errorMsg: q.data.error,
					donations: []
				});
				return this.errorCustom(q.data.error);
			}
		} catch (error) {
			this.setState({ donations: [] });
			this.error();
		}
	}

	async downloadDonations() {
		try {
			let headers = {
				id: '#',
				currency: 'Moneda',
				amount: 'Monto'.replace(/,/g, ''), // remove commas to avoid errors
				amount_in_euros: 'Monto en EUR',
				payment_method: "Pasarela de Pago",
				date: "Fecha",
				client: "Benefactor",
				email: "Email",
				country: 'Pais',
				operator: 'Operador',
				campaign: 'Campana',
				confirmed: 'Confirmed'
			};
			var fileTitle = 'Donaciones'; // or 'my-unique-title'
			this.exportCSVFile(headers, this.state.donations, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
		} catch (err) {
			this.error();
		}
	}

	convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
			var line = '';
			for (var index in array[i]) {
					if (line != '') line += ','
					line += array[i][index];
			}
			str += line + '\r\n';
    }
    return str;
	}

	exportCSVFile(headers, items, fileTitle) {
		if (headers) {
			items.unshift(headers);
		}
		// Convert Object to JSON
		var jsonObject = JSON.stringify(items);
		var csv = this.convertToCSV(jsonObject);
		var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
		var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, exportedFilenmae);
		} else {
			var link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", exportedFilenmae);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	async changeStatus(id, e) {
		let { range, date1, date2 } = this.state;
		let q = await axios.post(`${config.baseUrl}donation/status/${id}/${window.IP}`, {
			status: e.target.value,
			user_id: Auth.getUserId()
		});
		if (q.data.codeError) return this.errorCustom(q.data.error);
		if (date1 && date2) this.filterDataFromDate('Btw', date1, date2); 
		else this.filterDataFromDate(range || 'mtd');
	}

	error () {
    swal({
      type: 'error',
      title: 'Hubor un error al contactar con el servidor. Recargue la página e inténtelo de nuevo.'
    });
	}
	
	errorCustom (msg) {
    swal({
      type: 'error',
      title: msg
    });
  }

	render() {
		let { donations, errorMsg, startDate, endDate, focusedInput } = this.state;
		const contactadosBox = () => {
			if (donations.length > 0) {
				return donations.map((el, i) => {
					return (
						<tr key={el.id}>
							<td>{i++}</td>
							<td>{moment(el.date).format('h:mm:ss a DD-MM-YYYY')}</td>
							<td>{el.amount}</td>
							<td>{el.currency}</td>
							<td>{el.amount_in_euros ? el.amount_in_euros.toFixed(2) : 1}</td>
							<td>{`${el.lead}`}</td>
							<td><Link to={`/dashboard/benefactor/${el.email}`}>{`${el.email}`}</Link></td>
							<td>{el.country}</td>
							<td>{el.payment_method}</td>
							<td>{`${el.operator}`}</td>
							<td>{el.campaign}</td>
							<td>
								<Input type="select"
									id="confirmed"
									name="confirmed"
									onChange={e => {this.changeStatus(el.id, e)}}
									value={el.confirmed ? el.confirmed : 'Pending'}
									bsSize="lg">
									<option value="Pending">Pending</option>
									<option value="Confirmed">Confirmed</option>
									<option value="Denied">Denied</option>
								</Input>
							</td>
						</tr>
					)
				});
			} else {
				return (
					<tr>
						<td colspan="6">
							{errorMsg}
						</td>
					</tr>
				)
			}
		}

		return (
			<Container className="animated fadeIn">
				<br/>
				<Row>
					<Col xs="4" sm="4">
						<h2>Perfomance</h2>
					</Col>
					<Col xs="8" sm="8" className="datafilter">
						<ButtonGroup>
							<Button size="md" color="light" onClick={() => this.filterDataFromDate('1w')}><b>1 semana</b></Button>
							<Button size="md" color="light" onClick={() => this.filterDataFromDate('mtd')}><b>MTD</b></Button>
							<Button size="md" color="light" onClick={() => this.filterDataFromDate('1m')}><b>1 mes</b></Button>
							<Button size="md" color="light" onClick={() => this.filterDataFromDate('3m')}><b>3 meses</b></Button>
							<Button size="md" color="light" onClick={() => this.filterDataFromDate('6m')}><b>6 meses</b></Button>
							<Button size="md" color="light" onClick={() => this.filterDataFromDate('1y')}><b>1 año</b></Button>
							<Button size="md" color="light" onClick={() => this.filterDataFromDate('all')}><b>Todo</b></Button>
						</ButtonGroup>
						<div className="margin" style={{display: 'inline-block'}}>
							<DateRangePicker
								startDate={startDate}
								endDate={endDate}
								onDatesChange={({ startDate, endDate }) => {this.verifyTwoDates(startDate, endDate)}}
								focusedInput={focusedInput}
								onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
								small={true}
								isOutsideRange={() => false}
								hideKeyboardShortcutsPanel={true}
								numberOfMonths={1}
								showClearDates={true} />
						</div>
					</Col>
				</Row>
				<br/>
				<Card className="box-shadow">
					<CardBody>
						<Row>
							<Col xs="7" sm="7">
								<i className="fa fa-bar-chart"></i>
								<h3 style={{display: 'inline-block', marginLeft: '0.3em', marginRight: '0.5em'}}>
									Donaciones
								</h3>
							</Col>
							<hr/>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<Table id="Table">
									<thead>
										<tr>
											<th>#</th>
											<th>Fecha</th>
											<th>Monto</th>
											<th>Moneda</th>
											<th>Monto en EUR</th>
											<th>Benefactor</th>
											<th>Email</th>
											<th>País</th>
											<th>Pasarela</th>
											<th>Operador</th>
											<th>Campaña</th>
											<th>Confirmado</th>
										</tr>
									</thead>
									<tbody>
										{ contactadosBox() }
									</tbody>
								</Table>
								<br/>
								{ donations.length > 0 ?
									<Button color="primary"
										onClick={this.downloadDonations}
										size="lg">Descargar</Button>
								: '' }
							</Col>
						</Row>
					</CardBody>
				</Card>
			</Container>
		);
	}
}
