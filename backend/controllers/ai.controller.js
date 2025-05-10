import * as ai from '../services/ai.service.js';

export const getResult = async (req, res) => {
    try {
        const { prompt } = req.query;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        const result = await ai.generateResult(prompt);
        
        // Try to parse the result to ensure it's valid JSON
        try {
            const parsedResult = JSON.parse(result);
            return res.json(parsedResult);
        } catch (parseError) {
            console.error('AI response parsing error:', parseError);
            console.error('Raw response:', result);
            
            // If parsing fails, return a formatted error response
            return res.status(500).json({ 
                error: 'Invalid AI response format',
                details: parseError.message,
                text: "I couldn't generate a proper response. Please try again." 
            });
        }
    } catch (error) {
        console.error('AI generation error:', error);
        res.status(500).json({ 
            error: error.message,
            text: "There was an error processing your request. Please try again."
        });
    }
}