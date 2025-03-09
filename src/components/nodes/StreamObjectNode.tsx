"use client";

import { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import ProviderPicker from "../ui/ProviderPicker";

interface StreamObjectData {
  provider: string;
  model: string;
  modelFormat: string;
  importStatement: string;
  schema: string;
  prompt?: string;
  system?: string;
}

const StreamObjectNode = ({
  data,
  isConnectable,
}: NodeProps<StreamObjectData>) => {
  const [nodeData, setNodeData] = useState<StreamObjectData>({
    provider: data.provider || "@ai-sdk/openai",
    model: data.model || "gpt-4o",
    modelFormat: data.modelFormat || "openai('gpt-4o')",
    importStatement:
      data.importStatement || 'import { openai } from "@ai-sdk/openai";',
    schema: data.schema || '{ "type": "object", "properties": {} }',
    prompt: data.prompt || "",
    system: data.system || "",
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

  const handleSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeData((prev) => ({ ...prev, schema: e.target.value }));
    data.schema = e.target.value;
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeData((prev) => ({ ...prev, prompt: e.target.value }));
    data.prompt = e.target.value;
  };

  const handleSystemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeData((prev) => ({ ...prev, system: e.target.value }));
    data.system = e.target.value;
  };

  return (
    <div className="bg-white rounded-md shadow-md border border-teal-200 p-3 w-72">
      <div className="text-sm font-bold mb-2 text-teal-600">Stream Object</div>

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
          capabilities={["object"]}
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs mb-1">JSON Schema</label>
        <textarea
          value={nodeData.schema}
          onChange={handleSchemaChange}
          rows={3}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
          placeholder='{ "type": "object", "properties": {} }'
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs mb-1">Prompt (optional)</label>
        <textarea
          value={nodeData.prompt}
          onChange={handlePromptChange}
          rows={2}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-teal-400"
          placeholder="Enter a prompt to guide the object generation"
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs mb-1">System Message (optional)</label>
        <textarea
          value={nodeData.system}
          onChange={handleSystemChange}
          rows={1}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-teal-400"
          placeholder="System message for the AI"
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

export default StreamObjectNode;
