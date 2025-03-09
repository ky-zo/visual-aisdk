"use client";

import { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  addEdge,
  Node,
  Connection,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

// Import node components
import StreamTextNode from "./nodes/StreamTextNode";
import ToolNode from "./nodes/ToolNode";

// Define the node types
const nodeTypes: NodeTypes = {
  streamText: StreamTextNode,
  tool: ToolNode,
};

// Props for the EditorCanvas component
interface EditorCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const EditorCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
}: EditorCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle dropping nodes onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (!type) {
        return;
      }

      // Get position where node was dropped
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create default data based on node type
      let defaultData = {};
      switch (type) {
        case "streamText":
          defaultData = {
            model: "gpt-4o",
            systemPrompt: "You are a helpful assistant.",
            messages: true,
            maxSteps: 5,
          };
          break;
        case "tool":
          defaultData = {
            name: "myTool",
            description: "Description of what this tool does",
            parameters:
              '{\n  "type": "object",\n  "properties": {\n    "param1": {\n      "type": "string",\n      "description": "Description of parameter"\n    }\n  },\n  "required": ["param1"]\n}',
          };
          break;
        default:
          defaultData = {};
      }

      // Create a new node
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: defaultData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

// Wrapped component with ReactFlowProvider
const EditorCanvasWithProvider = (props: EditorCanvasProps) => (
  <ReactFlowProvider>
    <EditorCanvas {...props} />
  </ReactFlowProvider>
);

export default EditorCanvasWithProvider;
