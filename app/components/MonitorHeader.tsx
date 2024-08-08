
import React from 'react'
import BtnThemeSwitch from "@/app/components/BtnThemeSwitch";
import BtnConnectSwitch from "@/app/components/BtnConnectSwitch";
import BtnSearchDialog from './BtnSearchDialog'


const Header = () => {
    
  return (
    <div className='w-full flex  justify-center  h-[8vh] sticky top-0  shadow-box '>

        <div className=' absolute right-[8vw] top-1/2  -translate-y-1/2 flex flex-row gap-2'>
            <BtnThemeSwitch/>
            <></>
        </div>

    </div>
  )
}

export default Header