import React, { Component } from 'react';
import { Col, Row, Container } from "reactstrap";
import axios from 'axios';
import swal from 'sweetalert2';
import moment from 'moment';
import LeadData from '../Lead/LeadData';
import Historical from './Historical';
import config from '../../config';
import AuthService from '../../AuthService';
const Auth = new AuthService();

export default class Benefactor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
			client_id: '',
			company_id: '',
			user_id: '',
      country_id: '',
      country_name: '',
      treatment: '',
      firstName: '',
      lastName: '',
      phone: '',
      payment_method: '',
      dni: '',
      address: '',
      birth_date: '',
      city: '',
      zip_code: '',
      state: ''
    }
    this.getBenefactorData = this.getBenefactorData.bind(this);
    this.error = this.error.bind(this);
    this.errorCustom = this.errorCustom.bind(this);
  }

  async componentDidMount() {
    swal.showLoading();
		await this.setState({
			company_id: Auth.getCompanyId(),
			user_id: Auth.getUserId()
    });
    await this.getBenefactorData();
    swal.close();
  }

  checkPayments (gateway, payments) {
		if (payments === '') {
			payments += gateway
		} else if (gateway !== 'Ninguno') {
			payments += ', ' + gateway
		} else if (gateway === 'Ninguno' && payments === '') {
			payments = gateway
		}
		return payments
	}

  async getBenefactorData () {
    let { user_id } = this.state;
    let emailP = this.props.match.params.email;
    try {
      let q = await axios.get(`${config.baseUrl}client/data/by-email/${emailP}/${user_id}/${window.IP}`);
      if (q.data.error) return this.errorCustom(q.data.errorMessage);
      let { birth_date, city, country_id, dni, email, first_name, last_name,
        phone, state, treatment, zip_code, address, name, id } = q.data.benefactor;
      let pm = '';
      if (q.data.benefactor.stripe_id) pm = this.checkPayments('Stripe', pm);
      if (q.data.benefactor.braintree_id) pm = this.checkPayments('Braintree', pm);
      if (q.data.benefactor.bluesnap_id) pm = this.checkPayments('BlueSnap', pm);
      if (q.data.benefactor.payu_id) pm = this.checkPayments('PayU', pm);
      if (pm === '') pm = this.checkPayments('Ninguno', pm);
      else pm += '.';
      this.setState({
        email,
        country_id,
        treatment,
        firstName: first_name,
        lastName: last_name,
        phone,
        dni,
        address,
        payment_method: pm,
        birth_date: moment(birth_date).format('YYYY-MM-DD'),
        city,
        zip_code,
        state,
        country_name: name,
        client_id: id
      });
    } catch (err) {
      this.error();
    }
  }

  errorCustom (msg) {
    swal({
      type: 'error',
      title: msg
    });
  }

  error () {
    swal({
      type: 'error',
      title: 'Hubo un error al contactar con el servidor. Recargue la página e inténtelo de nuevo.'
    });
  }

	render () {
    let { email, client_id, user_id, country_name, treatment, firstName, lastName, phone, 
      payment_method, dni, address, birth_date, city, zip_code, state } = this.state;
		
		return (
      <Container className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="6" sm="6">
            <h2>Información del Benefactor</h2>
          </Col>
        </Row>
        <br/>
        <LeadData treatment={treatment} email={email} dni={dni} birth_date={birth_date}
          firstName={firstName} lastName={lastName} treatment={treatment} phone={phone}
          country_name={country_name} address={address} city={city} zip_code={zip_code}
          state={state} payment_method={payment_method} isInfoFromBenefactor={true} />
        { client_id ? 
          <Historical id={client_id} user_id={user_id} isInfoFromBenefactor={true}
          error={this.error} /> : '' 
        }  
      </Container>
		);
	}
}
