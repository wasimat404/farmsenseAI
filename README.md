<div align="center">

# 🌱 FarmSenseAI

### AI-powered potato leaf disease detection — instantly.

![Status](https://img.shields.io/badge/status-working-success?style=for-the-badge)
![Python](https://img.shields.io/badge/python-3.10-blue?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/react-17-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/fastapi-0.136-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TensorFlow](https://img.shields.io/badge/tensorflow-2.17-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Docker](https://img.shields.io/badge/docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/aws-EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)

A full-stack ML web app that classifies potato leaf images as **Healthy**, **Early Blight**, or **Late Blight** in under 2 seconds.

</div>

---

## 🌾 The problem

Potato is the world's **2nd most consumed staple food**. But every year, **20–30% of potato crops** are lost to leaf diseases — mainly Early Blight and Late Blight.

Traditional diagnosis takes days. The diseases spread in hours.

**FarmSenseAI bridges that gap** — upload a photo, get a diagnosis instantly.

---

## ✨ What it does

A farmer drags a leaf photo into the web app. Within ~2 seconds, our trained CNN model returns:

- ✅ **Detected disease class** — Healthy, Early Blight, or Late Blight
- 📊 **Confidence score** — how sure the AI is
- 🎨 **Color-coded severity** — green for safe, orange/red for action needed

---

## 🏗️ Architecture

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│             │ HTTP  │             │ Tensor│             │
│   React     │──────▶│   FastAPI   │──────▶│  CNN Model  │
│  Frontend   │ POST  │   Backend   │       │ (TensorFlow)│
│             │◀──────│             │◀──────│             │
└─────────────┘ JSON  └─────────────┘ Pred  └─────────────┘
     :3000              :8000              saved_model/
```

### Request pipeline

1. User uploads a leaf image
2. FastAPI receives the multipart file
3. Pillow opens it → NumPy array
4. Tensor reshape: `(1, 256, 256, 3)`
5. CNN inference
6. Softmax → argmax → label
7. JSON returned to React UI

---

## 🛠️ Tech stack

| Layer | Tools |
|---|---|
| **Frontend** | React 17, Material-UI, Axios, react-dropzone |
| **Backend** | FastAPI, Uvicorn, Python 3.10 |
| **AI / Model** | TensorFlow 2.17, Keras, Pillow, NumPy |
| **Infrastructure** | Docker, Docker Compose, AWS EC2 |
| **Dataset** | PlantVillage (potato leaves) |

---

## 📁 Project structure

```
farmsenseAI/
├── API/
│   ├── main.py              # FastAPI server
│   ├── requerment.txt       # Backend deps
│   └── Dockerfile           # Backend container
├── frontend/
│   ├── src/
│   │   ├── App.js           # Root component
│   │   └── home.js          # Main UI + logic
│   ├── public/
│   ├── package.json
│   └── Dockerfile           # Frontend container
├── saved_model/             # Trained CNN (TF SavedModel)
├── potato_diseases.ipynb    # Training notebook
├── docker-compose.yml       # Orchestrates both services
└── requirements.txt
```

---

## 🚀 Run it locally

### Option 1 — Docker (recommended)

One command, both services up:

```bash
git clone https://github.com/wasimat404/farmsenseAI.git
cd farmsenseAI
docker compose up --build
```

Then open `http://localhost:3000` in your browser.

> ⚠️ If deploying remotely (e.g. on EC2), edit `docker-compose.yml` and replace `REACT_APP_API_URL` with your public IP before building.

### Option 2 — Native (without Docker)

**Backend:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r API/requerment.txt
cd API
python main.py
```

**Frontend (in a separate terminal):**
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

---

## 📊 Model performance

| Metric | Value |
|---|---|
| **Overall accuracy** | 97% |
| **Peak performance** | 99% |
| **Response time** | < 2 seconds |
| **Classes** | 3 (Healthy / Early Blight / Late Blight) |
| **Training data** | PlantVillage dataset |

---

## 🔬 How the model works

The CNN processes images through:

1. **Convolution layers** — detect patterns (edges, textures, lesion shapes)
2. **Pooling layers** — shrink data while keeping important features
3. **Dense layers** — combine features into a final decision
4. **Softmax output** — outputs probabilities across the 3 classes

Trained on the PlantVillage dataset with data augmentation (rotation, flipping, zoom) for robustness.

---

## 🐳 Why Docker?

Without Docker — *"works on my machine"* hell. Manual install of Python, Node, TensorFlow, version mismatches, hours of setup.

With Docker — one command. Same setup runs anywhere. Frontend and backend isolated. Easy to deploy to ECS, Kubernetes, or any cloud.

```bash
docker compose up    # 🎉 entire stack running
```

---

## 🌟 Future scope

- 🌾 **Multi-crop support** — extend to tomatoes, peppers, rice, wheat
- 📱 **Native mobile apps** — Android & iOS for field-level access
- 💡 **Edge AI** — TensorFlow Lite for offline inference on low-power devices
- 🛰️ **IoT integration** — connect to drones and field sensors

---

## 👥 Authors

<div align="center">

</div>

---

## 📜 License

This project is for educational and research purposes. PlantVillage dataset belongs to its original authors.

---

<div align="center">

### 🌱 Built for smarter farming. Powered by AI.

</div>
