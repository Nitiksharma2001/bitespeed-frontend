import { useDnD } from '../../contexts/dnd-context'
import { FaRegMessage } from 'react-icons/fa6'
import UpdateBox from './updateBox'

export default ({ selectedNodeDetails, updateNodeData, onClickNode }) => {
  const [_, setType] = useDnD()

  const onDragStart = (event, nodeType) => {
    setType(nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className='border-l-gray-500 border-[1px] w-1/4'>
      {selectedNodeDetails.isSelected ? (
        // for updating node data
        <UpdateBox
          nodeDetails={selectedNodeDetails.nodeDetails}
          updateNodeData={updateNodeData}
          onClickNode={onClickNode}
        />
      ) : (
        <>
          {/* for droppng a new node on map */}
          <div
            className='flex flex-col ml-4 mt-8 w-1/2 h-20 cursor-grab justify-center items-center gap-2 border-2 border-blue-500 rounded-xl p-2 text-blue-600'
            onDragStart={(event) => onDragStart(event, 'custom')}
            draggable>
            <FaRegMessage />
            Message
          </div>
        </>
      )}
    </aside>
  )
}
