import React from 'react'
import {Link} from "react-router-dom";


const ToDoListItem = ({item, deleteToDO}) => {
    return (
        <tr>
            <td>{item.id}</td>
            <td>{item.text}</td>
            <td>{item.create}</td>
            <td>{item.project}</td>
            <td>{item.user}</td>
            <td><button  onClick={() =>deleteToDO(item.id)} type='button'>Delete</button></td>
        </tr>
    )
}

const ToDoList = ({items, deleteToDO}) => {
    //console.log(users)
    return (
        <div>
            <table className="table">
                <tr>
                    <th>Id</th>
                    <th>Text</th>
                    <th>Create</th>
                    <th>Project</th>
                    <th>Creator</th>
                    <th></th>
                </tr>
                {items.map((item) => <ToDoListItem item={item} deleteToDO={deleteToDO}/>)}
            </table>
            <Link to='/todos/create'>Create</Link>
        </div>
    )
}

export default ToDoList