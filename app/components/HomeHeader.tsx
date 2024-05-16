
import React from 'react'
import ThemeSwitchBtn from "@/app/components/ThemeSwitchBtn";
import ConnectSwitchBtn from "@/app/components/ConnectSwitchBtn";
import SearchDialog from './SearchDialog'


const HomeHeader = () => {
    
  return (
    <div className='w-full flex  justify-center  h-[8vh] sticky top-0  shadow-box '>

        <div className=' absolute right-[8vw] top-1/2  -translate-y-1/2 flex flex-row gap-2'>
            <ThemeSwitchBtn/>
            <ConnectSwitchBtn/>

            <></>
        </div>

    </div>
  )
}

export default HomeHeader