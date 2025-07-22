import { useRef } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

export default function UpdateBox({ nodeDetails, updateNodeData, onClickNode }) {
  const { id, data } = nodeDetails
  const newDataRef = useRef(data)
  return (
    <div className='max-w-md mx-auto border rounded-md shadow-sm'>
      <div className='flex justify-between items-center border-b px-4 py-2'>
        <button
          onClick={() => onClickNode(id, false)}
          className='text-gray-600 hover:text-gray-800'>
          <FaArrowLeft />
        </button>
        <h2 className='text-gray-700 font-medium'>Message</h2>
        <div className='w-5' />
      </div>

      <div className='p-4'>
        <label className='text-xs text-gray-500 mb-1 block'>Text</label>
        <textarea
          className='w-full border rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400'
          rows={3}
          defaultValue={newDataRef.current.title}
          onChange={(e) => (newDataRef.current.title = e.target.value)}
        />
      </div>

      <div className='border-t px-4 py-2 flex justify-end'>
        <button
          onClick={() => {
            updateNodeData(id, newDataRef.current)
            onClickNode(id, false)
          }}
          className='bg-white border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50 text-sm font-medium'>
          Update Message
        </button>
      </div>
    </div>
  )
}
