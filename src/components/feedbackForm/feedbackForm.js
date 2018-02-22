import React from 'react';
import fetch from 'node-fetch';
import Type from 'prop-types';

import Heading from 'arui-feather/heading';
import Checkbox from 'arui-feather/checkbox';
import Select from 'arui-feather/select';
import Input from 'arui-feather/input';
import PhoneInput from 'arui-feather/phone-input';
import EmailInput from 'arui-feather/email-input';
import Textarea from 'arui-feather/textarea';
import Attach from 'arui-feather/attach';
import Button from 'arui-feather/button';
import FormField from 'arui-feather/form-field';

export default class FeedbackForm extends React.Component {
  static propTypes = {
    selectOption: Type.array,
    onSend: Type.func
  };

  static defaultProps = {
    selectOption: [
      { value: '1', text: 'Ациль' },
      { value: '2', text: 'Мойша' }
    ]
  };

  state = {
    formData:{
      contacts: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      messange: '',
      attachedFile: ''
    },
    checked: false,
    selectOption: this.props.selectOption
  };

  componentWillMount() {
    const getSelectData = this.getSelectOptionData('http://127.0.0.1:3010/');

    Promise.all([ getSelectData ])
      .then((data) => {
        if (data[0] !== undefined) {
          this.setState({ selectOption:data[0] });
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCheck = (val) => {
    this.setState({ checked:val });
    console.log(`checked: ${this.state.checked}`);
  };

  handleClearClick = (name) => {
    this.setState({ formData: { ...this.state.formData, [name]: '' } });
    console.log(`name: ${name} value: ${this.state.formData.name}`);
  };

  handleChange = (event) => {
    this.setState({ formData: { ...this.state.formData, [event.target.name]: event.target.value } });
    console.log(`name: ${event.target.name}, value: ${event.target.value }`);
  };

  handleSendButton = () => {
    fetch('http://127.0.0.1:3010/add', {
      method: 'POST',
      body:    JSON.stringify(this.state.formData),
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })
      .then(res =>  {
        return res.json();
      })
      .then(json => console.log(json))
      .catch(err => console.log(err));

    if (this.props.onSend) {
      this.props.onSend();
    }
  };

  getSelectOptionData = (url) => {
    return fetch(url, { mode: 'cors' })
      .then(res => {
        return res.json();
      })
      .catch(e => {
        console.log(e);
      });
  };

  renderFullForm = () => {
    return (
      <span>
        <FormField>
          <Input
            name='fullName'
            width='available'
            placeholder='ФИО'
            clear
            onClearClick={this.handleClearClick}
            onChange={this.handleChange}
          />
          <PhoneInput
            name='phoneNumber'
            width='available'
            placeholder='Ваше телефон'
            clear
            onClearClick={this.handleClearClick}
            onChange={this.handleChange}
            mask='+111 11 111 11 11'
          />
          <EmailInput
            name='email'
            width='available'
            placeholder='Ваш email'
            clear
            onClearClick={this.handleClearClick}
            onChange={this.handleChange}
          />
        </FormField>
      </span>
    );
  };

  render() {
    return (
      <div className='feedbackForm'>
        <FormField>
          <Heading
            size='m'
          >
            Ваше сообщение
          </Heading>
        </FormField>
        <FormField>
          <Checkbox
            text='Анонимное сообщение'
            onChange={this.handleCheck}
          />
        </FormField>
        <Select
          name='contacts'
          width='available'
          placeholder='К кому ваше обращение'
          mode='radio'
          options={this.state.selectOption}
        />
        {!this.state.checked ? this.renderFullForm() : ''}
        <FormField>
          <Textarea
            name='messange'
            width='available'
            placeholder='Ваше сообщение....'
            autosize
            minRows={4}
            maxLength={17}
            onChange={this.handleChange}
          />
        </FormField>
        <FormField>
          <Attach
            name='attachedFile'
          />
        </FormField>
        <FormField>
          <Button
            width='available'
            text='Отправить'
            onClick={this.handleSendButton}
          />
        </FormField>
      </div>
    );
  }
}
