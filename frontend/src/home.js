import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Box } from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone';

const axios = require("axios").default;

const severity = (cls) => {
  if (!cls) return { color: "#1976d2", label: "", icon: "" };
  const n = cls.toLowerCase();
  if (n.includes("healthy")) return { color: "#2e7d32", label: "Plant is healthy", icon: "✓" };
  if (n.includes("early")) return { color: "#f57c00", label: "Moderate severity", icon: "⚠" };
  if (n.includes("late")) return { color: "#c62828", label: "High severity — urgent treatment needed", icon: "⚠" };
  return { color: "#1976d2", label: "", icon: "" };
};

const useStyles = makeStyles((theme) => ({
  "@global": {
    "@keyframes fadeUp": {
      "0%": { opacity: 0, transform: "translateY(30px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
    "@keyframes float": {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-8px)" },
    },
    "@keyframes flowPulse": {
      "0%, 100%": { opacity: 0.4 },
      "50%": { opacity: 1 },
    },
  },
  root: { fontFamily: "'Inter', sans-serif" },
  grow: { flexGrow: 1 },
  appbar: { background: "linear-gradient(90deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)", boxShadow: "0px 6px 24px rgba(0,0,0,0.18)" },
  title: { fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: "0.5px", fontSize: "1.5rem" },
  badge: { background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: "11px", fontWeight: 600, letterSpacing: "1px" },
  heroSection: { background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)", padding: "50px 20px 70px 20px", display: "flex", flexDirection: "column", alignItems: "center" },
  hero: { textAlign: "center", marginBottom: 32, maxWidth: 600, animation: "$fadeUp 0.8s ease both" },
  heroTitle: { fontFamily: "'Inter', sans-serif", fontSize: "2.4rem", fontWeight: 800, color: "#1b5e20", marginBottom: 10, lineHeight: 1.2 },
  heroSub: { fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#558b2f", fontWeight: 500 },
  card: { width: "100%", maxWidth: 560, borderRadius: 24, background: "white", boxShadow: "0 24px 70px rgba(27,94,32,0.22), 0 8px 16px rgba(0,0,0,0.08)", overflow: "hidden", animation: "$fadeUp 0.9s ease both" },
  previewWrap: { width: "100%", height: 260, overflow: "hidden", background: "#000" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  dropContent: { padding: 32 },
  dropzone: {
    border: "2px dashed #66bb6a !important", borderRadius: "16px",
    backgroundColor: "rgba(102, 187, 106, 0.06) !important", minHeight: "280px !important",
    "& p": { fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 500, color: "#2e7d32" },
    "& svg": { color: "#43a047", fontSize: "60px !important" },
  },
  loadingBox: { padding: 40, textAlign: "center" },
  resultPanel: { padding: "28px 32px 32px 32px" },
  resultLabel: { fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "1.8px", textTransform: "uppercase" },
  diseaseName: { fontFamily: "'Inter', sans-serif", fontSize: "2rem", fontWeight: 800, margin: "8px 0 14px 0", lineHeight: 1.1 },
  chip: { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 30, fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "white", letterSpacing: "0.3px" },
  confWrap: { marginTop: 28 },
  confRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 },
  confNum: { fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 800 },
  barTrack: { height: 12, borderRadius: 8, backgroundColor: "#eef2f0", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 8, transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" },
  btn: {
    marginTop: 28, width: "100%", padding: "14px", borderRadius: 14, fontFamily: "'Inter', sans-serif",
    fontWeight: 700, textTransform: "none", fontSize: "15px",
    background: "linear-gradient(90deg, #2e7d32, #43a047)", color: "white",
    boxShadow: "0 6px 16px rgba(46,125,50,0.3)",
    "&:hover": { background: "linear-gradient(90deg, #1b5e20, #388e3c)", boxShadow: "0 8px 22px rgba(46,125,50,0.4)" },
  },
  section: { padding: "80px 20px", maxWidth: 1100, margin: "0 auto" },
  sectionAlt: { background: "#f5f9f5" },
  sectionDark: { background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)", color: "white" },
  sectionLabel: { fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, color: "#43a047", letterSpacing: "3px", textTransform: "uppercase", textAlign: "center", marginBottom: 10 },
  sectionLabelLight: { color: "#a5d6a7" },
  sectionTitle: { fontFamily: "'Inter', sans-serif", fontSize: "2.2rem", fontWeight: 800, color: "#1b5e20", textAlign: "center", marginBottom: 16 },
  sectionTitleLight: { color: "white" },
  sectionSub: { fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#666", textAlign: "center", maxWidth: 600, margin: "0 auto 50px auto" },
  sectionSubLight: { color: "#c8e6c9" },
  workflow: { display: "flex", justifyContent: "space-between", alignItems: "stretch", gap: 20, flexWrap: "wrap" },
  step: {
    flex: "1 1 240px", background: "white", borderRadius: 20, padding: "32px 24px", textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)", border: "1px solid #e8f5e9",
    transition: "transform 0.3s ease, box-shadow 0.3s ease", position: "relative",
    "&:hover": { transform: "translateY(-8px)", boxShadow: "0 18px 50px rgba(46,125,50,0.15)" },
  },
  stepIcon: {
    width: 78, height: 78, borderRadius: "50%",
    background: "linear-gradient(135deg, #2e7d32, #66bb6a)", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px",
    margin: "0 auto 18px auto", boxShadow: "0 8px 24px rgba(46,125,50,0.3)",
    animation: "$float 3s ease-in-out infinite",
  },
  stepNum: { fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: "#43a047", letterSpacing: "2px", marginBottom: 6 },
  stepTitle: { fontFamily: "'Inter', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#1b5e20", marginBottom: 8 },
  stepDesc: { fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#666", lineHeight: 1.6 },
  arrow: { fontSize: "32px", color: "#a5d6a7", display: "flex", alignItems: "center", fontWeight: 800 },
  // ARCHITECTURE
  archGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40, "@media (max-width: 800px)": { gridTemplateColumns: "1fr" } },
  archCard: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "26px 24px", backdropFilter: "blur(10px)" },
  archCardTitle: { fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, color: "#a5d6a7", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 },
  fileTree: {
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: "13px", lineHeight: 1.85, color: "#e8f5e9", whiteSpace: "pre", margin: 0,
  },
  fileNote: { color: "#81c784", fontStyle: "italic" },
  flowSteps: { display: "flex", flexDirection: "column", gap: 10 },
  flowStep: { display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 10, borderLeft: "3px solid #66bb6a" },
  flowNum: {
    width: 28, height: 28, borderRadius: "50%", background: "#66bb6a", color: "#1b5e20",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 800, flexShrink: 0,
  },
  flowText: { fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#e8f5e9", fontWeight: 500 },
  flowCode: { fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#a5d6a7", background: "rgba(0,0,0,0.25)", padding: "2px 8px", borderRadius: 4, marginLeft: 6 },
  stackRow: { display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 12 },
  stackChip: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
    background: "rgba(255,255,255,0.1)", borderRadius: 30, border: "1px solid rgba(255,255,255,0.2)",
    fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "white",
  },
  stackEmoji: { fontSize: "18px" },
  // DISEASES
  diseaseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  diseaseCard: { borderRadius: 20, overflow: "hidden", background: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", transition: "transform 0.3s ease, box-shadow 0.3s ease", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" } },
  diseaseHeader: { padding: "28px 24px 22px 24px", color: "white" },
  diseaseEmoji: { fontSize: "44px", marginBottom: 10, display: "block" },
  diseaseName2: { fontFamily: "'Inter', sans-serif", fontSize: "1.4rem", fontWeight: 800, marginBottom: 4 },
  diseaseTag: { fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, opacity: 0.9, letterSpacing: "1px", textTransform: "uppercase" },
  diseaseBody: { padding: "20px 24px 24px 24px" },
  diseaseDesc: { fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#555", lineHeight: 1.65, marginBottom: 14 },
  diseaseSymptoms: { fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: "#888", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 },
  symptomList: { margin: 0, paddingLeft: 18, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#555", lineHeight: 1.7 },
  statsRow: { display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap", marginTop: 50, padding: "40px 20px" },
  stat: { textAlign: "center" },
  statNum: { fontFamily: "'Inter', sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#2e7d32", lineHeight: 1 },
  statLabel: { fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#666", fontWeight: 600, marginTop: 6, letterSpacing: "0.5px" },
  footer: { background: "#0d3d11", color: "white", padding: "30px 20px", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "14px" },
}));

const workflowSteps = [
  { num: "STEP 01", icon: "📤", title: "Upload Leaf Image", desc: "Drag and drop or click to upload a photo of a potato leaf from your device." },
  { num: "STEP 02", icon: "🧠", title: "AI Analysis", desc: "Our CNN model processes the image through trained convolutional layers in seconds." },
  { num: "STEP 03", icon: "🌿", title: "Get Diagnosis", desc: "Receive instant classification with confidence score and severity level." },
];

const fileTreeText = `farmsenseAI/
├── API/
│   └── main.py             # FastAPI server
├── frontend/
│   ├── src/
│   │   ├── App.js          # Root component
│   │   ├── home.js         # Main UI
│   │   └── index.js        # Entry point
│   ├── public/
│   └── package.json
├── saved_model/            # CNN model (TF SavedModel)
│   ├── saved_model.pb
│   └── variables/
├── potato_diseases.ipynb   # Training notebook
└── requirements.txt`;

const flowItems = [
  { n: 1, text: "User uploads image", code: "POST /predict" },
  { n: 2, text: "FastAPI receives multipart file", code: "UploadFile" },
  { n: 3, text: "Pillow opens → NumPy array", code: "(H,W,3)" },
  { n: 4, text: "Expand dims for batch", code: "(1,H,W,3)" },
  { n: 5, text: "TensorFlow CNN inference", code: "model.signatures" },
  { n: 6, text: "Softmax → argmax", code: "np.argmax()" },
  { n: 7, text: "Return JSON to React", code: "{class, confidence}" },
];

const techStack = [
  { name: "React", emoji: "⚛️" },
  { name: "FastAPI", emoji: "⚡" },
  { name: "TensorFlow", emoji: "🧠" },
  { name: "Uvicorn", emoji: "🚀" },
  { name: "Pillow", emoji: "🖼️" },
  { name: "NumPy", emoji: "🔢" },
];

const diseases = [
  {
    name: "Healthy", tag: "No infection detected",
    color: "linear-gradient(135deg, #2e7d32, #66bb6a)", emoji: "🌿",
    desc: "The leaf shows no signs of disease. Continue regular monitoring and maintain good agricultural practices.",
    symptoms: ["Uniform green color", "No spots or lesions", "Healthy leaf texture"],
  },
  {
    name: "Early Blight", tag: "Moderate severity",
    color: "linear-gradient(135deg, #ef6c00, #ffa726)", emoji: "🍂",
    desc: "Caused by the fungus Alternaria solani. Early detection allows for effective treatment with fungicides.",
    symptoms: ["Dark concentric ring spots", "Yellow halos around lesions", "Lower leaves affected first"],
  },
  {
    name: "Late Blight", tag: "High severity — urgent",
    color: "linear-gradient(135deg, #b71c1c, #e53935)", emoji: "🥀",
    desc: "Caused by Phytophthora infestans. Highly destructive — caused the Irish Potato Famine. Immediate action required.",
    symptoms: ["Dark water-soaked lesions", "White fungal growth underside", "Rapid spread in moist conditions"],
  },
];

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendFile = async () => {
    if (!image) return;
    setIsLoading(true);
    let formData = new FormData();
    formData.append("file", selectedFile);
    try {
      let res = await axios({ method: "post", url: process.env.REACT_APP_API_URL, data: formData });
      if (res.status === 200) setData(res.data);
    } catch (err) { console.error("Prediction error:", err); }
    setIsLoading(false);
  };

  const clearAll = () => { setData(undefined); setImage(false); setSelectedFile(undefined); setPreview(undefined); };

  useEffect(() => {
    if (!selectedFile) { setPreview(undefined); return; }
    setPreview(URL.createObjectURL(selectedFile));
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    sendFile();
    // eslint-disable-next-line
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) { setSelectedFile(undefined); setImage(false); setData(undefined); return; }
    setSelectedFile(files[0]); setData(undefined); setImage(true);
  };

  const confidence = data ? (parseFloat(data.confidence) * 100).toFixed(2) : 0;
  const sev = data ? severity(data.class) : { color: "#1976d2", label: "", icon: "" };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title}>🌱 FarmSenseAI</Typography>
          <div className={classes.grow} />
          <span className={classes.badge}>POTATO DISEASE</span>
        </Toolbar>
      </AppBar>

      <Box className={classes.heroSection}>
        <Box className={classes.hero}>
          <Typography className={classes.heroTitle}>Detect potato leaf diseases instantly</Typography>
          <Typography className={classes.heroSub}>Upload a leaf image and our AI will identify Early Blight, Late Blight, or confirm a healthy plant.</Typography>
        </Box>
        <Card className={classes.card}>
          {image && preview && (<div className={classes.previewWrap}><img className={classes.previewImg} src={preview} alt="Uploaded leaf" /></div>)}
          {!image && (
            <CardContent className={classes.dropContent}>
              <DropzoneArea acceptedFiles={['image/*']} dropzoneText={"Drag & drop a potato leaf image, or click to browse"}
                onChange={onSelectFile} filesLimit={1} showPreviewsInDropzone={false} showAlerts={false}
                classes={{ root: classes.dropzone }} />
            </CardContent>
          )}
          {isLoading && (
            <Box className={classes.loadingBox}>
              <CircularProgress style={{ color: '#43a047' }} size={42} />
              <Typography style={{ marginTop: 16, color: '#666', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Analyzing leaf with AI...</Typography>
            </Box>
          )}
          {data && !isLoading && (
            <CardContent className={classes.resultPanel}>
              <Typography className={classes.resultLabel}>Detected Condition</Typography>
              <Typography className={classes.diseaseName} style={{ color: sev.color }}>{data.class}</Typography>
              <span className={classes.chip} style={{ background: sev.color }}>{sev.icon} {sev.label}</span>
              <Box className={classes.confWrap}>
                <Box className={classes.confRow}>
                  <Typography className={classes.resultLabel}>Model Confidence</Typography>
                  <Typography className={classes.confNum} style={{ color: sev.color }}>{confidence}%</Typography>
                </Box>
                <Box className={classes.barTrack}>
                  <Box className={classes.barFill} style={{ width: `${confidence}%`, background: `linear-gradient(90deg, ${sev.color}, ${sev.color}dd)` }} />
                </Box>
              </Box>
              <Button className={classes.btn} onClick={clearAll} variant="contained" disableElevation>Upload Another Image</Button>
            </CardContent>
          )}
        </Card>
      </Box>

      {/* HOW IT WORKS */}
      <Box className={classes.section}>
        <Typography className={classes.sectionLabel}>How it works</Typography>
        <Typography className={classes.sectionTitle}>Three simple steps</Typography>
        <Typography className={classes.sectionSub}>From upload to diagnosis in under 2 seconds, powered by a deep learning model trained on thousands of leaf images.</Typography>
        <Box className={classes.workflow}>
          {workflowSteps.map((s, i) => (
            <React.Fragment key={i}>
              <Box className={classes.step}>
                <Box className={classes.stepIcon} style={{ animationDelay: `${i * 0.3}s` }}>{s.icon}</Box>
                <Typography className={classes.stepNum}>{s.num}</Typography>
                <Typography className={classes.stepTitle}>{s.title}</Typography>
                <Typography className={classes.stepDesc}>{s.desc}</Typography>
              </Box>
              {i < workflowSteps.length - 1 && <Box className={classes.arrow}>→</Box>}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* ARCHITECTURE */}
      <Box className={`${classes.sectionDark}`} style={{ padding: "80px 20px" }}>
        <Box style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Typography className={`${classes.sectionLabel} ${classes.sectionLabelLight}`}>Architecture</Typography>
          <Typography className={`${classes.sectionTitle} ${classes.sectionTitleLight}`}>Behind the scenes</Typography>
          <Typography className={`${classes.sectionSub} ${classes.sectionSubLight}`}>A full-stack AI pipeline — React frontend, FastAPI backend, and a TensorFlow CNN model working together.</Typography>

          <Box className={classes.archGrid}>
            <Box className={classes.archCard}>
              <Typography className={classes.archCardTitle}>📁 Project Structure</Typography>
              <pre className={classes.fileTree}>{fileTreeText}</pre>
            </Box>

            <Box className={classes.archCard}>
              <Typography className={classes.archCardTitle}>⚡ Request Pipeline</Typography>
              <Box className={classes.flowSteps}>
                {flowItems.map((f) => (
                  <Box key={f.n} className={classes.flowStep}>
                    <Box className={classes.flowNum}>{f.n}</Box>
                    <Typography className={classes.flowText}>{f.text}<span className={classes.flowCode}>{f.code}</span></Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Typography className={classes.archCardTitle} style={{ textAlign: "center", marginTop: 40 }}>🛠️ Tech Stack</Typography>
          <Box className={classes.stackRow}>
            {techStack.map((t, i) => (
              <Box key={i} className={classes.stackChip}>
                <span className={classes.stackEmoji}>{t.emoji}</span>{t.name}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* DISEASE CLASSIFICATION */}
      <Box className={classes.sectionAlt} style={{ padding: "80px 20px" }}>
        <Box style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Typography className={classes.sectionLabel}>What we detect</Typography>
          <Typography className={classes.sectionTitle}>Three classification categories</Typography>
          <Typography className={classes.sectionSub}>Our model is trained to distinguish between healthy leaves and the two most economically damaging potato diseases.</Typography>
          <Box className={classes.diseaseGrid}>
            {diseases.map((d, i) => (
              <Box key={i} className={classes.diseaseCard}>
                <Box className={classes.diseaseHeader} style={{ background: d.color }}>
                  <span className={classes.diseaseEmoji}>{d.emoji}</span>
                  <Typography className={classes.diseaseName2}>{d.name}</Typography>
                  <Typography className={classes.diseaseTag}>{d.tag}</Typography>
                </Box>
                <Box className={classes.diseaseBody}>
                  <Typography className={classes.diseaseDesc}>{d.desc}</Typography>
                  <Typography className={classes.diseaseSymptoms}>Key Symptoms</Typography>
                  <ul className={classes.symptomList}>{d.symptoms.map((sym, j) => <li key={j}>{sym}</li>)}</ul>
                </Box>
              </Box>
            ))}
          </Box>
          <Box className={classes.statsRow}>
            <Box className={classes.stat}><Typography className={classes.statNum}>97.8%</Typography><Typography className={classes.statLabel}>MODEL ACCURACY</Typography></Box>
            <Box className={classes.stat}><Typography className={classes.statNum}>3</Typography><Typography className={classes.statLabel}>CLASSIFICATIONS</Typography></Box>
            <Box className={classes.stat}><Typography className={classes.statNum}>&lt; 2s</Typography><Typography className={classes.statLabel}>RESPONSE TIME</Typography></Box>
          </Box>
        </Box>
      </Box>

      <Box className={classes.footer}>🌱 FarmSenseAI · CNN Model · Trained on PlantVillage Dataset · Built for smart agriculture</Box>
    </div>
  );
};
