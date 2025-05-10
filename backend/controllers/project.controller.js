import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';


export const createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Project name cannot be empty' });
        }
        
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        
        if (!loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
        const { projectId, users } = req.body;

        if (!projectId || !users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ error: "Project ID and at least one user are required" });
        }

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        });

        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        });

        return res.status(200).json({
            project,
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        });

        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const deletedProject = await projectService.deleteProject({
            projectId,
            userId: loggedInUser._id
        });

        return res.status(200).json({
            message: "Project deleted successfully",
            project: deletedProject
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}