
import React from 'react'
import BtnThemeSwitch from "@/app/components/BtnThemeSwitch";
import BtnConnectSwitch from "@/app/components/BtnConnectSwitch";
import BtnSearchDialog from './BtnSearchDialog'


const HomeHeader = () => {
    
  return (
    <div className='w-full flex  justify-center  h-[8vh] sticky top-0  shadow-box '>

        <div className=' absolute right-[8vw] top-1/2  -translate-y-1/2 flex flex-row gap-2'>
            <BtnThemeSwitch/>
            <BtnConnectSwitch/>

            <></>
        </div>

    </div>
  )
}

export default HomeHeader