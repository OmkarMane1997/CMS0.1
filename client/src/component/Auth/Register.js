import React ,{useState} from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import validator from 'validator';


function Register(props) {
  const [user,setUser]=useState({
    name:"",
    email:"",
    mobile:"",
    password:""
  });

  const [nameError, setNameError] = useState()
  const [emailError, setEmailError] = useState()
  const [mobileNoError, setMobileNoError] = useState()
  const [passwordError, setPasswordError] = useState()

  //validation msg
  const [nameSuccess, setNameSuccess] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [mobileSuccess, setMobileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)


  const navigate =useNavigate();
  
  const readValue=(e)=>{
    
    const {name,value}= e.target;

    // Name validation
    if (  validator.isLength(user.name ,{min:3})) {

      setNameError('Valid Name')
      setNameSuccess(true)
    } else {
      setNameError('Name cannot be shorter than 3 characters. ')
      
    }

        //  Email validation
        if (validator.isEmail(user.email)) {
          setEmailError('Valid Email')
          setEmailSuccess(true)
        } else {
          setEmailError('Enter valid Email!')
        }

            // Mobile validation
            if (   validator.isMobilePhone(user.mobile) ) {
              setMobileNoError('Valid Mobile no')
              setMobileSuccess(true)
            } else {
              setMobileNoError('Please enter valid Mobile No. ')
              
            }


            // password 
            if (validator.isStrongPassword(user.password)) {

              setPasswordError('Password is Valid')
              setPasswordSuccess(true)

            } else {
              setPasswordError("Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long")

            }
    


    setUser({...user,[name]:value})
  }

  const submitHandler= async (e)=>{
    e.preventDefault();
    try {
      // console.log("user =",user)
      // console.log("Email =",user.email)


      if ( validator.isLength(user.name ,{min:3}) && validator.isEmail(user.email) &&  validator.isMobilePhone(user.mobile) && validator.isStrongPassword(user.password) ) {
      console.log("all are ok");
       await axios.post(`/api/v1/auth/register`,user)
      .then(res=>{
        // console.log(`after Register=`,user);
        toast.success("user Registered Successfully")
        navigate('/login');
      }).catch(err=>toast.error(err.message));
       
      }else{
        // console.log("all are not ok");
        toast.success("Please Fill Required Fields")

      }
     

     
    } catch (err) {
      toast.error(err.response.data.msg)
      
    }
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h3 className="display-3">Register</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <form autoComplete='off' onSubmit={submitHandler}>

                <div className="form-group mt-2">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" id="name" value={user.name} onChange={readValue}  className='form-control' required/>
                  <span className={nameSuccess? "text-success":"text-danger"}>{nameError}</span>
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="">Email</label>
                  <input type="email" name="email" id="email" value={user.email} onChange={readValue} className='form-control' required />
                  <span className={emailSuccess? "text-success":"text-danger"}>{emailError}</span>
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="">Mobile</label>
                  <input type="number" name="mobile" id="mobile" value={user.mobile} onChange={readValue} className='form-control' required />
                  <span className={mobileSuccess? "text-success":"text-danger"}>{mobileNoError}</span>
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="">Password</label>
                  <input type="password" name="password" id="password" value={user.password} onChange={readValue} className='form-control' required />
                  <span className={passwordSuccess? "text-success":"text-danger"}>{passwordError}</span>
                </div>
                <div className="form-group mt-2">
                  
                    <input type="submit" value="Register" className='btn btn-warning' />
                 
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register