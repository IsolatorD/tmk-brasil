import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button, ButtonGroup, FormGroup, Label, Input } from 'reactstrap';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import swal from 'sweetalert2';
import axios from 'axios';
import { CSVLink } from 'react-csv'

import withPermission from '../withPermission';
import AuthService from '../../AuthService';
import config from '../../config';
const Auth = new AuthService();

class DashBoardMe extends Component {
  constructor() {
    super();
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
      users: [],
      user: '',
      orgs: [],
      display: 'block',
      display2: 'none',
      color: 'primary',
      color2: 'light',
      tarjeta: 0,
      bancaria: 0,
      totalDeDonaciones: 0,
      montoTotalDeDonaciones: 0,
      datos: [],
      headers: [
        { label: 'Lead ID', key: 'client_id' },
        { label: 'Email', key: 'email' },
        { label: 'Nome', key: 'first_name' },
        { label: 'Sobrenome', key: 'last_name' },
        { label: 'Sexo', key: 'sex' },
        { label: 'Telefone', key: 'phone' },
        { label: 'Data de Nascimento', key: 'birth_date' },
        { label: 'CPF', key: 'cpf' },
        { label: 'CEP', key: 'cep' },
        { label: 'Estado', key: 'state' },
        { label: 'Cidade', key: 'city' },
        { label: 'Bairro', key: 'urbanization' },
        { label: 'Endereço', key: 'address' },
        { label: 'Complemento', key: 'complement' },
        { label: 'Numero', key: 'number' },
        { label: 'Tipo de Lead', key: 'type' },
        { label: 'Doação ID', key: 'donation_id' },
        { label: 'Valor', key: 'amount' },
        { label: 'Data da Doação', key: 'created_at' },
        { label: 'Data esperada de pagamento', key: 'monthly_year_payment' },
        { label: 'Tipo de Doação', key: 'donation_type' },
        { label: 'CODCAD', key: 'codcad' },
        { label: 'Data de Coleta', key: 'payment_date' },
        { label: 'Método', key: 'method' },
        { label: 'Tipo de Pessoa', key: 'person_type' },
        { label: 'Tipo ID', key: 'identification_type' },
        { label: 'ID Pagador', key: 'identification' },
        { label: 'Tipo de cartão', key: 'card_type' },
        { label: 'Número de cartão', key: 'card_number' },
        { label: 'Mês de expiração', key: 'expired_month' },
        { label: 'Ano de expiração', key: 'expired_year' },
        { label: 'Tipo de conta', key: 'account_type' },
        { label: 'Banco', key: 'bank' },
        { label: 'Agência', key: 'agency' },
        { label: 'Numero de conta', key: 'account_number' }
      ],
      displayCsv: 'none'
    }
    this.filterDataFromDate = this.filterDataFromDate.bind(this);
    this.verifyTwoDates = this.verifyTwoDates.bind(this);
    this.successMessage = this.successMessage.bind(this);
    this.error = this.error.bind(this);
    this.errorCustom = this.errorCustom.bind(this);
    this.handleChangeDisplays = this.handleChangeDisplays.bind(this);
    this.handleChangeDisplays2 = this.handleChangeDisplays2.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  async getUsers() {
    let user_id = Auth.getUserId();
    try {
      let q = await axios.get(config.baseUrl+'user/all/'+user_id);
      if(q.data.codeError) this.errorCustom(q.data.error);
      this.setState({
        users: q.data.data
      });
    } catch(err) {
      console.log(err);
      this.error()
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleChangeDisplays() {
    this.setState({ display: 'block', display2: 'none',color: 'primary', color2: 'light'});
  }
  handleChangeDisplays2() {
    this.setState({ display: 'none', display2: 'block',color: 'light', color2: 'primary'});
  }

  componentDidMount() {
    this.getUsers();
  }
    
  successMessage (msg) {
    swal({
      type: 'success',
      title: msg
    })
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
      title: 'Houve um erro ao entrar em contato com o servidor. Recarregue a página e tente novamente.'
    })
  }

