import './App.css';
import {useEffect, useState} from "react";


const useValidation = (value,validations) => {
    const [isEmpty,setIsEmpty] = useState(true);
    const [minLengthError,setMinLengthError] = useState(true);
    const [maxLengthError,setMaxLengthError] = useState(true);
    const [emailError,setEmailError] = useState(true);
    const [inputValid,setInputValid] = useState(false)

    useEffect(()=>{
        for (const validation in validations) {
            switch (validation){
                case "minLength":
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false)
                        break;
                case "isEmpty":
                    value ? setIsEmpty(false) : setIsEmpty(true)
                        break
                case "maxLength":
                    value.length > validations[validation] ? setMaxLengthError(true) : setMaxLengthError(false)
                    break
                case "isEmail":
                    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true)
                    break
            }
        }

    },[value]);


    useEffect(()=> {
        if(isEmpty || maxLengthError || minLengthError || emailError){
            setInputValid(false)
        }
            else{
            setInputValid(true)
        }
    },[isEmpty,maxLengthError,minLengthError,emailError]);

    return {
        isEmpty,
        minLengthError,
        emailError,
        maxLengthError,
        inputValid
    }
}

const useInput = (initialValue,validations) => {
    const [value,setValue] = useState(initialValue);
    const [isDirty,setIsDirty] = useState(false)
    const valid = useValidation(value,validations)
  const onChange = (e) => {
        setValue(e.target.value)
  }
  const onBlur = (e) => {
      setIsDirty(true)
  }

  return {
    value,
    onChange,
    onBlur,
    ...valid,
    isDirty
  }
}

function App() {
  const email = useInput('',{isEmpty: true,minLength: 6,isEmail: true});
  const password = useInput('',{isEmpty: true,minLength: 5,maxLength: 20});
    ///Посмотреть inputValid
  return (
    <div className="App">
        <form className="form">
            <h1>Авторизация</h1>
            {email.isDirty && email.isEmpty && <div style={{color:"red",padding:"5px"}}>Поле не может быть пустым</div>}
            {email.isDirty && email.minLengthError && <div style={{color:"red",padding:"5px"}}>В email должно быть не менее 6 символов</div>}
            {email.isDirty && email.emailError && <div style={{color:"red",padding:"5px"}}>Некорректный email</div>}
            <input name={email.value.toString()} onBlur={e => email.onBlur(e)} onChange={e => email.onChange(e)} type="text" placeholder="Введите email" className="input"/>
            {password.isDirty && password.isEmpty && <div style={{color:"red",padding:"5px"}}>Поле не может быть пустым</div>}
            {password.isDirty && password.minLengthError && <div style={{color:"red",padding:"5px"}}>Слишком короткий пароль</div>}
            {password.isDirty && password.maxLengthError && <div style={{color:"red",padding:"5px"}}>Слишком длинный пароль</div>}
            <input name={password.value.toString()} onBlur={e => password.onBlur(e)} onChange={e => password.onChange(e)} type="password" placeholder="Введите пароль" className="input"/>
            <button className="button" type="submit" disabled={!email.inputValid || !password.inputValid}>Авторизироваться</button>
        </form>
    </div>
  );
}

export default App;
