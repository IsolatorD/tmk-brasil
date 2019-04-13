import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button, FormGroup, Label, Input } from "reactstrap";
import withPermission from '../../withPermission';
import Fecha from '../../others/Fecha';
import config from '../../../config';
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert2';

import { CSVLink } from 'react-csv'

import AuthService from '../../../AuthService';
const Auth = new AuthService();

class NewExport extends Component {
  constructor() {
    super();
    this.state = {
      orgs: [],
      org: '',
      data: [],
      headers: [
        { label: 'Operador', key: 'user_email'},
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
    }
    this.successMessage = this.successMessage.bind(this);
    this.error = this.error.bind(this);
    this.errorCustom = this.errorCustom.bind(this);
    this.getOrgs = this.getOrgs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeChecks = this.handleChangeChecks.bind(this);
    this.sendOfExport = this.sendOfExport.bind(this);
  }

  componentDidMount() {
    this.getOrgs();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value });
    this.handleChangeChecks();
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
      this.setState({ orgs: q.data.data, org: q.data.data[0].id })
      this.handleChangeChecks();
    } catch(error) {
      return this.error()
    }  
  }

  async handleChangeChecks() {
    let { data } = this.state;
    var org = $('#org').val();

    if(data.length > 0) {
      var table = $('#Table').DataTable();
      table.destroy();
      this.setState({ data: [] });
    }
    
    swal.showLoading();
    var array1 = [], array2 = [], array3 = [];
    if($('#mensal').prop('checked')) {
      array1.push('Mensal')
    }
    if($('#pontual').prop('checked')) {
      array1.push('Pontual')
    }
    if($('#cartao').prop('checked')) {
      array2.push('Cartão');
    }
    if($('#conta').prop('checked')) {
      array2.push('Conta');
    }
    if($('#pf').prop('checked')) {
      array3.push('Pessoa Fisica');
    }
    if($('#pj').prop('checked')) {
      array3.push('Pessoa Juridica');
    }
    if(org != '') {
      var datos = {
        frequency: array1,
        payment_type: array2,
        person_type: array3
      }
      let q = await axios.post(`${config.baseUrl}exportation/all_donations/${org}`, datos);
      if(q.data.codeError) {
        this.setState({ data: [] });
        return this.errorCustom(q.data.error);
      } else {
        swal.close();
        this.setState({ data: q.data.data });
        $('#Table').DataTable({
          language: {
            "sProcessing": "Processando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "Nenhum resultado encontrado",
            "sEmptyTable": "Não há dados disponíveis nesta tabela",
            "sInfo": "Mostrando registros del _START_ al _END_ de um total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de um total de 0 registros",
            "sInfoFiltered": "(filtrando um total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Pesquisar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Carregando...",
            "oPaginate": {
              "sFirst": "Primeiro",
              "sLast": "Último",
              "sNext": "Próximo",
              "sPrevious": "Anterior"
            },
            "oAria": {
              "sSortAscending": ": Ative para ordenar a coluna ascendente",
              "sSortDescending": ": Ativar para ordenar a coluna em ordem decrescente"
            }
          },
          "iDisplayLength": 10
        });
      }
    } else {
      return this.errorCustom('Você deve selecionar uma organização');
    }
  }

  async sendOfExport() {
    swal.showLoading();
    let { data } = this.state;
    var user_id = Auth.getUserId();
    var company_id = $('#org').val();
    var ids = [];
    var types = [];
    if($('#mensal').prop('checked')) {
      types.push('Mensal')
    }
    if($('#pontual').prop('checked')) {
      types.push('Pontual')
    }
    if($('#cartao').prop('checked')) {
      types.push('Cartão');
    }
    if($('#conta').prop('checked')) {
      types.push('Conta');
    }
    if($('#pf').prop('checked')) {
      types.push('Pessoa Fisica');
    }
    if($('#pj').prop('checked')) {
      types.push('Pessoa Juridica');
    }
    data.map((i, j) => {
      ids.push(i.donation_id);
    });

    try {
      var datos = { company_id, ids, types, user_id };
      let q = await axios.put(`${config.baseUrl}exportation/mark_exportation`, datos);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.handleChangeChecks();
      this.successMessage(q.data.data);
    } catch(err) {
      console.log(err);
      this.error();
    }

  }

  render() {
    let { data, orgs, org, headers } = this.state;
    let orgsList = [];

    if (orgs.length > 0) {
			orgsList = orgs.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			orgsList = null;
    }
    
    const exportacion = () => {
      if(data.length > 0) {
        return data.map((i, j) => {
          return (
            <tr key={j++} className='animated fadeIn'>
                <td>{j}</td>
                <td>{i.first_name}</td>
                <td>{i.last_name}</td>
                <td>{i.email}</td>
                <td>{i.amount}</td>
                <td>{i.type}</td>
                <td>{i.method}</td>
            </tr>
          );
        });
      } else {
        return (
          <tr>
            <td colspan="8">
              Sem registros.
            </td>
          </tr>
        );
      }
    }

    return(
      <Container className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="6" sm="6">
            <h2>Exportações - Nova Exportação</h2>
          </Col>
          <Col xs="6" sm="6">
            <Fecha/>
          </Col>
        </Row>
        <br/>
        <Card className="box-shadow">
          <CardBody>
            <Row>
              <Col xs="12" sm="12">
                <h4>Filtrar para exportações</h4>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="org">Organização</Label>
                  <Input id="org" name="org" value={org} type="select" onChange={this.handleChange}>
                    <option value="">Selecione</option>
                    {orgsList}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="2" sm="2">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} id="mensal" name="mensal" onClick={this.handleChangeChecks}/>{' '}
                    Mensal
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="2" sm="2">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} id="pontual" name="pontual" onClick={this.handleChangeChecks}/>{' '}
                    Pontual
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="2" sm="2">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} id="cartao" name="cartao" onClick={this.handleChangeChecks}/>{' '}
                    Cartão
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="1" sm="1">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} id="conta" name="conta" onClick={this.handleChangeChecks}/>{' '}
                    Conta
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="2" sm="2">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} id="pf" name="pf" onClick={this.handleChangeChecks}/>{' '}
                    Pessoa Fisica
                  </Label>
                </FormGroup>
              </Col>
              <Col xs="3" sm="3">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} id="pj" name="pj" onClick={this.handleChangeChecks}/>{' '}
                    Pessoa Juridica
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <br/>
        <Card className="box-shadow">
          <CardBody>
            <Row>
              <Col xs="12" sm="12">
                <h4>Pré-visualização de exportação</h4>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col xs="12" sm="12">
                <Table id="Table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Sobrenome</th>
                      <th>Email</th>
                      <th>Valor</th>
                      <th>Tipo de doação</th>
                      <th>Meio de pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportacion()}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col xs="3" sm="3" style={{display: data.length > 0 ? 'block' : 'none'}}>
                <CSVLink
                  data={data}
                  headers={headers}
                  filename={"Exportação-"+ new Date().toISOString() +".csv"}
                  className="btn btn-lg btn-primary"
                  onClick={this.sendOfExport}
                >
                  <b>Exportação</b>
                </CSVLink>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    )
  }
}

export default withPermission(NewExport)