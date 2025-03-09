"use client";

import { useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface ToolNodeData {
  name: string;
  description: string;
  parameters: string; // JSON representation of zod schema
}

// Parameter types for UI
type ParameterType = "string" | "number" | "boolean" | "array" | "object";

interface Parameter {
  name: string;
  type: ParameterType;
  description: string;
  required: boolean;
}

const ToolNode = ({ data, isConnectable }: NodeProps<ToolNodeData>) => {
  const [nodeData, setNodeData] = useState<ToolNodeData>({
    name: data.name || "myTool",
    description: data.description || "Description of what this tool does",
    parameters:
      data.parameters ||
      '{\n  "type": "object",\n  "properties": {\n    "param1": {\n      "type": "string",\n      "description": "Description of parameter"\n    }\n  },\n  "required": ["param1"]\n}',
  });

  // Parse the JSON schema into a list of parameters for easier editing
  const [parameters, setParameters] = useState<Parameter[]>(() => {
    try {
      const schema = JSON.parse(nodeData.parameters);
      const params: Parameter[] = [];
      const required = schema.required || [];

      if (schema.properties) {
        Object.entries(schema.properties).forEach(
          ([name, prop]: [string, any]) => {
            params.push({
              name,
              type: prop.type || "string",
              description: prop.description || "",
              required: required.includes(name),
            });
          }
        );
      }

      return params.length
        ? params
        : [
            {
              name: "param1",
              type: "string",
              description: "Description of parameter",
              required: true,
            },
          ];
    } catch {
      // Default parameter if parsing fails
      return [
        {
          name: "param1",
          type: "string",
          description: "Description of parameter",
          required: true,
        },
      ];
    }
  });

  // Update the JSON schema when parameters change
  useEffect(() => {
    updateJSONSchema();
  }, [parameters]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeData((prev) => ({ ...prev, name: e.target.value }));
    data.name = e.target.value;
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNodeData((prev) => ({ ...prev, description: e.target.value }));
    data.description = e.target.value;
  };

  // Add a new parameter
  const addParameter = () => {
    const newParamName = `param${parameters.length + 1}`;
    setParameters([
      ...parameters,
      {
        name: newParamName,
        type: "string",
        description: "",
        required: false,
      },
    ]);
  };

  // Remove a parameter
  const removeParameter = (index: number) => {
    const newParams = [...parameters];
    newParams.splice(index, 1);
    setParameters(newParams);
  };

  // Update a parameter property
  const updateParameter = (
    index: number,
    field: keyof Parameter,
    value: any
  ) => {
    const newParams = [...parameters];
    newParams[index] = { ...newParams[index], [field]: value };
    setParameters(newParams);
  };

  // Generate JSON schema from parameters
  const updateJSONSchema = () => {
    const schema: {
      type: string;
      properties: Record<string, any>;
      required?: string[];
    } = {
      type: "object",
      properties: {},
    };

    // Create required array if needed
    const requiredParams = parameters
      .filter((p) => p.required)
      .map((p) => p.name);
    if (requiredParams.length > 0) {
      schema.required = requiredParams;
    }

    // Add parameters to schema
    parameters.forEach((param) => {
      schema.properties[param.name] = {
        type: param.type,
      };

      if (param.description) {
        schema.properties[param.name].description = param.description;
      }
    });

    const jsonString = JSON.stringify(schema, null, 2);
    setNodeData((prev) => ({ ...prev, parameters: jsonString }));
    data.parameters = jsonString;
  };

  return (
    <div className="bg-white rounded-md shadow-md border border-amber-200 p-3 w-80">
      <div className="text-sm font-bold mb-2 text-amber-600">Tool</div>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />

      <div className="space-y-3">
        <div className="mb-2">
          <label className="block text-xs mb-1">Tool Name</label>
          <input
            type="text"
            value={nodeData.name}
            onChange={handleNameChange}
            className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div className="mb-2">
          <label className="block text-xs mb-1">Description</label>
          <textarea
            value={nodeData.description}
            onChange={handleDescriptionChange}
            rows={2}
            className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold">Parameters</label>
            <button
              onClick={addParameter}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 rounded px-2 py-1"
              type="button"
            >
              Add Parameter
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
            {parameters.map((param, index) => (
              <div
                key={index}
                className="border border-amber-100 rounded-md p-2 bg-amber-50"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) =>
                        updateParameter(index, "name", e.target.value)
                      }
                      placeholder="Name"
                      className="w-24 px-1 py-0.5 text-xs border rounded"
                    />
                    <select
                      value={param.type}
                      onChange={(e) =>
                        updateParameter(
                          index,
                          "type",
                          e.target.value as ParameterType
                        )
                      }
                      className="px-1 py-0.5 text-xs border rounded"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="array">Array</option>
                      <option value="object">Object</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removeParameter(index)}
                    className="text-xs text-red-500 hover:text-red-700"
                    type="button"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="text"
                    value={param.description}
                    onChange={(e) =>
                      updateParameter(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="flex-1 px-1 py-0.5 text-xs border rounded"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={param.required}
                      onChange={(e) =>
                        updateParameter(index, "required", e.target.checked)
                      }
                      className="mr-1"
                    />
                    <label htmlFor={`required-${index}`} className="text-xs">
                      Required
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <details className="mt-2">
            <summary className="text-xs text-gray-500 cursor-pointer">
              View JSON Schema
            </summary>
            <pre className="mt-1 p-2 bg-gray-50 border rounded text-xs font-mono overflow-x-auto">
              {nodeData.parameters}
            </pre>
          </details>
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

export default ToolNode;