  verifyTwoDates(startDate, endDate) {
    this.setState({ 
      startDate, 
      endDate,
      orgs: [],
      tarjeta: 0,
      bancaria: 0, 
      totalDeDonaciones: 0,
      montoTotalDeDonaciones: 0
    });
    if(startDate !== null && endDate !== null) {
      var fechaInicial = new Date(startDate);
      var fechaFinal = new Date(endDate);
      var añoInicial = fechaInicial.getFullYear();
      var mesInicial = fechaInicial.getMonth()+1;
      var diaInicial = fechaInicial.getDate();
      var añoFinal = fechaFinal.getFullYear();
      var mesFinal = fechaFinal.getMonth()+1;
      var diaFinal = fechaFinal.getDate();
      if(mesInicial < 10) {
        mesInicial = `0${mesInicial}`;
      }
      if(mesFinal < 10) {
        mesFinal = `0${mesFinal}`;
      }
      if(diaInicial < 10) {
        diaInicial = `0${diaInicial}`;
      }
      if(diaFinal < 10) {
        diaFinal = `0${diaFinal}`;
      }
      var dateInicial = `${añoInicial}-${mesInicial}-${diaInicial}`;
      var dateFinal = `${añoFinal}-${mesFinal}-${diaFinal}`;
      this.filterDataFromDate('customized', dateInicial, dateFinal);
    }
  }

  async filterDataFromDate(option, date1 = null, date2 = null) {
    swal.showLoading();
    this.setState({ displayCsv: 'none' });
    let { user } = this.state;
    var userId = Auth.getUserId();
    if(user != '') {
      try {
        let q = await axios.get(`${config.baseUrl}donation/reports_by_user/${user}/${option}/${date1}/${date2}/${userId}`);
        if(q.data.codeError) {
          this.setState({ orgs: [], tarjeta: 0, bancaria: 0, totalDeDonaciones: 0, montoTotalDeDonaciones: 0 });
          return this.errorCustom(q.data.error);
        } else {
          var dat = q.data.data;
          swal.close();
          this.setState({ 
            orgs: dat.asociaciones.length > 0 ? dat.asociaciones : [],
            tarjeta: dat.tarjeta, 
            bancaria: dat.bancaria, 
            totalDeDonaciones: dat.totalDeDonaciones,
            montoTotalDeDonaciones: dat.montoDeTotalDeDonaciones,
            datos: dat.donations,
            displayCsv: dat.donations.length > 0 ? 'block' : 'none',
          });
        }
      } catch(err) {
        console.log(err);
        this.error()
      }
    } else {
      this.errorCustom('Você deve selecionar um usuário');
    }
  }

