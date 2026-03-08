const Groq = require("groq-sdk");
const groqService = require("../../src/services/groqService");

jest.mock('groq-sdk', () => {
    const mGroq = {
        chat: {
            completions: {
                create: jest.fn(),
            },
        },
    };
    return jest.fn(() => mGroq);
});

describe('groqService', () => {
    const mockCreate = new Groq().chat.completions.create;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getChatCompletion', () => {
        it('should successfully return content when API call succeeds', async () => {
            // Setup mock response
            const mockResult = {
                choices: [
                    {
                        message: {
                            content: 'Mocked valid response',
                        },
                    },
                ],
            };

            mockCreate.mockResolvedValueOnce(mockResult);

            const messages = [{ role: 'user', content: 'hello' }];
            const result = await groqService.getChatCompletion(messages);

            // Verify the result
            expect(result).toBe('Mocked valid response');

            // Verify SDK was called correctly
            expect(mockCreate).toHaveBeenCalledTimes(1);
            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.3,
            }));
        });

        it('should return empty string if content is missing', async () => {
            const mockResult = { choices: [{ message: {} }] };
            mockCreate.mockResolvedValueOnce(mockResult);

            const result = await groqService.getChatCompletion([]);
            expect(result).toBe('');
        });

        it('should throw an error if API call fails', async () => {
            const mockError = new Error('API Rate Limit Exceeded');
            mockCreate.mockRejectedValueOnce(mockError);

            // We expect the promise to reject with the error
            await expect(groqService.getChatCompletion([])).rejects.toThrow('API Rate Limit Exceeded');
        });
    });
});
