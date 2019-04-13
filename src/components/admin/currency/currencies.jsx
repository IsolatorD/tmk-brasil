import React, { Component } from 'react'
import { 
  Container, Card, CardBody, Row, Col, InputGroup, InputGroupAddon, Form, Input, Button, Badge, ButtonGroup, 
  TabContent, TabPane, Nav, NavItem, NavLink
   } from 'reactstrap'
import config from '../../../config'
import axios from 'axios'
import withPermission from '../../withPermission'
import AuthService from '../../../AuthService'
import swal from 'sweetalert2'
import classnames from 'classnames'
import CurrenciesBraintree from './CurrenciesBraintree'

const Auth = new AuthService()

class Currency extends Component {
  constructor() {
    super()
    this.state = {
      currenciesToAdd: [],
      supportedCurrencies: [],
      addDelete: 'EUR',
      toDo: '',
      activeTab: '1'
    }
    this.handleChange = this.handleChange.bind(this)
    this.toAdd = this.toAdd.bind(this)
    this.toDelete = this.toDelete.bind(this)
    this.error = this.error.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  componentDidMount () {
    const currenciesBluesnap = ['EUR', 'AED', 'ALL', 'AMD', 'ANG', 'ARS', 'AUD', 'AWG', 'BAM', 'BBD',
    'BGN', 'BHD', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BWP', 'BYR', 'CAD', 'CHF', 'CLP', 'CNY', 'COP',
    'CRC', 'CZK', 'DKK', 'DOP', 'DZD', 'EGP', 'FJD', 'GBP', 'GEL', 'GIP', 'GTQ', 'HKD', 'HRK', 'HUF',
    'IDR', 'ILS', 'INR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KHR', 'KRW', 'KWD', 'KYD', 'KZT', 'LBP',
    'LKR', 'MAD', 'MDL', 'MKD', 'MRO', 'MUR', 'MWK', 'MXN', 'MYR', 'NAD', 'NGN', 'NOK', 'NPR', 'NZD',
    'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'QAR', 'RON', 'RSD', 'RUB', 'SAR', 'SCR', 'SDG',
    'SEK', 'SGD', 'THB', 'TND', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UYU', 'UZS', 'VEF', 'VND', 'XCD',
    'XOF', 'ZAR']

    axios.get(`${config.baseUrl}donation/currencies`)
      .then(response => {
        console.log(response.data)
        if (response.data.currenciesBlueSnap.length > 0) {
          this.setState({ supportedCurrencies: response.data.currenciesBlueSnap })
        } else {
          this.error()
        }
      })
      .catch(() => this.error())

    this.setState({
      currenciesToAdd: currenciesBluesnap
    })
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  toAdd () {
    this.setState({ toDo: 'add' })
  }

  toDelete () {
    this.setState({ toDo: 'delete' })
  }

  error () {
    swal({
      type: 'error',
      title: 'Hubor un error al contactar con el servidor. Recargue la página e inténtelo de nuevo.'
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    swal.showLoading()
    var currencies = this.state.supportedCurrencies
    if (this.state.toDo === 'add') {
      if (!currencies.includes(this.state.addDelete)) {
        currencies.push(this.state.addDelete)
        axios.put(`${config.baseUrl}donation/currencies`, {currencies, user_id: Auth.getUserId()})
          .then(response => {
            if (response.data.currencies) {
              this.setState({ supportedCurrencies: response.data.currencies })
              swal({
                type: 'success',
                title: 'La moneda fue agregada.'
              })
            } else {
              this.error()
            }
          })
          .catch(() => this.error())
      } else {
        swal({
          type: 'error',
          title: 'La moneda ya está agregada.'
        })
      }
    } else {
      var index = currencies.indexOf(this.state.addDelete)
      if (index > -1) {
        if (this.state.supportedCurrencies.length < 2) return swal({ type: 'error', title: 'Tiene que haber al menos una moneda.' });
        currencies.splice(index, 1)
        axios.put(`${config.baseUrl}donation/currencies`, {currencies, user_id: Auth.getUserId()})
          .then(response => {
            if (response.data.currencies) {
              this.setState({ supportedCurrencies: response.data.currencies })
              swal({
                type: 'success',
                title: 'La moneda fue eliminada.'
              })
            } else {
              this.error()
            }
          })
          .catch(() => this.error())
      } else {
        swal({
          type: 'error',
          title: 'La moneda no está agregada.'
        })
      }
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    const currenciesBluesnapList = this.state.currenciesToAdd.map(function(num, i){ return <option value={num} key={i}>{num}</option>; })
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
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Braintree
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#"
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  BlueSnap
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <CurrenciesBraintree />
              </TabPane>
              <TabPane tabId="2" className="animated fadeIn">
                <Row>
                  <Col xs="6" sm="6" md="6" className="mx-auto my-4">
                    <Row>
                      <Col xs="2" sm="2" md="2">
                        <img src="/assets/img/bluesnap_logo.png" alt="BlueSnap Logo" style={{width: '2.5em', height: '2.5em'}}/>
                      </Col>
                      <Col xs="10" sm="10" md="10">
                        <h1><Badge color="primary">BlueSnap</Badge></h1>
                      </Col>
                    </Row>
                    <Row>
                      {this.state.supportedCurrencies[0]
                        ? <p className="h5 my-5"><b>Monedas aceptadas:</b> {this.state.supportedCurrencies.join(", ")}.</p>
                        : <p className="h5 my-5">No hay monedas seleccionadas para BlueSnap.</p>
                      }
                    </Row>
                    <Row>
                      <ButtonGroup className="col-6">
                        <Button disabled={this.state.toDo==='add' ? true : false} color="primary" onClick={this.toAdd}>Agregar</Button>
                        <Button disabled={this.state.toDo==='delete' ? true : false} color="danger" onClick={this.toDelete}>Eliminar</Button>
                      </ButtonGroup>
                      {this.state.toDo ? 
                        <Form onSubmit={this.handleSubmit} className="ml-auto col-6">
                          <InputGroup>
                            <Input type="select" name="addDelete" id="addDelete" onChange={this.handleChange.bind(this)}>
                              { currenciesBluesnapList }
                            </Input>
                            {this.state.toDo === 'add' ?
                              <InputGroupAddon addonType="append"><Button color="primary">Añadir</Button></InputGroupAddon>
                            : <InputGroupAddon addonType="append"><Button color="danger">Quitar</Button></InputGroupAddon>
                            }
                          </InputGroup>
                        </Form>
                        : ''
                      }
                    </Row>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>
    )
  }
}

export default withPermission(Currency)