"use client";

import React from "react";

const NodePalette = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="bg-gray-50 border-r border-gray-200 p-4 h-full w-full overflow-y-auto">
      <h3 className="text-md font-semibold mb-4">Visual AI SDK</h3>

      <div className="space-y-3">
        <div
          className="bg-white border border-purple-200 shadow-sm rounded-md p-3 cursor-grab transition-all hover:shadow-md"
          onDragStart={(event) => onDragStart(event, "streamText")}
          draggable
        >
          <div className="text-sm font-medium text-purple-600">Stream Text</div>
          <div className="text-xs text-gray-500 mt-1">
            Stream text responses with AI SDK
          </div>
        </div>

        <div
          className="bg-white border border-amber-200 shadow-sm rounded-md p-3 cursor-grab transition-all hover:shadow-md"
          onDragStart={(event) => onDragStart(event, "tool")}
          draggable
        >
          <div className="text-sm font-medium text-amber-600">Tool</div>
          <div className="text-xs text-gray-500 mt-1">
            Create a tool for the AI to use
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-500 mb-2">
          Documentation
        </h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>
            <a
              href="https://sdk.vercel.ai/docs/ai-sdk-core/generating-text"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Generating Text
            </a>
          </li>
          <li>
            <a
              href="https://sdk.vercel.ai/docs/ai-sdk-core/tool-calling"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Tool Calling
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default NodePalette;
