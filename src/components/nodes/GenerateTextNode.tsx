"use client";

import { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import ProviderPicker from "../ui/ProviderPicker";

interface GenerateTextData {
  provider: string;
  model: string;
  modelFormat: string;
  importStatement: string;
  prompt: string;
}

const GenerateTextNode = ({
  data,
  isConnectable,
}: NodeProps<GenerateTextData>) => {
  const [nodeData, setNodeData] = useState<GenerateTextData>({
    provider: data.provider || "@ai-sdk/openai",
    model: data.model || "gpt-4o",
    modelFormat: data.modelFormat || "openai('gpt-4o')",
    importStatement:
      data.importStatement || 'import { openai } from "@ai-sdk/openai";',
    prompt: data.prompt || "",
  });

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

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeData((prev) => ({ ...prev, prompt: e.target.value }));
    data.prompt = e.target.value;
  };

  return (
    <div className="bg-white rounded-md shadow-md border border-gray-200 p-3 w-72">
      <div className="text-sm font-bold mb-2 text-blue-600">Generate Text</div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />

      <div className="mb-3">
        <ProviderPicker
          value={{ provider: nodeData.provider, model: nodeData.model }}
          onChange={handleModelSelection}
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs mb-1">Prompt</label>
        <textarea
          value={nodeData.prompt}
          onChange={handlePromptChange}
          rows={3}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Enter your prompt here..."
        />
      </div>

      <div className="text-xs text-gray-500 mt-3 bg-gray-50 p-2 rounded border">
        <div className="font-mono mb-1">{nodeData.importStatement}</div>
        <div className="font-mono">model = {nodeData.modelFormat}</div>
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

export default GenerateTextNode;
