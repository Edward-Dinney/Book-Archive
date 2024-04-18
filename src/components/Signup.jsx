import React,{useState} from 'react' 
import { createUserWithEmailAndPassword  } from "firebase/auth";
import { auth } from "./firebase"
const Signup=()=>{ 
	const [email,setEmail]=useState(""); 
	const [passw,setPassw]=useState(""); 
	const signUp = (e) => {
		e.preventDefault();
		createUserWithEmailAndPassword (auth, email, passw)
		.then((useCredential) => {
			console.log(useCredential);
		})
		.catch((error) => {
			console.log(error);
		})
	}
    
	return(
	<div className="log-in-container">
		<form onSubmit={signUp}> 
			<h1>Create account</h1>
			<div> 
				<label htmlFor="email">Email: </label>
				<input type="text" name="email" id="email" value={email} placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)}/> 
			</div> 
			<div> 
				<label htmlFor="passw">Password: </label>
			<input type="text" name="passw" id="passw" value={passw} placeholder="Enter password" onChange={(e)=>setPassw(e.target.value)}/> 
			</div>  
			<button type="submit">Create</button>
		</form>
	</div>
)} 

export default Signup;