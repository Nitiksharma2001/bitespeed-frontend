import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { FaWhatsapp } from 'react-icons/fa'

function ChatBox({ id, data }) {
  return (
    <div
      className='w-fit rounded-md shadow-md border border-gray-200 overflow-hidden'
      onClick={() => window.onClickNode(id, true)}>
      <div className='bg-teal-100 flex items-center justify-between px-4 py-2 gap-4'>
        <div className='text-sm font-medium text-gray-800 flex items-center gap-1'>
          Send Message
        </div>
        <FaWhatsapp className='text-green-500 text-lg' />
      </div>
      <div className='bg-white px-4 py-2 text-sm text-gray-700'>{data.title}</div>
      {/* left and right handle source and target */}
      <Handle type='target' position={Position.Right} />
      <Handle type='source' position={Position.Left} />
    </div>
  )
}

export default memo(ChatBox)
