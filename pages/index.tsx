//https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app

import React, { useCallback } from 'react';
import ReactFlow, {useNodesState, useEdgesState, addEdge, Controls, MiniMap, Background} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    { id: '3', position: { x: 0, y: 200 }, data: { label: '3' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onDoubleClick = useCallback((params) => {
        console.log("Double Click")
        setEdges((eds) => edges.filter(e => e.id != eds[0].id))
    }, [setEdges]);
    
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow nodes={nodes}
                       edges={edges}
                       onNodesChange={onNodesChange}
                       onEdgesChange={onEdgesChange}
                       onEdgeDoubleClick={onDoubleClick}
                       onConnect={onConnect}
                       >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}