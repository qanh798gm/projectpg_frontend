import React, { Component } from 'react'
import {
    InputGroup, Input,
    Container, Row, Col, Button
} from 'reactstrap'
import { connect } from 'react-redux'
import axios from '../../../../axios'

class LoginContent extends Component {
    state = {
        email: '',
        password: '',
        token: '',
        isLoggedIn: false
    }

    postDataHandler = () => {
        const account = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('/users/login', account)
            .then(response => {
                console.log(response.data)
                if (response.data.token.length > 0) {


                    axios.get(`/users/cart-detail`,
                    { headers: { "Authorization": `Bearer ${response.data.token}` } })
                    .then(response => {
                        if (response.data) {
                            response.data.cart.map(item => {
                                response.data.cartDetail.map(newItem => {
                                    if (item.id === newItem._id) {
                                        Object.assign(newItem, { quantity: item.quantity })
                                    }
                                })
                            })
                            console.log(response.data.cartDetail)
                            this.props.setCart(response.data.cartDetail)
                        }
                        else {
                            console.log('cart error')
                        }
                    })


                    this.props.setUserValue(response.data)
                    this.props.history.push('/')
                    console.log(response.data.token)
                }
                else {
                    console.log('error')
                }
            })
    }
    render() {
        return (
            <Container>
                <Row>
                    <Col sm={{ size: '6', offset: 3 }}>
                        <br />
                        <center><h2>Login Form</h2></center>
                        <br />
                        <InputGroup>
                            <Input
                                onChange={(event) => this.setState({ email: event.target.value })}
                                placeholder="Email" type="text" />
                        </InputGroup>
                        <br />
                        <InputGroup>
                            <Input
                                onChange={(event) => this.setState({ password: event.target.value })}
                                placeholder="Password" type="password" />
                        </InputGroup>
                        <br />
                        <center><Button onClick={this.postDataHandler} color="primary">Submit</Button></center>
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        email: state.email,
        _id: state._id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUserValue: (data) => dispatch({
            type: 'SET_USER',
            payload: {
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                token: data.token,
                cart: data.cart,
                isLoggedIn: true
            }
        }),
        setCart: (data) => dispatch({
            type: 'SET_CART',
            payload: {
                cart: data
            }
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContent)