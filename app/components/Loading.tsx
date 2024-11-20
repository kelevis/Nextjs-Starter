// import { type FC } from "react";
//
// export const Loading: FC = () => {
//     return (
//         <div className="flex justify-center items-center h-full">
//             <div className="flex space-x-2">
//                 <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                 <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                 <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
//             </div>
//         </div>
//     );
// };

import { FC } from "react";

export const Loading  = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-4 border-b-4 border-l-4 border-r-4 border-[transparent] animate-spin">
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
                <div className="absolute inset-0 flex justify-center items-center">
                    <span className="text-blue-500 font-semibold">Loading...</span>
                </div>
            </div>
        </div>
    );
};
