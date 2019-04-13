import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Form, Input, CardTitle, Button, FormGroup } from 'reactstrap';
import $ from 'jquery';
import AuthService from '../AuthService';

class Login extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.state = {
            email: '',
            password: ''
        }
        this.verify = this.verify.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillMount(){
        if(this.Auth.loggedIn()) {
            this.props.history.replace('/dashboard/index');
        }
    }
    componentDidMount() {
        this.verify();
        
    }

    verify(e) {
        if($('#email').val() !== '' && $('#password').val() !== '') {
            $('#btnLogin').removeAttr('disabled');
        } else {
            $('#btnLogin').attr('disabled', 'disabled');
        }
    }

    handleChange(e) {
        this.setState({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.Auth.login(this.state.email, this.state.password)
            .then( res => {
                if(res.data.codeError === false) {
                    this.props.history.replace('/dashboard/index');
                }
            })
            .catch( err => {
                console.log(err);
            });
    }

    render() {
        return (
            <Container>
                <center className="centrado" style={{marginTop: '10em'}}>
                    {/*<Row>
                        <Col xs="12" sm="12">
                            <img src="../assets/img/logo.png" alt="Logo" className="login-logo"/>
                        </Col>
                    </Row>*/}
                    <Row>
                        <Col xs="12" sm="12">
                            <Card className="login-card box-shadow">
                                <br/>
                                <center>
                                    <CardTitle className="login-title">
                                        TMK System
                                    </CardTitle>
                                    <span className="login-text">
                                        Entre para iniciar sua sessão
                                    </span>
                                </center>
                                <CardBody>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <FormGroup>
                                                    <Input type="email" name="email" id="email" placeholder="E-mail do usuário" className="login-input" onKeyUp={this.verify} required bsSize="lg" />
                                                </FormGroup>
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <FormGroup>
                                                    <Input type="password" name="password" id="password" placeholder="Password" className="login-input" onKeyUp={this.verify} required onChange={this.handleChange} bsSize="lg" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                    <Button block size="sm" color="primary" id="btnLogin">Sign In</Button>
                                            </Col>
                                        </Row>
                                        <br/>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </center>
            </Container>
        );
    }
}

export default Login;