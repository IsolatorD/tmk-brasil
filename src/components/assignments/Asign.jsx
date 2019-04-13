import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, FormGroup, Label, Input, Button, Tooltip } from 'reactstrap';
import withAuth from '../withAuth';
import AuthService from '../../AuthService';
import Fecha from '../others/Fecha'
import axios from 'axios';
import $ from 'jquery';
import config from '../../config';
import swal from 'sweetalert2';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import DropDownAsign from './DropDownAsign';

const Auth = new AuthService();

class Asign extends Component {
  constructor() {
    super();
    this.state = {
      display: 'none',
      display2: 'none',
      orgs: [],
      org: '',
      startDate: null,
      endDate: null,
      dateInicial: '',
      dateFinal: '',
      focusedInput: null,
      openEncomiendas: false,
      openIntencion: false,
      openBaixe: false,
      atribuirEncomendas: 0,
      atribuirIntencion: 0,
      atribuirBaixe: 0,
      objEncomiendas: {
        title: 'Encomendas',
        total: 0,
        nuevos: 0,
        devueltos: 0,
        urldata: [],
      },
      objIntencion: {
        title: 'Intenção doação',
        total: 0,
        nuevos: 0,
        devueltos: 0,
        urldata: [],
      },
      objBaixe: {
        title: 'Baixe',
        total: 0,
        nuevos: 0,
        devueltos: 0,
        urldata: [],
      },
      operators: [],
      tooltipOpen: false,
      nuevosDevueltos: true
    }
    this.successMessage = this.successMessage.bind(this);
    this.errorCustom = this.errorCustom.bind(this);
    this.error = this.error.bind(this);
    this.verifyTwoDates = this.verifyTwoDates.bind(this);
    this.getOrgs = this.getOrgs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openEncomiendas = this.openEncomiendas.bind(this);
    this.openIntencion = this.openIntencion.bind(this);
    this.openBaixe = this.openBaixe.bind(this);
    this.handleDisplay = this.handleDisplay.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.eval = this.eval.bind(this);
    this.blurInputs = this.blurInputs.bind(this);
    this.getOperators = this.getOperators.bind(this);
    this.asignar = this.asignar.bind(this);
    this.successCustom = this.successCustom.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChangeChecks = this.handleChangeChecks.bind(this);
  }

  componentDidMount () {
    this.getOrgs();    
  }
  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  successCustom(sms, users) {
    var html = ''; 
    for(let i = 0; i < users.length; i++) {
      html += `<p><b>Operador:</b> ${users[i].email}, <b>Atribuídos</b> ${users[i].asignados}<p>`;
    }
    return swal({
            title: sms,
            html: html
          })
  }

  async asignar() {
    swal.showLoading();
    let { org, dateInicial, dateFinal } = this.state;
    var user_id = Auth.getUserId();
    let user_to_assign = [];
    var users = $('#operators').val();
    var urls = []
    let type = "";
    let date1 = null;
    let date2 = null;
    if($('#all').prop('checked')) {
      type = "All";
    } else if($('#date').prop('checked')) {
      type = "customized";
      date1 = dateInicial;
      date2 = dateFinal;
    }
    
    if(users.length > 0) {
      users.forEach(element => {
        user_to_assign.push(element);
      });
    }
    $.each($(`.encomendas`), (i, el) => {
      if($(`#${el.id}`).val() != '' && $(`#${el.id}`).val() > 0) {
        urls.push({ 
          name: $(`#${el.id}`).attr('data-url'), 
          cantidad: $(`#${el.id}`).val(), 
          type: 'Encomendas' 
        });
      }
    });
    $.each($(`.intencion`), (i, el) => {
      if($(`#${el.id}`).val() != '' && $(`#${el.id}`).val() > 0) {
        urls.push({ 
          name: $(`#${el.id}`).attr('data-url'), 
          cantidad: $(`#${el.id}`).val(), 
          type: 'Intenção de doação' 
        });
      }
    });
    $.each($(`.baixe`), (i, el) => {
      if($(`#${el.id}`).val() != '' && $(`#${el.id}`).val() > 0) {
        urls.push({ 
          name: $(`#${el.id}`).attr('data-url'), 
          cantidad: $(`#${el.id}`).val(), 
          type: 'Baixe' 
        });
      }
    });

    let nuevosDevueltos = $('#nuevosDevueltos').prop('checked');

    var datos = {
      user_id,
      company_id: org,
      user_to_assign,
      urls,
      code: type,
      first_date: date1,
      last_date: date2,
      nuevosDevueltos
    }
    try {
      let q = await axios.post(`${config.baseUrl}client/to_assign`, datos);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.successCustom(q.data.data.sms, q.data.data.users);
      this.getInfo(org, type, date1, date2);
    } catch(err) {
      console.log(err);
      this.error();
    }
  }

