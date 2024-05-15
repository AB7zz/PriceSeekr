import React from 'react';
import { useSearchContext } from '~context/SearchContext';
import NotSupport from './NotSupport';
import { Grid, Paper, Typography } from '@mui/material';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
const Choose = ({ data }) => {
  const { setPage, darkTheme } = useSearchContext();
  return (
    <div className="">
      {data ? (
        <>
        <h1 className={`${darkTheme ? 'text-white' : 'text-black'} text-xl font-semibold mb-3 text-center`}>
          Select type of Search
        </h1>
        <p className={`text-sm ${darkTheme ? 'text-gray-100' : 'text-gray-600'} mb-6 text-center`} >
          Explore options to find similar or identical products and save money!
        </p>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={6}
            onClick={() => {
              setPage('/same');
            }}
            style={{
              cursor: 'pointer',
              transition: 'background-color 0.8s',
            }}
          >
            <Paper
              elevation={3}
              className={`${darkTheme ? '!bg-[#2d2d2d]' : '!bg-[#FFF5ED]'}`}
              style={{
                padding: '2rem',
                boxShadow: 'none',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <ImageSearchIcon style={{ fontSize: 64, color: 'orange'}} />
              <Typography mt={1} className={`${darkTheme && 'text-white'}`} >Same Products</Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            onClick={() => setPage('/similar')}
            style={{
              cursor: 'pointer',
              transition: 'background-color 0.8s',
            }}
          >
            <Paper
              elevation={3}
              className={`${darkTheme ? '!bg-[#2d2d2d]' : '!bg-[#F7f7f7]'}`}
              style={{
                backgroundColor: '#f7f7f7',
                padding: '2rem',
                boxShadow: 'none',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <TravelExploreIcon style={{ fontSize: 64, color: '#3fcaf6' }} />
              <Typography  mt={1} className={`${darkTheme && 'text-white'}`}>Similar Products</Typography>
            </Paper>
          </Grid>
        </Grid>
        </>
      ) : (
        <NotSupport />
      )}
    </div>
  );
};

export default Choose;
