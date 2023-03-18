import React from "react"

class ToDoForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {text: '', user: 0}
    }

    handleChange(event)
    {
        this.setState(
            {
                [event.target.text]: event.target.value
            }
        );
    }

    handleSubmit(event) {
        this.props.createToDo(this.state.text, this.state.user)
        event.preventDefault()
    }

    render() {
        return (
            <form onSubmit={(event)=> this.handleSubmit()}>
                <div>
                    <label for="text">text</label>
                    <input type="text" className="form-control" name="text"
                           value={this.state.text} onChange={(event)=>this.handleChange(event)} />
                </div>
                <div className="form-group">
                    <label for="user">user</label>
                    <input type="number" className="form-control" name="user"
                           value={this.state.user} onChange={(event)=>this.handleChange(event)} />
                </div>
                <input type="submit" className="btn btn-primary" value="Save" />
            </form>
        );
    }
}

export default ToDoForm