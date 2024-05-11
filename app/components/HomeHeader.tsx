
import React from 'react'
import SearchDialog from './SearchDialog'

const HomeHeader = () => {
    
  return (
    <div className='w-full flex  justify-center  h-[8vh] sticky top-0  shadow-box'>
        <SearchDialog></SearchDialog>
    </div>
  )
}

export default HomeHeader