"use client";

import { useState, useEffect } from "react";

// Define provider import names and initialization formats
const PROVIDER_FORMATS = {
  "@ai-sdk/openai": {
    importName: "openai",
    format: (model: string) => `openai('${model}')`,
  },
  "@ai-sdk/azure": {
    importName: "azureOpenAI",
    format: (model: string) => `azureOpenAI('${model}')`,
  },
  "@ai-sdk/anthropic": {
    importName: "anthropic",
    format: (model: string) => `anthropic('${model}')`,
  },
  "@ai-sdk/amazon-bedrock": {
    importName: "amazonBedrock",
    format: (model: string) => `amazonBedrock('${model}')`,
  },
  "@ai-sdk/google": {
    importName: "googleGenerativeAI",
    format: (model: string) => `googleGenerativeAI('${model}')`,
  },
  "@ai-sdk/google-vertex": {
    importName: "googleVertex",
    format: (model: string) => `googleVertex('${model}')`,
  },
  "@ai-sdk/mistral": {
    importName: "mistral",
    format: (model: string) => `mistral('${model}')`,
  },
  "@ai-sdk/xai": {
    importName: "xai",
    format: (model: string) => `xai('${model}')`,
  },
  "@ai-sdk/togetherai": {
    importName: "togetherAI",
    format: (model: string) => `togetherAI('${model}')`,
  },
  "@ai-sdk/cohere": {
    importName: "cohere",
    format: (model: string) => `cohere('${model}')`,
  },
  "@ai-sdk/fireworks": {
    importName: "fireworks",
    format: (model: string) => `fireworks('${model}')`,
  },
  "@ai-sdk/deepinfra": {
    importName: "deepInfra",
    format: (model: string) => `deepInfra('${model}')`,
  },
  "@ai-sdk/deepseek": {
    importName: "deepSeek",
    format: (model: string) => `deepSeek('${model}')`,
  },
  "@ai-sdk/cerebras": {
    importName: "cerebras",
    format: (model: string) => `cerebras('${model}')`,
  },
  "@ai-sdk/groq": {
    importName: "groq",
    format: (model: string) => `groq('${model}')`,
  },
  "@ai-sdk/perplexity": {
    importName: "perplexity",
    format: (model: string) => `perplexity('${model}')`,
  },
  "ollama-ai-provider": {
    importName: "ollama",
    format: (model: string) => `ollama('${model}')`,
  },
  "chrome-ai": {
    importName: "chromeAI",
    format: (model: string) => `chromeAI('${model}')`,
  },
  "@openrouter/ai-sdk-provider": {
    importName: "openRouter",
    format: (model: string) => `openRouter('${model}')`,
  },
};

