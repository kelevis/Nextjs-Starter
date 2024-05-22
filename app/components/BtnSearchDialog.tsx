"use client"
import React, { useState } from 'react'

import Link from 'next/link'
import BtnThemeSwitch from './BtnThemeSwitch'

const BtnSearchDialog = () => {
    
    return (
        <div className=' absolute right-[8vw] top-1/2  -translate-y-1/2'>
            <BtnThemeSwitch/>
        </div>
    )
}

export default BtnSearchDialog;