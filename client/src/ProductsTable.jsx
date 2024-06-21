import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from "axios";
import { Button, Card, CardContent, FormControl, Grid, Input, Select, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import BarGraph from './BarGraph';


function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 }
]

export default function EnhancedTable() {

  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [searchString, setSearchString] = React.useState('');
  const [month, setMonth] = React.useState(3);
  const [transectionStatistics, setTransectionStatistics] = React.useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });

  React.useEffect(() => {
    axios.get('http://localhost:8000/api/product/list?month=3').then((res) => {
      console.log({ res: res.data });
      setProducts([...res.data.products]);
    }).catch((err) => console.log({ err: err.message }));
  }, [])

  React.useEffect(() => {
    getProducts();
  }, [page, month]);


  const geTransactionStatistics = () => {
    if (month !== '') {
      axios.get(`http://localhost:8000/api/product/transectionStatistics/${month}`).then((res) => {
        setTransectionStatistics({ ...res.data });
      }).catch((err) => console.log({ err: err.message }));
    }

  }

  const getProducts = () => {
    axios.get(`http://localhost:8000/api/product/list?page=${page}&search=${searchString}&month=${month}`).then((res) => {
      console.log({ res: res.data });
      setProducts([...res.data.products]);
      setPage(res.data.currentPage);
      if (month !== '') { geTransactionStatistics(); getBarGraphData(); }
    }).catch((err) => console.log({ err: err.message }));
  }

  const nextPage = () => setPage((page) => page + 1);
  const previousPage = () => setPage((page) => page - 1);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedLog = debounce(() => getProducts(), 2000);

  React.useEffect(() => {
    debouncedLog();
  }, [searchString])
  const handleSearch = (e) => setSearchString(e.target.value);

  const handleChangeMonth = debounce((e) => setMonth(e.target.value));

  const [barGraphData, setBarGraphData] = React.useState([]);

  const getBarGraphData = () => {
    axios.get(`http://localhost:8000/api/product/bargraph/${month}`).then((res) => {
      setBarGraphData([...res.data]);
    }).catch((err) => console.log({ err: err.message }));
  }

  const monthLabel = React.useMemo(() => {
    let selectedMonth = months.find(m => m.value === month);
    return selectedMonth?.label || '';
  }, [month, months]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems={'center'} >
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <TextField id="serach-trans" label="Search Transaction" variant="outlined" size='small' value={searchString} onChange={handleSearch} />
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ paddingBottom: '1rem' }}>
                  <FormControl >
                    <InputLabel id="demo-simple-select-label">Month</InputLabel>
                    <Select
                      labelId="select-month-label"
                      id="select-month"
                      value={month}
                      label="Select Month"
                      onChange={handleChangeMonth}
                      sx={{ width: 'auto', minWidth: 100 }}
                      size='small'
                    >
                      {months.map((m, i) => <MenuItem key={i} value={m.value}>{m.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="right" sx={{ maxWidth: 100 }}>Title</TableCell>
                      <TableCell align="right" sx={{ maxWidth: 120 }}>Description</TableCell>
                      <TableCell align="right" sx={{ maxWidth: 100 }}>Price</TableCell>
                      <TableCell align="right" sx={{ maxWidth: 100 }}>Category</TableCell>
                      <TableCell align="right" sx={{ maxWidth: 100 }}>Sold</TableCell>
                      <TableCell align="right" sx={{ maxWidth: 100 }}>Image</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody sx={{ typography: { fontSize: '0.5rem' } }}>
                    {products.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.title}</TableCell>
                        <TableCell align="right">{row.description}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">{row.category}</TableCell>
                        <TableCell align="right">{row.sold ? "sold" : "unsold"}</TableCell>
                        <TableCell align="right" >
                          
                          <a href={row.image} target='_blank'><img src={row.image} alt={row.title} width={50}/></a></TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems={'center'} justifyContent={'space-between'}>
              <Grid item xs={3}>
                <Item>Page : {page}</Item>
              </Grid>
              <Grid item xs={3}>
                <Grid container spacing={3}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="text" startIcon={<ArrowBackIosRoundedIcon />} onClick={previousPage} disabled={page === 1 ? true : false}>
                      Previous
                    </Button>
                    <Button variant="text" endIcon={<ArrowForwardIosRoundedIcon />} onClick={nextPage}>
                      Next
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Item>Per Page :10</Item>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} >

        <Grid container alignItems={'center'} spacing={4}>
          <Grid item xs={4}>

            <Card sx={{ backgroundColor: '#f0eba7' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Statistics&nbsp;-&nbsp;{monthLabel}
                </Typography>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      Total Sale
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {transectionStatistics.totalSaleAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      Total Sold Item
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {transectionStatistics.totalSoldItems}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      Total Not Sold Item
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {transectionStatistics.totalNotSoldItems}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>

            </Card>
          </Grid>
          <Grid item xs={8}>
            {month &&
              <BarGraph barGraphData={barGraphData} monthLabel={monthLabel} />
            }
          </Grid>
        </Grid>


      </Grid>

      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Grid>
  );
}