  async getOperators() {
    var user_id = Auth.getUserId();
    try {
      let q = await axios.get(`${config.baseUrl}user/all_operators/${user_id}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({ operators: q.data.data });
    } catch(err) {
      console.log(err);
      this.error();
    }
  }
  async blurInputs(event, nuevos, devueltos) {
    let counter = 0;
    let value = Number(event.target.value);
    if (value >= 0 && value <= (Number(devueltos) + Number(nuevos))) {
      $(`#${event.target.id}`).removeClass('border-danger');
    } else {
      $(`#${event.target.id}`).addClass('border-danger');
    }

    if(event.target.name === 'encomendas') {
      $.each($(`.${event.target.name}`), (i, el) => {
        let value = Number($(`#${el.id}`).val());
        counter += value;
      });
      this.setState({ atribuirEncomendas: counter });
    }
    if(event.target.name === 'intencion') {
      $.each($(`.${event.target.name}`), (i, el) => {
        let value = Number($(`#${el.id}`).val());
        counter += value;
      });
      this.setState({ atribuirIntencion: counter });
    }
    if(event.target.name === 'baixe') {
      $.each($(`.${event.target.name}`), (i, el) => {
        let value = Number($(`#${el.id}`).val());
        counter += value;
      });
      this.setState({ atribuirBaixe: counter });
    }
  }

  eval() {
    let { org, startDate, endDate, dateInicial, dateFinal } = this.state; 
    if($('#all').prop('checked') && org != '') {
      this.getInfo(org, 'All');
    }else if($('#date').prop('checked') && org != '' && startDate != null && endDate != null) {
      this.getInfo(org, 'customized', dateInicial, dateFinal);
    } else {
      this.errorCustom('Você deve selecionar uma organização e um método (se for uma data, você deve inserir as respectivas datas)');
    }
  }

  async getInfo(org, codigo, date1 = null, date2 = null) {
    this.getOperators();
    this.setState({
      atribuirEncomendas: 0, atribuirIntencion: 0, atribuirBaixe: 0,
      objEncomiendas: {
        title: 'Encomendas', total: 0, nuevos: 0, devueltos: 0, urldata: [],
      },
      objIntencion: {
        title: 'Intenção doação', total: 0, nuevos: 0, devueltos: 0, urldata: [],
      },
      objBaixe: {
        title: 'Baixe', total: 0, nuevos: 0, devueltos: 0, urldata: [],
      },
    });
    let nuevosDevueltos = $('#nuevosDevueltos').prop('checked');
    let user_id = Auth.getUserId();
    try {
      let q = await axios.get(`${config.baseUrl}client/dashboard_not_assigned/${user_id}/${org}/${nuevosDevueltos}/${codigo}/${date1}/${date2}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      var dat = q.data.data;
      this.setState({
        objEncomiendas: {
          title: 'Encomendas',
          total: dat.totalEncomiendas,
          nuevos: dat.nuevosEncomiendas,
          devueltos: dat.devueltosEncomiendas,
          urldata: dat.urlsEncomiendas
        },
        objIntencion: {
          title: 'Intenção doação',
          total: dat.totalIntencion,
          nuevos: dat.nuevosIntencion,
          devueltos: dat.devueltosIntencion,
          urldata: dat.urlsIntencion
        },
        objBaixe: {
          title: 'Baixe',
          total: dat.totalBaixe,
          nuevos: dat.nuevosBaixe,
          devueltos: dat.devueltosBaixe,
          urldata: dat.urlsBaixe
        }
      }, () => this.handleDisplay());
    } catch(err) {
      console.log(err);
      this.error();
    }
  }

  handleDisplay() {
    let { org } = this.state;
    if(org != '') {
      this.setState({ display: 'block' });
    } else {
      this.setState({ display: 'none' });
    }
  }

  handleCheck(event) {
    if(event.target.id === 'date') {
      this.setState({ display2: 'block' });
    } else {
      this.setState({ display2: 'none' });
    }
  }

  handleChangeChecks(event) {
    if($('#nuevosDevueltos').prop('checked')) {
      this.setState({ nuevosDevueltos: true });
    } else {
      this.setState({ nuevosDevueltos: false });
    }
  }
  
  openEncomiendas() {
    this.setState({ 
      openEncomiendas: !this.state.openEncomiendas,
      openIntencion: false,
      openBaixe: false
    });
  }
  
  openIntencion() {
    this.setState({ 
      openIntencion: !this.state.openIntencion,
      openEncomiendas: false,
      openBaixe: false
    });
  }
  
  openBaixe() {
    this.setState({ 
      openBaixe: !this.state.openBaixe,
      openIntencion: false,
      openEncomiendas: false,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ display: 'none' });
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
  
  async getOrgs() {
    var user_id = Auth.getUserId();
    try {
      let q = await axios.get(`${config.baseUrl}company/all/${user_id}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({ orgs: q.data.data });
    } catch(error) {
      return this.error()
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
      this.setState({
        dateInicial,
        dateFinal
      })
    }
  }

  render() {
    let { display, display2, orgs, org, startDate, endDate, focusedInput, openEncomiendas, openIntencion, openBaixe, objEncomiendas, objIntencion, objBaixe, atribuirEncomendas, atribuirIntencion, atribuirBaixe, operators, tooltipOpen } = this.state;
    let orgsList = [], operatorsList = [];
    
    if (orgs.length > 0) {
			orgsList = orgs.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			orgsList = null;
    }

    if (operators.length > 0) {
			operatorsList = operators.map(el => {
				return <option value={el.id} key={el.id}>{el.email}</option>;
			});
		} else {
			operatorsList = null;
    }
    
    return (
      <Container className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="7" sm="7">
            <h2>Atribuições</h2>
          </Col>
          <Col xs="5" sm="5">
            <Fecha/>
          </Col>
        </Row>
        <br/>
        <Card className="box-shadow">
          <CardBody>
            <Row>
              <Col xs="3" sm="3">
                <FormGroup check>
                  <Label check>
                    <Input 
                      id="all"
                      type="radio" 
                      name="radio"
                      defaultChecked
                      onChange={this.handleCheck}
                    />{' '}
                      All
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="3" sm="3">
                <FormGroup check>
                  <Label check>
                    <Input 
                      id="date"
                      type="radio" 
                      name="radio" 
                      onChange={this.handleCheck}
                    />{' '}
                      Date
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" style={{ display: display2 }}>
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
                  <Label for="org">Organização</Label>
                  <Input type="select" name="org" value={org} onChange={this.handleChange}>
                    <option value="">Selecione...</option>
                    { orgsList }
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="3" sm="3" className="mt3">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} id="nuevosDevueltos" name="nuevosDevueltos" onClick={this.handleChangeChecks}/>{' '}
                    Nuevos/Devueltos
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="3" sm="3">
                <Button className="mt3" color="primary" onClick={this.eval}>
                  Listar
                </Button>
              </Col>
            </Row>
            <br/>
            <Row style={{ display: display }} className="animated fadeIn">
              <Col xs="5" sm="5">
                <FormGroup>
                  <Label for="operators">Operadores</Label>
                  <Input type="select" name="operators" id="operators" multiple>
                    { operatorsList }
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="12" sm="12">
                <Button 
                  color="primary"
                  onClick={this.asignar}
                >
                  Atribuir
                </Button>
                <i className="ion-information-circled i-tool ml1" id="TooltipExample"></i>
                <Tooltip 
                  placement="right" 
                  isOpen={tooltipOpen} 
                  target="TooltipExample" 
                  toggle={this.toggle}
                >
                  Os campos em vermelho indicam que o número de leads a ser atribuído excede o limite de disponibilidade para o referido URL, portanto, eles não serão considerados no momento da atribuição.
                </Tooltip>
              </Col>
            </Row>
            <br/>
            <Row style={{ display: display }} className="animated fadeIn">
              <Col xs="12" sm="12">
                <Row>
                  <Col xs="12" sm="12">
                    <Table onClick={this.openEncomiendas}>
                      <thead className="thead-asign">
                        <th>Tipo de Lead</th>
                        <th>Registros Totais</th>
                        <th>Quantidade Novo</th>
                        <th>Retornado</th>
                        <th>Atributo</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{objEncomiendas.title}</td>
                          <td>{objEncomiendas.total}</td>
                          <td>{objEncomiendas.nuevos}</td>
                          <td>{objEncomiendas.devueltos}</td>
                          <td>{atribuirEncomendas}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col xs="12" sm="12">
                    <DropDownAsign 
                      open={openEncomiendas} 
                      url={objEncomiendas.urldata}
                      blurInputs={this.blurInputs}
                      name="encomendas"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <br/>
            <Row style={{ display: display }} className="animated fadeIn">
              <Col xs="12" sm="12">
                <Row>
                  <Col xs="12" sm="12">
                    <Table onClick={this.openIntencion}>
                      <thead className="thead-asign">
                        <th>Tipo de Lead</th>
                        <th>Registros Totais</th>
                        <th>Quantidade Novo</th>
                        <th>Retornado</th>
                        <th>Atributo</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{objIntencion.title}</td>
                          <td>{objIntencion.total}</td>
                          <td>{objIntencion.nuevos}</td>
                          <td>{objIntencion.devueltos}</td>
                          <td>{atribuirIntencion}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col xs="12" sm="12">
                    <DropDownAsign 
                      open={openIntencion} 
                      url={objIntencion.urldata} 
                      blurInputs={this.blurInputs}
                      name="intencion"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <br/>
            <Row style={{ display: display }} className="animated fadeIn">
              <Col xs="12" sm="12">
                <Row>
                  <Col xs="12" sm="12">
                    <Table onClick={this.openBaixe}>
                      <thead className="thead-asign">
                        <th>Tipo de Lead</th>
                        <th>Registros Totais</th>
                        <th>Quantidade Novo</th>
                        <th>Retornado</th>
                        <th>Atributo</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{objBaixe.title}</td>
                          <td>{objBaixe.total}</td>
                          <td>{objBaixe.nuevos}</td>
                          <td>{objBaixe.devueltos}</td>
                          <td>{atribuirBaixe}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col xs="12" sm="12">
                    <DropDownAsign 
                      open={openBaixe} 
                      url={objBaixe.urldata}
                      blurInputs={this.blurInputs}
                      name="baixe"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    )
  }
}

export default Asign;