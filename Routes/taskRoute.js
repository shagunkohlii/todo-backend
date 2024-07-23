const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const TASK = require('../Models/Task');
const User = require('../Models/User');
const { fetchUser } = require('../middlewares/auth');

router.post('/addTask', fetchUser, async (req, res) => {
    const { taskName, description } = req.body;
    const userId = req.user._id;

    try {
        // Create the new task
        const newTask = await TASK.create({
            taskName,
            description,
            user: userId
        });

        // Add the task ID to the user's userTaskData
        await User.findByIdAndUpdate(
            userId,
            { $push: { userTaskData: newTask._id } },
            { new: true }
        );

        console.log('Task added successfully');
        res.status(201).json({
            message: 'Task added successfully',
            task: newTask
        });
    } catch (err) {
        console.error('Error adding task:', err);
        res.status(500).json({ message: 'Error adding task', error: err.message });
    }
});

router.delete('/deleteTask', fetchUser, async (req, res) => {
    const { taskId } = req.body;
    const userId = req.user._id;

    // Validate taskId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid or missing task ID' });
    }

    try {
        // Find the task and ensure it belongs to the authenticated user
        const task = await TASK.findOne({ _id: taskId, user: userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to delete this task' });
        }

        // Delete the task
        await TASK.findByIdAndDelete(taskId);

        // Remove the task reference from the user's userTaskData
        await User.findByIdAndUpdate(
            userId,
            { $pull: { userTaskData: taskId } },
            { new: true }
        );

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});


router.put('/updateTask', fetchUser, async (req, res) => {
    const { taskId, taskName, description } = req.body;
    const userId = req.user._id; 

    // Validate taskId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid or missing task ID' });
    }

    if (!taskName && !description) {
        return res.status(400).json({ message: 'Please provide taskName or description to update' });
    }

    try {
        // Find the task and ensure it belongs to the authenticated user
        const task = await TASK.findOne({ _id: taskId, user: userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to update this task' });
        }

        // Update the task
        const updatedTask = await TASK.findByIdAndUpdate(
            taskId,
            { 
                $set: { 
                    ...(taskName && { taskName }),
                    ...(description && { description })
                } 
            },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Task updated successfully', task: updatedTask });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
});

router.get('/getTasks', fetchUser, async (req, res) => {
    const userId = req.user._id;

    try {
        // Fetch tasks for the authenticated user
        const tasks = await TASK.find({ user: userId });

        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
});


module.exports = router;