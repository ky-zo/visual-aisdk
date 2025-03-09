"use client";

import { useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import ProviderPicker from "../ui/ProviderPicker";

interface StreamTextData {
  systemPrompt: string;
  messages: boolean; // Indicates if messages are used
  maxSteps: number;
  provider: string;
  model: string;
  modelFormat: string;
  importStatement: string;
}

const StreamTextNode = ({ data, isConnectable }: NodeProps<StreamTextData>) => {
  const [nodeData, setNodeData] = useState<StreamTextData>({
    systemPrompt: data?.systemPrompt || "You are a helpful assistant.",
    messages: data?.messages !== undefined ? data.messages : true,
    maxSteps: data?.maxSteps || 5,
    provider: data?.provider || "@ai-sdk/openai",
    model: data?.model || "gpt-4o",
    modelFormat: data?.modelFormat || "openai('gpt-4o')",
    importStatement:
      data?.importStatement || 'import { openai } from "@ai-sdk/openai";',
  });

  // Initialize data with defaults if it's empty (for new nodes)
  useEffect(() => {
    if (!data.systemPrompt) {
      data.systemPrompt = nodeData.systemPrompt;
    }
    if (data.messages === undefined) {
      data.messages = nodeData.messages;
    }
    if (!data.maxSteps) {
      data.maxSteps = nodeData.maxSteps;
    }
    if (!data.provider) {
      data.provider = nodeData.provider;
    }
    if (!data.model) {
      data.model = nodeData.model;
    }
    if (!data.modelFormat) {
      data.modelFormat = nodeData.modelFormat;
    }
    if (!data.importStatement) {
      data.importStatement = nodeData.importStatement;
    }
  }, []);

  const handleSystemPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNodeData((prev) => ({ ...prev, systemPrompt: e.target.value }));
    data.systemPrompt = e.target.value;
  };

  const handleMessagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeData((prev) => ({ ...prev, messages: e.target.checked }));
    data.messages = e.target.checked;
  };

  const handleMaxStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;
    setNodeData((prev) => ({ ...prev, maxSteps: value }));
    data.maxSteps = value;
  };

  const handleModelSelection = (selection: {
    provider: string;
    model: string;
    modelFormat: string;
    importStatement: string;
  }) => {
    setNodeData((prev) => ({
      ...prev,
      provider: selection.provider,
      model: selection.model,
      modelFormat: selection.modelFormat,
      importStatement: selection.importStatement,
    }));
    data.provider = selection.provider;
    data.model = selection.model;
    data.modelFormat = selection.modelFormat;
    data.importStatement = selection.importStatement;
  };

  return (
    <div className="bg-white rounded-md shadow-md border border-purple-200 p-3 w-72">
      <div className="text-sm font-bold mb-2 text-purple-600">Stream Text</div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />

      <div className="space-y-3">
        <div className="mb-2">
          <ProviderPicker
            value={{ provider: nodeData.provider, model: nodeData.model }}
            onChange={handleModelSelection}
          />
        </div>

        <div className="mb-2">
          <label className="block text-xs mb-1">System Prompt</label>
          <textarea
            value={nodeData.systemPrompt}
            onChange={handleSystemPromptChange}
            rows={3}
            className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="You are a helpful assistant."
          />
        </div>

        <div className="mb-2 flex items-center">
          <input
            type="checkbox"
            id="messages"
            checked={nodeData.messages}
            onChange={handleMessagesChange}
            className="mr-2"
          />
          <label htmlFor="messages" className="text-xs">
            Use Messages from Request
          </label>
        </div>

        <div className="mb-2 flex items-center">
          <label htmlFor="maxSteps" className="text-xs mr-2">
            Max Steps:
          </label>
          <input
            type="number"
            id="maxSteps"
            min="1"
            max="10"
            value={nodeData.maxSteps}
            onChange={handleMaxStepsChange}
            className="w-16 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
    </div>
  );
};

export default StreamTextNode;
