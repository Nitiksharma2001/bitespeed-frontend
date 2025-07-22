import { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'

import '@xyflow/react/dist/base.css'

import ChatBox from '../../components/chatbox/chatBox.jsx'
import { DnDProvider, useDnD } from '../../contexts/dnd-context.jsx'
import Sidebar from '../../components/sidebar/sidebar.jsx'

const nodeTypes = {
  custom: ChatBox,
}

const initEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
]

let id = 0
const getId = () => `dndnode_${id++}`

const Home = () => {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges)
  const [selectedNodeDetails, setSelectedNodeDetails] = useState({ isSelected: false })
  const { screenToFlowPosition, setNodes } = useReactFlow()
  const [type] = useDnD()

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const [nodes, _, onNodesChange] = useNodesState([])
  const nodeRef = useRef(nodes)
  nodeRef.current = nodes
  
  function onClickNode(id, isSelected) {
    console.log(nodeRef.current)
    if (isSelected) {
      setSelectedNodeDetails({
        isSelected: true,
        nodeDetails: nodeRef.current.find((node) => node.id === id),
      })
    } else {
      setSelectedNodeDetails({ isSelected: false })
    }
  }

  function updateNodeData(id, data) {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...data },
            }
          : node,
      ),
    )
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = {
        id: getId(),
        type,
        position,
        data: { title: `${type} node`, job: 'Designer', emoji: '🤓', onClickNode },
      }

      setNodes((nds) => nds.concat(newNode))
    },

    [screenToFlowPosition, type],
  )

  const onDragStart = (event, nodeType) => {
    setType(nodeType)
    event.dataTransfer.setData('text/plain', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className='flex w-screen h-screen'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        fitView
      />
      <Sidebar
        selectedNodeDetails={selectedNodeDetails}
        updateNodeData={updateNodeData}
        onClickNode={onClickNode}
      />
    </div>
  )
}

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <Home />
    </DnDProvider>
  </ReactFlowProvider>
)
