import React, {MouseEvent as ReactMouseEvent, MouseEventHandler, useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
    MiniMap,
    Background,
    Connection,
    Edge, BackgroundVariant, updateEdge
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from '../components/graph/elements';

import 'reactflow/dist/style.css';
import AnimNode from "../components/graph/nodes/AnimNode";

const nodeTypes = {
    animNode: AnimNode,
};

export default function App() {
    const edgeUpdateSuccessful = useRef(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [loaded, setLoaded] = useState(false);

    function loadGraph() {

    }

    useEffect(() =>
    {
        if(!loaded){
            loadGraph();
            setLoaded(true);
        }

    }, []);
    
    const onConnect = useCallback((params : Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onDoubleClick = useCallback((event : ReactMouseEvent, edg : Edge) => {
        console.log("Double Click")
        setEdges((eds) => edges.filter(e => e.id != edg.id))
    }, [setEdges]);

    function createAnimNode() {
        const id = (nodes.length + 1).toString();
        const newNode = {
            id,
            type: 'animNode',
            data: { nodeData: { function: 'input', params: [] } },
            position: { x: 250, y: 5 },
        };

        setNodes((ns) => ns.concat(newNode));
    }
    
    // region edges
    
    // region delete edge on drop
    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge : Edge<any>, newConnection : Connection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((event: MouseEvent | TouchEvent, edge: Edge<any>) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);


    // endregion
    
    // endregion

    return (
        <>
            <div className={'bg-gray-100 w-12 text-gray-500 '}>
                <button className={'rounded-full w-100'} onClick={createAnimNode}>Create Anim Node</button>
            </div>
            <div style={{width: '100vw', height: '100vh'}}>
                <ReactFlow nodes={nodes}
                           edges={edges}
                           onNodesChange={onNodesChange}
                           onEdgesChange={onEdgesChange}
                           onEdgeDoubleClick={onDoubleClick}
                           onEdgeUpdate={onEdgeUpdate}
                           onEdgeUpdateStart={onEdgeUpdateStart}
                           onEdgeUpdateEnd={onEdgeUpdateEnd}
                           onConnect={onConnect}
                           fitView
                           snapToGrid
                           nodeTypes={nodeTypes}
                >
                    <Controls/>
                    <MiniMap/>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </div>
        </>
    );
}