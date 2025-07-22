import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import '@xyflow/react/dist/base.css'

import ChatBox from '../../components/chatbox/chatBox.jsx'
import { DnDProvider, useDnD } from '../../contexts/dnd-context.jsx'
import Sidebar from '../../components/sidebar/sidebar.jsx'

const nodeTypes = {
  custom: ChatBox,
}

const localEdges = localStorage.getItem('edges') ?? '[]'
const localNodes = localStorage.getItem('nodes') ?? '[]'
const Home = () => {
  // error handing for save flow
  const [error, setError] = useState({ isError: false, message: '' })

  // all nodes and edges data
  const [edges, setEdges, onEdgesChange] = useEdgesState(JSON.parse(localEdges))
  const [nodes, _, onNodesChange] = useNodesState(JSON.parse(localNodes))

  // state for storing data of clicked node
  const [selectedNodeDetails, setSelectedNodeDetails] = useState({ isSelected: false })
  const { screenToFlowPosition, setNodes } = useReactFlow()

  // for storing nodes informations
  const nodeRef = useRef(nodes)

  const [type] = useDnD()
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  useEffect(() => {
    nodeRef.current = nodes
  }, [nodes])

  // function to open update data sidebar
  window.onClickNode = useCallback((id, isSelected) => {
    if (isSelected) {
      setSelectedNodeDetails({
        isSelected: true,
        nodeDetails: nodeRef.current.find((node) => node.id === id),
      })
    } else {
      setSelectedNodeDetails({ isSelected: false })
    }
  }, [])

  // function to update node data
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

  // function when dropping a new node on map
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { title: `${type} node` },
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

  // function for clicking on save changes on local and validation
  function onLocalSave() {
    const isTargetEmpty = nodes.filter(
      (node) => edges.find((edge) => edge.target === node.id) === undefined,
    )
    if (isTargetEmpty.length > 1) {
      setError({ isError: true, message: 'Cannot Save Flow' })
    } else {
      setError({ isError: false, message: '' })
      localStorage.setItem('nodes', JSON.stringify(nodes))
      localStorage.setItem('edges', JSON.stringify(edges))
    }
  }

  return (
    <div className='flex flex-col w-screen h-screen'>
      <div className='h-12 w-full bg-slate-200 flex items-center justify-between px-8'>
        <div>
          {error.isError && (
            <span className='bg-red-400 px-4 py-2 rounded-lg text-black font-bold'>
              {' '}
              {error.message}
            </span>
          )}
        </div>
        <button
          onClick={onLocalSave}
          className='bg-white border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50 text-sm font-medium'>
          Save Changes
        </button>
      </div>
      <div className='flex w-full grow'>
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
          defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
        />
        <Sidebar
          selectedNodeDetails={selectedNodeDetails}
          updateNodeData={updateNodeData}
          onClickNode={onClickNode}
        />
      </div>
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
