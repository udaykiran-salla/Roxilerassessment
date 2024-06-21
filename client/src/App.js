import ProductsTable from './ProductsTable'
import { Grid } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Grid container justifyContent={'center'} sx={{mt:3}} >
        <Grid item xs={11}>
          <ProductsTable />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
