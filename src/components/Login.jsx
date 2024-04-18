import React,{useState} from 'react' 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"
const Login=({ onLoginSuccess })=>{ 
	const [email,setEmail]=useState(""); 
	const [passw,setPassw]=useState(""); 
	
	const login = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, email, passw)
		.then((useCredential) => {
			console.log(useCredential);
			onLoginSuccess(useCredential.user.uid);
		})
		.catch((error) => {
			console.log(error);
		})
	}
	return(
	<div className="log-in-container">
		<form onSubmit={login}> 
			<h1>Log In</h1>
			<div> 
				<label htmlFor="email">Email: </label>
				<input type="text" name="email" id="email" value={email} placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)}/> 
			</div> 
			<div> 
				<label htmlFor="passw">Password: </label>
			<input type="text" name="passw" id="passw" value={passw} placeholder="Enter password" onChange={(e)=>setPassw(e.target.value)}/> 
			</div>  
			<button type="submit">Login</button>
		</form>
	</div>
)} 

export default Login;