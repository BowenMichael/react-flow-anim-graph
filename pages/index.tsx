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
import AnimNode, {animOptions} from "../components/graph/nodes/anim-node";
import {Button, ButtonGroup, Container, Navbar} from "react-bootstrap";



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
    
    const onConnect = useCallback((params : Edge<any> | Connection) => {
        setEdges((eds) => {
            const newEdge : Edge[] = addEdge(params, eds)
            console.log("New edge", eds, edges, newEdge)
            setEdges(newEdge)
            setLoaded(false)
            return newEdge;
        })
        console.log("New Connection", edges, params)
        
    }, [setEdges]);
    const onDoubleClick = useCallback((event : ReactMouseEvent, edg : Edge) => {
        console.log("Double Click", edg.id)
        setEdges((eds)=>{
            return eds.filter(e => {
                return e.id !== edg.id;
            });
        });
        
    }, [setEdges]);

    function createAnimNode() {
        const id = (nodes.length + 1).toString();
        const newNode = {
            id,
            type: 'anim-node-function',
            data: { nodeData: { nodeFunction: EFunction_Types.input, params: []  }},
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

    function sameAnimGraph() {
        const output = {
            "nodes" : [
                nodes.map((value, index, nodeArray) => {
                    const data = (value.data.nodeData as NodeData);
                    console.log(data)
                    let inputNodes:any[]= [];
                    edges.map((edge, index) => {
                        debugger;
                        
                        if(edge.target === value.id){
                            inputNodes = [...inputNodes,  {
                                  index : edge.source
                            }]
                        }
                    })

                    let animData;
                    if(data){
                        animData = animOptions[Number(data.nodeFunction)];
                        console.log(animData)  
                    }
                    
                    const params = data?.inputParams ? data.inputParams : [];
                    
                    return {
                        id : value.id,
                        data : animData,
                        params ,
                        inputs : inputNodes
                        
                    }
                })
            ]
        }

        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(output, null, 2)], {
            type: "text/plain"
        }));
        a.setAttribute("download", "data.txt");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">React-Flow Test</Navbar.Brand>
                    <Navbar.Text>
                        <ButtonGroup>
                            <Button className={'w-100'} onClick={createAnimNode} variant={'success'}>Create Anim Node</Button>
                            <Button className={'w-100'} onClick={sameAnimGraph}>Save Anim Graph</Button>
                        </ButtonGroup>
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