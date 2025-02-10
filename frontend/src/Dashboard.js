import React from 'react';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Grid, 
  Paper 
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  return (
    <div>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Count Me In!
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper>
              // ...existing content...
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;