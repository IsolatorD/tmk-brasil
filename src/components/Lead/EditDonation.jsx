import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Cuenta from './EditDonation/Cuenta';
import Tarjeta from './EditDonation/Tarjeta';

export default class EditDonation extends Component {  
  render() {
    let { modal3, openModal3, OnModalOpen, handleChange, updateDonationCartao, updateDonationConta, handleChangeIpcaEdit, handleChangeTypeEdit } = this.props;
    let {suscription_id, user_id, codcad,person_type,identification_type,identification,ipca,payment_date,amount,method, displayEdit, display2Edit, card_type, card_number, expiration_month, expiration_year, account_type, bank, agency, account_number, ano_cobro, mes_cobro} = this.props
    let mesesList = [], añosList = [], añoFinalDelCiclo = new Date().getFullYear()+1;
      
    for(let añoDeInicio=2019; añoDeInicio <= añoFinalDelCiclo; añoDeInicio++ ) {
      añosList.push(<option value={añoDeInicio}>{añoDeInicio}</option>);
    }
		const CuentaBox = () => {
			return <Cuenta account_number={account_number} agency={agency} bank={bank} handleChange={handleChange.bind(this)}/>
		}

		const TarjetaBox = () => {
			return <Tarjeta card_number={card_number} expiration_month={expiration_month} expiration_year={expiration_year} handleChange={handleChange.bind(this)}/>
    }
    var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    mesesList = meses.map(el => {
      return <option value={el} key={el}>{el}</option>;
    });
    return(
      <Modal isOpen={modal3} toggle={openModal3} onOpened={OnModalOpen}>
				<ModalHeader toggle={openModal3}>Edite informação de doação</ModalHeader>
				<ModalBody>
					<Form>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="codcadM">CODCAD</Label>
                  <Input value="" type="text" value={codcad} name="codcad" id="codcadM" onChange={handleChange.bind(this)}/>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="person_typeM">Tipo de Pessoa</Label>
                  <Input type="select" value={person_type} name="person_type" id="person_typeM" onChange={handleChange.bind(this)}>
                    <option value="">Selecione</option>
                    <option value="Pessoa Juridica">Pessoa Juridica</option>
                    <option value="Pessoa Fisica">Pessoa Fisica</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="identification_typeM">Tipo ID</Label>
                  <Input type="select" value={identification_type} name="identification_type" id="identification_typeM" onChange={handleChange.bind(this)}>
                    <option value="">Selecione</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="CPF">CPF</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="identificationM">ID Pagador</Label>
                  <Input value={identification} type="text" name="identification" id="identificationM" onChange={handleChange.bind(this)}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" defaultChecked={true} value={ipca} id="ipcaM" name="ipca" onClick={handleChangeIpcaEdit.bind(this)}/>{' '}
                    IPCA
                  </Label>
                </FormGroup>
                <hr/>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="payment_dateM">Data de cobro</Label>
                  <Input type="select" value={payment_date} name="payment_date" id="payment_dateM" onChange={handleChange.bind(this)}>
                    <option value="">Selecione</option>
                    <option value="gv1">GV1</option>
                    <option value="gv2">GV2</option>
                    <option value="gv3">GV3</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="amountM">Quantidade</Label>
                  <Input value={amount} type="number" min="1" name="amount" id="amountM" onChange={handleChange.bind(this)}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label>Mês da Colecção</Label>
                  <Input type="select" value={mes_cobro} name="mes_cobro" id="mesCobro" onChange={handleChange.bind(this)}>
                    <option value="">Selecione...</option>
                    { mesesList }
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label>Ano de coleta</Label>
                  <Input type="select" value={ano_cobro} name="ano_cobro" id="anoCobro" onChange={handleChange.bind(this)}>
                    <option value="">Selecione...</option>
                    { añosList }
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="6">
                <FormGroup>
                  <Label for="method2">Método</Label>
                  <Input type="select" value={method} onChange={handleChangeTypeEdit.bind(this)} name="method" id="method2">
                    <option value="">Selecione</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Conta">Conta bancária</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" style={{display: displayEdit}}>
                <FormGroup>
                  <Label for="card_type">Tipo de Cartão</Label>
                  <Input type="select" value={card_type} onChange={handleChange.bind(this)} name="card_type" id="card_type">
                    <option value="">Selecione</option>
                    <option value="credito">Credito</option>
                    <option value="debido">Debito</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" style={{display: display2Edit}}>
                <FormGroup>
                  <Label for="account_type">Tipo de Conta</Label>
                  <Input type="select" value={account_type} name="account_type" id="account_type" onChange={handleChange.bind(this)}>
                    <option value="">Selecione</option>
                    <option value="poupança">Poupança</option>
                    <option value="corrente">Corrente</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" style={{display: displayEdit}}>
                { TarjetaBox() }
                <Button 
                  disabled={ suscription_id && user_id && person_type&& identification_type&& identification&& amount&& payment_date && card_type && card_number && expiration_month && expiration_year && mes_cobro && ano_cobro ? false : true } 
                  color="success" 
                  onClick={updateDonationCartao.bind(this)}
                >
                  Atualizar doação con cartão
                </Button>
              </Col>
              <Col xs="12" sm="12" style={{display: display2Edit}}>
                { CuentaBox() }
                <Button 
                  disabled={ suscription_id && user_id && person_type&& identification_type&& identification&& amount&& payment_date && account_type && bank && agency && account_number && mes_cobro && ano_cobro ? false : true }
                  color="success" 
                  onClick={updateDonationConta.bind(this)}
                >
                  Atualizar doação com conta
                </Button>
              </Col>
            </Row>
          </Form>
				</ModalBody>
				<ModalFooter>
				</ModalFooter>
			</Modal>
    )
  }
}