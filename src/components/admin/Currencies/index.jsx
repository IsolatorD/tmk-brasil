import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import axios from 'axios';
import swal from 'sweetalert2';
import classnames from 'classnames';
import withPermission from '../../withPermission';
import AuthService from '../../../AuthService';
import Braintree from './Braintree';
import Gateway from './Gateway';
import config from '../../../config';
const Auth = new AuthService();

class Currencies extends Component {
  constructor() {
    super();
    this.state = {
      coinsToAcceptedInBraintree: [],
      coinsToAddInStripe: [],
      coinsToAcceptedInStripe: [],
      coinsToAddInBlueSnap: [],
      coinsToAcceptedInBlueSnap: [],
      coinsToAddInPayU: [],
      coinsToAcceptedInPayU: [],
      addDelete: '',
      toDo: '',
      activeTab: '1',
      company_id: Auth.getCompanyId(),
      user_id: Auth.getUserId(),
      merchantToAdd: '',
      currencyToAdd: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.getCurrencies = this.getCurrencies.bind(this);
    this.toAdd = this.toAdd.bind(this);
    this.toDelete = this.toDelete.bind(this);
    this.error = this.error.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount () {
    const currenciesBluesnap = ['EUR', 'AED', 'ALL', 'AMD', 'ANG', 'ARS', 'AUD', 'AWG', 'BAM', 'BBD',
    'BGN', 'BHD', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BWP', 'BYR', 'CAD', 'CHF', 'CLP', 'CNY', 'COP',
    'CRC', 'CZK', 'DKK', 'DOP', 'DZD', 'EGP', 'FJD', 'GBP', 'GEL', 'GIP', 'GTQ', 'HKD', 'HRK', 'HUF',
    'IDR', 'ILS', 'INR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KHR', 'KRW', 'KWD', 'KYD', 'KZT', 'LBP',
    'LKR', 'MAD', 'MDL', 'MKD', 'MRO', 'MUR', 'MWK', 'MXN', 'MYR', 'NAD', 'NGN', 'NOK', 'NPR', 'NZD',
    'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'QAR', 'RON', 'RSD', 'RUB', 'SAR', 'SCR', 'SDG',
    'SEK', 'SGD', 'THB', 'TND', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UYU', 'UZS', 'VEF', 'VND', 'XCD',
    'XOF', 'ZAR'];
    const currenciesBlueSnapList = currenciesBluesnap.map((cur, i) => { return <option value={cur} key={i}>{cur}</option>; });
    const currenciesStripe = ['USD', 'EUR', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD',
    'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BWP', 'BZD',
    'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP',
    'ETB', 'FJD', 'FKP', 'GBP', 'GEL', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG',
    'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JMD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KRW', 'KYD', 'KZT', 
    'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR',
    'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'PAB', 'PEN', 'PGK',
    'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SEK', 'SGD',
    'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SZL', 'THB', 'TJS', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS',
    'UAH', 'UGX', 'UYU', 'UZS', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'];
    const currenciesStripeList = currenciesStripe.map((cur, i) => { return <option value={cur} key={i}>{cur}</option>; });
    let currenciesPayU = ['MXN', 'ARS', 'BRL', 'CLP', 'COP', 'PEN', 'USD'];
    const currenciesPayUList = currenciesPayU.map((cur, i) => { return <option value={cur} key={i}>{cur}</option>; });
    this.setState({ 
      currenciesToAddBlueSnap: currenciesBlueSnapList, 
      currenciesToAddStripe: currenciesStripeList,
      currenciesToAddPayU: currenciesPayUList
    });
    this.getCurrencies();
  }

  async getCurrencies() {
    let { company_id, user_id } = this.state;
    try {
      let c = await axios.get(`${config.baseUrl}currencies/${company_id}/${user_id}/${window.IP}`);
      if (c.data.error) return this.errorCustom(c.data.error);
      c.data.currencies.map(el => {
        if (el.gateway === 'Stripe') this.setState({ coinsToAcceptedInStripe: el.currencies ? el.currencies : [] });
        if (el.gateway === 'BlueSnap') this.setState({ coinsToAcceptedInBlueSnap: el.currencies ? el.currencies : [] });
        if (el.gateway === 'PayU') this.setState({ coinsToAcceptedInPayU: el.currencies ? el.currencies : [] });
      });
      this.setState({ coinsToAcceptedInBraintree: c.data.curBra ? c.data.curBra : [] });
    } catch (error) {
      this.error();
    }
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  toAdd () {
    this.setState({ toDo: 'add' });
  }

  toDelete () {
    this.setState({ toDo: 'delete' });
  }

  error () {
    swal({
      type: 'error',
      title: 'Hubo un error al contactar con el servidor. Recargue la página e inténtelo de nuevo.'
    });
  }

  errorCustom (msg) {
    swal({
      type: 'error',
      title: msg
    });
  }

  async addCurrencies (currencies, gateway, user_id, company_id, msg, addDelete) {
    try {
      if (currencies.includes(addDelete)) return this.errorCustom('La moneda ya está agregada.');
      currencies.push(addDelete);
      let q = await axios.put(`${config.baseUrl}currencies/${window.IP}`, {
        currencies,
        gateway,
        user_id,
        company_id
      });
      if (q.data.codeError) return this.errorCustom('Hubo un error al actualizar las monedas.');
      swal({ type: 'success', title: msg });
      this.setState({ addDelete: '' });
      this.getCurrencies();
    } catch (error) {
      this.error();
    }
  }

  async deleteCurrencies (currencies, gateway, user_id, company_id, msg, addDelete) {
    try {
      let index = currencies.indexOf(addDelete);
      if (index === -1) return this.errorCustom('La moneda no está agregada.');
      if (currencies.length < 2) return this.errorCustom('Tiene que haber al menos una moneda.');
      currencies.splice(index, 1);
      let q = await axios.put(`${config.baseUrl}currencies/${window.IP}`, {
        currencies,
        gateway,
        user_id,
        company_id
      });
      if (q.data.codeError) return this.errorCustom('Hubo un error al actualizar las monedas.');
      swal({ type: 'success', title: msg });
      this.setState({ addDelete: '' });
      this.getCurrencies();
    } catch (error) {
      this.error();
    }
  }

  async addOrDeleteBraintree (id, currencies, merchant, currency, gateway, company_id, user_id) {
    try {
      if (id) {
        let q = await axios.delete(`${config.baseUrl}currencies/${id}/${window.IP}`);
        if (q.data.codeError) return this.errorCustom('Hubo un error al eliminar el merchantId.');
        swal({ type: 'success', title: 'MerchantId eliminado.' });
        this.getCurrencies();
      } else {
        let q = await axios.post(`${config.baseUrl}currencies/${window.IP}`, {
          merchant,
          currency,
          gateway,
          user_id,
          company_id
        });
        if (q.data.codeError) return this.errorCustom(q.data.error);
        swal({ type: 'success', title: 'MerchantId agregado.' });
        this.setState({
          merchantToAdd: '',
          currencyToAdd: ''
        });
        this.getCurrencies();
      }
    } catch (error) {
      this.error();
    }
  }

  async handleSubmit(e, gateway, id = null) {
    e.preventDefault();
    swal.showLoading();
    let { toDo, addDelete, coinsToAcceptedInBraintree, coinsToAcceptedInStripe, coinsToAcceptedInBlueSnap,
      coinsToAcceptedInPayU, user_id, company_id, merchantToAdd, currencyToAdd } = this.state;
      if (id) { // Add or delete Braintree
        return this.addOrDeleteBraintree(id, coinsToAcceptedInBraintree, merchantToAdd, currencyToAdd, gateway, company_id, user_id);
      } else if (gateway === 'Braintree') {
      return this.addOrDeleteBraintree(null, coinsToAcceptedInBraintree, merchantToAdd, currencyToAdd, gateway, company_id, user_id);
    }
    if (toDo === 'add') {
      if (gateway === 'Stripe') {
        this.addCurrencies(coinsToAcceptedInStripe, gateway, user_id, company_id, 'La moneda fue agregada.', addDelete);
      } else if (gateway === 'BlueSnap') {
        this.addCurrencies(coinsToAcceptedInBlueSnap, gateway, user_id, company_id, 'La moneda fue agregada.', addDelete);
      } else {
        this.addCurrencies(coinsToAcceptedInPayU, gateway, user_id, company_id, 'La moneda fue agregada.', addDelete);
      }
    } else {
      if (gateway === 'Stripe') {
        this.deleteCurrencies(coinsToAcceptedInStripe, gateway, user_id, company_id, 'La moneda fue eliminada.', addDelete);
      } else if (gateway === 'BlueSnap') {
        this.deleteCurrencies(coinsToAcceptedInBlueSnap, gateway, user_id, company_id, 'La moneda fue eliminada.', addDelete);
      } else {
        this.deleteCurrencies(coinsToAcceptedInPayU, gateway, user_id, company_id, 'La moneda fue eliminada.', addDelete);
      }
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        addDelete: '',
        toDo: ''
      });
    }
  }

  render() {
    let { currenciesToAddBlueSnap, currenciesToAddStripe, currenciesToAddPayU, activeTab, coinsToAcceptedInBraintree,
      coinsToAcceptedInStripe, coinsToAcceptedInBlueSnap, coinsToAcceptedInPayU, toDo, addDelete, merchantToAdd,
      currencyToAdd } = this.state;
    return(
      <Container className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" md="12" className="my-3">
            <h2>Administrador - Monedas</h2>
          </Col>
        </Row>
        <Card className="box-shadow">
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink href="#"
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}>
                  Braintree
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#"
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}>
                  Stripe
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#"
                  className={classnames({ active: activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}>
                  BlueSnap
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#"
                  className={classnames({ active: activeTab === '4' })}
                  onClick={() => { this.toggle('4'); }}>
                  PayU
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <Braintree currencies={coinsToAcceptedInBraintree} handleSubmit={this.handleSubmit} handleChange={this.handleChange}
                merchantToAdd={merchantToAdd} currencyToAdd={currencyToAdd} />
              <Gateway gateway={'Stripe'} currenciesToAdd={currenciesToAddStripe} currencies={coinsToAcceptedInStripe}
                handleSubmit={this.handleSubmit} handleChange={this.handleChange} toAdd={this.toAdd} toDelete={this.toDelete}
                toDo={toDo} addDelete={addDelete} url={'stripe logo'} id={'2'} />
              <Gateway gateway={'BlueSnap'} currenciesToAdd={currenciesToAddBlueSnap} currencies={coinsToAcceptedInBlueSnap}
                handleSubmit={this.handleSubmit} handleChange={this.handleChange} toAdd={this.toAdd} toDelete={this.toDelete}
                toDo={toDo} addDelete={addDelete} url={'bluesnap_logo'} id={'3'} />
              <Gateway gateway={'PayU'} currenciesToAdd={currenciesToAddPayU} currencies={coinsToAcceptedInPayU}
                handleSubmit={this.handleSubmit} handleChange={this.handleChange} toAdd={this.toAdd} toDelete={this.toDelete}
                toDo={toDo} addDelete={addDelete} url={'payu'} id={'4'} />
            </TabContent>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default withPermission(Currencies);
