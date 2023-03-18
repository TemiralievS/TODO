import React from 'react';
import logo from './logo.svg';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import axios from 'axios'
import Footer from './components/Footer.js'
import Navbar from './components/Menu.js'
import UserList from './components/User.js'
import {ProjectList, ProjectDetail} from './components/Project.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/Auth.js'
import ProjectForm from "./components/ProjectForm";
import ToDoForm from "./components/ToDoForm";


const DOMAIN = 'http://127.0.0.1:8001/api/'
const get_url = (url) => `${DOMAIN}${url}`


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navbarItems: [
                {name: 'Users', href: '/'},
                {name: 'Projects', href: '/projects'},
                {name: 'TODOs', href: '/todos'},
            ],
            users: [],
            projects: [],
            project: {},
            todos: [],
            auth: {username: '', is_login: false}
        }
    }

    login(username, password) {
        axios.post(get_url('token/'), {username: username, password: password})
            .then(response => {
                const result = response.data
                const access = result.access
                const refresh = result.refresh
                localStorage.setItem('login', username)
                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)
                this.setState({'auth': {username: username, is_login: true}})
                this.load_data()
                 //    <BrowserRouter>
                 //     <Switch>
                 // <Redirect from='/authors1' to='/'/>
                 //     <Switch>
            }).catch(error => {
            if (error.response.status === 401) {
                alert('Неверный логин или пароль')
            } else {
                console.log(error)
            }
        })
    }

    get_headers(){
        console.log('test')
        let headers = {

            'Content-Type':'application/json',
            // 'Accept': 'application/json; version=v'
        }
        // console.log(this.is_aut())
        if(this.state.auth.is_login()){
            // console.log(`Token ${this.state.token}`)
            headers['Authorization'] = `Token ${this.state.token}`
        }


        return headers
    }

    logout() {
        localStorage.setItem('login', '')
        localStorage.setItem('access', '')
        localStorage.setItem('refresh', '')
        this.setState({'auth': {username: '', is_login: false}})
    }

    load_data() {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.get(get_url('users/'), {headers})
            .then(response => {
                //console.log(response.data)
                this.setState({users: response.data})
            }).catch(error =>

            console.log(error)
        )

        axios.get(get_url('projects/'), {headers})
            .then(response => {
                //console.log(response.data)
                this.setState({projects: response.data})
            }).catch(error =>
            console.log(error)
        )

        axios.get(get_url('todos/'), {headers})
            .then(response => {
                //console.log(response.data)
                this.setState({todos: response.data})
            }).catch(error =>
            console.log(error)
        )
    }

    componentDidMount() {

        // Получаем значения из localStorage
        const username = localStorage.getItem('login')
        if ((username !== "") & (username != null)) {
            this.setState({'auth': {username: username, is_login: true}}, () => this.load_data())
        }
    }

    deleteToDo(id) {
        const headers = this.get_headers()
        axios.delete(`http://127.0.0.1:8000/api/todos/${id}`, {headers: headers})
            .then(response => {
                this.setState({todos: this.state.todos.filter((item)=>item.id !== id)})
            }).catch(error => console.log(error))
    }

    createToDo(text, user) {
        const headers = this.get_headers()
        const data = {text: text, user: user}
        axios.post(`http://127.0.0.1:8000/api/todos/`, data, {headers: headers})
            .then(response => {
                let new_todo = response.data
                const user = this.state.users.filter((item) => item.id === new_todo.user)[0]
                new_todo.user = user
                this.setState({todos: [...this.state.todos, new_todo]})
            }).catch(error => console.log(error))
    }

    createProject(name, user) {
        const headers = this.get_headers()
        const data = {name: name, user: user}
        axios.post(`http://127.0.0.1:8000/api/projects/`, data, {headers: headers})
            .then(response => {
                let new_project = response.data
                const user = this.state.users.filter((item) => item.id === new_project.user)[0]
                new_project.user = user
                this.setState({projects: [...this.state.projects, new_project]})
            }).catch(error => console.log(error))
    }

    deleteProject(id) {
        const headers = this.get_headers()
        axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {headers: headers})
            .then(response => {
                this.setState({projects: this.state.projects.filter((item)=>item.id !== id)})
            }).catch(error => console.log(error))
    }
    getProject(id) {

        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.get(get_url(`/api/projects/${id}`), {headers})
            .then(response => {
                this.setState({project: response.data})
            }).catch(error => console.log(error))
    }


    render() {
        return (
            <Router>
                <header>
                    <Navbar navbarItems={this.state.navbarItems} auth={this.state.auth} logout={() => this.logout()}/>
                </header>
                <main role="main" class="flex-shrink-0">
                    <div className="container">
                        <Switch>
                            <Route exact path='/'>
                                <UserList users={this.state.users}/>
                            </Route>
                            <Route exact path='/projects' component={() => <ProjectList items={this.state.projects}
                                                                                        deleteProject={(id)=>this.deleteProject(id)}/>} />
                            <Route exact path='/projects/create' component={() => <ProjectForm users={this.state.users} createProject={(name, user) => this.createProject(name, user)}  />} />
                            <Route exact path='/todos/create' component={() => <ToDoForm
                                createToDo={(text, user) => this.createToDo(text, user)}/>}/>
                            <Route exact path='/todos' component={() => <ToDoList items={this.state.todos} deleteToDo={(id)=>this.deleteToDo(id)} />} />
                            <Route exact path='/login'>
                                <LoginForm login={(username, password) => this.login(username, password)}/>
                            </Route>
                            <Route path="/project/:id" children={<ProjectDetail getProject={(id) => this.getProject(id)}
                                                                                item={this.state.project}/>}/>
                        </Switch>
                    </div>
                </main>

                <Footer/>
            </Router>


        )
    }
}


export default App;