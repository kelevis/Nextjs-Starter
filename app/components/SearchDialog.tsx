"use client"
import React, { useState } from 'react'

import Link from 'next/link'
import ThemeSwitchBtn from './ThemeSwitchBtn'

const SearchDialog = () => {
    
    return (
        <div className=' absolute right-[8vw] top-1/2  -translate-y-1/2'>
            <ThemeSwitchBtn></ThemeSwitchBtn>
        </div>
    )
}

export default SearchDialog