  render() {
    let { orgs, users, user, color, color2, display, display2, startDate, endDate, focusedInput, tarjeta, bancaria, totalDeDonaciones, montoTotalDeDonaciones, datos, headers, displayCsv } = this.state;
    let usersList = [];

    if (users.length > 0) {
			usersList = users.map(el => {
				return <option value={el.id} key={el.id}>{el.email}</option>;
			});
		} else {
			usersList = null;
    }
        
    const orgCard = () => {
      if(orgs.length > 0) {
        return orgs.map((i, j) => {
          return (
            <Col xs="4" sm="4" className="inline-block2 mb1">
              <Card className="box-shadow animated fadeIn">
                <CardBody>
                  <Row>
                    <Col xs="12" sm="12">
                      <h4 className="text1">
                        <center>
                          <b>
                            {i.company_name}
                          </b>
                        </center>
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="12">
                      <span>
                        <center>
                          <b>
                            Quantidade de doações
                          </b>
                        </center>
                      </span>
                      <h5 className="text1">
                        <center>
                          <b>
                            {i.cantidadDeDonaciones}
                          </b>
                        </center>
                      </h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="12">
                      <span>
                        <center>
                          <b>
                            Valor de doações
                          </b>
                        </center>
                      </span>
                      <h5 className="text2">
                        <center>
                          <b>
                            R$ {i.valorDeDonaciones}
                          </b>
                        </center>
                      </h5>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          )
        })
      } else {
        return(
          <Col xs="12" sm="12">
            <Card>
              <CardBody>
                <h4>No hay datos de compañias</h4>
              </CardBody>
            </Card>
          </Col>
        )
      }
    }
        
    return (
      <Container className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="6" sm="6">
            <h2>Dashboard / Usuários</h2>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs="6" sm="6">
            <ButtonGroup className="margin5">
              <Button 
                size="lg" 
                color="light" 
                onClick={() => this.filterDataFromDate('Tmt')}
              >
                <b>
                  Mtd
                </b>
              </Button>
              <Button 
                size="lg" 
                color="light" 
                onClick={() => this.filterDataFromDate('Tyt')}
              >
                <b>
                  YTD
                </b>
              </Button>
              <Button 
                size="lg" 
                color="light" 
                onClick={() => this.filterDataFromDate('Mtd')}
              >
                <b>
                  1M
                </b>
              </Button>
              <Button 
                size="lg" 
                color="light" 
                onClick={() => this.filterDataFromDate('Ttd')}
              >
                <b>
                  3M
                </b>
              </Button>
              <Button 
                size="lg" 
                color="light" 
                onClick={() => this.filterDataFromDate('Std')}
              >
                <b>
                  6M
                </b>
              </Button>
              <Button 
                size="lg" 
                color="light" 
                onClick={() => this.filterDataFromDate('1y')}
              >
                <b>
                  1Y
                </b>
              </Button>
              <Button 
                size="lg" 
                color="light" 
                onClick={() => this.filterDataFromDate('All')}
              >
                <b>
                  All
                </b>
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs="6" sm="6" className="mt1">
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
              showClearDates={true}
            />
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs="4" sm="4">
            <FormGroup>
              <Label>Operador</Label>
              <Input type="select" name="user" value={user} id="user" onChange={this.handleChange}>
                <option value="">Selecione..</option>
                { usersList }
              </Input>
            </FormGroup>
          </Col>
          <Col xs="2" sm="2">
            <Button 
              color="primary" 
              className="mt2" 
              onClick={() => this.filterDataFromDate('All')} 
              disabled={user ? false : true }
            >
              Pesquisar
            </Button>
          </Col>
        </Row>
        <br/>
        <hr/>
        <Row>
          <Col xs="8" sm="8">
            <ButtonGroup>
              <Button 
                size="lg" 
                color={color} 
                onClick={this.handleChangeDisplays}
              >
                <b>
                  Individuales
                </b>
              </Button>
              <Button 
                size="lg" 
                color={color2} 
                onClick={this.handleChangeDisplays2}
              >
                <b>
                  Totais
                </b>
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs="4" sm="4" style={{ display: displayCsv }}>
            <CSVLink
              data={datos}
              headers={headers}
              className="btn btn-primary"
              target="_blank"
              filename={"Exportação-painel-"+ new Date().toISOString() +".csv"}
            >
              <b>Exportação</b>
            </CSVLink>
          </Col>
        </Row>
        <br/>
        <Row style={{display: display}} className="animated fadeIn">
          <Col xs="12" sm="12" className="inline-block2">
            <Card className="box-shadow">
              <CardBody>
                <Row>
                  <Col xs="6" sm="6">
                    <h4>
                      <center>
                        Domicílio bancário
                      </center>
                    </h4>
                    <br/>
                    <h3 className="text1">
                      <center>
                        <b>
                          {bancaria}
                        </b>
                      </center>
                    </h3>
                  </Col>
                  <Col xs="6" sm="6">
                    <h4>
                      <center>
                        Cartão
                      </center>
                    </h4>
                    <br/>
                    <h3 className="text2">
                      <center>
                        <b>
                          {tarjeta}
                        </b>
                      </center>
                    </h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row style={{display: display2}} className="animated fadeIn">
          <Col xs="6" sm="6" className="inline-block2">
            <Card className="box-shadow">
              <CardBody>
                <Row>
                  <Col xs="12" sm="12">
                    <h4>
                      <center>
                        Quantidade total de doações
                      </center>
                    </h4>
                    <h3 className="text1">
                      <center>
                        <b>
                          R$ {montoTotalDeDonaciones}
                        </b>
                      </center>
                    </h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xs="6" sm="6" className="inline-block2">
            <Card className="box-shadow">
              <CardBody>
                <Row>
                  <Col xs="12" sm="12">
                    <h4>
                      <center>
                        Doações totais
                      </center>
                    </h4>
                    <h3 className="text2">
                      <center>
                        <b>
                          {totalDeDonaciones}
                        </b>
                      </center>
                    </h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br/>
        <br/>
        <Row className="animated fadeIn">
          <Col xs="12" sm="12">
            <Row>
              <Col xs="12" sm="12">
                <h3>
                  <b>
                    Organizações
                  </b>
                </h3>
              </Col>
              <br/>
            </Row>
            <Row>
              { orgCard() }
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withPermission(DashBoardMe);