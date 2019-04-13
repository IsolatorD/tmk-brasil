import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import axios from 'axios';
import swal from 'sweetalert2';
import moment from 'moment';
import CreateClient from './CreateClient';
import EditClient from './EditClient';
import SearchLead from './SearchLead';
import Campaigns from './Campaigns';
import LeadData from './LeadData';
import NoContacted from './NoContacted';
import Contacted from './Contacted';
import Historical from './Historical';
import AddAssociation from './AddAssociation';
import Donation from './Donation/index';
import Cancels from './Cancels';
import Suscriptons from './Suscriptions';
import EditDonation from './EditDonation';
import config from '../../config';
import AuthService from '../../AuthService';
import $ from 'jquery';
import '../../App.css';

const Auth = new AuthService();

export default class Lead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modal2: false,
      modal3: false,
      display: 'block',
      display2: 'none',
      display3: 'none',
      display4: 'none',
      email: '',
			client_id: '',
      company_id: '',
      companies: [],
      company_name: '',
			user_id: '',
      sex: '',
      firstName: '',
      lastName: '',
      phone: '',
      cpf: '',
      urbanization: '',
      complement: '',
      number: '',
      type: '',
      address: '',
      birth_date: '',
      city: '',
      cep: '',
      state: '',
      campaigns: [],
      campaign: '',
      orgs: [],
      noOrgs: [],
      contactability: [],
      yesList: [],
      noList: [],
      assigned: false,
      user_email: null,
      suscriptions: [],
      cancels: [],
      susId: '',
      codcad: '',
      person_type: '',
      identification_type: '',
      identification: '',
      ipca: false,
      amount: '',
      payment_date: '',
      method: '',
      displayEdit: 'none', 
      display2Edit: 'none',
      card_type: '',
      card_number: '',
      expiration_month: '',
      expiration_year: '',
      account_type: '',
      bank: '',
      agency: '',
      account_number: '',
      ano_cobro: '',
      mes_cobro: '',
      updatedTable: false
   };
    this.openModal = this.openModal.bind(this);
    this.openModal2 = this.openModal2.bind(this);
    this.openModal3 = this.openModal3.bind(this);
    this.getLead = this.getLead.bind(this);
    this.createClient = this.createClient.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getCampaigns = this.getCampaigns.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearCampaign = this.clearCampaign.bind(this);
    this.refreshClientData = this.refreshClientData.bind(this);
    this.error = this.error.bind(this);
    this.errorCustom = this.errorCustom.bind(this);
    this.successMessage = this.successMessage.bind(this);
    this.getOrgs = this.getOrgs.bind(this);
    this.handleChangeCompany = this.handleChangeCompany.bind(this);
    this.getContactabilities = this.getContactabilities.bind(this);
    this.getResults = this.getResults.bind(this);
    this.resetCompanies = this.resetCompanies.bind(this);
    this.getNoOrgs = this.getNoOrgs.bind(this);
    this.getCancels = this.getCancels.bind(this);
    this.getSuscriptions = this.getSuscriptions.bind(this);
    this.handleChangeCampaign = this.handleChangeCampaign.bind(this);
    this.sendToModal = this.sendToModal.bind(this);
    this.updateDonationCartao = this.updateDonationCartao.bind(this);
    this.updateDonationConta = this.updateDonationConta.bind(this);
    this.handleChangeIpcaEdit = this.handleChangeIpcaEdit.bind(this);
    this.handleChangeTypeEdit = this.handleChangeTypeEdit.bind(this);
    this.clearEdit = this.clearEdit.bind(this);
    this.handleChangeValueTable = this.handleChangeValueTable.bind(this);
  }
  
  componentDidMount() {
    console.log(this.props);
    this.setState({
      user_id: Auth.getUserId()
    });
    this.getOrgs();
    if(this.props.em != null) {
      this.getLead()
    }
  }

  clearEdit() {
    this.setState({
      susId: '',
      codcad: '',
      person_type: '',
      identification_type: '',
      identification: '',
      ipca: false,
      amount: '',
      payment_date: '',
      method: '',
      displayEdit: 'none', 
      display2Edit: 'none',
      card_type: '',
      card_number: '',
      expiration_month: '',
      expiration_year: '',
      account_type: '',
      bank: '',
      agency: '',
      account_number: '',
      ano_cobro: '',
      mes_cobro: '',
    })
  }
  handleChangeTypeEdit(e) {
    if($('#method2').val() != '') {
      if($('#method2').val() == 'Conta') {
        this.setState({ displayEdit: 'none', display2Edit: 'block', method: 'Conta'})
      } else if($('#method2').val() == 'Cartão'){
        this.setState({ displayEdit: 'block', display2Edit: 'none', method: 'Cartão'})
      }
    }
  }

  handleChangeValueTable(e) {
    this.setState({ updatedTable: !this.state.updatedTable });
  }

  handleChangeIpcaEdit(e) {
    this.setState({ ipca: $('#ipcaM').prop('checked') })
  }

  openModal() {
    this.setState({
      modal: !this.state.modal
    });    
  }
  openModal2() {
    this.setState({
      modal2: !this.state.modal2
    });    
  }
  sendToModal(id, codcad, person_type, identification_type, identification, ipca, amount, payment_date, method, mes, ano) {
    if(method === 'Conta') {
      this.setState({ displayEdit: 'none', display2Edit: 'block' })
    } else {
      this.setState({ displayEdit: 'block', display2Edit: 'none' })
    }
    this.setState({
      susId: id,
      codcad: codcad,
      person_type: person_type,
      identification_type: identification_type,
      identification: identification,
      ipca: ipca,
      amount: amount,
      payment_date: payment_date,
      method: method,
      ano_cobro: ano,
      mes_cobro: mes,
    });
  }

  openModal3() {
    this.setState({
      modal3: !this.state.modal3
    });
  }
  handleCancel() {
    this.setState({
      display: 'block',
      display2: 'none',
      display3: 'none',
      display4: 'none',
      company_id: '',
      companies: [],
      client_id: '',
      email: '',
      sex: '',
      firstName: '',
      lastName: '',
      phone: '',
      cpf: '',
      address: '',
      birth_date: '',
      city: '',
      cep: '',
      state: '',
      campaign: '',
      campaigns: [],
      orgs: [],
      noOrgs: [],
      company_name: '',
      urbanization: '',
      complement: '',
      number: '',
      type: '',
      contactability: [],
      yesList: [],
      noList: [],
      assigned: false,
      user_email: null,
      suscriptions: [],
      cancels: [],
      codcad: '',
      person_type: '',
      identification_type: '',
      identification: '',
      ipca: false,
      amount: '',
      payment_date: '',
      method: '',
      displayEdit: 'none', 
      display2Edit: 'none',
      card_type: '',
      card_number: '',
      expiration_month: '',
      expiration_year: '',
      account_type: '',
      bank: '',
      agency: '',
      account_number: '',
      updatedTable: false
    });
    window.history.pushState(null, 'TMK System', '/dashboard/index');
  }

  resetCompanies() {
    this.setState({ companies: [] });
  }

  async getCampaigns(company_id) {
    let { user_id } = this.state;
    try {
			let q = await axios.get(`${config.baseUrl}campain/all/${company_id}/${user_id}`);
      if (q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({
        campaigns: q.data.data
      });
    } catch (error) {
      this.error();
    }
  }

	async getResults(company_id) {
		let { user_id } = this.state;
		let yes = [], no = [];
		try {
			let q = await axios.get(`${config.baseUrl}callstatus/all/${company_id}/${user_id}`);
      if (q.data.codeError) {
        this.setState({
          yesList: [],
          noList: []
        });
        return this.errorCustom('Esta organização não possui eventos de resultado');
      }
      if(q.data.data.length > 0) {
        q.data.data.forEach(el => {
          if (el.effective) {
            yes.push(el);
          } else {
            no.push(el);
          }
          this.setState({
            yesList: yes,
            noList: no
          });
        });
      } else {
        this.setState({
          yesList: [],
          noList: []
        });
        return swal({
					type: "info",
					title: 'Esta organização não possui eventos de resultado'
				});
      }
		} catch (err) {
      console.log(err);
			return this.error();
		}
	}

  async getContactabilities(id) {
		let { user_id } = this.state;
		try {
			let q = await axios.get(`${config.baseUrl}contactability/all/${id}/${user_id}`);
      if (q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({ contactability: q.data.data });
      swal.close();
		} catch (err) {
			return this.error();
		}
	}

  async refreshClientData () {
    let { client_id, user_id } = this.state;
    try {
      let q = await axios.get(`${config.baseUrl}client/view/${client_id}/${user_id}`);
      if (q.data.error) return this.errorCustom(q.data.errorMessage);
      let { birth_date, city, cpf, email, first_name, last_name,
        phone, state, sex, cep, address, urbanization, complement, number, type, assigned, user_email } = q.data.data.client;
      this.getNoOrgs(q.data.data.client.id);
      this.setState({
        email,
        sex,
        firstName: first_name,
        lastName: last_name,
        phone,
        company_id: '',
        cpf,
        address,
        birth_date: moment(birth_date).format('YYYY-MM-DD'),
        city,
        cep,
        state,
        urbanization,
        complement,
        number,
        type,
        assigned,
        user_email,
        companies: q.data.data.companies
      });
    } catch (err) {
      console.log(err)
      this.error();
    }
  }
	
	clearCampaign () {
		this.setState({ campaign: '' });
	}
  
  async getLead(e) {
    if(e) {
      e.preventDefault();
    }
		try {
      swal.showLoading();
      var em = this.props.em;
      var email = em != null ? em : this.state.email;
      var user_id = Auth.getUserId();
      if(email == '') {
        return false;
      }
      let q = await axios.get(`${config.baseUrl}client/search/${email}/${user_id}`);
      
			if (q.data.codeError === '401: Não autorizado.') {
        this.errorCustom(q.data.error);
      } else if(q.data.codeError == '404: Nao encontrado.'){
          this.setState({
            display: 'none',
            display2: 'block'
          });
          this.getOrgs();
          return swal.close();
      } else {
        this.mountContactLead(q.data.data.companies, q.data.data.client, q.data.data.firstCompany);
      }
		} catch (err) {
      console.log(err)
			this.error();
		}
  }

  
  async mountContactLead (companies, data, firstCompany) {
    let fecha;
    this.getCampaigns(firstCompany);
    this.getCancels(firstCompany);
    this.getContactabilities(firstCompany);
    this.getResults(firstCompany);
    if (data.birth_date !== null) fecha = data.birth_date.split(' ');
    else fecha = '';
    this.getNoOrgs(data.id);
    this.setState({
      display: 'none',
      display3: 'block',
      display4: 'block',
      client_id: data.id,
      email: data.email,
      sex: data.sex,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      cpf: data.cpf,
      address: data.address,
      birth_date: fecha[0],
      city: data.city,
      state: data.state,
      cep: data.cep,
      urbanization: data.urbanization,
      complement: data.complement,
      number: data.number,
      type: data.type,
      assigned: data.assigned,
      user_email: data.user_email,
      companies,
      company_id: firstCompany
    });
    swal.close();
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
  handleChangeCampaign(event) {
    this.setState({ [event.target.name]: event.target.value });
    if(event.target.value != '') {
      this.getSuscriptions(event.target.value);
    } else {
      this.setState({ suscriptions: [] });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeCompany(event) {
    this.setState({ [event.target.name]: event.target.value });
    if(event.target.value != '') {
      swal.showLoading();
      this.getCampaigns(event.target.value);
      this.getContactabilities(event.target.value);
      this.getResults(event.target.value);
      this.getCancels(event.target.value);
    } else {
      this.setState({
        campaigns: [],
        contactability: [],
        yesList: [],
        noList: []
      })
    }
  }
  async createClient(e) {
		e.preventDefault();
    swal.showLoading();
		let { email, cpf, firstName, lastName, sex, phone, birth_date, address,
      city, cep, state, company_id, user_id, urbanization, complement, number,type } = this.state;
    try {
      let q = await axios.post(`${config.baseUrl}client/add`, {
        email,
        first_name: firstName,
        last_name: lastName,
        sex,
        phone,
        company_id,
        cpf,
        birth_date,
        address,
        city,
        state,
        cep,
        user_id,
        urbanization,
        complement,
        number,
        type,
      });
      if (q.data.codeError) return this.errorCustom(q.data.error);
      await this.mountContactLead (q.data.data.companies, q.data.data.client, q.data.data.firstCompany);
      this.setState({ display2: 'none' });
      this.successMessage(q.data.data.sms);
    } catch (error) {
      return this.error();
    }
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
  async getNoOrgs(client_id) {
    var user_id = Auth.getUserId();
    try {
      let q = await axios.get(`${config.baseUrl}client/without_companies/${client_id}/${user_id}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({ noOrgs: q.data.data });
    } catch(error) {
      return this.error()
    }  
  }

  async getCancels(id) {
    var user_id = Auth.getUserId();
    try {
      let q = await axios.get(`${config.baseUrl}cancelations/all/${id}/${user_id}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({ cancels: q.data.data });
    } catch(error) {
      return this.error()
    }
  }

  async getSuscriptions(campaign) {
    var user_id = Auth.getUserId();
    let { client_id, company_id } = this.state;
    try {
      let q = await axios.get(`${config.baseUrl}donation/clients_subscription/${client_id}/${company_id}/${campaign}/${user_id}`);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.setState({ suscriptions: q.data.data });
    } catch(err) {
      return this.error();
    }
  }

  async updateDonationCartao() {
    let { susId, client_id, codcad, person_type, identification_type, identification, ipca, payment_date, amount, method, card_number, card_type, expiration_month, expiration_year, ano_cobro, mes_cobro } = this.state;
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

      if(validacion == true) {
        swal.showLoading();
        let user_id = Auth.getUserId();
        var datos = {
          donation_id: susId, client_id, user_id,
          codcad, person_type, identification_type, identification, ipca, payment_date, amount, method, card_number, card_type, expiration_month, expiration_year, monthly_year_payment: `${mes_cobro}-${ano_cobro}`
        }
        try {
          let q = await axios.put(`${config.baseUrl}donation/update_donation`, datos);
          if(q.data.codeError) return this.errorCustom(q.data.error);
          this.clearEdit();
          this.setState({ updatedTable: !this.state.updatedTable });
          this.openModal3();
          return this.successMessage(q.data.data);
        } catch(er) {
          return this.error()
        }
      } else {
        this.errorCustom('Cartão Expirado');
      }
    } else {
      this.errorCustom('Data de validade inválida');
    }
  }

  async updateDonationConta() {
    swal.showLoading();
    let user_id = Auth.getUserId(); 
    let { susId, client_id, codcad, person_type, identification_type, identification, ipca, payment_date, amount, method, account_number, account_type, bank, agency, mes_cobro, ano_cobro } = this.state;
    var datos = {
      donation_id: susId, client_id, user_id,
      codcad, person_type, identification_type, identification, ipca, payment_date, amount, method, account_number, account_type, bank, agency, monthly_year_payment: `${mes_cobro}-${ano_cobro}`
    }
    try {
      let q = await axios.put(`${config.baseUrl}donation/update_donation`, datos);
      if(q.data.codeError) return this.errorCustom(q.data.error);
      this.clearEdit();
      this.setState({ updatedTable: !this.state.updatedTable });
      this.openModal3();
      return this.successMessage(q.data.data);
    } catch(er) {
      return this.error()
    }
  }
  render() {
		let { display4, display3, client_id, display, display2, sex, firstName,
			lastName, email, phone, cpf, birth_date, city, state,
			cep, campaign, address,
      campaigns, modal, user_id, company_id, orgs, company_name, urbanization, complement, number, type, contactability, yesList, noList, assigned, user_email, companies, modal2, noOrgs, suscriptions, cancels, modal3, susId, 
      codcad, person_type, identification_type, identification, ipca, amount, payment_date,
      method, displayEdit, display2Edit, card_type, card_number, expiration_month, expiration_year, account_type, bank, agency, account_number, updatedTable, ano_cobro, mes_cobro } = this.state;
    let date = new Date(), campaignsList = [], contactabilityList = [], yesL = [], noL = [], orgsList = [], companiesList = [], cancelsList = [], suscripciones = [];
		let maxYear = `${date.getFullYear()-18}-${date.getMonth()+1}-${date.getDate()}`;
    
		const historicalBox = () => {
      if(display3 === 'block') {
        return <Historical id={client_id} user_id={user_id} />;
      }
    };
    
		if (campaigns.length > 0) {
			campaignsList = campaigns.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			campaignsList = null;
    }
    if (contactability.length > 0) {
			contactabilityList = contactability.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			contactabilityList = null;
		}
    if (yesList.length > 0) {
			yesL = yesList.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			yesL = null;
    }
    if (noList.length > 0) {
			noL = noList.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			noL = null;
    }
    if (orgs.length > 0) {
			orgsList = orgs.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			orgsList = null;
    }
    if (companies.length > 0) {
			companiesList = companies.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			companiesList = null;
    }

    if (cancels.length > 0) {
			cancelsList = cancels.map(el => {
				return <option value={el.id} key={el.id}>{el.name}</option>;
			});
		} else {
			cancelsList = null;
    }

    if (suscriptions.length > 0) {
			suscripciones = suscriptions.map(el => {
				return <option value={el.id} key={el.id}>{el.amount}R$ - {el.method} - {el.created_at}</option>;
			});
		} else {
			suscripciones = null;
    }
    
    const campaignsBox = () => {
      if (display3 === 'block') {
        return <Campaigns handleChangeCampaign={this.handleChangeCampaign} campaign={campaign}
          campaignsList={campaignsList} handleCancel={this.handleCancel}
          openModal={this.openModal} />;
      }
		};
		const searchLeadBox = () => {
			return <SearchLead  getLead={this.getLead} handleChange={this.handleChange}
        email={email} company_id={company_id} company_name={company_name} />;
		};
		const createClientBox = () => {
			return <CreateClient orgsList={orgsList} handleCancel={this.handleCancel} handleChange={this.handleChange}
        email={email} cpf={cpf} firstName={firstName} lastName={lastName}
        sex={sex} phone={phone} birth_date={birth_date}
        address={address} city={city} cep={cep}
        state={state} maxYear={maxYear} createClient={this.createClient} company_id={company_id} company_name={company_name} urbanization={urbanization} complement={complement} number={number} type={type} />;
		};
		const editClientBox = () => {
			if (display3 === 'block') {
				return <EditClient user_id={user_id} openModal={this.openModal} handleChange={this.handleChange} resetCompanies={this.resetCompanies}
          email={email} cpf={cpf} firstName={firstName} lastName={lastName}
          sex={sex} phone={phone} birth_date={birth_date}
          address={address} city={city} cep={cep}
          state={state} maxYear={maxYear} refreshClientData={this.refreshClientData} modal={modal} client_id={client_id} errorCustom={this.errorCustom} successMessage={this.successMessage} error={this.error} urbanization={urbanization} complement={complement} number={number} type={type} orgs={orgs} company_id={company_id} company_name={company_name}/>;
			}
    };
    const addAssociation = () => {
      if(display4 == 'block') {
        return <AddAssociation modal2={modal2} client_id={client_id} user_id={user_id} openModal2={this.openModal2} refreshClientData={this.refreshClientData} errorCustom={this.errorCustom} error={this.error} successMessage={this.successMessage} noOrgs={noOrgs} companies={companies}/>
      }
    };
		const leadDataBox = () => {
      if (display3 === 'block') {
        return <LeadData openModal={this.openModal} openModal2={this.openModal2} handleChangeCompany={this.handleChangeCompany} refreshClientData={this.refreshClientData} company_id={company_id} successMessage={this.successMessage} error={this.error} errorCustom={this.errorCustom} user_email={user_email} assigned={assigned} companiesList={companiesList} sex={sex} client_id={client_id}
          email={email} cpf={cpf} firstName={firstName} lastName={lastName}
          sex={sex} phone={phone} birth_date={birth_date}
          address={address} city={city} cep={cep}
          state={state} urbanization={urbanization} complement={complement} number={number} type={type} />;
      }
    };

		const noContactedBox = () => {
			if (display3 === 'block') {
				return <NoContacted id={client_id} campaign={campaign} user_id={user_id}
					company_id={company_id} error={this.error} errorCustom={this.errorCustom}
					successMessage={this.successMessage} clearCampaign={this.clearCampaign} contactabilityList={contactabilityList} />;
			}
		};
		const contactedBox = () => {
			if (display3 === 'block') {
				return <Contacted id={client_id} campaign={campaign} user_id={user_id}
					company_id={company_id} error={this.error} errorCustom={this.errorCustom}
          successMessage={this.successMessage} clearCampaign={this.clearCampaign}
          refreshClientData={this.refreshClientData} yesList={yesL} noList={noL} />;
			}
    };

    const DonationBox = () => {
        if(display3 === 'block') {
          return <Donation id={client_id} campaign={campaign} user_id={user_id} 
            company_id={company_id} error={this.error} errorCustom={this.errorCustom} successMessage={this.successMessage} handleChangeValueTable={this.handleChangeValueTable} getSuscriptions={this.getSuscriptions}/>
        }
    };

    const cancelsBox = () => {
      if(display3 === 'block') {
        return <Cancels id={client_id} campaign={campaign} user_id={user_id} 
          company_id={company_id} error={this.error} errorCustom={this.errorCustom} successMessage={this.successMessage} suscripciones={suscripciones} cancelsList={cancelsList} clearCampaign={this.clearCampaign}/>
      }
    }

    const suscriptionsBox = () => {
      if(display3 === 'block') {
        return <Suscriptons id={client_id} openModal3={this.openModal3} sendToModal={this.sendToModal} value={updatedTable}/>
      } 
    }

    const editDonationBox = () => {
      if(display3 === 'block') {
        return <EditDonation modal3={modal3} client_id={client_id} user_id={user_id} openModal3={this.openModal3} errorCustom={this.errorCustom} error={this.error} successMessage={this.successMessage} suscription_id={susId} codcad={codcad} person_type={person_type} identification_type={identification_type} identification={identification} ipca={ipca}amount={amount} payment_date={payment_date} method={method} displayEdit={displayEdit} display2Edit={display2Edit} card_type={card_type} card_number={card_number} expiration_month={expiration_month} expiration_year={expiration_year} account_type={account_type} bank={bank} agency={agency} account_number={account_number} ano_cobro={ano_cobro} mes_cobro={mes_cobro}
        handleChange={this.handleChange} handleChangeTypeEdit={this.handleChangeTypeEdit} handleChangeIpcaEdit={this.handleChangeIpcaEdit} updateDonationCartao={this.updateDonationCartao} updateDonationConta={this.updateDonationConta}/>
      }
    }

    return (
      <Container>
        <Row>
          <Col xs="6" sm="6" md="6" xl="6" style={{display: display3}}>
						{ campaignsBox() }
            { leadDataBox() }
            { DonationBox() }
					</Col>
					<Col xs="6" sm="6" md="6" xl="6" style={{display: display3}}>
						{ noContactedBox() }
            { contactedBox() }
            { cancelsBox() }
            { suscriptionsBox() }
          </Col>
				</Row>
				<Row style={{display: display === 'block' || display2 === 'block' ? 'block' : 'none'}}>
          <Col xs="6" sm="6" md="6" xl="6" className="mb-4">
						<Card className="box-shadow mb-4">
              <CardBody style={{display: display}} className="animated fadeIn">
                { searchLeadBox() }
              </CardBody>
              <CardBody style={{display: display2}} className="animated fadeIn">
								{ createClientBox() }
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs="12" sm="12">
            { historicalBox() }
          </Col>
        </Row>
        <Row>
          { editClientBox() }
        </Row>
        <Row>
          { addAssociation() }
        </Row>
        <Row>
          { editDonationBox() }
        </Row>
      </Container>
    );
  }
}
