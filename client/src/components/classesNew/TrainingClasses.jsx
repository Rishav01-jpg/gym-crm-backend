import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import LoadingSpinner from "../layout/LoadingSpinner";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";

const TrainingClasses = () => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { user, isAuthenticated } = authContext;

  const canModify = user && (user.role === "admin" || user.role === "manager");

  // ================= STATES =================
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form / modal
  const [openForm, setOpenForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    duration: "",
    capacity: "",
    difficulty: "beginner",
    description: "",
     scheduleAt: "",
    isActive: true,
  });

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  // ================= EFFECTS =================
  useEffect(() => {
    if (isAuthenticated) loadClasses();
    // eslint-disable-next-line
  }, [isAuthenticated]);

 useEffect(() => {
  filterClasses();
}, [searchTerm, categoryFilter, fromDate, toDate, classes]);


  // ================= API =================
  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/training-classes");
      setClasses(res.data);

      const uniqueCategories = [
        ...new Set(res.data.map((c) => c.category)),
      ];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (err) {
      setAlert("Error fetching training classes", "error");
      setLoading(false);
    }
  };

  // ================= FILTER =================
 const filterClasses = () => {
  let filtered = classes;

  // 🔍 Search
  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (c.description && c.description.toLowerCase().includes(s))
    );
  }

  // 🏷 Category
  if (categoryFilter !== "all") {
    filtered = filtered.filter((c) => c.category === categoryFilter);
  }

  // 📅 FROM date
  if (fromDate) {
    filtered = filtered.filter(
      (c) => new Date(c.scheduleAt) >= new Date(fromDate)
    );
  }

  // 📅 TO date
  if (toDate) {
    filtered = filtered.filter(
      (c) => new Date(c.scheduleAt) <= new Date(toDate)
    );
  }

  setFilteredClasses(filtered);
};


  // ================= FORM =================
  const openAddForm = () => {
    setEditingClass(null);
    setFormData({
      name: "",
      category: "",
      duration: "",
      capacity: "",
      difficulty: "beginner",
      description: "",
       scheduleAt: "",
      isActive: true,
    });
    setOpenForm(true);
  };

  const openEditForm = (item) => {
    setEditingClass(item);
    setFormData({
      name: item.name,
      category: item.category,
      duration: item.duration,
      capacity: item.capacity,
      difficulty: item.difficulty,
      description: item.description || "",
      scheduleAt: item.scheduleAt
      ? item.scheduleAt.slice(0, 16) // ✅ IMPORTANT
      : "",
      isActive: item.isActive,
    });
    setOpenForm(true);
  };

  const handleSave = async () => {
    try {
        if (!formData.scheduleAt) {
  setAlert("Schedule date & time is required", "error");
  return;
}

      if (editingClass) {
        if (!formData.scheduleAt) {
  setAlert("Please select date & time", "error");
  return;
}

        await axios.put(
          `/api/training-classes/${editingClass._id}`,
          formData
        );
        setAlert("Training class updated", "success");
      } else {
        await axios.post("/api/training-classes", formData);
        setAlert("Training class created", "success");
      }
      setOpenForm(false);
      loadClasses();
    } catch (err) {
      setAlert(err.response?.data?.msg || "Save failed", "error");
    }
  };

  // ================= DELETE =================
  const openDeleteDialog = (item) => {
    setClassToDelete(item);
    setDeleteDialogOpen(true);
  };

  const deleteClass = async () => {
    try {
      await axios.delete(`/api/training-classes/${classToDelete._id}`);
      setAlert("Training class deleted", "success");
      setDeleteDialogOpen(false);
      loadClasses();
    } catch (err) {
      setAlert("Delete failed", "error");
    }
  };

  if (loading) return <LoadingSpinner />;

  // ================= UI =================
  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Training Classes</Typography>
          {canModify && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddForm}
            >
              Add Training Class
            </Button>
          )}
        </Grid>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
<Grid item xs={12} sm={6} md={4}>
  <TextField
    fullWidth
    label="From Date"
    type="datetime-local"
    InputLabelProps={{ shrink: true }}
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
  />
</Grid>

<Grid item xs={12} sm={6} md={4}>
  <TextField
    fullWidth
    label="To Date"
    type="datetime-local"
    InputLabelProps={{ shrink: true }}
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
  />
</Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Schedule</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredClasses.length ? (
                filteredClasses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Chip label={item.category} size="small" />
                      </TableCell>
                      <TableCell>{item.duration} min</TableCell>
                      <TableCell>{item.capacity}</TableCell>
                      <TableCell>
  {new Date(item.scheduleAt).toLocaleString()}
</TableCell>

                      <TableCell align="right">
                        {canModify && (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => openEditForm(item)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => openDeleteDialog(item)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                 <TableCell colSpan={6} align="center">

                    No training classes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredClasses.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>
          {editingClass ? "Edit Training Class" : "Add Training Class"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
<TextField
  fullWidth
  margin="dense"
  label="Schedule Date & Time"
  type="datetime-local"
  InputLabelProps={{ shrink: true }}
  value={formData.scheduleAt}
  onChange={(e) =>
    setFormData({ ...formData, scheduleAt: e.target.value })
  }
/>

          <TextField
            fullWidth
            margin="dense"
            label="Duration (min)"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={deleteClass}
        title="Delete Training Class"
        content={`Are you sure you want to delete "${classToDelete?.name}"?`}
      />
    </Container>
  );
};

export default TrainingClasses;
