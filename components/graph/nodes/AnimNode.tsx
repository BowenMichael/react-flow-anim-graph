import {Handle, Position, useReactFlow, useStoreApi} from "reactflow";
import {ChangeEvent, ChangeEventHandler, memo, useCallback} from "react";

const options = [
    {
        value: 'smoothstep',
        label: 'Smoothstep',
    },
    {
        value: 'step',
        label: 'Step',
    },
    {
        value: 'default',
        label: 'Bezier (default)',
    },
    {
        value: 'straight',
        label: 'Straight',
    },
];

interface IAnimOptions {
    [key : string]: string | number;
    value: string;
    label: string;
    inputs: number;
    params: number;
}

const animOptions = [
    {
        value: 'concat',
        label: 'Concat',
        inputs: 2,
        params: 0
    },
    {
        value: 'lerp',
        label: 'Lerp',
        inputs: 2,
        params: 1
    },
    {
        value: 'input',
        label: 'Input Node',
        inputs: 0,
        params: 1
    }
] as IAnimOptions[];

const AnimSelect = (params : { value: string, handleId : string, nodeId : string })=>{
    const { value, handleId, nodeId } = params;
    const { setNodes } = useReactFlow();
    const store = useStoreApi();

    const onChange = (evt : ChangeEvent<HTMLSelectElement> | undefined) => {
        const { nodeInternals } = store.getState();
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === nodeId) {
                    node.data = {
                        ...node.data,
                        animData: {
                            ...node.data.selects,
                            function: evt?.target.value,
                        },
                    };
                }

                return node;
            })
        );
    };


    return (<>
        <div className="custom-node__select">
            <>
                <div>Edge Type</div>
                <select className="nodrag" onChange={onChange} value={value}>
                    {animOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                
               
            </>
        </div>
    </>);
}

function AnimNode(params : { id : string, data : any }) {
    const { id, data } = params;
    const handleForFunction = 'function'
    const currentOption : IAnimOptions = animOptions[animOptions.findIndex((option) => option.value === data.nodeData.function)]
    console.log(currentOption);
    
    const { setNodes } = useReactFlow();
    const store = useStoreApi();
    

    const onParamChange = useCallback((evt:any) => {
        if(currentOption.value === 'input'){
            const { nodeInternals } = store.getState();
            setNodes(
                Array.from(nodeInternals.values()).map((node) => {
                    node.data.animData.params[evt.target.id] = evt?.target.value
                    if (node.id === id) {
                        node.data = {
                            ...node.data,
                            animData: {
                                ...node.data.selects,
                                params : evt?.target.value,
                            },
                        };
                    }

                    return node;
                })
            );
            return;
        }
        
        console.log(evt.target.id)
        console.log(evt.target.value);
    }, []);

    return (
        <>
            <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
                <div className="flex">
                    <div className="ml-2">
                        <div className="text-lg font-bold text-gray-500">This is a <strong>custom node</strong></div>
                        <div className="text-gray-500">
                            
                            <AnimSelect key={data.nodeData.function} nodeId={id} value={data.nodeData.function} handleId={data.nodeData.function} />
                        </div>
                    </div>
                </div>
                { // region inputs

                    currentOption.inputs != undefined && Array.from(Array(currentOption.inputs).keys()).map((i) => {
                        const id = String.fromCharCode(i+65).toLowerCase()
                        console.log(i,id)

                        return(
                            <Handle key={id} type="target" style={{top: 25 + (50 * (i ))}}  id={id} position={Position.Left}  isConnectable={true}/>
                        )
                    })



                    // endregion
                }

                { // region outputs

                    currentOption.params != undefined && Array.from(Array(currentOption.params).keys()).map((i) => {
                        const id = String.fromCharCode(i+65).toLowerCase()
                        console.log(i,id)

                        
                            
                        return(
                            <div>
                                <label htmlFor="text">Text:</label>
                                <input id={`${i}`} name="text" onChange={onParamChange} className="nodrag" />
                            </div>
                        )
                    })
                    // endregion
                }

                <Handle key={id} type={'source'}  id={id} position={Position.Right}  isConnectable={true}/>

            </div>
        </>
    );
}

export default memo(AnimNode);