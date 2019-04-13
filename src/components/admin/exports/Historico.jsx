import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button } from "reactstrap";
import withPermission from '../../withPermission';
import Fecha from '../../others/Fecha';
import config from '../../../config';
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert2';

import { CSVLink } from 'react-csv'

import AuthService from '../../../AuthService';
const Auth = new AuthService();

class HistoryExport extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      datos: [],
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
      ]
    }
    this.successMessage = this.successMessage.bind(this);
    this.errorCustom = this.errorCustom.bind(this);
    this.error = this.error.bind(this);
    this.getHistoryOfExports = this.getHistoryOfExports.bind(this);
    this.sendExportDate = this.sendExportDate.bind(this);
  }

  componentDidMount() {
    this.getHistoryOfExports();
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

  async getHistoryOfExports() {
    swal.showLoading();
    let { data } = this.state;
    if(data.length > 0) {
      var table = $('#Table').DataTable();
      table.destroy();
    }
    var user_id = Auth.getUserId();
    try {
      let q = await axios.get(`${config.baseUrl}exportation/get_exportation/${user_id}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
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
    } catch(err) {
      console.log(err);
      this.error();
    }
  }

  async sendExportDate(date) {
    swal.showLoading();
    var user_id = Auth.getUserId();
    var datos = {
      user_id,
      export_date: date
    }
    try {
      let q = await axios.post(`${config.baseUrl}exportation/get_export_donation`, datos);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      swal.close();
      this.setState({ datos: q.data.data });
    } catch(err) {
      console.log(err);
      this.error();
    }
  }

  render() {
    let { data, headers, datos } = this.state;

    const historico = () => {
      if(data.length > 0) {
        return data.map((i, j) => {
          return (
            <tr key={j++} className='animated fadeIn'>
              <td>{i.created_at}</td>
              <td>{i.id}</td>
              <td>{i.type}</td>
              <td>{i.length}</td>
              <td>{i.first_name} {i.last_name}</td>
              <td>
                <Button 
                  color="warning" 
                  className="medio-margin"
                  onClick={() => this.sendExportDate(i.created_at)}
                >
                  <b>Prepare-se</b>
                </Button>
                <CSVLink
                  data={datos}
                  headers={headers}
                  className="btn btn-primary"
                  target="_blank"
                  filename={"Exportação-"+ new Date().toISOString() +".csv"}
                >
                  <b>Exportação</b>
                </CSVLink>
              </td>
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
        )
      }
    }
    return(
      <Container className="animated fadeIn">
        <br/>
        <Row>
          <Col xs="6" sm="6">
            <h2>Exportações - Histórico</h2>
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
                <h4><b><i class="ion-information-circled text-danger"></i> O arquivo deve ser preparado antes de prosseguir para o download</b></h4>
              </Col>
              <hr/>
            </Row>
            <br/>
            <Row>
              <Col xs="12" sm="12">
                <Table id="Table">
                  <thead>
                    <tr>
                      <th>Data de exportação</th>
                      <th>Código de exportação</th>
                      <th>Tipo</th>
                      <th>Número de registros</th>
                      <th>Usuário</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico()}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    )
  }
}

export default withPermission(HistoryExport)