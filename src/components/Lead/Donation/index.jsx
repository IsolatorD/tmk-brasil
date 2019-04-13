import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Badge, Button } from 'reactstrap';
import axios from 'axios';
import $ from 'jquery';
import config from '../../../config';
import Cuenta from './Cuenta';
import Tarjeta from './Tarjeta';
import swal from 'sweetalert2';

export default class Donation extends Component {
  constructor() {
    super();
    this.state = {
      display: 'none',
      display2: 'none',
      codcad: '',
      person_type: '',
      identification_type: '',
      identification: '',
      ipca: false,
      payment_date: '',
      amount: '',
      method: '',
      card_type: '',
      card_number: '',
      expiration_month: '',
      expiration_year: '',
      account_type: '',
      bank: '',
      agency: '',
      account_number: '',
      mes_cobro: '',
      ano_cobro: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeIpca = this.handleChangeIpca.bind(this);
    this.createDonationCartao = this.createDonationCartao.bind(this);
    this.createDonationConta = this.createDonationConta.bind(this);
    this.clearInputs = this.clearInputs.bind(this);
  }

  clearInputs() {
    this.setState({
      display: 'none',
      display2: 'none',
      codcad: '',
      person_type: '',
      identification_type: '',
      identification: '',
      ipca: false,
      payment_date: '',
      amount: '',
      method: '',
      card_type: '',
      card_number: '',
      expiration_month: '',
      expiration_year: '',
      account_type: '',
      bank: '',
      agency: '',
      account_number: '',
      mes_cobro: '',
      ano_cobro: '',
    });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleChangeType(e) {
    if($('#method').val() != '') {
      if($('#method').val() == 'Conta') {
        this.setState({ display: 'none', display2: 'block', method: 'Conta'})
      } else if($('#method').val() == 'Cartão'){
        this.setState({ display: 'block', display2: 'none', method: 'Cartão'})
      }
    }
  }

  handleChangeIpca(e) {
    this.setState({ ipca: $('#ipca').prop('checked') })
  }

  async createDonationCartao(e) {
    let { codcad, person_type, identification_type, identification, ipca, payment_date, amount, method, card_type, card_number, expiration_month, expiration_year, ano_cobro, mes_cobro } = this.state;
    let { id, campaign, user_id, company_id, error, errorCustom, successMessage, handleChangeValueTable, getSuscriptions } = this.props;

    if(Number(expiration_month) > 0 && Number(expiration_month) <= 12) {
      var date = new Date()
      var mes = date.getMonth() + 1;
      var ano = date.getFullYear();
      var exp_month = Number(expiration_month);
      var ano_exp = Number(expiration_year);
      
      let validacion = false;

      if (ano_exp > ano) {
        // pasa
        validacion = true;
      } else if (ano_exp == ano) {
        // revisa el mes
        validacion = true;
        if (exp_month >= mes) {
          // pasa
          validacion = true;
        } else {
          validacion = false;
        }
      } else if (ano_exp < ano) {
        validacion = false;
      }

      if(validacion==true) {
        swal.showLoading()
        let data = {
          client_id: id, campaign_id: campaign, user_id, company_id,
          codcad, person_type, identification_type, identification,
          ipca, payment_date, amount, method, card_type, card_number,
          expiration_month, expiration_year, monthly_year_payment: `${mes_cobro}-${ano_cobro}`
        }
        try {
          let q = await axios.post(`${config.baseUrl}donation/local_add`, data);
          if(q.data.codeError) return errorCustom(q.data.error);
          this.clearInputs()
          getSuscriptions(campaign)
          handleChangeValueTable()
          successMessage(q.data.data);
        } catch(e) {
          console.log(e);
          error();
        }
      } else {
        errorCustom('Cartão Expirado');
      }
    } else {
      errorCustom('Data de validade inválida');
    }
  }
  
  async createDonationConta(e) {
    swal.showLoading()
    let { codcad, person_type, identification_type, identification, ipca, payment_date, amount, method, account_type, bank, agency, account_number, ano_cobro, mes_cobro } = this.state;
    let { id, campaign, user_id, company_id, error, errorCustom, successMessage, handleChangeValueTable, getSuscriptions } = this.props;
    let data = {
      client_id: id, campaign_id: campaign, user_id, company_id,
      codcad, person_type, identification_type, identification,
      ipca, payment_date, amount, method, account_type, bank,
      agency, account_number, monthly_year_payment: `${mes_cobro}-${ano_cobro}`
    }
    try {
      let q = await axios.post(`${config.baseUrl}donation/local_add`, data);
      if(q.data.codeError) return errorCustom(q.data.error);
      this.clearInputs()
      getSuscriptions(campaign)
      handleChangeValueTable()
      successMessage(q.data.data);
    } catch(e) {
      console.log(e);
      error();
    }
  }

  render() {
    let { display, display2, codcad, person_type, identification_type, identification, ipca, payment_date, amount, method, card_type, card_number, expiration_month, expiration_year, account_type, bank, agency, account_number, ano_cobro, mes_cobro } = this.state;
    let { id, campaign, user_id, company_id } = this.props;

    let mesesList = [], añosList = [],
    añoFinalDelCiclo = new Date().getFullYear()+1;
      
    for(let añoDeInicio=2019; añoDeInicio <= añoFinalDelCiclo; añoDeInicio++ ) {
      añosList.push(<option value={añoDeInicio}>{añoDeInicio}</option>);
    }
  
    const CuentaBox = () => {
      return <Cuenta handleChange={this.handleChange} account_type={account_type} bank={bank} agency={agency} account_number={account_number}/>
    }
    const TarjetaBox = () => {
      return <Tarjeta handleChange={this.handleChange} card_number={card_number} expiration_month={expiration_month} expiration_year={expiration_year}/>
    }
    var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    mesesList = meses.map(el => {
      return <option value={el} key={el}>{el}</option>;
    });
    return(
      <Card className="box-shadow">
        <CardBody className="animated fadeIn">
          <Form>
            <Row>
              <Col xs="12" sm="12">
                <i className="fa fa-heart clead-icons"></i>	
                <h1 className="inline-block margin">
                  <Badge color="info">Donativo</Badge>
                </h1>
                <hr/>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="codcad">CODCAD</Label>
                  <Input value="" type="text" value={codcad} name="codcad" id="codcad" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="person_type">Tipo de Pessoa</Label>
                  <Input type="select" value={person_type} name="person_type" id="person_type" onChange={this.handleChange}>
                    <option value="">Selecione</option>
                    <option value="Pessoa Juridica">Pessoa Juridica</option>
                    <option value="Pessoa Fisica" selected="true">Pessoa Fisica</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="identification_type">Tipo ID</Label>
                  <Input type="select" value={identification_type} name="identification_type" id="identification_type" onChange={this.handleChange}>
                    <option value="">Selecione</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="CPF">CPF</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="identification">ID Pagador</Label>
                  <Input value={identification} type="text" name="identification" id="identification" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} value={ipca} id="ipca" name="ipca" onClick={this.handleChangeIpca}/>{' '}
                    IPCA
                  </Label>
                </FormGroup>
                <hr/>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="payment_date">Data de cobro</Label>
                  <Input type="select" value={payment_date} name="payment_date" id="payment_date" onChange={this.handleChange}>
                    <option value="">Selecione</option>
                    <option value="gv1">GV1</option>
                    <option value="gv2">GV2</option>
                    <option value="gv3">GV3</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="amount">Quantidade</Label>
                  <Input value={amount} type="number" min="1" name="amount" id="amount" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label>Mês da Colecção</Label>
                  <Input type="select" value={mes_cobro} name="mes_cobro" id="mesCobro" onChange={this.handleChange}>
                    <option value="">Selecione...</option>
                    { mesesList }
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label>Ano de coleta</Label>
                  <Input type="select" value={ano_cobro} name="ano_cobro" id="anoCobro" onChange={this.handleChange}>
                    <option value="">Selecione...</option>
                    { añosList }
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="method">Método</Label>
                  <Input type="select" value={method} onChange={this.handleChangeType} name="method" id="method">
                    <option value="">Selecione</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Conta">Conta bancária</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" style={{display: display}}>
                <FormGroup>
                  <Label for="card_type">Tipo de Cartão</Label>
                  <Input type="select" value={card_type} onChange={this.handleChange} name="card_type" id="card_type">
                    <option value="">Selecione</option>
                    <option value="credito">Credito</option>
                    <option value="debido">Debito</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" style={{display: display2}}>
                <FormGroup>
                  <Label for="account_type">Tipo de Conta</Label>
                  <Input type="select" value={account_type} name="account_type" id="account_type" onChange={this.handleChange}>
                    <option value="">Selecione</option>
                    <option value="poupança">Poupança</option>
                    <option value="corrente">Corrente</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" style={{display: display}}>
                { TarjetaBox() }
                <Button 
                  disabled={ id && campaign && user_id && company_id && person_type && identification_type && identification && amount && payment_date && card_type && card_number && expiration_month && expiration_year && ano_cobro && mes_cobro ? false : true } 
                  color="success" 
                  onClick={this.createDonationCartao}
                >
                  Criar doação
                </Button>
              </Col>
              <Col xs="12" sm="12" style={{display: display2}}>
                { CuentaBox() }
                <Button 
                  disabled={ id && campaign && user_id && company_id && person_type && identification_type && identification && amount && payment_date && account_type && bank && agency && account_number && ano_cobro && mes_cobro ? false : true }
                  color="success" 
                  onClick={this.createDonationConta}
                >
                  Criar Doação
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    )
  }
}