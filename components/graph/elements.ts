import React from 'react';
import { MarkerType, Position, Node } from 'reactflow';

export interface NodeData {
    nodeFunction : EFunction_Types;
    inputParams: string[]
    nodeMask : string[]
}

export enum EFunction_Types {
    UNKOWN=-1,
    CONCAT,
    LERP,
    input,
}

export const nodeTypes  = [
    {type: EFunction_Types.CONCAT, label: 'Concat', paramLabels: []},
    {type: EFunction_Types.LERP, label: 'Lerp', paramLabels: ['Float 0-1']},
    {type: EFunction_Types.input, label: 'Input', paramLabels: ['Animation clip name']},
] as {type: EFunction_Types, label: string, paramLabels: string[]}[];

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