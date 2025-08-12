import React, { useState } from 'react';
import { Box, Button, Fade, Grid, Modal as MuiModal, Backdrop } from '@mui/material';

export default function WebModal({ link }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        onClick={handleOpen}
        sx={{
          fontFamily: 'Bruno Ace SC, serif',
          fontStyle: 'normal',
          color: '#7BAFD4',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          position: 'relative',
          "&:hover": { color: '#fff' },
          "&::before": {
            content: "''",
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "#fff",
            transform: "scaleX(0)",
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
          },
          '&:hover::before': {
            transform: "scaleX(1)"
          },
        }}
      >
        Learn more
      </Button>

      <MuiModal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(2px)',
              cursor: 'pointer',
            }
          }
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Fade in={open}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxHeight: '90vh',
              overflowY: 'auto',
              outline: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              width: '90%',
              maxWidth: '600px',
              '& .html-container': {
                all: 'initial',
                fontFamily: 'sans-serif',
                color: 'black',
                width: '100%',
                height: '100%',
              },
              '& .html-container *': {
                all: 'unset',
                display: 'revert',
              },
              '& .html-container p': {
                margin: '1em 0',
                fontSize: '16px',
              },
            }}
          >
            {/* Optional: Use props like title, date, etc. */}
            {/* <Typography variant="h4" id="modal-title" sx={{ fontFamily: 'Bruno Ace SC, serif', color: '#7BAFD4' }}>
              {title}
            </Typography> */}

            <Grid container>
              <Grid item xs={12} sx={{ height: '400px', overflowY: 'auto' }}>
                {/* Replace with real HTML or content viewer */}
                {/* <HTMLViewer html={body} /> */}
                <Box className="html-container">
                  <p>Modal Content Goes Here</p>
                </Box>
              </Grid>
            </Grid>

            <Box mt={2} textAlign="right">
              <Button onClick={handleClose}>Close</Button>
            </Box>
          </Box>
        </Fade>
      </MuiModal>
    </div>
  );
}
