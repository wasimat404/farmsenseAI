import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import cblogo from "./cblogo.PNG";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';




const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appbar: {
    background: "linear-gradient(90deg, #4cafef, #1976d2)",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
  },
  title: {
    fontWeight: 700,
    letterSpacing: "1px",
  },
  mainContainer: {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "93vh",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  gridContainer: {
    justifyContent: "center",
  },
  imageCard: {
    margin: "auto",
    width: "100%",
    maxWidth: 480,
    minHeight: 500,
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 50px rgba(0,0,0,0.3)",
    },
  },
  media: {
    height: 400,
    borderRadius: "15px 15px 0 0",
    objectFit: "cover",
  },
  content: {
    padding: theme.spacing(3),
    textAlign: "center",
  },
  detail: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "0 0 15px 15px",
    padding: theme.spacing(2),
  },
  tableCell: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1976d2",
  },
  tableCell1: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#444",
  },
  dropzone: {
    border: "2px dashed #1976d2 !important",
    borderRadius: "15px",
    backgroundColor: "rgba(25, 118, 210, 0.05) !important",
    "& p": {
      fontSize: "16px",
      fontWeight: 500,
      color: "#1976d2",
    },
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
    }
  }
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
             Potato Disease Classification
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo}></Avatar>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="image"
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              }
              {!image && <CardContent className={classes.content}>
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag & drop a potato leaf image or click to upload"}
                  onChange={onSelectFile}
                  classes={{ root: classes.dropzone }}
                />
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <TableContainer component={Paper} className={classes.tableContainer}>
                  <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableCell1}>Label:</TableCell>
                        <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                      <TableRow className={classes.tableRow}>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          {data.class}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
