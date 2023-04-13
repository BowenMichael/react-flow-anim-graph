import React from 'react';
import { MarkerType, Position, Node } from 'reactflow';

interface NodeData {
    function: string;
}

export const nodes = [
    {
        id: '1',
        type: 'animNode',
        data: {
            nodeData : {
                function: 'input',
            } as NodeData,
            
        },
        position: { x: 0, y: 0 },
        sourcePosition: 'right',
    },
    {
        id: '2',
        type: 'animNode',
        data: {
            nodeData :  {
                function: 'input',
            } as NodeData,
        },
        position: { x: 0, y: 175 },
        sourcePosition: 'right',
    },
    {
        id: '4',
        type: 'animNode',
        position: { x: 400, y: 75 },
        data: {
            nodeData :  {
                function: 'concat',
            } as NodeData,
        },
    },
    {
        id: '5',
        type: 'output',
        data: {
            label: 'Output Node',
        },
        position: { x: 750, y: 100 },
        targetPosition: 'left',
    },
] as Node[];

export const edges = [
    { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        type: 'smoothstep',
        sourceHandle: 'handle-0',
        data: {
            selectIndex: 0,
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
    {
        id: 'e4-6',
        source: '4',
        target: '6',
        type: 'smoothstep',
        sourceHandle: 'handle-1',
        data: {
            selectIndex: 1,
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    },
];

export const animNodes = [
    {
        
    }
]