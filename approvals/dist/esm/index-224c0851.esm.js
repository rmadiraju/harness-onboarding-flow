import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const validationLabels = [
  { key: "vulnerabilities", label: "Validate Build Vulnerabilities" },
  { key: "componentTests", label: "Validate Component Tests" },
  { key: "liveDependency", label: "Validate Live-Dependency Tests" },
  { key: "performance", label: "Validate Performance Tests" },
  { key: "changeFreeze", label: "Change Freeze Validation" }
];
const mockReleaseApprovals = [
  {
    release_id: "REL-2001",
    component: "Lease Processor",
    system: "Lease End System",
    ba: "Lease End BA",
    submitted_by: "alice",
    date_submitted: "2024-06-16",
    validations: {
      vulnerabilities: true,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: true
    },
    has_exception: false,
    release_notes: "This release includes bug fixes and performance improvements for Lease Processor."
  },
  {
    release_id: "REL-2002",
    component: "Analytics Engine",
    system: "Lease End Analytics",
    ba: "Lease End BA",
    submitted_by: "bob",
    date_submitted: "2024-06-15",
    validations: {
      vulnerabilities: true,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: true
    },
    has_exception: false,
    release_notes: "Adds new analytics dashboard and improves data pipeline reliability."
  }
];
const mockExceptionApprovals = [
  {
    release_id: "REL-2003",
    component: "Lending Core Service",
    system: "Lending Core",
    ba: "Lending BA",
    submitted_by: "carol",
    date_submitted: "2024-06-14",
    validations: {
      vulnerabilities: false,
      componentTests: true,
      liveDependency: true,
      performance: false,
      changeFreeze: false
    },
    has_exception: true,
    release_notes: "Critical patch for Lending Core Service. Some tests failed but urgent deployment required."
  },
  {
    release_id: "REL-2004",
    component: "Payment Gateway",
    system: "Payment System",
    ba: "Payment BA",
    submitted_by: "david",
    date_submitted: "2024-06-13",
    validations: {
      vulnerabilities: true,
      componentTests: false,
      liveDependency: false,
      performance: true,
      changeFreeze: false
    },
    has_exception: true,
    release_notes: "Security update for Payment Gateway. Performance tests passed but component tests failed."
  }
];
const getReleaseApprovals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReleaseApprovals;
};
const getExceptionApprovals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockExceptionApprovals;
};
const approveRelease = async (releaseId, response) => {
  await new Promise((resolve) => setTimeout(resolve, 1e3));
  console.log(`Release ${releaseId} ${response.approved ? "approved" : "rejected"} with comments: ${response.comments}`);
};

