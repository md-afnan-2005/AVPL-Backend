import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {
    const task = await Task.create({
        ...req.body,
        user: req.user.id, // store user who created task
    });
    res.json(task);
};

// GET ALL TASKS
export const getTasks = async (req, res) => {
    if (req.user.role === "admin") {
        return res.json(
            await Task.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
        );
    }

    res.json(
        await Task.find({ user: req.user.id })
            .populate("user", "name email")
            .sort({ createdAt: -1 })
    );
};

// GET SINGLE TASK
export const getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.json(task);
};

// UPDATE
export const updateTask = async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(task);
};

// DELETE
export const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
};
