"use client";

import { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface GenerateObjectData {
  model: string;
  schema: string;
  prompt?: string;
}

const GenerateObjectNode = ({
  data,
  isConnectable,
}: NodeProps<GenerateObjectData>) => {
  const [nodeData, setNodeData] = useState<GenerateObjectData>({
    model: data.model || "gpt-4o",
    schema: data.schema || '{ "type": "object", "properties": {} }',
    prompt: data.prompt || "",
  });

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeData((prev) => ({ ...prev, model: e.target.value }));
    data.model = e.target.value;
  };

  const handleSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeData((prev) => ({ ...prev, schema: e.target.value }));
    data.schema = e.target.value;
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeData((prev) => ({ ...prev, prompt: e.target.value }));
    data.prompt = e.target.value;
  };

  return (
    <div className="bg-white rounded-md shadow-md border border-green-200 p-3 w-64">
      <div className="text-sm font-bold mb-2 text-green-600">
        Generate Object
      </div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />

      <div className="mb-2">
        <label className="block text-xs mb-1">Model</label>
        <input
          type="text"
          value={nodeData.model}
          onChange={handleModelChange}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-400"
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs mb-1">JSON Schema</label>
        <textarea
          value={nodeData.schema}
          onChange={handleSchemaChange}
          rows={3}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-400 font-mono"
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs mb-1">Prompt (optional)</label>
        <textarea
          value={nodeData.prompt || ""}
          onChange={handlePromptChange}
          rows={2}
          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-400"
        />
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

export default GenerateObjectNode;
