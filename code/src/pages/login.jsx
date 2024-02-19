import { Button, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../features/userSlice";
import { UserContext } from "../context/usercontext.jsx";
import "./login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const { emailPasswordLogin } = useContext(UserContext);
    
    const user = useSelector(selectUser);
    console.log("Initial User: ", user)
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    
    const onFormInputChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };
    
    const redirectNow = () => {
        const redirectTo = location.search.replace("?redirectTo=", "");
        console.log("Redirecting to: ", redirectTo)
        if (redirectTo === '/'){
            navigate("/dashboard");
        } else {
            navigate(redirectTo);
        }
    }
    
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await emailPasswordLogin(form.email, form.password);
            if (user) {
                console.log("Dispatching user: ", user)
                dispatch(
                    login({
                        session_token: user
                    }
                ))
                redirectNow();
                console.log("Now redirecting...")
            }
        } catch (error) {
            if (error.statusCode === 401) {
                alert("Invalid username/password. Try again!");
            } else {
                alert(error);
            }
        }
    };


    const loadUser = async () => {
    if (!user) {
        const fetchedUser = await emailPasswordLogin(form.email, form.password);
        if (fetchedUser) {
            console.log("Dispatching user: ", fetchedUser)
            dispatch(
                login({
                    session_token: fetchedUser
                }
            ));
            redirectNow();
        }
    }
    }
    
    useEffect(() => {
        loadUser(); 
    }, []);
    
    return (
        <div className="login-container">
            <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }} onSubmit={onSubmit}>
                <h1 className="center-text">Login</h1>
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    name="email"
                    value={form.email}
                    onChange={onFormInputChange}
                    style={{ marginBottom: "1rem", color: "cyan"}}
                    InputProps={{
                        style: {
                            borderColor: 'cyan'
                        }
                    }}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    name="password"
                    value={form.password}
                    onChange={onFormInputChange}
                    style={{ marginBottom: "1rem", color: "cyan" }}
                    InputProps={{
                        style: {
                            borderColor: 'cyan'
                        }
                    }}
                    required
                />
                <Button variant="contained" color="primary" type="submit" className="login-btn">
                    Login
                </Button>
                <br></br>
                <p>Don't have an account? <Link to="/signup">Signup</Link></p>
            </form>
        </div>
    );
}

export default Login;