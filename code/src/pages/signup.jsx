import { Button, TextField, Select, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/usercontext.jsx";
import "./signup.css";

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { emailPasswordSignup } = useContext(UserContext);
    const [form, setForm] = useState({
        name:   "",
        email: "",
        password: "",
        mobilenumber: "",
        age: "",
        occupation: "",
    });
    
    const onFormInputChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };
    
    const redirectNow = () => {
        const redirectTo = location.search.replace("?redirectTo=", "");
        navigate(redirectTo ? redirectTo : "/");
    }
    
    const onSubmit = async () => {
    try {
        console.log("Form: ", form)
        const response = await emailPasswordSignup(form.name, form.email, form.password, form.mobilenumber, form.age, form.occupation);
        if (response.status === 200){
            redirectNow('/login');
        }
        else{
            alert("Error signing up. Try again!");
        }
    } catch (error) {
        alert(error);
    }
    };
    
    return(
        <div className="signup-container">
            <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
                <h1 className="center-text">Signup</h1>
                <TextField
                    label="Name"
                    type="text"
                    variant="outlined"
                    name="name"
                    value={form.name}
                    onInput={onFormInputChange}
                    style={{ marginBottom: "1rem" }}
                />
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    name="email"
                    value={form.email}
                    onInput={onFormInputChange}
                    style={{ marginBottom: "1rem" }}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    name="password"
                    value={form.password}
                    onInput={onFormInputChange}
                    style={{ marginBottom: "1rem" }}
                />
                <TextField
                    label="Mobile Number"
                    type="mobile"
                    value={form.mobilenumber}
                    variant="outlined"
                    name="mobilenumber"
                    onInput={onFormInputChange}
                    style={{ marginBottom: "1rem" }}
                />
                <TextField
                    label="Age"
                    type="number"
                    value={form.age}
                    variant="outlined"
                    name="age"
                    onInput={onFormInputChange}
                    style={{ marginBottom: "1rem" }}
                />

                <TextField
                    label="Occupation"
                    type="text"
                    value={form.occupation}
                    variant="outlined"
                    name="occupation"
                    onInput={onFormInputChange}
                    style={{ marginBottom: "1rem" }}
                />
                <Button variant="contained" color="primary" onClick={onSubmit}>
                    Signup
                </Button>
                <p>Have an account already? <Link to="/login">Login</Link></p>
                </form>
        </div>
        );
    }

export default Signup;