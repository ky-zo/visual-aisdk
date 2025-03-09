"use client";

import React, { useState } from "react";
import { Node } from "reactflow";

// Helper types for node data
type StreamTextNodeData = {
  model: string;
  systemPrompt: string;
  messages: boolean;
  maxSteps: number;
  provider: string;
  modelFormat: string;
  importStatement: string;
};

type ToolNodeData = {
  name: string;
  description: string;
  parameters: string;
};

type NodeData = StreamTextNodeData | ToolNodeData;

interface CodeGeneratorProps {
  nodes: Node<NodeData>[];
}

const CodeGenerator = ({ nodes }: CodeGeneratorProps) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  // Generate code based on the nodes
  const generateCode = () => {
    if (nodes.length === 0) {
      return `// Drag and drop nodes to generate code

// Add StreamText and Tool nodes to generate a complete API route`;
    }

    // Extract different node types
    const streamTextNodes = nodes.filter((node) => node.type === "streamText");
    const toolNodes = nodes.filter((node) => node.type === "tool");

    // Start building code
    let code = "";

    // Add imports
    code += `import { streamText, createDataStreamResponse, type Message } from 'ai';\n`;
    code += `import { NextResponse } from 'next/server';\n`;

    if (streamTextNodes.length > 0) {
      const streamNode = streamTextNodes[0];
      const data = streamNode.data as StreamTextNodeData;
      // Add default import for OpenAI if importStatement is missing
      if (data.importStatement) {
        code += `${data.importStatement}\n`;
      } else {
        code += `import { openai } from "@ai-sdk/openai";\n`;
      }
    } else {
      // Default import if no streamText node exists
      code += `import { openai } from "@ai-sdk/openai";\n`;
    }

    if (toolNodes.length > 0) {
      code += `import { z } from 'zod';\n`;
      code += `import { generateUUID } from '@/lib/utils';\n`;
      code += `import { DataStreamWriter, tool } from 'ai';\n`;
      code += `import { Session } from 'next-auth';\n`;
      code += `import { auth } from '@/app/(auth)/auth';\n\n`;
    } else {
      code += `\n`;
    }

    // Add tool definitions
    if (toolNodes.length > 0) {
      toolNodes.forEach((toolNode) => {
        const data = toolNode.data as ToolNodeData;

        code += `interface ${data.name}Props {\n`;
        code += `  session: Session;\n`;
        code += `  dataStream: DataStreamWriter;\n`;
        code += `}\n\n`;

        code += `export const ${data.name} = ({ session, dataStream }: ${data.name}Props) =>\n`;
        code += `  tool({\n`;
        code += `    description: '${data.description}',\n`;
        code += `    parameters: z.object(${convertJsonToZod(
          data.parameters
        )}),\n`;
        code += `    execute: async (params) => {\n`;
        code += `      // Add your tool implementation here\n`;
        code += `      const id = generateUUID();\n\n`;
        code += `      // Example of writing data back to the stream\n`;
        code += `      dataStream.writeData({\n`;
        code += `        type: 'id',\n`;
        code += `        content: id,\n`;
        code += `      });\n\n`;
        code += `      return {\n`;
        code += `        id,\n`;
        code += `        message: 'Tool executed successfully'\n`;
        code += `      };\n`;
        code += `    },\n`;
        code += `  });\n\n`;
      });
    }

    // Generate API route handler
    code += `export async function POST(request: Request) {\n`;
    code += `  try {\n`;
    code += `    const { messages }: { messages: Array<Message> } = await request.json();\n\n`;

    // Add authentication if there are tools
    if (toolNodes.length > 0) {
      code += `    const session = await auth();\n\n`;
      code += `    if (!session || !session.user) {\n`;
      code += `      return new Response('Unauthorized', { status: 401 });\n`;
      code += `    }\n\n`;
    }

    // Generate streamText implementation
    if (streamTextNodes.length > 0) {
      const streamNode = streamTextNodes[0];
      const data = streamNode.data as StreamTextNodeData;

      code += `    return createDataStreamResponse({\n`;
      code += `      execute: (dataStream) => {\n`;
      code += `        const result = streamText({\n`;

      // Use modelFormat if it exists, otherwise default to openai('gpt-4o')
      const modelCode = data.modelFormat || `openai('gpt-4o')`;
      code += `          model: ${modelCode},\n`;

      code += `          system: '${data.systemPrompt}',\n`;
      if (data.messages) {
        code += `          messages,\n`;
      }
      code += `          maxSteps: ${data.maxSteps},\n`;

      // Add tool integration if there are tools
      if (toolNodes.length > 0) {
        code += `          tools: {\n`;
        toolNodes.forEach((toolNode) => {
          const toolData = toolNode.data as ToolNodeData;
          code += `            ${toolData.name}: ${toolData.name}({ session, dataStream }),\n`;
        });
        code += `          },\n`;
      }

      code += `          onFinish: async ({ response }) => {\n`;
      code += `            console.log('Stream finished', response.id);\n`;
      code += `          },\n`;
      code += `        });\n\n`;
      code += `        result.consumeStream();\n\n`;
      code += `        result.mergeIntoDataStream(dataStream, {\n`;
      code += `          sendReasoning: true,\n`;
      code += `        });\n`;
      code += `      },\n`;
      code += `      onError: (error) => {\n`;
      code += `        console.error('Error in stream:', error);\n`;
      code += `        return 'An error occurred while processing your request.';\n`;
      code += `      },\n`;
      code += `    });\n`;
    } else {
      // Fallback if no streamText nodes
      code += `    // Add a streamText implementation here\n`;
      code += `    return new Response('Not implemented', { status: 501 });\n`;
    }

    code += `  } catch (error) {\n`;
    code += `    return NextResponse.json({ error }, { status: 400 });\n`;
    code += `  }\n`;
    code += `}\n`;

    return code;
  };

  // Helper function to convert JSON schema to Zod schema syntax
  const convertJsonToZod = (jsonSchema: string): string => {
    try {
      const schema = JSON.parse(jsonSchema);
      let zodCode = "{";

      if (schema.properties) {
        Object.entries(schema.properties).forEach(
          ([key, prop]: [string, any], index, array) => {
            zodCode += `\n    ${key}: z.`;

            if (prop.type === "string") {
              zodCode += "string()";
              if (prop.description) {
                zodCode += `.describe('${prop.description}')`;
              }
            } else if (prop.type === "number") {
              zodCode += "number()";
            } else if (prop.type === "boolean") {
              zodCode += "boolean()";
            } else if (prop.type === "array") {
              zodCode += "array(z.any())";
            } else if (prop.type === "object") {
              zodCode += "object({})";
            } else {
              zodCode += "any()";
            }

            // Check if property is required
            if (schema.required && !schema.required.includes(key)) {
              zodCode += ".optional()";
            }

            if (index < array.length - 1) {
              zodCode += ",";
            }
          }
        );
        zodCode += "\n  }";
      } else {
        zodCode += " }";
      }

      return zodCode;
    } catch (e) {
      console.error("Error parsing JSON schema:", e);
      return "{}";
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col h-full border-l border-gray-200 p-4 overflow-hidden w-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-md font-semibold">Generated Code</h3>
        <button
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
          onClick={() => {
            navigator.clipboard.writeText(generateCode());
          }}
        >
          Copy
        </button>
      </div>

      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto text-xs font-mono flex-1">
        <pre>
          <code>
            {generateCode()
              .split("\n")
              .map((line, i) => (
                <div
                  key={i}
                  className={`${
                    selectedLine === i ? "bg-gray-800" : ""
                  } hover:bg-gray-800 cursor-pointer`}
                  onClick={() => setSelectedLine(i)}
                >
                  <span className="text-gray-500 inline-block w-8 text-right mr-2">
                    {i + 1}
                  </span>
                  {line || "\n"}
                </div>
              ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeGenerator;
