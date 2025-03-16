const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 
// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/tododb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// ToDoList Schema
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Add New Task
app.post('/add-task', async (req, res) => {
  try {
    const { task } = req.body;
    const newTask = new Todo({ task });
    await newTask.save();
    res.json({ message: 'Task added successfully!', task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Todo.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Task 
app.put('/update-task/:id', async (req, res) => {
  try {
    const updatedTask = await Todo.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json({ message: 'Task updated successfully!', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Task
app.delete('/delete-task/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
app.listen(3000, () => console.log('Server running on port 3000'));
