import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  TouchableHighlight,
} from 'react-native';

import itypeof from 'itypeof';

import Icon from 'react-native-vector-icons/FontAwesome';

const FBLoginManager = NativeModules.MFBLoginManager;

const styles = StyleSheet.create({
  login: {
    flex: 1,
    backgroundColor: '#3B5998',
    padding: 10,
    alignItems: 'center'
  },
  whiteFont: {
    color: 'white'
  }
});

const statics = {
  loginText: 'Cadastrar com Facebook',
  logoutText: 'Sair do Facebook'
};

class FBLogin extends Component {
  constructor (props) {
    super(props);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this._handleEvent = this._handleEvent.bind(this);
    this._getButtonView = this._getButtonView.bind(this);
    this.getChildContext = this.getChildContext.bind(this);
    this._onFacebookPress = this._onFacebookPress.bind(this);

    this.state = {
      statics:statics,
      isLoggedIn: false,
      buttonText: statics.loginText
    };
  }

  componentDidMount(){
    FBLoginManager.setLoginBehavior(this.props.loginBehavior)
      .then((behaviour)=>{
        console.log(`FbLogin: using ${behaviour.name} behaviour`, behaviour)
      });
    FBLoginManager.getCredentials((err, data) => {
      if (!this.mounted) return;
      if(data &&
        itypeof(data.credentials) === 'object' &&
        itypeof(data.credentials.token) === 'string' &&
        data.credentials.token.length > 0) {
        this.setState({isLoggedIn:true, buttonText: this.state.statics.logoutText});
      } else {
        this.setState({isLoggedIn:false, buttonText: this.state.statics.loginText});
      }
      this._handleEvent(null,data);
    });
    this.mounted = true;
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  static childContextTypes = {
    isLoggedIn: PropTypes.bool,
    login: PropTypes.func,
    logout: PropTypes.func,
    props: PropTypes.shape({})
  }

  getChildContext () {
    return {
      isLoggedIn: this.state.isLoggedIn,
      login: this.login,
      logout: this.logout,
      props: this.props
    };

  }

  login(permissions) {
    FBLoginManager.loginWithPermissions(
      permissions || this.props.permissions,
      (err,data) => this._handleEvent(err,data)
    );
  }

  logout() {
    FBLoginManager.logout((err, data) => this._handleEvent(err, data));
  }

  _handleEvent(e, data) {
    const result = e || data;
    if(result.type === 'success' && result.profile){
      try{
        result.profile = JSON.parse(result.profile)
      } catch (err) {
        console.warn('Could not parse facebook profile: ', result.profile);
        console.error(err);
      }
    }

    if(result.eventName === 'onLogin' || result.eventName === 'onLoginFound'){
      this.setState({isLoggedIn:true, buttonText: this.state.statics.logoutText});
    } else if (result.eventName === 'onLogout'){
      this.setState({isLoggedIn:false, buttonText: this.state.statics.loginText});
    }

    if(result.eventName && this.props.hasOwnProperty(result.eventName)){
      const event = result.eventName;
      delete result.eventName;
      console.log('Triggering \'%s\' event', event)
      this.props[event](result);
    } else {
      console.log('\'%s\' Event is not defined or recognized', result.eventName)
    }
  }

  _onFacebookPress() {
    let permissions = [];
    if( itypeof(this.props.permissions) === 'array'){
      permissions = this.props.permissions;
    }

    if(this.state.isLoggedIn){
      this.logout()
    }else{
      this.login(permissions)
    }
  }

  _getButtonView () {
    const buttonText = this.props.facebookText ? this.props.facebookText:this.state.buttonText;
    return (this.props.buttonView)
      ? this.props.buttonView
      : (
        <View style={{flex: 1, flexDirection: 'row', justifyContent:"space-around",  padding:5 }}>
          <Icon name={'facebook'} style={[ { color: 'white', fontSize: 24 }]} />
          <Text style={{color:  'white', fontSize: 18, textAlign: "center" }}>{buttonText}</Text>
        </View>
      );
  }

  render(){
    return (
      <TouchableOpacity 
        style={[{ margin: 15,
          backgroundColor: whiteColor, borderRadius: 10, marginBottom: 0, padding: 6,
          borderColor: '#3E9B91',
          borderWidth: 1, marginBottom: 2, 
          backgroundColor: "#3b5998", 
          flexDirection:'row', 
          height: 50 }]}
        onPress={this._onFacebookPress} >
          {this._getButtonView()}
      </TouchableOpacity>
    )
  }
}

module.exports =  {
  FBLogin,
  FBLoginManager
};