const ApprovalsPage = () => {
  const [releaseApprovals, setReleaseApprovals] = useState([]);
  const [exceptionApprovals, setExceptionApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [comments, setComments] = useState("");
  const [approving, setApproving] = useState(false);
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        const [releases, exceptions] = await Promise.all([
          getReleaseApprovals(),
          getExceptionApprovals()
        ]);
        setReleaseApprovals(releases);
        setExceptionApprovals(exceptions);
      } catch (err) {
        setError("Failed to fetch approvals");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, []);
  const handleOpenModal = (release) => {
    setSelectedRelease(release);
    setModalOpen(true);
    setComments("");
  };
  const handleApprove = async () => {
    if (!selectedRelease)
      return;
    try {
      setApproving(true);
      await approveRelease(selectedRelease.release_id, { approved: true, comments });
      setModalOpen(false);
      setComments("");
      const [releases, exceptions] = await Promise.all([
        getReleaseApprovals(),
        getExceptionApprovals()
      ]);
      setReleaseApprovals(releases);
      setExceptionApprovals(exceptions);
    } catch (err) {
      setError("Failed to approve release");
      console.error(err);
    } finally {
      setApproving(false);
    }
  };
  const handleReject = async () => {
    if (!selectedRelease)
      return;
    try {
      setApproving(true);
      await approveRelease(selectedRelease.release_id, { approved: false, comments });
      setModalOpen(false);
      setComments("");
      const [releases, exceptions] = await Promise.all([
        getReleaseApprovals(),
        getExceptionApprovals()
      ]);
      setReleaseApprovals(releases);
      setExceptionApprovals(exceptions);
    } catch (err) {
      setError("Failed to reject release");
      console.error(err);
    } finally {
      setApproving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement(Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", height: "400px" } }, /* @__PURE__ */ React.createElement(CircularProgress, null));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Box, { sx: { p: 3 } }, /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error));
  }
  return /* @__PURE__ */ React.createElement(Box, { sx: { p: 3 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "h4", gutterBottom: true }, "Approvals"), /* @__PURE__ */ React.createElement(Paper, { sx: { p: 2, mb: 4 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", sx: { mb: 2 } }, "Release Approval Requests (", releaseApprovals.length, ")"), /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, { size: "small" }, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, "Release ID"), /* @__PURE__ */ React.createElement(TableCell, null, "Component"), /* @__PURE__ */ React.createElement(TableCell, null, "System"), /* @__PURE__ */ React.createElement(TableCell, null, "BA"), /* @__PURE__ */ React.createElement(TableCell, null, "Submitted By"), /* @__PURE__ */ React.createElement(TableCell, null, "Date Submitted"))), /* @__PURE__ */ React.createElement(TableBody, null, releaseApprovals.map((release) => /* @__PURE__ */ React.createElement(
    TableRow,
    {
      key: release.release_id,
      hover: true,
      sx: { cursor: "pointer" },
      onClick: () => handleOpenModal(release)
    },
    /* @__PURE__ */ React.createElement(TableCell, { sx: { color: "primary.main", textDecoration: "underline" } }, release.release_id),
    /* @__PURE__ */ React.createElement(TableCell, null, release.component),
    /* @__PURE__ */ React.createElement(TableCell, null, release.system),
    /* @__PURE__ */ React.createElement(TableCell, null, release.ba),
    /* @__PURE__ */ React.createElement(TableCell, null, release.submitted_by),
    /* @__PURE__ */ React.createElement(TableCell, null, release.date_submitted)
  ))))), releaseApprovals.length === 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "body2", sx: { textAlign: "center", py: 2, color: "text.secondary" } }, "No release approval requests found")), /* @__PURE__ */ React.createElement(Paper, { sx: { p: 2 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "h6", sx: { mb: 2 } }, "Exception Approvals (", exceptionApprovals.length, ")"), /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, { size: "small" }, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, "Release ID"), /* @__PURE__ */ React.createElement(TableCell, null, "Component"), /* @__PURE__ */ React.createElement(TableCell, null, "System"), /* @__PURE__ */ React.createElement(TableCell, null, "BA"), /* @__PURE__ */ React.createElement(TableCell, null, "Submitted By"), /* @__PURE__ */ React.createElement(TableCell, null, "Date Submitted"))), /* @__PURE__ */ React.createElement(TableBody, null, exceptionApprovals.map((release) => /* @__PURE__ */ React.createElement(
    TableRow,
    {
      key: release.release_id,
      hover: true,
      sx: { cursor: "pointer" },
      onClick: () => handleOpenModal(release)
    },
    /* @__PURE__ */ React.createElement(TableCell, { sx: { color: "primary.main", textDecoration: "underline" } }, release.release_id),
    /* @__PURE__ */ React.createElement(TableCell, null, release.component),
    /* @__PURE__ */ React.createElement(TableCell, null, release.system),
    /* @__PURE__ */ React.createElement(TableCell, null, release.ba),
    /* @__PURE__ */ React.createElement(TableCell, null, release.submitted_by),
    /* @__PURE__ */ React.createElement(TableCell, null, release.date_submitted)
  ))))), exceptionApprovals.length === 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "body2", sx: { textAlign: "center", py: 2, color: "text.secondary" } }, "No exception approvals found")), /* @__PURE__ */ React.createElement(Dialog, { open: modalOpen, onClose: () => setModalOpen(false), maxWidth: "sm", fullWidth: true }, /* @__PURE__ */ React.createElement(DialogTitle, null, "Release Details"), /* @__PURE__ */ React.createElement(DialogContent, null, selectedRelease && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, "Release ID:"), " ", selectedRelease.release_id), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, "Component:"), " ", selectedRelease.component), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, "System:"), " ", selectedRelease.system), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, "BA:"), " ", selectedRelease.ba), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, "Submitted By:"), " ", selectedRelease.submitted_by), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, "Date Submitted:"), " ", selectedRelease.date_submitted), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, "Has Exception:"), " ", selectedRelease.has_exception ? "Yes" : "No"), /* @__PURE__ */ React.createElement(
    TextField,
    {
      label: "Release Notes",
      multiline: true,
      minRows: 2,
      fullWidth: true,
      value: selectedRelease.release_notes || "",
      InputProps: { readOnly: true },
      sx: { mt: 3 }
    }
  ), /* @__PURE__ */ React.createElement(Box, { sx: { mt: 3 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1", sx: { mb: 1 } }, "Validation Results"), validationLabels.map((validation) => /* @__PURE__ */ React.createElement(Box, { key: validation.key, sx: { display: "flex", alignItems: "center", mb: 1, gap: 1 } }, /* @__PURE__ */ React.createElement(Typography, { sx: { minWidth: 220 } }, validation.label), selectedRelease.validations[validation.key] === true ? /* @__PURE__ */ React.createElement(CheckCircleIcon, { color: "success" }) : /* @__PURE__ */ React.createElement(CancelIcon, { color: "error" })))), /* @__PURE__ */ React.createElement(
    TextField,
    {
      label: "Comments (optional)",
      multiline: true,
      minRows: 2,
      fullWidth: true,
      value: comments,
      onChange: (e) => setComments(e.target.value),
      sx: { mt: 3 }
    }
  ))), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleApprove,
      color: "success",
      variant: "contained",
      disabled: approving
    },
    approving ? /* @__PURE__ */ React.createElement(CircularProgress, { size: 20 }) : "Approve"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleReject,
      color: "error",
      variant: "contained",
      disabled: approving
    },
    approving ? /* @__PURE__ */ React.createElement(CircularProgress, { size: 20 }) : "Reject"
  ), /* @__PURE__ */ React.createElement(Button, { onClick: () => setModalOpen(false), variant: "outlined", disabled: approving }, "Close"))));
};
var ApprovalsPage$1 = ApprovalsPage;

export { ApprovalsPage$1 as default };
//# sourceMappingURL=index-224c0851.esm.js.map
