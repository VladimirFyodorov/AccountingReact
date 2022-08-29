import React, {Component, useState} from 'react';
import './login-form.css';
import WithService from '../hoc';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {checkMark: '', email: '', first_name: '', id: '', last_name: '', username: ''};
    this.onInput = this.onInput.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.clearState = this.clearState.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
  }

  onInput(data) {
    this.setState(() => {
      return {...data};
    });
  }

  clearState(data) {
    let emptyState = {...this.state};

    for (const key of Object.keys(emptyState)) {
      emptyState[key] = '';
    }

    this.setState({...emptyState, ...data});
  }

  checkEmail(email) {
    this.props.Service.checkEmail({email})
      .then(res => {
        if (res.id > 0) {
          this.setState({...res, email, checkMark: true});
        } else {
          this.clearState({email, errorMessage: this.state.errorMessage || ''});
        }
      });
  }


  onSubmitEmail() {
    const email = this.state.email;
    this.props.Service.checkEmail({email})
      .then(res => {
        if (res.id > 0) {
          this.setState({...res, checkMark: true, userIsPreValidated: true, errorMessage: ''});
        } else {
          this.clearState({email, errorMessage: 'Wrong email'});
        }
      });
  }

  onSubmitPassword() {
    const {username, password} = this.state;
    this.props.Service.login({username, password})
      .then(res => {
        if (res.message == 'Logged in') {
          sessionStorage.setItem('status','loggedIn');
          window.location.replace(`${location.protocol}//${location.host}/home`);
        } else {
          this.setState({errorMessage: 'Wrong password'});
        }
      })
      .catch(() => this.setState({errorMessage: 'Wrong password'}));
  }

  render() {
    if (!this.state.userIsPreValidated) {
      return (
        <FormWithEmail
          state={this.state}
          onInput={this.onInput}
          checkEmail={this.checkEmail}
          onSubmitEmail={this.onSubmitEmail}
        />
      );
    }
    return (
      <FormWithPassword
        state={this.state}
        onInput={this.onInput}
        onSubmitPassword={this.onSubmitPassword}
      />
    );
  }
}

export default WithService()(LoginForm);



const FormWithEmail = ({state, onInput, onSubmitEmail, checkEmail}) => {
  return (
    <div className="form">
      <h1>Sign in</h1>
      <h2>Continue with email</h2>
      <h3>New user? 
        <a href="#" className="link">Create an account</a>
      </h3>
      <div className="input-box">
        <h5 className="input-hint">Email address</h5>
        <div className="input">
          <input 
            className="login" 
            type="text" 
            value={state.email || ''} 
            onChange={(e) => {
              onInput({email: e.target.value});
              checkEmail(e.target.value);
            }}/>
          {state.checkMark?<div className="checkMark checkMark-green"></div>:<></>}
        </div>
      </div>
      {state.errorMessage?<h5 className='errorMsg'>{state.errorMessage}</h5>:<></>}
      <button className="btn-login" type="submit" onClick={onSubmitEmail}>Continue</button>
    </div>
  );
};


const FormWithPassword = ({state, onInput, onSubmitPassword}) => {
  const [seePassword, toggleSeePassword] = useState(false);
  const inputType = seePassword? 'text': 'password';
  const biEyeClass = seePassword? 'bi bi-eye': 'bi bi-eye-slash';

  return (
    <div className="form">
      <h1>Enter your password</h1>
      <div className="login-user-box">
        <div className="login-user-box-circle">
          {state.first_name.slice(0, 1) + state.last_name.slice(0, 1)}
        </div>
        <div className="login-user-box-info">
          <h5>{`${state.first_name} ${state.last_name}`}</h5>
          <h5>{state.email}</h5>
        </div>
      </div>
      <div className="input-box">
        <h4 className="input-hint">Password</h4>
        <div className="input">
          <input 
            type={inputType}
            className="login"
            value={state.password || ''}
            onChange={(e) => onInput({password: e.target.value})}/>
          <div
            id='see-password-icon'
            className={biEyeClass}
            onClick={() => toggleSeePassword((prev) => !prev)}></div>
        </div>
      </div>
      {state.errorMessage?<h5 className='errorMsg'>{state.errorMessage}</h5>:<></>}
      <button className="btn-login" type="submit" onClick={onSubmitPassword}>Continue</button>
    </div>
  );
};