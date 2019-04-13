import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, Form, Badge, Table } from 'reactstrap';
import axios from 'axios';
import config from '../../config';
import $ from 'jquery';
import AuthService from '../../AuthService';

const Auth = new AuthService();

export default class Suscriptions extends Component {
	constructor() {
		super();
		this.state = {
      suscriptions: [],
      currentValue: ''
    }
		this.getSuscriptions = this.getSuscriptions.bind(this);
		this.modalize = this.modalize.bind(this);
  }
  
  componentDidMount() {
    this.getSuscriptions(this.props.id);
  }
  
  componentWillReceiveProps() {
    let { currentValue } = this.state;
    let { value, id } = this.props;
    if(value != currentValue) {
      this.setState({ currentValue: value });
      console.log('Actualizando tabla..')
      this.getSuscriptions(id)
    } else {
      return;
    }
  }

  getSuscriptions(id) {
		if(this.state.suscriptions.length > 0) {
      var table = $('#TableSuscriptions').DataTable();
      table.destroy();
    }
    var user_id = Auth.getUserId();
    axios.get(config.baseUrl+'donation/get_donations/'+id+'/'+user_id)
      .then( res => {
        var data = res.data.data;
        if(res.data.codeError === false){
          this.setState({
            suscriptions: data
          });
          if(data.length > 0) {
            $('#TableSuscriptions').DataTable({language: {
              lengthMenu: 'Mostrar _MENU_ Registros por página',
              zeroRecords: 'Nenhum resultado encontrado',
              info: 'Mostrando página _PAGE_ de _PAGES_',
              infoEmpty: 'Nenhum resultado encontrado',
              paginate: {
                first: 'Primeiro',
                last: 'Último',
                next: 'Próximo',
                previous: 'Anterior'
              },
              search: 'Pesquisar:',
              infoFiltered: 'Filtrado de _MAX_ registros',
              },
              lengthMenu: [3, 5, 8, 10]
            });
          }
        } else {
          this.setState({
            suscriptions: []
          });
        }
      })
      .catch( err => {
        console.log(err);
      });
  }

	modalize(id, codcad, person_type, identification_type, identification, ipca, amount, payment_date, method, fecha) {
    var fecha2 = '', mes = '', ano = '';
    if(fecha != null) {
      fecha2 = fecha.split('-');
      mes = fecha2[0], ano = fecha2[1];
    }
		let { openModal3, sendToModal } = this.props;
		sendToModal(id, codcad, person_type, identification_type, identification, ipca, amount, payment_date, method, mes, ano);
		openModal3()
	}

	render() {
		const suscripciones = () => {
			if(this.state.suscriptions !== null && this.state.suscriptions.length > 0) {
        return this.state.suscriptions.map((i, j) => {
          return (
            <tr key={j++} className="animated fadeIn">
							<td>{j}</td>
              <td>{i.identification}</td>
							<td>{i.amount}R$</td>
							<td>{i.method}</td>
              <td>
								{i.ipca ?
									<Button className="btn-actions" color="primary" onClick={() => this.modalize(i.id, i.codcad, i.person_type, i.identification_type, i.identification, i.ipca, i.amount, i.payment_date, i.method, i.monthly_year_payment)}>
										<i className="ion-edit icon-actions"></i>
									</Button> : 'Não editável'
								}
              </td>
            </tr>
          )
        });
      } else {
        return (
          <tr>
            <td colspan="6">
              Sem Assinaturas.
            </td>
          </tr>
        )
      }
		}
		return (
			<Card className="box-shadow mb-4">
				<CardBody>
					<Form id="formAsignaturas">
						<Row>
							<Col xs="12" sm="12">
								<i className="ion-email-unread clead-icons"></i>
								<h1 className="inline-block margin">
									<Badge color="info">Assinaturas</Badge>
								</h1>
								<hr/>
							</Col>
						</Row>
						<Row>
							<Col xs="12" sm="12">
								<Table id="TableSuscriptions">
									<thead>
                    <tr>
											<th>#</th>
                      <th>ID Pagador</th>
                      <th>Quantidade</th>
											<th>Método</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suscripciones()}
                  </tbody>
								</Table>
							</Col>
						</Row>
					</Form>
				</CardBody>
			</Card>
		);
	}
}
