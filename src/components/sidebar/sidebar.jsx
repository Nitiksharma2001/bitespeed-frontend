import { useRef } from 'react'
import { useDnD } from '../../contexts/dnd-context'

export default ({ selectedNodeDetails, updateNodeData, onClickNode }) => {
  const [_, setType] = useDnD()

  const onDragStart = (event, nodeType) => {
    setType(nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className='border-l-black border-2'>
      {selectedNodeDetails.isSelected ? (
        <UpdateChatBoxDetails
          nodeDetails={selectedNodeDetails.nodeDetails}
          updateNodeData={updateNodeData}
          onClickNode={onClickNode}
        />
      ) : (
        <>
          <div className='description'>You can drag these nodes to the pane on the right.</div>
          <div
            className='dndnode input'
            onDragStart={(event) => onDragStart(event, 'custom')}
            draggable>
            Input Node
          </div>
        </>
      )}
    </aside>
  )
}

function UpdateChatBoxDetails({ nodeDetails, updateNodeData, onClickNode }) {
  const { id, data } = nodeDetails
  const newDataRef = useRef(data)

  return (
    <div className='flex flex-col'>
      <input
        type='text'
        defaultValue={newDataRef.current.title}
        onChange={(e) => (newDataRef.current.title = e.target.value)}
      />
      <button
        onClick={() => {
          updateNodeData(id, newDataRef.current)
          onClickNode(id, false)
        }}>
        save
      </button>
    </div>
  )
}