// Define all available providers and their models
const AI_PROVIDERS = {
  "@ai-sdk/openai": {
    name: "OpenAI",
    models: [
      {
        id: "gpt-4o",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "gpt-4o-mini",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "gpt-4-turbo",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "gpt-4",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      { id: "o3-mini", capabilities: ["tool", "tool-streaming"] },
      { id: "o1", capabilities: ["image"] },
      { id: "o1-mini", capabilities: ["image"] },
      { id: "o1-preview", capabilities: ["image"] },
    ],
  },
  "@ai-sdk/azure": {
    name: "Azure OpenAI",
    models: [
      {
        id: "gpt-4o",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "gpt-4-turbo",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "gpt-4",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
    ],
  },
  "@ai-sdk/anthropic": {
    name: "Anthropic",
    models: [
      {
        id: "claude-3-7-sonnet-20250219",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "claude-3-5-sonnet-20241022",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "claude-3-5-sonnet-20240620",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
      {
        id: "claude-3-5-haiku-20241022",
        capabilities: ["image", "object", "tool", "tool-streaming"],
      },
    ],
  },
  "@ai-sdk/amazon-bedrock": {
    name: "Amazon Bedrock",
    models: [
      { id: "anthropic.claude-3-haiku-20240307", capabilities: ["image"] },
      { id: "anthropic.claude-3-sonnet-20240229", capabilities: ["image"] },
      { id: "anthropic.claude-3-opus-20240229", capabilities: ["image"] },
      { id: "meta.llama3-70b-instruct", capabilities: [] },
      { id: "meta.llama3-8b-instruct", capabilities: [] },
    ],
  },
  "@ai-sdk/google": {
    name: "Google Generative AI",
    models: [
      { id: "gemini-2.0-flash-exp", capabilities: ["image", "tool"] },
      { id: "gemini-1.5-flash", capabilities: ["image", "tool"] },
      { id: "gemini-1.5-pro", capabilities: ["image", "tool"] },
    ],
  },
  "@ai-sdk/google-vertex": {
    name: "Google Vertex",
    models: [
      { id: "gemini-2.0-flash-exp", capabilities: ["image", "tool"] },
      { id: "gemini-1.5-flash", capabilities: ["image", "tool"] },
      { id: "gemini-1.5-pro", capabilities: ["image", "tool"] },
    ],
  },
  "@ai-sdk/mistral": {
    name: "Mistral",
    models: [
      { id: "pixtral-large-latest", capabilities: ["image", "tool"] },
      { id: "mistral-large-latest", capabilities: ["tool"] },
      { id: "mistral-small-latest", capabilities: ["tool"] },
      { id: "pixtral-12b-2409", capabilities: ["image"] },
    ],
  },
  "@ai-sdk/xai": {
    name: "xAI Grok",
    models: [
      { id: "grok-2-1212", capabilities: ["tool"] },
      { id: "grok-2-vision-1212", capabilities: ["image", "tool"] },
      { id: "grok-beta", capabilities: [] },
      { id: "grok-vision-beta", capabilities: ["image"] },
    ],
  },
  "@ai-sdk/togetherai": {
    name: "Together.ai",
    models: [
      { id: "togethercomputer/llama-3-70b-instruct", capabilities: [] },
      { id: "togethercomputer/llama-3-8b-instruct", capabilities: [] },
      { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", capabilities: [] },
    ],
  },
  "@ai-sdk/cohere": {
    name: "Cohere",
    models: [
      { id: "command", capabilities: [] },
      { id: "command-r", capabilities: [] },
      { id: "command-r-plus", capabilities: [] },
    ],
  },
  "@ai-sdk/fireworks": {
    name: "Fireworks",
    models: [
      { id: "llama-v3-70b-instruct", capabilities: [] },
      { id: "llama-v3-8b-instruct", capabilities: [] },
    ],
  },
  "@ai-sdk/deepinfra": {
    name: "DeepInfra",
    models: [
      { id: "meta-llama/Llama-3-70b-chat-hf", capabilities: [] },
      { id: "meta-llama/Llama-3-8b-chat-hf", capabilities: [] },
    ],
  },
  "@ai-sdk/deepseek": {
    name: "DeepSeek",
    models: [
      { id: "deepseek-chat", capabilities: ["tool"] },
      { id: "deepseek-reasoner", capabilities: ["tool"] },
    ],
  },
  "@ai-sdk/cerebras": {
    name: "Cerebras",
    models: [
      { id: "llama3.1-8b", capabilities: ["tool"] },
      { id: "llama3.1-70b", capabilities: ["tool"] },
      { id: "llama3.3-70b", capabilities: ["tool"] },
    ],
  },
  "@ai-sdk/groq": {
    name: "Groq",
    models: [
      { id: "llama-3.3-70b-versatile", capabilities: ["image"] },
      { id: "llama-3.1-8b-instant", capabilities: ["image"] },
      { id: "mixtral-8x7b-32768", capabilities: [] },
      { id: "gemma2-9b-it", capabilities: [] },
    ],
  },
  "@ai-sdk/perplexity": {
    name: "Perplexity",
    models: [
      { id: "sonar-small-online", capabilities: [] },
      { id: "sonar-medium-online", capabilities: [] },
    ],
  },
  "ollama-ai-provider": {
    name: "Ollama",
    models: [
      { id: "llama3", capabilities: [] },
      { id: "mistral", capabilities: [] },
    ],
  },
  "chrome-ai": {
    name: "ChromeAI",
    models: [{ id: "gemini-pro", capabilities: [] }],
  },
  "@openrouter/ai-sdk-provider": {
    name: "OpenRouter",
    models: [
      { id: "anthropic/claude-3-opus", capabilities: ["image"] },
      { id: "anthropic/claude-3-sonnet", capabilities: ["image"] },
      { id: "meta/llama-3-70b-instruct", capabilities: [] },
    ],
  },
};

// Provider picker component props
interface ProviderPickerProps {
  value: {
    provider: string;
    model: string;
  };
  onChange: (newValue: {
    provider: string;
    model: string;
    modelFormat: string;
    importStatement: string;
  }) => void;
  capabilities?: string[];
}

export const ProviderPicker = ({
  value,
  onChange,
  capabilities = [],
}: ProviderPickerProps) => {
  const [selectedProvider, setSelectedProvider] = useState(
    value.provider || Object.keys(AI_PROVIDERS)[0]
  );
  const [selectedModel, setSelectedModel] = useState(value.model || "");

  const providerOptions = Object.entries(AI_PROVIDERS).map(
    ([id, provider]) => ({
      id,
      name: provider.name,
    })
  );

  // Filter models based on required capabilities if specified
  const availableModels = selectedProvider
    ? AI_PROVIDERS[
        selectedProvider as keyof typeof AI_PROVIDERS
      ]?.models.filter((model) => {
        if (capabilities.length === 0) return true;
        return capabilities.every((cap) => model.capabilities.includes(cap));
      }) || []
    : [];

  // Update selected model when provider changes
  useEffect(() => {
    if (
      availableModels.length > 0 &&
      (!selectedModel || !availableModels.some((m) => m.id === selectedModel))
    ) {
      const newModel = availableModels[0].id;
      setSelectedModel(newModel);
      updateModelSelection(selectedProvider, newModel);
    }
  }, [selectedProvider, availableModels]);

  // Generate import statement and model format
  const updateModelSelection = (providerPkg: string, modelId: string) => {
    const providerFormat =
      PROVIDER_FORMATS[providerPkg as keyof typeof PROVIDER_FORMATS];

    if (!providerFormat) {
      // Fallback to simple format if provider not found
      onChange({
        provider: providerPkg,
        model: modelId,
        modelFormat: `${
          providerPkg.split("/").pop() || "provider"
        }('${modelId}')`,
        importStatement: `import { ${
          providerPkg.split("/").pop() || "provider"
        } } from "${providerPkg}";`,
      });
      return;
    }

    onChange({
      provider: providerPkg,
      model: modelId,
      modelFormat: providerFormat.format(modelId),
      importStatement: `import { ${providerFormat.importName} } from "${providerPkg}";`,
    });
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value;
    setSelectedProvider(newProvider);
    // Will trigger the useEffect to update the model
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    updateModelSelection(selectedProvider, newModel);
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-xs mb-1">Provider</label>
        <select
          value={selectedProvider}
          onChange={handleProviderChange}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {providerOptions.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs mb-1">Model</label>
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.id}
            </option>
          ))}
        </select>
      </div>

      {selectedModel && selectedProvider && (
        <div className="text-xs text-gray-500 mt-1">
          <div className="font-mono bg-gray-50 p-1 rounded border">
            {PROVIDER_FORMATS[
              selectedProvider as keyof typeof PROVIDER_FORMATS
            ]?.format(selectedModel) ||
              `${
                selectedProvider.split("/").pop() || "provider"
              }('${selectedModel}')`}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderPicker;
