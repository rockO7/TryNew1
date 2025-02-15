using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Threading;
using Azure.AI.OpenAI;
using OpenAI.Chat;

class Program
{
    static void Main()
    {
        // Define API endpoint and API key
        // Define deployment name
        string deploymentName = "YOUR_MODEL_NAME"; // Replace with your actual deployment name

        // Define API endpoint (ensure it matches your APIM setup)
        Uri endpoint = new Uri($"YOUR_DEPLOYMENT_URL");

        // Set up API credentials (Replace with your actual key)
        ApiKeyCredential credential = new ApiKeyCredential("YOUR_API_KEY");

        // Define OpenAI client options
        AzureOpenAIClientOptions options = new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2024_06_01);

        // Initialize the Azure OpenAI client
        AzureOpenAiClientWithApim openAiClient = new AzureOpenAiClientWithApim(endpoint, credential, options);

        // Get a chat client
        ChatClient chatClient = openAiClient.GetChatClient(deploymentName);

        // Create a chat message
        // Create a list to hold the chat messages
        List<ChatMessage> messages = new List<ChatMessage>
        {
            // Add a system message to set the assistant's behavior
            new SystemChatMessage("You are a helpful assistant."),

            // Add a user message
            new UserChatMessage("Hello, how can I assist you today?"),

            // Add an assistant message
            new AssistantChatMessage("Hello! I'm here to help you with any questions you have.")
        };



        //Initial Calling 
       //// var response = chatClient.CompleteChat(messages);
       //// Console.WriteLine(response.Value.Content[0].Text);


      
        // Call the chat service
        // Start an interactive loop
        string userInput = string.Empty;
        while (true)
        {
            // Ask for user input
            Console.Write("You: ");
            userInput = Console.ReadLine();

            // If user types "quit", break out of the loop
            if (userInput.ToLower() == "quit")
            {
                Console.WriteLine("Goodbye!");
                break;
            }

            // Add the user's message to the list
            messages.Add(new UserChatMessage(userInput));

            // Call the chat service
            var response = chatClient.CompleteChat(messages);

            // Print the assistant's response
            if (response.Value.Content.Count > 0)
            {
                Console.WriteLine($"Assistant: {response.Value.Content[0].Text}");
            }
            else
            {
                Console.WriteLine("Assistant: Sorry, I didn't understand that.");
            }
        }

        // Print the response
        ////foreach (var update in response)
        ////{
        ////    // Check if ContentUpdate has any elements before trying to access index 0
        ////    if (update.ContentUpdate != null && update.ContentUpdate.Count > 0)
        ////    {
        ////        Console.WriteLine(update.ContentUpdate[0].Text);
        ////    }
        ////    else
        ////    {
        ////        // Print empty string if ContentUpdate is empty or null
        ////        Console.WriteLine(string.Empty);
        ////    }
        ////}

    }
}
