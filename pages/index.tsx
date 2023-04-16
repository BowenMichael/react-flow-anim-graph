import React, {MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    MiniMap,
    updateEdge,
    useEdgesState,
    useNodesState
} from 'reactflow';

import {edges as initialEdges, EFunction_Types, NodeData, nodes as initialNodes} from '../components/graph/elements';

import 'reactflow/dist/style.css';
import AnimNode from "../components/graph/nodes/anim-node";
import {Button, Container, Navbar} from "react-bootstrap";

const nodeTypes = {
    "anim-node-function": AnimNode,
    "anim-node-input": AnimNode,
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
            type: 'anim-node-function',
            data: { nodeData: { nodeFunction: EFunction_Types.input, params: [] } as NodeData },
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
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">React-Flow Test</Navbar.Brand>
                    <Navbar.Text>                
                        <Button className={'rounded-full w-100'} onClick={createAnimNode}>Create Anim Node</Button>
                    </Navbar.Text>
                </Container>
            </Navbar>
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