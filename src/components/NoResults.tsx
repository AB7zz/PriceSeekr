import React from 'react';
import NotFound from 'data-base64:~assets/notfound.png';
import { useSearchContext } from '~context/SearchContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {motion} from 'framer-motion'

const NoResults: React.FC = () => {
    const { setPage, darkTheme } = useSearchContext();
    const handleGoBack = () => {
        setPage('/choose');
    };

    const handleRedoSearch = () => {
        setPage('/choose');
    };

    return (
        <>
            <div className="flex flex-col overflow-hidden">
                <div className="text-left mb-2 ">
                    <motion.button
                        onClick={handleGoBack}
                        className={`rounded-[15px] px-3 py-3 ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-gray-100'} text-[#e0821e]`}
                        whileHover={{ scale: 1.1 }}
                        style={{
                            borderRadius: '20px',
                            color: '#FF8500',
                            alignItems: 'center',
                            alignContent: 'center',
                            fontWeight: 500
                        }}
                    >
                        <ArrowBackIcon className='mr-2' />Back
                    </motion.button>
                </div>
                <h2 className="text-gray-600 text-[25px] relative w-full text-center">This is our top pick</h2>

                <div className="relative w-full h-[14rem] mt-2 bg-black rounded-lg text-center">

                    <img src={NotFound} alt="Not Found" className="mx-auto mt-2 h-[160px]" />
                    <p className="text-white text-md px-4">
                        PriceSeekr has searched 100's of products across the web, this is the best deal we could find.
                    </p>
                </div>
                <div className="text-center mt-10">
                    <button
                        onClick={handleRedoSearch}
                        className={`rounded-lg px-8 py-3 border border-[#FF9C1A] text-[#FF9C1A] hover:text-[#FF9C1A] ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-[#FFEFDC] hover:bg-[#FFEFDC]'}`}
                    >
                        Redo Search
                    </button>
                </div>
            </div>
        </>
    );
};

export default NoResults;
