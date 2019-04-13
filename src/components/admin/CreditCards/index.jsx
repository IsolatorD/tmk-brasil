import React, { Component } from 'react'
import { Container, Card, CardBody, Row, Col, Table, Button } from 'reactstrap';
import config from '../../../config'
import axios from 'axios'
import AuthService from '../../../AuthService'
import swal from 'sweetalert2'

const Auth = new AuthService()

export default class Vault extends Component {
  constructor() {
    super()
    this.state = {
      credit_cards: []
    }
		this.getCreditCards = this.getCreditCards.bind(this);
		this.downloadVault = this.downloadVault.bind(this);
  }

  componentDidMount() {
		if(Auth.getRole() !== '10') {
			if (!Auth.isCompanyAdmin()) {
				if (!Auth.isAdmin()) {
					window.location.replace('/dashboard/index');
				}
			}
		}
		this.getCreditCards();
	}

	async getCreditCards() {
		try {
			let query = await axios.get(`${config.baseUrl}donation/credit-cards/${Auth.getCompanyId()}`);
			this.setState({
				credit_cards: query.data.credit_cards
			})
		} catch (error) {
			this.error();
		}
	}

	async downloadVault() {
		try {
			let query = await axios.get(`${config.baseUrl}donation/credit-cards/download/${Auth.getCompanyId()}`);
			let headers = {
				fullName: 'Nombre y Apellido'.replace(/,/g, ''), // remove commas to avoid errors
				amount: 'Donado',
				cardNumber: "Número de Tarjeta",
				franchise: "Franquicia",
				expirationDate: "Fecha de Vencimiento",
				securityCode: "Código de Seguridad"
			};
			var fileTitle = 'Vault'; // or 'my-unique-title'
			this.exportCSVFile(headers, query.data.credit_cards, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
			this.getCreditCards();
		} catch (error) {
			this.error();
		}
	}

	error () {
    swal({
      type: 'error',
      title: 'Hubor un error al contactar con el servidor. Recargue la página e inténtelo de nuevo.'
    })
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

  render() {
		let { credit_cards } = this.state;
		let cardTable = credit_cards.map((el, i) => {
			return (
				<tr key={i}>
					<td>{el.name}</td>
					<td>{el.amount}</td>
					<td>{el.card_number}</td>
					<td>{el.franchise}</td>
					<td>{el.expiration_date}</td>
					<td>{el.cvv}</td>
				</tr>
			);
		})

    return(
      <Container className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" md="12" className="my-3">
            <h2>Vault</h2>
          </Col>
        </Row>
        <Card className="box-shadow">
          <CardBody>
					<Row>
							<Col xs="12" sm="12">
								<h3>Tarjetas</h3>
							</Col>
						</Row>
            <Row>
              <Col xs="12" sm="12">
              	<Table hover responsive>
		              <thead>
		                <tr>
											<th>Nombre y Apellido</th>
											<th>Donado</th>
		                  <th>Número de Tarjeta</th>
		                  <th>Franquicia</th>
											<th>Fecha de Vencimiento</th>
											<th>Código de Seguridad</th>
		                </tr>
		              </thead>
		              <tbody>
										{ credit_cards.length === 0 ?
											<tr><td colSpan="6">No hay tarjetas registradas</td></tr> : cardTable }
		              </tbody>
	              </Table>
								{ credit_cards.length > 0 ?
									<Button color="primary" onClick={this.downloadVault}>Descargar</Button>
								: '' }
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    )
  }
}
