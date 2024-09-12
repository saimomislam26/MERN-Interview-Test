import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useGetDrawingList from './hooks/api/DrawingList';
import Loader from '../../utils/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const DrawList = () => {
  const baseUrl = `${import.meta.env.VITE_API_URL}`
  const { fetchData, data, loading, error, setError, totalDataLength, deleteData, success, setSuccess } = useGetDrawingList()
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate()

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete =async(id)=>{
    await deleteData(`${baseUrl}/delete-drawing/${id}`)
    await fetchData(`${baseUrl}/get-all-drawings?page=${page + 1}&limit=${rowsPerPage}`)
    handleMenuClose()
  }

  useEffect(() => {
    fetchData(`${baseUrl}/get-all-drawings?page=${page + 1}&limit=${rowsPerPage}`)
  }, [page, rowsPerPage])

  useEffect(() => {
    if (error !== "") {
      toast.warning(error, { autoClose: 2000, pauseOnHover: false })
      setError("")
    }
  }, [error])

  useEffect(()=>{
    if(success !== ""){
      toast.success(success, {  autoClose: 2000, pauseOnHover: false })
      setSuccess("")
    }
  },[success])

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div style={{ width: "100%", padding: "2rem" }}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Created Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.createdAt.split('T')[0]}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleMenuClick(event, row)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => navigate(`/single-drawing/${selectedRow._id}`)}>View</MenuItem>
                        <MenuItem onClick={() => handleDelete(selectedRow._id)}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalDataLength}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default DrawList;
