import {Handle, Position, useReactFlow, useStoreApi} from "reactflow";
import {ChangeEvent, memo, useEffect, useState} from "react";
import {EFunction_Types} from "../elements";
import {Button, Col, Container, Row, Form} from "react-bootstrap";

interface IAnimOptions {
    value: EFunction_Types;
    label: string;
    inputs: number;
    params: number;
}

const animOptions = [
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
    const { setNodes, getNode } = useReactFlow();
    const store = useStoreApi();
    const [inputs, setInputs] = useState(0);
    const [inputParamsCount, setInputParamsCount] = useState(0);
    const [inputParams, setInputParams] = useState<string[]>([]);
    const [functionType, setFunctionType] = useState<EFunction_Types>(EFunction_Types.UNKOWN);
    const [loaded, setLoaded] = useState(false);
    
    const current = getNode(id);
    
    useEffect(() =>
    {
        if(!loaded){
            UpdateNodeState(current?.data?.type ?? EFunction_Types.CONCAT);
            setLoaded(true)
        }
    }, []);

    
    
    function UpdateNodeState(newNodeType : number) {
        const newType = animOptions.find((option) => option.value as number == newNodeType);
        console.log('newType', newType)
        setInputs(newType?.inputs ?? 0);
        setFunctionType(newType?.value ?? EFunction_Types.UNKOWN);
        setInputParamsCount(newType?.params ?? 0);
        setInputParams(Array.from(Array(newType?.params ?? 0).keys()).map((i) => String.fromCharCode(i+65).toLowerCase()));
    }
    
    function UpdateParamValue(e : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index : number) {
        console.log('UpdateParamValue', e.currentTarget.value);
        inputParams[index] = e.currentTarget.value;
        setInputParams(inputParams);
    }

    function OnNodeTypeChange(e : ChangeEvent<HTMLSelectElement>) {
        console.log('OnNodeTypeChange', e.currentTarget.value as number);
        UpdateNodeState(e.currentTarget.value as number);
    }
    
    if(!loaded) return <></>
    
    console.log(current?.style?.height)
    
    return (
        <>
            <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
                <Container>
                    <Row>
                        <Col>
                            <Row className="text-lg font-bold text-gray-500">
                                <strong>Node: {id}</strong>
                            </Row>
                            <Row>
                                
                                
                            </Row>
                            <Button onClick={() => {
                                if(inputs < 6){
                                    setInputs(inputs + 1);
                                }
                            }}>Add Output {inputs}</Button>
                            <Form.Select aria-label="Default select example" onChange={OnNodeTypeChange}>
                                {
                                    animOptions.map((option) => (
                                        <option value={option.value} key={option.value}>{option.label}</option>
                                    ))
                                }
                            </Form.Select>
                            
                            { // region inputs
                                inputs > 0 && Array.from(Array(inputParamsCount).keys()).map((i) => {
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

                    return(
                        <Handle key={id} type="target" style={{top: 10 + ((10)* i) }} id={id} position={Position.Left} isConnectable={true}/>
                    )
                })
                
              // endregion
            }


            <Handle key={id} type={'source'}  id={id} position={Position.Right}  isConnectable={true}/>
        </>
    )
}

export default memo(AnimNode);