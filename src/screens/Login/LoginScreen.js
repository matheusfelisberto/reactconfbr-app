// @flow

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

import styled from 'styled-components/native';
import { withNavigation, SwitchNavigator } from 'react-navigation';

import Header from '../../components/common/Header';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoginMutation from './LoginEmailMutation';

import { IMAGES } from '../../utils/design/images';
import { LoggedAppRouter } from '../../navigation/Router';
import { ROUTENAMES } from '../../navigation/RouteNames';
import ErrorModal from '../../components/ErrorModal';

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.primaryColor}
  padding: 20px;
`;

const ForgotButton = styled.TouchableOpacity`
`;

const ForgotText = styled.Text`
  color: ${props => props.theme.colors.secondaryColor};
  font-weight: bold;
  font-size: 20px;
  text-align: right;
`;

const TextWrapper = styled.View`
  flex: 3;
`;

const BigText = styled.Text`
  color: ${props => props.theme.colors.secondaryColor};
  font-size: 36px;
  font-weight: bold;
  padding: 20px 0 20px 0;
`;

const ButtonsWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
  padding-horizontal: 5;
  z-index: 3;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.primaryColor};
  font-size: 24px;
  font-weight: bold
`;

const BottomFixedReactLogo = styled.Image.attrs({
  source: IMAGES.REACT,
})`
  width: 303;
  height: 271.39;
  position: absolute;
  right: -100;
  bottom: -90;
  tint-color: rgba(0,0,0,0.1);
  z-index: 1;
`;

const Arrow = styled.Image.attrs({
  source: IMAGES.ARROW,
})`
  width: 30;
  height: 24;
  margin-top: 5;
  tint-color: black;
`;

type Props = {};

type State = {
  login: string,
  password: string,
  errorText: string,
};

@withNavigation
export default class LoginScreen extends Component<any, Props, State> {
  state = {
    login: '',
    password: '',
    errorText: '',
  };

  handleLoginPress = async () => {
    const { email, password } = this.state;
    const { navigation } = this.props;

    if (!email || !password) {
      return this.setState({
        errorText: 'Favor preencher todos os campos',
      });
    }

    const input = {
      email,
      password,
    };

    const onCompleted = async res => {
      const response = res && res.LoginEmail;
      const token = response && response.token;
      console.log('login sucess res', res);
      if (response && response.error) {
        console.log('Login onCompleted error', response.error);
        this.setState({
          errorText: response.error,
        });
      } else if (token) {
        await AsyncStorage.setItem('token', token);
        navigation.navigate(ROUTENAMES.LOGGED_APP);
      }
    };

    const onError = () => {
      console.log('Register onError');

      this.setState({
        errorText: 'Verifique sua conexão com a internet e tente novamente',
      });
    };

    LoginMutation.commit(input, onCompleted, onError);
  };

  closeModal = () => {
    this.setState({
      errorText: '',
    });
  };

  render() {
    const { navigation } = this.props;
    const { errorText } = this.state;

    return (
      <Wrapper>
        <Header>
          <ForgotButton onPress={() => navigation.pop()}>
            <Arrow />
          </ForgotButton>
          <ForgotButton>
            <ForgotText>Forgot Password</ForgotText>
          </ForgotButton>
        </Header>
        <TextWrapper>
          <BigText>Login</BigText>
          <Input
            placeholder="Email"
            onChangeText={text => this.setState({ email: text })}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            onChangeText={text => this.setState({ password: text })}
          />
        </TextWrapper>
        <ButtonsWrapper>
          <Button fill onPress={this.handleLoginPress}>
            <ButtonText>Login</ButtonText>
          </Button>
        </ButtonsWrapper>
        <BottomFixedReactLogo />
        <ErrorModal
          visible={errorText ? true : false}
          errorText={errorText}
          onRequestClose={this.closeModal}
        />
      </Wrapper>
    );
  }
}
