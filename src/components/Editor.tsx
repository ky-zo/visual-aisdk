"use client";

import { useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  Edge,
} from "reactflow";
import NodePalette from "./NodePalette";
import EditorCanvasWithProvider from "./EditorCanvas";
import CodeGenerator from "./CodeGenerator";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "./ui/resizable";

const Editor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Function to sync nodes from the canvas to the code generator
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Function to sync edges from the canvas to the code generator
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        {/* Left sidebar with node palette */}
        <ResizablePanel defaultSize={15} minSize={10}>
          <NodePalette />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Middle section with canvas */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full">
            <EditorCanvasWithProvider
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              setNodes={setNodes}
              setEdges={setEdges}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right sidebar with code generation */}
        <ResizablePanel defaultSize={35} minSize={20}>
          <CodeGenerator nodes={nodes} edges={edges} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;
