public class GetResponseFromAPIM
{
    string deploymentName = "gpt-4o-mini"; // Replace with your actual deployment name
    public Uri endpoint = new Uri($"https://your_end_point/openai/deployments/gpt-4o-mini"); // Update with your actual deployment URL
    private readonly ApiKeyCredential credential = new ApiKeyCredential("your_api_key"); // Replace with your actual API key

    public void ExecuteUpdate(string UserMessage)
    {
        // Define OpenAI client options
        AzureOpenAIClientOptions options = new(AzureOpenAIClientOptions.ServiceVersion.V2024_06_01);

        // Initialize the Azure OpenAI client
        AzureOpenAiClientWithApim openAiClient = new(endpoint, credential, options);

        // Get a chat client
        ChatClient chatClient = openAiClient.GetChatClient(deploymentName);

        // Create a list to hold the chat messages
        List<ChatMessage> messages = new()
        {
            // Add a system message to set the assistant's behavior
            new SystemChatMessage("You are a helpful assistant."),

            // Add a user message
            new UserChatMessage("Hello, how can I assist you today?"),

            // Add an assistant message
            new AssistantChatMessage("Hello! I'm here to help you with any questions you have.")
        };

        messages.Add(new UserChatMessage(UserMessage));

        // Complete the chat
        var response = chatClient.CompleteChat(messages);
        Console.WriteLine($"Assistant: {response.Value.Content[0].Text}");
    }
}
