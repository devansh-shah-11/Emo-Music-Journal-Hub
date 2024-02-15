import React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './entries.css';

let filteredTodos = [
    {
        'task': 'Do the dishes',
        'deadline': '2024-02-11T00:00:00Z', 
    },
];

function TasksCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasksDue, setTasksDue] = useState([]);

    useEffect(() => {
        console.log('Selected date: ', selectedDate);
        console.log('Todos: ', filteredTodos);
        const tasksDueOnSelectedDate = filteredTodos.filter(todo => {
            const todoDate = new Date(todo.deadline);
            return todoDate.getDate() === selectedDate.getDate() &&
                todoDate.getMonth() === selectedDate.getMonth() &&
                todoDate.getFullYear() === selectedDate.getFullYear();
        }) || [];

        setTasksDue(tasksDueOnSelectedDate);
    }, [selectedDate, filteredTodos]);

    const handleMouseEnter = (date) => {
        console.log('Mouse entered on date: ', date);
        setSelectedDate(date);
    };

    return (
        <div className='container'>
            <TextField 
                id="outlined-basic" 
                label="Search" 
                variant="outlined" 
                className="search-bar"
            />
            <Calendar
                tileContent={({ date, view }) => view === 'month' && <div onMouseEnter={() => handleMouseEnter(date)} style={{ height: '100%', width: '100%' }}></div>}
            />
            <ul>
                {tasksDue.map(task => (
                    <li key={task.index} className='task-item'>{task.task}</li>
                ))}
            </ul>
        </div>
    );
}

export default TasksCalendar;