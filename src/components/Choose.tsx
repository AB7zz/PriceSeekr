import React from 'react';
import { useSearchContext } from '~context/SearchContext';
import NotSupport from './NotSupport';
import { Grid, Paper, Typography } from '@mui/material';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
const Choose = ({ data }) => {
  const { setPage } = useSearchContext();
  console.log('data prop:', data);
  return (
    <div className="px-4 py-4">
      {data ? (
        <>
        <h1 className="text-xl font-semibold mb-3 text-center">
          Select type of Search
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center" >
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
              style={{
                backgroundColor: '#FFF5ED',
                padding: '2rem',
                boxShadow: 'none',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <ImageSearchIcon style={{ fontSize: 64, color: 'orange'}} />
              <Typography mt={1} >Same Products</Typography>
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
              <Typography  mt={1} >Similar Products</Typography>
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
