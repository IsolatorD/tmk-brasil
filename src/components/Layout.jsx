import React, { Component } from 'react';
import { Dashboard, Header, Sidebar } from 'react-adminlte-dash';
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, Form, Input, Button, Label, FormGroup, Row, Col, Alert } from "reactstrap";
import { inactividad } from "../helpers";
import swal from 'sweetalert2';
import AuthService from '../AuthService';
import withAuth from './withAuth';
import RouterView from './routerViews';
import config from "../config";
import $ from 'jquery';
import axios from 'axios';
const Auth = new AuthService();

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            isCompanyAdmin: false,
            displayAlert: 'none',
            modal: false,
            username: '',
            mini: false,
            menu0: 'Dashboard',
            menu1: 'Contactar lead',
            menu3: 'Atribuições',
            menu5: 'Painel do Usuários'

        };
        this.handleHeader = this.handleHeader.bind(this);
        this.showModal = this.showModal.bind(this);
        this.changePass = this.changePass.bind(this);
        this.handleSidebar = this.handleSidebar.bind(this);
    }

    componentWillMount() {
        var admin = Auth.isAdmin();
        var companyAdmin = Auth.isCompanyAdmin();
        if(admin) {
            this.setState({
                username: Auth.getUserInfo(),
                isAdmin: admin,
            });
        } else if(companyAdmin){
            this.setState({
                isCompanyAdmin: companyAdmin,
                username: Auth.getUserInfo()
            });
        } else {
            this.setState({
                isAdmin: admin,
                isCompanyAdmin: companyAdmin,
                username: Auth.getUserInfo()
            });
        }
    }

    showModal() {
        if(this.state.modal ===false) {
            this.setState({
                displayAlert: 'none'
            });
        }
        this.setState({
            modal: !this.state.modal
        });
    }
    
    changePass(e) {
        e.preventDefault();
        if($('#newPassConfirm').val() !== $('#newPass').val()) {
            this.setState({
                displayAlert: 'block'
            });
        } else {
            this.setState({
                displayAlert: 'none'
            });
            swal.showLoading();
            var userId = Auth.getUserId();
            var form = document.getElementById('formPass');
            var formData = new FormData(form);
            formData.append('user_id', userId);
            axios.put(config.baseUrl+'user/update_pass', formData)
                .then( res => {
                    if(res.data.codeError === false) {
                        swal({
                            type: 'success',
                            title: res.data.data
                        });
                        this.showModal();
                    } else {
                        swal({
                            type: 'info',
                            title: res.data.error
                        });
                    }
                })
                .catch( err => {
                    console.log(err);
                });
        }
    }

    componentDidMount() {
        console.clear();
        $('.biMfWR').click(()=>{
            if(this.state.mini === false) {
                this.setState({
                    mini: true,
                    menu0: '',
                    menu1: '',
                    menu3: '',
                    menu5: ''
                });
            } else {
                this.setState({
                    mini: false,
                    menu0: 'Dashboard',
                    menu1: 'Contactar lead',
                    menu3: 'Atribuições',
                    menu5: 'Painel do Usuários'
                });
            }
        });
        inactividad();
    }

    handleSidebar() {
        if(this.state.isAdmin) {
            return <Sidebar.Menu key="1">
                    <Link to="/dashboard/dash" className="links">
                        <Sidebar.Menu.Item icon={{className : 'ion-podium'}} title={this.state.menu0} />
                    </Link>
                    <Link to="/dashboard/me" className="links">
                            <Sidebar.Menu.Item icon={{className : 'ion-podium'}} title={this.state.menu5} />
                        </Link>
                    <Link to="/dashboard/index" className="links">
                        <Sidebar.Menu.Item icon={{className : 'fa fa-phone'}} title={this.state.menu1} />
                    </Link>
                    <Sidebar.Menu.Item icon={{className : 'fa fa-user'}} title='Administrador'>
                        <Sidebar.Menu.Item icon={{className: 'fa fa-building'}} title="Organizações">
                            <Link to="/dashboard/admin/company/list" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title="Listar Organizações"/>
                            </Link>
                            <Link to="/dashboard/admin/company/new" className="links">
                                <Sidebar.Menu.Item icon={{className : 'fa fa-plus'}} title='Nova organização'/>
                            </Link>
                        </Sidebar.Menu.Item>
                        <Sidebar.Menu.Item icon={{className : 'fa fa-users'}} title="Usuários">
                            <Link to="/dashboard/admin/user/list" className="links">
                                <Sidebar.Menu.Item icon={{className : 'fa fa-list-ul'}} title='Listar Usuários'/>
                            </Link>
                            <Link to="/dashboard/admin/user/new" className="links">
                                <Sidebar.Menu.Item icon={{className : 'fa fa-user-plus'}} title='Adicionar Usuário'/>
                            </Link>
                        </Sidebar.Menu.Item>
                        <Sidebar.Menu.Item icon={{className: 'fa fa-tag'}} title='Funções do Usuário'>
                            <Link to="/dashboard/admin/roles/list" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Listar Funções'/>
                            </Link>
                            <Link to="/dashboard/admin/roles/new" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-plus'}} title='Adicionar papel'/>
                            </Link>
                        </Sidebar.Menu.Item>
                        <Link to="/dashboard/admin/logs" className="links">
                            <Sidebar.Menu.Item icon={{className : 'ion-clipboard'}} title='Auditoría' />
                        </Link>
                    </Sidebar.Menu.Item>
                    <Link to="/dashboard/admin/assignments/asign" className="links">
                        <Sidebar.Menu.Item icon={{className: 'fa fa-tag'}} title={this.state.menu3}/>
                    </Link>
                    <Sidebar.Menu.Item icon={{className: 'ion-archive'}} title='Exportações'>
                        <Link to="/dashboard/export/new" className="links">
                            <Sidebar.Menu.Item icon={{className: 'fa fa-plus'}} title='Novo'/>
                        </Link>
                        <Link to="/dashboard/export/history" className="links">
                            <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Histórico'/>
                        </Link>
                        <Link to="/dashboard/export/recusas" className="links">
                            <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Recusas'/>
                        </Link>
                    </Sidebar.Menu.Item>
                    <Sidebar.Menu.Item icon={{className : 'fa fa-sign-out'}} title='Saída' onClick={this.handleLogout.bind(this)}/>
                </Sidebar.Menu>
        } else if(this.state.isCompanyAdmin){
            return <Sidebar.Menu key="2">
                        <Link to="/dashboard/dash" className="links">
                            <Sidebar.Menu.Item icon={{className : 'ion-podium'}} title={this.state.menu0} />
                        </Link>
                        <Link to="/dashboard/me" className="links">
                            <Sidebar.Menu.Item icon={{className : 'ion-podium'}} title={this.state.menu5} />
                        </Link>
                        <Link to="/dashboard/index" className="links">
                            <Sidebar.Menu.Item icon={{className : 'fa fa-phone'}} title={this.state.menu1} />
                        </Link>
                        <Sidebar.Menu.Item icon={{className : 'fa fa-user'}} title='Administrador'>
                            <Sidebar.Menu.Item icon={{className : 'fa fa-users'}} title="Usuários">
                                <Link to="/dashboard/admin/user/list" className="links">
                                    <Sidebar.Menu.Item icon={{className : 'fa fa-list-ul'}} title='Listar Usuários'/>
                                </Link>
                                <Link to="/dashboard/admin/user/new" className="links">
                                    <Sidebar.Menu.Item icon={{className : 'fa fa-user-plus'}} title='Adicionar Usuario'/>
                                </Link>
                            </Sidebar.Menu.Item>
                            <Sidebar.Menu.Item icon={{className: 'fa fa-tag'}} title='Funções do Usuário'>
                                <Link to="/dashboard/admin/roles/list" className="links">
                                    <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Listar Funções'/>
                                </Link>
                                <Link to="/dashboard/admin/roles/new" className="links">
                                    <Sidebar.Menu.Item icon={{className: 'fa fa-plus'}} title='Adicionar papel'/>
                                </Link>
                            </Sidebar.Menu.Item>
                            <Link to="/dashboard/admin/logs" className="links">
                                <Sidebar.Menu.Item icon={{className : 'ion-clipboard'}} title='Auditoría' />
                            </Link>
                        </Sidebar.Menu.Item>
                        <Link to="/dashboard/admin/assignments/asign" className="links">
                            <Sidebar.Menu.Item icon={{className: 'fa fa-tag'}} title={this.state.menu3}/>
                        </Link>
                        <Sidebar.Menu.Item icon={{className: 'ion-archive'}} title='Exportações'>
                            <Link to="/dashboard/export/new" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-plus'}} title='Novo'/>
                            </Link>
                            <Link to="/dashboard/export/history" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Histórico'/>
                            </Link>
                            <Link to="/dashboard/export/recusas" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Recusas'/>
                            </Link>
                        </Sidebar.Menu.Item>
                        <Sidebar.Menu.Item icon={{className : 'fa fa-sign-out'}} title='Saída' onClick={this.handleLogout.bind(this)}/>
                    </Sidebar.Menu>
        } else if(Auth.getRole() === '10'){
            return <Sidebar.Menu key="2">
                        <Link to="/dashboard/dash" className="links">
                            <Sidebar.Menu.Item icon={{className : 'ion-podium'}} title={this.state.menu0} />
                        </Link>
                        <Link to="/dashboard/me" className="links">
                            <Sidebar.Menu.Item icon={{className : 'ion-podium'}} title={this.state.menu5} />
                        </Link>
                        <Link to="/dashboard/index" className="links">
                            <Sidebar.Menu.Item icon={{className : 'fa fa-phone'}} title={this.state.menu1} />
                        </Link>
                        <Link to="/dashboard/admin/assignments/asign" className="links">
                            <Sidebar.Menu.Item icon={{className: 'fa fa-tag'}} title={this.state.menu3}/>
                        </Link>
                        <Sidebar.Menu.Item icon={{className: 'ion-archive'}} title='Exportações'>
                            <Link to="/dashboard/export/new" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-plus'}} title='Novo'/>
                            </Link>
                            <Link to="/dashboard/export/history" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Histórico'/>
                            </Link>
                            <Link to="/dashboard/export/recusas" className="links">
                                <Sidebar.Menu.Item icon={{className: 'fa fa-list-ul'}} title='Recusas'/>
                            </Link>
                        </Sidebar.Menu.Item>
                        <Sidebar.Menu.Item icon={{className : 'fa fa-sign-out'}} title='Saída' onClick={this.handleLogout.bind(this)}/>
                    </Sidebar.Menu>
        } else {
            return <Sidebar.Menu key="2">
                        <Link to="/dashboard/index" className="links">
                            <Sidebar.Menu.Item icon={{className : 'fa fa-phone'}} title={this.state.menu1} />
                        </Link>
                        <Sidebar.Menu.Item icon={{className : 'fa fa-sign-out'}} title='Saída' onClick={this.handleLogout.bind(this)}/>
                    </Sidebar.Menu>
        }
    }

    handleHeader() {
        return <div>
            <Header.Item key="2" onClick={this.showModal} title="Ajustes" iconClass="fa fa-cog"/>
            <Header.Item key="1" onClick={this.handleLogout.bind(this)} title={this.state.username} iconClass="fa fa-sign-out"/>
            </div>
    }

    handleLogout() {
        swal({
            title: '¿Claro que você quer sair?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText:'Sim, vá!'
        })
        .then( result => {
            if(result.value) {
                swal.showLoading();
                var id = Auth.getUserId();
                axios.get(config.baseUrl+'auth/logout/'+id+'/'+window.IP)
                    .then( res => {
                        if(res.data.codeError === false) {
                            localStorage.clear();
                            this.props.history.replace('/');
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    });
            }
        });
    }
    
    render() {
        var logoname = Auth.getUserInfo();
        var logoMini = logoname.charAt(0).toUpperCase();
        const logoLg = this.state.isAdmin ? <span className="TitleAdmin">Administrador</span>: <span className="TitleAdmin">Operador</span>;
        const logoSm = <span>{logoMini}</span>;
        
        const ModalView = () => {
            return(
                <Modal isOpen={this.state.modal} toggle={this.showModal} >
                    <ModalHeader toggle={this.showModal}>Alterar senha</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.changePass} id="formPass">
                            <Row>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label>Nova senha</Label>
                                        <Input type="password" name="password" id="newPass" required/>
                                    </FormGroup>
                                </Col>
                                <Col xs="6" sm="6">
                                    <FormGroup>
                                        <Label>Confirmar senha</Label>
                                        <Input type="password" name="newPassConfirm" id="newPassConfirm" required/>
                                    </FormGroup>
                                </Col>
                                <Col xs="12" sm="12">
                                    <Alert color="danger" style={{display: this.state.displayAlert}}>As senhas não correspondem!</Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <center>
                                        <Button color="success" type="submit">Salvar</Button>
                                        <Button color="danger" className="margin" onClick={this.showModal}>Cancelar</Button>
                                    </center>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                </Modal>
            )
        }
        return (
            <div>
                <Dashboard logoHref="#" navbarChildren={this.handleHeader()} sidebarChildren={this.handleSidebar()} theme="skin-green" logoLg={logoLg} logoSm={logoSm} fixed={true} sidebarMini={true} >
                    <RouterView/>
                    {ModalView()}
                </Dashboard>
            </div>
        ); 
    }
}

export default withAuth(Layout);