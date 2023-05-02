import {
    Handle,
    Position,
    ReactFlowInstance,
    ReactFlowJsonObject,
    ReactFlowState,
    useReactFlow,
    useStoreApi
} from "reactflow";
import {ChangeEvent, memo, useEffect, useState} from "react";
import {EFunction_Types, NodeData} from "../elements";
import {Button, Col, Container, Row, Form} from "react-bootstrap";

interface IAnimOptions {
    value: EFunction_Types;
    label: string;
    inputs: number;
    params: number;
}

export const animOptions = [
    {
        value: EFunction_Types.CONCAT,
        label: 'Concat',
        inputs: 2,
        params: 0
    },
    {
        value: EFunction_Types.LERP,
        label: 'Lerp',
        inputs: 2,
        params: 1
    },
    {
        value: EFunction_Types.input,
        label: 'Input Node',
        inputs: 0,
        params: 1
    }
] as IAnimOptions[];

function AnimNode(params : { id : string, data : any }) {
    const {id, data} = params;
    const { setNodes, getNode, setEdges } = useReactFlow();
    const store = useStoreApi();
    const [inputs, setInputs] = useState(0);
    const [inputParamsCount, setInputParamsCount] = useState(0);
    const [inputParams, setInputParams] = useState<string[]>([]);
    const [functionType, setFunctionType] = useState<EFunction_Types>(EFunction_Types.UNKOWN);
    const [loaded, setLoaded] = useState(false);
    const [loadedHeight, setLoadedHeight] = useState(false);
    
    const current  = getNode(id);
    let nodeHeight = window.document.getElementById('animCard-'+current?.id)?.clientHeight

    useEffect(() =>
    {
        if(!loaded){
            UpdateNodeState(current?.data?.nodeData.nodeFunction);
            
            nodeHeight = window.document.getElementById('animCard-'+current?.id)?.clientHeight

            setLoaded(true)
        }else if(!loadedHeight){
            setEdges((edgs)=>{
                return edgs.filter((edg)=>{
                    return edg.sourceNode?.id != id || edg.targetNode?.id != id;
                })
            })
            nodeHeight = window.document.getElementById('animCard-'+current?.id)?.clientHeight
            setLoadedHeight(true)
        }
        else{
     

        }
    }, [loaded, nodeHeight]);

    
    
    function UpdateNodeState(newNodeType : number) {
        const newType = animOptions.at(newNodeType );
        console.log('newType', newType)
        setInputs(newType?.inputs ?? 0);
        setFunctionType(newType?.value ?? EFunction_Types.UNKOWN);
        setInputParamsCount(newType?.params ?? 0);
        setInputParams([]);
        setNodes((nodes)=>{
            return nodes.map((node)=>{
                if(node.id == id){
                    node.data.nodeData.nodeFunction = newNodeType;
                    node.data.nodeData.inputParams = inputParams;
                }
                return node;
            })
        })

    }
    
    function UpdateParamValue(e : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index : number) {
        console.log('UpdateParamValue', e.currentTarget.value);
        inputParams[index] = e.currentTarget.value;
        setInputParams(inputParams);
        setNodes((nodes)=>{
            return nodes.map((node)=>{
                if(node.id == id){
                    node.data.nodeData.inputParams = inputParams;
                }
                return node;
            })
        })
    }

    function OnNodeTypeChange(e : ChangeEvent<HTMLSelectElement>) {
        UpdateNodeState(e.currentTarget.value as unknown as number);
        setEdges((edgs)=>{
            return edgs.filter((edg)=>{
                return edg.sourceNode?.id != id || edg.targetNode?.id != id;
            })
        })

    }
    
    if(!loaded && loadedHeight) return <></>
    
    console.log(current?.style?.height)

    return (
        <div id={`animCard-${current?.id}`}>
            <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
                <Container>
                    <Row>
                        <Col>
                            <Row className="text-lg font-bold text-gray-500">
                                <strong>Node: {id}</strong>
                            </Row>
                            <Row>
                                
                                
                            </Row>
               {/*             <Button onClick={() => {
                                if(inputs < 6){
                                    setInputs(inputs + 1);
                                }
                            }}>Add Output {inputs}</Button>*/}
                            <Form.Select aria-label="Default select example" value={functionType} onChange={OnNodeTypeChange}>
                                {
                                    animOptions.map((option) => (
                                        <option value={option.value} key={option.value}>{option.label}</option>
                                    ))
                                }
                            </Form.Select>
                            
                            { // region inputs
                                inputParamsCount > 0 && Array.from(Array(inputParamsCount).keys()).map((i) => {
                                    console.log(inputParamsCount)
                                    
                                    return (
                                        <div key={i}>
                                            <Form.Control  type="text" placeholder="Enter Input" onChange={(e)=>UpdateParamValue(e, i)}/>
                                        </div>
                                    )
                                })

                                // endregion
                            }
                                                
                            
                        </Col>
                    </Row>
                </Container>
                
            </div>
            { // region inputs

                inputs > 0 && Array.from(Array(inputs).keys()).map((i) => {
                    const id = String.fromCharCode(i+65).toLowerCase()
                    console.log(i,id)

                    if (loaded && nodeHeight ) {
                        // Client-side-only code
                        console.log(nodeHeight) 
                        //debugger    
                        
                        return(
                            <Handle className={'handle'} key={id + i} type="target" style={{top:  /*nodeHeight / 12 + (nodeHeight / inputs) **/ i * 20}} id={id + i} position={Position.Left} isConnectable={true}/>
                        )
                    }
                })
                
              // endregion
            }


            <Handle className={'handle'} key={id+ 'Output'} type={'source'}  id={id + 'Output'} position={Position.Right}  isConnectable={true}/>
        </div>
    )
}

export default memo(AnimNode);