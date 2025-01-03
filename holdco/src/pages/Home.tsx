import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';


const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const { currentUser, logout } = useFrappeAuth();
  const navigate = useNavigate()


  const fetchTasks = async () => {
    if (!currentUser) return; 
    try {
      const response = await axios.post('http://localhost:8000/api/method/holdo_task.api.todo.get_todos', {
        allocated_to: currentUser,
      });
      if (response?.data?.message?.data) {
        setTasks(response.data.message.data);
        console.log(response.data.message.data);
      } else {
        console.error(response?.data?.message || 'No data received');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function create a new task
  const createTask = async () => {
    if (!newTaskDescription.trim()) return;
    try {
      const response = await axios.post('http://localhost:8000/api/method/holdo_task.api.todo.create_todo', {
        user_name: currentUser,
        description: newTaskDescription,
      });
      if (response) {
        setNewTaskDescription('');
        fetchTasks(); 
        console.log('Added successfully', response.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

//update task
  const markTaskAsDone = async (taskName) => {
  try {
    const response = await axios.post('http://localhost:8000/api/method/holdo_task.api.todo.update_todo_status', {
      task_name: taskName, 
    });
    if (response) {
      console.log('Task marked as done:', response.data.message);
      fetchTasks(); // Refresh tasks after marking as done
    } else {
      console.error('Failed to mark task as done:', response?.data?.message || 'No message received');
    }
  } catch (error) {
    console.error('Error marking task as done:', error.message);
  }
};

const deleteTodo = async (task)=>{
  try {
    const response = await axios.delete("http://localhost:8000/api/method/holdo_task.api.todo.delete_todo", 
    { data: { todo_name: task } }  
    );
    if(response){
      console.log("deleted successfully")
      fetchTasks()
    }else{
      console.error("failed")
    }

  } catch (error) {
        console.error('Error deleting task :', error.message);

  }
}
  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]); 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-120">

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Add new task"
          className="border-2 border-purple-900 rounded-lg px-4 py-0.5 w-full bg-transparent text-white"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button
          className="bg-purple-900 text-white px-4 py-0.5 rounded-lg ml-2"
          onClick={createTask}
        >
          <span className="text-xl">+</span>
        </button>
      </div>
  
      <div className="mb-4">
        <h3 className="text-l font-semibold text-purple-700 ml-1">
          Tasks to do - {tasks.filter((task) => task.status === 'Open').length}
        </h3>
      </div>
      <div className="w-full flex flex-col max-h-64 overflow-y-auto custom-scrollbar">
        {tasks
          ?.filter((task) => task.status === 'Open')
          .map((task) => (
            <div
              key={task.name}
              className="w-full flex justify-between items-center py-2 bg-gray-950 rounded-l p-2 h-12 mb-2"
            >
              <span className="text-white text-sm">{task.description}</span>
              <div className="flex space-x-2">
                <button onClick={()=>deleteTodo(task.name)} className="text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  onClick={() => markTaskAsDone(task.name)}
                  className="text-green-500"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                </button>
              </div>
            </div>
          ))}
      </div>
  
      <div className="mt-4">
        <h3 className="text-sm text-purple-600 mb-2">
          Done - {tasks.filter((task) => task.status === 'Closed').length}
        </h3>
        <div className="w-full flex flex-col max-h-48 overflow-y-auto custom-scrollbar">
          {tasks
            ?.filter((task) => task.status === 'Closed')
            .map((task) => (
              <div
                key={task.name}
                className="w-full flex justify-between items-center py-2 bg-gray-950 rounded-l p-2 h-12 mb-2"
              >
                <span className="line-through text-green-600 text-sm">
                  {task.description}
                </span>
              </div>
            ))}
        </div>
      </div>
  
      {currentUser ? (
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate('login')}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      )}
    </div>
  </div>
  
  );
};

export default TodoPage;
