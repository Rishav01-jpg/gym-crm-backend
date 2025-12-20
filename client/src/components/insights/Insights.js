import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

/* =======================
   CHART.JS SETUP
======================= */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

/* =======================
   SAFE DATE HELPERS
======================= */
const safeDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const formatDate = (d) =>
  d && !isNaN(new Date(d).getTime())
    ? new Date(d).toISOString().split("T")[0]
    : "";

/* =======================
   COMPONENT
======================= */
const Insights = () => {
  const [loading, setLoading] = useState(true);

  /* RAW DATA */
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainingClasses, setTrainingClasses] = useState([]);
  const [checkins, setCheckins] = useState([]);
  

  /* FILTERS */
  const [period, setPeriod] = useState("monthly");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());

  /* =======================
     DATE RANGE CHECK
  ======================= */
  const isInRange = (date) => {
    const d = safeDate(date);
    if (!d) return false;
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  };

  /* =======================
     LOAD ALL DATA (ALL APIs)
  ======================= */
  const loadInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { "x-auth-token": token };

      const paymentsRes = await axios.get("/api/payments", { headers });
      const membersRes = await axios.get("/api/members", { headers });
      const trainingRes = await axios.get("/api/training-classes", { headers });
      const checkinsRes = await axios.get(
        "/api/members?limit=50&sort=firstName",
        { headers }
      );

      const qs =
        startDate && endDate
          ? `?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
          : "";

     

      setPayments(paymentsRes.data || []);
      setMembers(membersRes.data || []);
      setTrainingClasses(trainingRes.data || []);
      setCheckins(checkinsRes.data || []);
     

      setLoading(false);
    } catch (err) {
      console.error("Insights error:", err);
      setLoading(false);
    }
  };

  /* =======================
     PERIOD AUTO SET
  ======================= */
  useEffect(() => {
    const now = new Date();

    if (period === "daily") {
      setStartDate(new Date(now.setHours(0, 0, 0, 0)));
      setEndDate(new Date());
    }

    if (period === "weekly") {
      const s = new Date();
      s.setDate(s.getDate() - 7);
      setStartDate(s);
      setEndDate(new Date());
    }

    if (period === "monthly") {
      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setEndDate(new Date());
    }

    if (period !== "custom") {
      loadInsights();
    }
  }, [period]);

  useEffect(() => {
    loadInsights();
  }, []);

  /* =======================
     FILTERED DATA
  ======================= */
  const filteredPayments = payments.filter(
    (p) => p.paymentStatus === "completed" && isInRange(p.paymentDate)
  );

  const filteredMembers = members.filter((m) => isInRange(m.createdAt));
  const filteredTraining = trainingClasses.filter((t) =>
    isInRange(t.createdAt)
  );
  const filteredCheckins = checkins.filter((c) =>
    isInRange(c.createdAt)
  );
 

  /* =======================
     TOTALS
  ======================= */
  const totalRevenue = filteredPayments.reduce(
    (s, p) => s + Number(p.amount || 0),
    0
  );

 

  const membersCount = filteredMembers.length;
  const trainingCount = filteredTraining.length;
  const checkinsCount = filteredCheckins.length;

  /* =======================
     THIN BAR CHART CONFIG
  ======================= */
  const thinBar = (label, value, color) => ({
    labels: ["Selected Period"],
    datasets: [
      {
        label,
        data: [value],
        backgroundColor: color,
        barThickness: 25,
      },
    ],
  });

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  /* =======================
     UI
  ======================= */
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Insights
      </Typography>

      {/* FILTERS */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          select
          label="Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </TextField>

        {period === "custom" && (
          <>
            <TextField
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={formatDate(startDate)}
              onChange={(e) => setStartDate(safeDate(e.target.value))}
            />
            <TextField
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={formatDate(endDate)}
              onChange={(e) => setEndDate(safeDate(e.target.value))}
            />
          </>
        )}
      </Box>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3}>
        {[
          ["Revenue", `₹${totalRevenue}`],
         
          ["Members", membersCount],
          ["Training Classes", trainingCount],
          ["Check-ins", checkinsCount],
        ].map(([title, value], i) => (
          <Grid item xs={12} md={2.4} key={i}>
            <Card>
              <CardContent>
                <Typography>{title}</Typography>
                <Typography variant="h5">{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* BAR CHARTS */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography>Revenue</Typography>
            <Bar data={thinBar("Revenue", totalRevenue, "#4caf50")} />
          </CardContent></Card>
        </Grid>

       

        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography>Members</Typography>
            <Bar data={thinBar("Members", membersCount, "#2196f3")} />
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography>Training Classes</Typography>
            <Bar data={thinBar("Training Classes", trainingCount, "#ff9800")} />
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography>Check-ins</Typography>
            <Bar data={thinBar("Check-ins", checkinsCount, "#9c27b0")} />
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Insights;
