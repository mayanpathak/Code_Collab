import { getMessages as getMessagesService, searchMessages as searchMessagesService, clearMessages as clearMessagesService, getMessageCount as getMessageCountService } from '../services/message.service.js';

/**
 * Get messages for a project with pagination
 * @route GET /projects/:projectId/messages
 */
export const getProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { limit = 100, offset = 0 } = req.query;
        
        // Validate project access
        if (!req.project) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have access to this project'
            });
        }
        
        // Get messages from Redis
        const messages = await getMessagesService(projectId, {
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
        // Get message count
        const messageCount = await getMessageCountService(projectId);
        
        return res.status(200).json({
            status: 'success',
            data: {
                messages,
                totalCount: messageCount
            }
        });
    } catch (error) {
        console.error('Error getting messages:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get messages'
        });
    }
};

/**
 * Search messages for a project
 * @route POST /projects/:projectId/messages/search
 */
export const searchProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { searchTerm } = req.body;
        
        if (!searchTerm) {
            return res.status(400).json({
                status: 'error',
                message: 'Search term is required'
            });
        }
        
        // Validate project access
        if (!req.project) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have access to this project'
            });
        }
        
        // Search messages in Redis
        const results = await searchMessagesService(projectId, searchTerm);
        
        return res.status(200).json({
            status: 'success',
            data: {
                messages: results,
                totalCount: results.length
            }
        });
    } catch (error) {
        console.error('Error searching messages:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to search messages'
        });
    }
};

/**
 * Clear all messages for a project
 * @route DELETE /projects/:projectId/messages
 */
export const clearProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // Validate project access and ownership
        if (!req.project) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have access to this project'
            });
        }
        
        // Only project owner can clear messages
        const isOwner = req.project.users.some(
            userId => userId.toString() === req.user._id.toString() && 
            req.project.createdBy.toString() === req.user._id.toString()
        );
        
        if (!isOwner) {
            return res.status(403).json({
                status: 'error',
                message: 'Only the project owner can clear messages'
            });
        }
        
        // Clear messages in Redis
        await clearMessagesService(projectId);
        
        return res.status(200).json({
            status: 'success',
            message: 'Messages cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing messages:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to clear messages'
        });
    }
};

/**
 * Get message count for a project
 * @route GET /projects/:projectId/messages/count
 */
export const getProjectMessageCount = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // Validate project access
        if (!req.project) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have access to this project'
            });
        }
        
        // Get message count from Redis
        const count = await getMessageCountService(projectId);
        
        return res.status(200).json({
            status: 'success',
            data: {
                count
            }
        });
    } catch (error) {
        console.error('Error getting message count:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get message count'
        });
    }
}; 