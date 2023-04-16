import React from 'react';
import { MarkerType, Position, Node } from 'reactflow';

export interface NodeData {
    nodeFunction : EFunction_Types;
}

export enum EFunction_Types {
    UNKOWN=-1,
    CONCAT,
    LERP,
    input,
}

export const nodes = [
    {
        id: '1',
        type: 'anim-node-input',
        data: {
            nodeData : {
                nodeFunction: 'input',
            } as NodeData,
            
        },
        position: { x: 0, y: 0 },
        sourcePosition: 'right',
    },
    {
        id: '2',
        type: 'anim-node-input',
        data: {
            nodeData :  {
                nodeFunction: 'input',
            } as NodeData,
        },
        position: { x: 0, y: 175 },
        sourcePosition: 'right',
    },
    {
        id: '3',
        type: 'anim-node-function',
        position: { x: 400, y: 75 },
        data: {
            nodeData :  {
                nodeFunction: EFunction_Types.CONCAT,
            } as NodeData,
        },
    },
    {
        id: '4',
        type: 'output',
        data: {
            label: 'Output Node',
        },
        position: { x: 750, y: 100 },
        targetPosition: 'left',
    },
] as Node[];

export const edges = [
    
];

export const animNodes = [
    {
        
    }
]