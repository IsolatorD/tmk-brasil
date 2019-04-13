import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button, ButtonGroup, Input, Label, FormGroup } from "reactstrap";
import axios from 'axios';
import swal from 'sweetalert2';
import config from '../../../config';
import $ from 'jquery';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { CSVLink } from 'react-csv';
import withPermission from '../../withPermission';
import Fecha from '../../others/Fecha';
import AuthService from '../../../AuthService';

const Auth = new AuthService();

class Recusas extends Component {
  constructor() {
    super();
    this.state = {
      displayCsv: 'none', 
      startDate: null,
      endDate: null,
      focusedInput: null,
      dateInicial: null,
      dateFinal: null,
      user: '',
      org: '',
      resultado: '',
      users: [],
      orgs: [],
      resultados: [],
      data: [],
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
        { label: 'Descrição', key: 'description' }
      ],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOrg = this.handleChangeOrg.bind(this);
    this.successMessage = this.successMessage.bind(this);
    this.errorCustom = this.errorCustom.bind(this);
    this.error = this.error.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getOrgs = this.getOrgs.bind(this);
    this.getResults = this.getResults.bind(this);
    this.verifyTwoDates = this.verifyTwoDates.bind(this);
    this.filterDataFromDate = this.filterDataFromDate.bind(this);
  }
  componentDidMount() {
    this.getUsers();
    this.getOrgs();
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleChangeOrg(event) {
    this.setState({ [event.target.name]: event.target.value })
    this.getResults(event.target.value);
  }

  successMessage (msg) {
    swal({ type: 'success', title: msg })
  }
  errorCustom (msg) {
    swal({ type: 'error', title: msg })
  }
  error () {
    swal({ type: 'error', title: 'Houve um erro ao entrar em contato com o servidor. Recarregue a página e tente novamente.' })
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

  async getOrgs() {
    var user_id = Auth.getUserId();
    try {
      let q = await axios.get(`${config.baseUrl}company/all/${user_id}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({ orgs: q.data.data })
    } catch(error) {
      return this.error()
    }  
  }

  async getResults(id) {
    var user_id = Auth.getUserId();
    try {
      let q = await axios.get(config.baseUrl+'callstatus/all/'+id+'/'+user_id);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({
        resultados: q.data.data
      });
    } catch (error) {
      this.error();
    }
  }

  verifyTwoDates(startDate, endDate) {
    this.setState({ startDate, endDate })
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
      this.setState({ dateInicial, dateFinal });
      this.filterDataFromDate('customized', dateInicial, dateFinal);
    }
  }

  async filterDataFromDate (option, date1 = null, date2 = null) {
    let { user, org, resultado ,data } = this.state;
    if(data.length > 0) {
      let table = $('#table').DataTable();
      table.destroy();
      this.setState({ data: [] });
    }
    swal.showLoading();
    this.setState({ displayCsv: 'none' });
    let userId = Auth.getUserId();
    if(user != '' && org != '' && resultado != '') {
      try {
        let q = await axios.get(`${config.baseUrl}exportation/recusas/${user}/${org}/${resultado}/${option}/${date1}/${date2}/${userId}`);
        if(q.data.codeError) {
          this.setState({ data: [], displayCsv: 'none' });
          return this.errorCustom(q.data.error);
        } else {
          this.setState({ data: q.data.data, displayCsv: 'block' });
          swal.close();
          $('#table').DataTable({ language: {
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
            search: 'Buscar:',
            infoFiltered: 'Filtrado de _MAX_ registros'
          }});
        }
      } catch (error) {
        console.log(error);
        this.error();
      }
    } else {
      this.errorCustom('Você deve selecionar um usuário e uma organização')
    }
  }

  render() {
    let { org, orgs, user, users, resultados, resultado, startDate, endDate, focusedInput, data, headers, displayCsv } = this.state;
    let orgsList = [], usersList = [], resultadosList = [];

    if (orgs.length > 0) {
			orgsList = orgs.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			orgsList = null;
    }
    if (users.length > 0) {
			usersList = users.map(el => {
        return <option value={el.id} key={el.id}>{el.email}</option>;
			});
		} else {
			usersList = null;
    }
    if (resultados.length > 0) {
			resultadosList = resultados.map(el => {
        return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			resultadosList = null;
    }

    const tabla = () => {
      if(data.length > 0) {
        return data.map((i, j) => {
          return(
            <tr key={j++}>
              <td>{j}</td>
              <td>{i.date}</td>
              <td>{i.first_name}</td>
              <td>{i.last_name}</td>
              <td>{i.email}</td>
              <td>{i.phone}</td>
              <td>{i.type}</td>
            </tr>
          );
        });
      } else {
        return(
          <tr>
            <td colspan="5">
              Sem registros.
            </td>
          </tr>
        );
      }
    }

    return (
      <Container className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="6" sm="6">
            <h2>Exportações - Usuários</h2>
          </Col>
          <Col xs="6" sm="6">
            <Fecha/>
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
          <Col xs="6" sm="6">
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
          <Col xs="3" sm="3">
            <FormGroup>
              <Label>Operador</Label>
              <Input type="select" name="user" value={user} id="user" onChange={this.handleChange}>
                <option value="">Selecione..</option>
                { usersList }
              </Input>
            </FormGroup>
          </Col>
          <Col xs="3" sm="3">
            <FormGroup>
              <Label>Organização</Label>
              <Input type="select" name="org" value={org} id="org" onChange={this.handleChangeOrg}>
                <option value="">Selecione..</option>
                { orgsList }
              </Input>
            </FormGroup>
          </Col>
          <Col xs="3" sm="3">
            <FormGroup>
              <Label>Resultado de contato</Label>
              <Input type="select" name="resultado" value={resultado} id="resultado" onChange={this.handleChange}>
                <option value="">Selecione..</option>
                { resultadosList }
              </Input>
            </FormGroup>
          </Col>
          <Col xs="2" sm="2">
            <Button 
              color="primary" 
              className="mt2" 
              onClick={() => this.filterDataFromDate('All')} 
              disabled={user && org && resultado ? false : true }
            >
              Pesquisar
            </Button>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs="12" sm="12">
            <Card className="box-shadow">
              <CardBody>
                <Row>
                  <Col xs="12" sm="12">
                    <Table id="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Data</th>
                          <th>Nome</th>
                          <th>Sobrenome</th>
                          <th>Email</th>
                          <th>Telefone</th>
                          <th>Tipo de Lead</th>
                        </tr>
                      </thead>
                      <tbody>
                        { tabla() }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col xs="4" sm="4" style={{ display: displayCsv }}>
                    <CSVLink
                      data={data}
                      headers={headers}
                      className="btn btn-primary"
                      target="_blank"
                      filename={"Exportação-painel-"+ new Date().toISOString() +".csv"}
                    >
                      <b>Exportação</b>
                    </CSVLink>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

}

export default withPermission(Recusas);