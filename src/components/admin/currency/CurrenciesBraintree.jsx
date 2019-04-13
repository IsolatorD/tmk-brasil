import React, { Component } from 'react'
import { 
  Container, Row, Col, Form, Input, Button, Badge, Table
   } from 'reactstrap'
import config from '../../../config'
import axios from 'axios'
import withPermission from '../../withPermission'
import AuthService from '../../../AuthService'
import swal from 'sweetalert2'

const Auth = new AuthService()

class CurrenciesBraintree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currenciesBraintree: [],
      merchantToAdd: '',
      currencyToAdd: ''
    }
    this.error = this.error.bind(this)
    this.errorCustom = this.errorCustom.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.insertMerchantId = this.insertMerchantId.bind(this)
    this.deleteMerchantId = this.deleteMerchantId.bind(this)
  }

  componentDidMount () {
  	axios.get(`${config.baseUrl}company/braintree/${Auth.getCompanyId()}`)
      .then(response => {
      	if (response.data.errorMessage) return this.errorCustom(response.data.errorMessage)
        this.setState({
  				currenciesBraintree: response.data.currenciesBraintree
				})
      })
      .catch(() => this.error())
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  errorCustom (msg) {
  	swal({
      type: 'error',
      title: msg
    })
  }

  error () {
    swal({
      type: 'error',
      title: 'Hubor un error al contactar con el servidor. Recargue la página e inténtelo de nuevo.'
    })
  }

  insertMerchantId (e) {
  	e.preventDefault()
  	let { merchantToAdd, currencyToAdd } = this.state
  	if (merchantToAdd !== '' && currencyToAdd !== '') {
  		swal.showLoading()
  		axios.post(`${config.baseUrl}company/braintree`, {
  			merchant_id: merchantToAdd,
  			currency: currencyToAdd,
  			company_id: Auth.getCompanyId(),
  			id: this.state.currenciesBraintree[0] ? undefined : 1
  		})
  			.then(response => {
  				if (response.data.errorMessage) return this.errorCustom(response.data.errorMessage)
  				this.setState({
  					currenciesBraintree: response.data.currencies,
  					merchantToAdd: '',
  					currencyToAdd: ''
  				})
        	swal({
            type: 'success',
            title: 'El MerchantID fue agregado correctamente.'
          })
      	})
      	.catch(() => this.error())
  	}
  }

  deleteMerchantId (id) {
  	swal.showLoading()
  	axios.delete(`${config.baseUrl}company/braintree/${Auth.getCompanyId()}/${id}`)
			.then(response => {
      	if (response.data.errorMessage) return this.errorCustom(response.data.errorMessage)
				this.setState({
					currenciesBraintree: response.data.currencies
				})
      	swal({
          type: 'success',
          title: 'El MerchantID fue eliminado correctamente.'
        })
    	})
    	.catch(() => this.error())
  }

  render() {
  	let { merchantToAdd, currencyToAdd, currenciesBraintree } = this.state
  	let currencyTable = currenciesBraintree.map(el => {
  		return (
				<tr key={el.id}>
	        <td>{el.merchant_id}</td>
	        <td>{el.currency}</td>
	        <td><Button color="danger" onClick={e => this.deleteMerchantId(el.id)}>Eliminar</Button></td>
	      </tr>
  		)
  	})
  	return (
  		<Container className="animated fadeIn">
        <Form onSubmit={this.insertMerchantId}>
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
                  	<td><Input type="text"
                          name="merchantToAdd"
                          id="merchantToAdd"
                          onChange={this.handleChange.bind(this)}
                          value={merchantToAdd} /></td>
	                  <td><Input type="text"
                          name="currencyToAdd"
                          id="currencyToAdd"
                          onChange={this.handleChange.bind(this)}
                          value={currencyToAdd} /></td>
	                  <td><Button disabled={merchantToAdd !== '' && currencyToAdd !== '' ? false : true} color="primary">Agregar</Button></td>
                	</tr>
	              </tbody>
	            </Table>
	          </Col>
	        </Row>
        </Form>
  		</Container>
  	)
  }
}

export default withPermission(CurrenciesBraintree)
