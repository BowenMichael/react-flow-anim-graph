import React from 'react';
import { MarkerType, Position, Node } from 'reactflow';

export interface NodeData {
    nodeFunction : EFunction_Types;
    inputParams: string[]
}

export enum EFunction_Types {
    UNKOWN=-1,
    CONCAT,
    LERP,
    input,
}

export const nodes = [
    {
        id: '0',
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