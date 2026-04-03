import{r as d,j as e,B as b,L as v,S as k,g as S}from"./index-D3YuJ2W0.js";const w=[{id:"fixmystreet",title:"FixMyStreet",city:"London",country:"UK",category:"citizen-reporting",problem:"Citizens had no quick, centralised way to report potholes, broken street lights, or graffiti. Reports were lost across council phone lines and email inboxes.",solution:"FixMyStreet lets anyone drop a pin on a map, describe the issue, and attach a photo. The platform automatically routes the report to the correct local authority using boundary data. Councils receive structured tickets they can triage, assign, and close with public status updates.",impact:"Over 2 million reports filed across the UK, with average council response times dropping by 30% in participating boroughs.",techStack:["HTML","CSS","JavaScript","REST API","Leaflet.js","PostgreSQL"],difficulty:"starter",codeSnippet:`// FixMyStreet-style report submission form (vanilla JS)
// Drop this into an HTML page with a <form id="reportForm"> and a Leaflet map.

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const report = {
    latitude: parseFloat(document.getElementById("lat").value),
    longitude: parseFloat(document.getElementById("lng").value),
    category: document.getElementById("category").value,   // e.g. "pothole"
    description: document.getElementById("description").value,
    photo_url: document.getElementById("photoUrl").value || null,
    reported_at: new Date().toISOString(),
  };

  try {
    const res = await fetch("https://api.city.example/v1/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    const data = await res.json();
    alert(\`Report #\${data.id} submitted! Track it at /reports/\${data.id}\`);
  } catch (err) {
    console.error("Submission failed:", err);
    alert("Could not submit report. Please try again.");
  }
});`,repoHint:"Search GitHub for 'mysociety/fixmystreet' -- the original open-source Perl/Catalyst codebase that powers FixMyStreet.com and dozens of international forks.",tags:["open-source","civic-tech","reporting","map","local-government"]},{id:"seoul-digital-mayor",title:"Seoul Digital Mayor's Office",city:"Seoul",country:"South Korea",category:"civic-ai",problem:"Seoul's 10-million-plus residents overwhelmed call centres with repetitive questions about permits, taxes, and public services. Wait times exceeded 20 minutes at peak hours.",solution:"The Digital Mayor's Office deployed an AI chatbot that understands natural-language queries in Korean and English, classifies them by department, and either answers directly from a knowledge base or escalates to a human agent with full context. The system continuously learns from resolved tickets to improve future routing accuracy.",impact:"Call centre volume dropped 35% within the first year, and citizen satisfaction scores for city services rose by 12 percentage points.",techStack:["Python","FastAPI","OpenAI API","PostgreSQL","Redis","Docker"],difficulty:"intermediate",codeSnippet:`# Civic AI query router -- classifies a citizen question and drafts a response.
# Requires: pip install openai

import openai

DEPARTMENT_PROMPT = """You are a municipal services assistant for a large city.
Given a citizen's question, respond with JSON:
{
  "department": "one of: tax, permits, transit, waste, housing, health, other",
  "answer": "a concise, helpful answer (2-3 sentences)",
  "needs_human": true/false
}
Only set needs_human to true if the question involves a complaint, legal issue,
or something you cannot answer from general municipal knowledge."""

def route_citizen_query(question: str) -> dict:
    """Classify and answer a citizen query using an LLM."""
    client = openai.OpenAI()  # uses OPENAI_API_KEY env var
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": DEPARTMENT_PROMPT},
            {"role": "user", "content": question},
        ],
        temperature=0.2,
    )
    import json
    return json.loads(response.choices[0].message.content)

# Example usage:
# result = route_citizen_query("How do I renew my business permit?")
# print(result)
# => {"department": "permits", "answer": "You can renew ...", "needs_human": false}`,repoHint:"Look at 'langchain-ai/langchain' for retrieval-augmented generation patterns, or 'run-llama/llama_index' for building knowledge-base chatbots over municipal documents.",tags:["AI","chatbot","NLP","citizen-services","automation"]},{id:"barcelona-superblocks",title:"Barcelona Superblocks",city:"Barcelona",country:"Spain",category:"mobility",problem:"Barcelona's Eixample grid suffered from severe traffic congestion and air pollution, with NO2 levels consistently above EU limits. Pedestrians competed with cars for limited public space.",solution:"The Superblocks programme groups nine city blocks into a single 'superblock' where through-traffic is redirected to perimeter roads. Interior streets become shared spaces for pedestrians, cyclists, and play. Sensor networks measure traffic flow before and after implementation to guide iterative redesign.",impact:"Pilot superblocks reduced vehicle traffic by 25% inside treated areas and cut NO2 levels by 20-25%, while local retail foot traffic increased.",techStack:["Python","pandas","Matplotlib","GIS / QGIS","traffic sensors"],difficulty:"intermediate",codeSnippet:`# Superblock traffic analysis -- compare vehicle counts before/after intervention.
# Requires: pip install pandas matplotlib

import pandas as pd
import matplotlib.pyplot as plt

# Sample sensor data: hourly vehicle counts at an intersection
data = {
    "hour": list(range(24)) * 2,
    "vehicles": [
        # Before superblock (24 hrs)
        120, 80, 45, 30, 35, 90, 250, 480, 520, 430, 390, 410,
        450, 420, 400, 460, 510, 540, 480, 350, 280, 210, 180, 150,
        # After superblock (24 hrs)
        90, 60, 30, 20, 25, 60, 160, 310, 340, 280, 250, 270,
        300, 280, 260, 300, 340, 370, 320, 230, 180, 140, 120, 100,
    ],
    "period": ["before"] * 24 + ["after"] * 24,
}

df = pd.DataFrame(data)

fig, ax = plt.subplots(figsize=(10, 5))
for label, group in df.groupby("period"):
    ax.plot(group["hour"], group["vehicles"], marker="o", label=label.capitalize())

ax.set_xlabel("Hour of day")
ax.set_ylabel("Vehicles per hour")
ax.set_title("Superblock impact: vehicle counts at Carrer de Girona")
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("superblock_traffic.png", dpi=150)
print(f"Before avg: {df[df.period=='before'].vehicles.mean():.0f} veh/hr")
print(f"After avg:  {df[df.period=='after'].vehicles.mean():.0f} veh/hr")
print(f"Reduction:  {1 - df[df.period=='after'].vehicles.mean() / df[df.period=='before'].vehicles.mean():.1%}")`,repoHint:"Search GitHub for 'cityflows' or 'uber/kepler.gl' for open-source traffic visualisation tools. Also see 'a]b-street/abstreet' for urban traffic simulation.",tags:["urban-design","traffic","data-analysis","pedestrian","air-quality"]},{id:"taipei-itrash",title:"Taipei iTrash",city:"Taipei",country:"Taiwan",category:"smart-infrastructure",problem:"Taipei's waste collection relied on musical garbage trucks that residents had to chase on foot. Missed pickups meant bags piling up on sidewalks.",solution:"The iTrash system equips every garbage truck with a GPS transponder broadcasting its real-time location to a public API. A companion app and web map show the truck's ETA for each stop, letting residents time their trip to the kerb. Smart bins at high-traffic locations weigh incoming waste and send fill-level data to optimise routes.",impact:"Missed-collection complaints fell by 40%, and route optimisation reduced fuel consumption by 15% across the fleet.",techStack:["JavaScript","Leaflet.js","WebSocket","GPS trackers","Node.js"],difficulty:"starter",codeSnippet:`// Real-time garbage truck tracker using Leaflet and a WebSocket feed.
// Drop into an HTML page with <div id="map" style="height:100vh"></div>
// Requires: leaflet CSS/JS from CDN

const map = L.map("map").setView([25.033, 121.565], 13); // Taipei centre

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const truckIcon = L.icon({
  iconUrl: "/icons/truck.png",  // swap for your own icon
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const trucks = {};  // truckId -> L.marker

// Connect to the city's real-time GPS feed
const ws = new WebSocket("wss://api.city.example/ws/trucks");

ws.onmessage = (event) => {
  const { truckId, lat, lng, route, eta } = JSON.parse(event.data);

  if (trucks[truckId]) {
    // Update existing marker position smoothly
    trucks[truckId].setLatLng([lat, lng]);
    trucks[truckId].setPopupContent(
      \`<b>Truck \${truckId}</b><br>Route: \${route}<br>Next stop ETA: \${eta}\`
    );
  } else {
    // Create new marker for this truck
    trucks[truckId] = L.marker([lat, lng], { icon: truckIcon })
      .addTo(map)
      .bindPopup(\`<b>Truck \${truckId}</b><br>Route: \${route}\`);
  }
};

ws.onerror = (err) => console.error("WebSocket error:", err);`,repoHint:"Look at 'transitland/transitland-server' for GTFS-based transit APIs, or 'openstreetmap/leaflet' for map rendering. Search for 'fleet-tracking open source' on GitHub.",tags:["real-time","GPS","waste-management","maps","IoT"]},{id:"amsterdam-smart-traffic",title:"Amsterdam Smart Traffic",city:"Amsterdam",country:"Netherlands",category:"smart-infrastructure",problem:"Fixed-cycle traffic lights caused unnecessary idling at low-traffic intersections and long queues during peak hours, wasting fuel and increasing emissions.",solution:"Amsterdam installed induction loops and camera sensors at key intersections, feeding real-time vehicle and cyclist counts to a central controller. The controller dynamically adjusts green-phase durations, prioritises trams and emergency vehicles, and coordinates adjacent intersections to create 'green waves' along major corridors.",impact:"Average intersection wait times fell by 18%, and CO2 emissions along the A10 ring corridor dropped by an estimated 12%.",techStack:["Python","NumPy","MQTT","induction loops","OpenCV","PostgreSQL"],difficulty:"advanced",codeSnippet:`# Adaptive traffic light controller -- adjusts green phase from sensor data.
# Requires: pip install numpy paho-mqtt

import json
import numpy as np
import paho.mqtt.client as mqtt

# Configuration
MIN_GREEN = 10   # seconds
MAX_GREEN = 60   # seconds
BASE_GREEN = 25  # seconds

def calculate_green_time(vehicle_count: int, pedestrian_waiting: bool) -> int:
    """Compute optimal green phase duration based on demand."""
    # Linear scaling with demand, capped at MAX_GREEN
    green = BASE_GREEN + int(vehicle_count * 1.5)
    # Shorten vehicle phase if pedestrians are waiting and traffic is light
    if pedestrian_waiting and vehicle_count < 5:
        green = max(MIN_GREEN, green - 10)
    return int(np.clip(green, MIN_GREEN, MAX_GREEN))

def on_message(client, userdata, msg):
    """Handle incoming sensor readings from an intersection."""
    data = json.loads(msg.payload)
    intersection = data["intersection_id"]
    vehicles = data["vehicle_count"]        # from induction loop
    peds_waiting = data["pedestrian_button"] # boolean

    green = calculate_green_time(vehicles, peds_waiting)
    command = {"intersection_id": intersection, "green_seconds": green}

    client.publish(f"traffic/control/{intersection}", json.dumps(command))
    print(f"[{intersection}] vehicles={vehicles}  green={green}s")

client = mqtt.Client()
client.on_message = on_message
client.connect("mqtt.city.example", 1883)
client.subscribe("traffic/sensors/#")
print("Adaptive traffic controller running...")
client.loop_forever()`,repoHint:"Explore 'eclipse/sumo' (Simulation of Urban Mobility) for traffic simulation, or 'CityFlow-project/CityFlow' for reinforcement-learning traffic signal control.",tags:["IoT","sensors","traffic","real-time","emissions","MQTT"]},{id:"medellin-cable-cars",title:"Medellin Cable Cars (MetroCable)",city:"Medellin",country:"Colombia",category:"mobility",problem:"Steep hillside comunas had no direct transit links to the city centre. Residents faced 90-minute bus rides or dangerous informal transport to reach jobs and schools.",solution:"Medellin integrated aerial cable-car lines into the metro network, connecting hillside neighbourhoods directly to metro stations below. The system was designed with community input, and stations doubled as civic hubs with libraries, parks, and health clinics. Route planning used elevation and population-density data to maximise coverage per station.",impact:"Commute times for hillside residents dropped by up to 60%, and homicide rates in served comunas fell by over 70% within a decade of construction.",techStack:["Python","GeoPandas","elevation APIs","network analysis","QGIS"],difficulty:"intermediate",codeSnippet:`# Elevation-aware transit route planner -- finds optimal station placements
# by scoring candidate locations on elevation gain and population served.
# Requires: pip install requests geopy

import math
from dataclasses import dataclass

@dataclass
class CandidateStation:
    name: str
    lat: float
    lng: float
    elevation_m: float       # metres above sea level
    population_500m: int     # residents within 500m radius

def haversine_km(lat1, lon1, lat2, lon2) -> float:
    """Great-circle distance between two points in kilometres."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def score_route(stations: list[CandidateStation], metro_lat: float, metro_lng: float) -> dict:
    """Score a proposed cable-car route from a metro station to hillside stops."""
    total_pop = sum(s.population_500m for s in stations)
    elevation_gain = max(s.elevation_m for s in stations) - min(s.elevation_m for s in stations)
    total_dist = sum(
        haversine_km(stations[i].lat, stations[i].lng, stations[i+1].lat, stations[i+1].lng)
        for i in range(len(stations) - 1)
    )
    return {
        "stations": [s.name for s in stations],
        "population_served": total_pop,
        "elevation_gain_m": elevation_gain,
        "route_length_km": round(total_dist, 2),
        "people_per_km": round(total_pop / total_dist, 0) if total_dist else 0,
    }

# Example candidates
candidates = [
    CandidateStation("Acevedo Metro", 6.2826, -75.5590, 1460, 3200),
    CandidateStation("Andalucia", 6.2870, -75.5545, 1580, 8500),
    CandidateStation("Popular", 6.2910, -75.5500, 1720, 12000),
    CandidateStation("Santo Domingo", 6.2960, -75.5460, 1880, 15000),
]

result = score_route(candidates, metro_lat=6.2826, metro_lng=-75.5590)
for k, v in result.items():
    print(f"  {k}: {v}")`,repoHint:"Search for 'gboeing/osmnx' for street-network and elevation analysis with OpenStreetMap data, or 'uber/h3' for hexagonal spatial indexing of population density.",tags:["transit","equity","elevation","urban-planning","community"]},{id:"singapore-oneservice",title:"Singapore OneService",city:"Singapore",country:"Singapore",category:"citizen-reporting",problem:"Singapore's municipal feedback was fragmented across dozens of agency hotlines. Citizens did not know which agency handled which issue, leading to misrouted reports and slow resolution.",solution:"OneService provides a single mobile app and web portal for all municipal feedback. AI-based image recognition auto-classifies uploaded photos (e.g., 'fallen tree', 'illegal parking'), and the system routes tickets to the correct agency without the citizen needing to know the bureaucratic structure. A public dashboard tracks resolution statistics by district.",impact:"Cross-agency routing accuracy reached 92%, and average case resolution time improved from 10 working days to 3.5.",techStack:["React","TypeScript","REST API","image classification","PostgreSQL"],difficulty:"starter",codeSnippet:`// OneService-style feedback form (React + TypeScript)
// A reusable component for submitting municipal feedback with photo upload.

import React, { useState, type FormEvent } from "react";

interface FeedbackPayload {
  category: string;
  description: string;
  location: { lat: number; lng: number };
  photoBase64: string | null;
}

const CATEGORIES = [
  "Roads & footpaths",
  "Cleanliness",
  "Noise & pollution",
  "Parks & trees",
  "Illegal parking",
  "Street lighting",
  "Other",
];

export default function FeedbackForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const payload: FeedbackPayload = {
      category,
      description,
      location: { lat: 1.3521, lng: 103.8198 }, // replace with real geolocation
      photoBase64: null, // attach Base64 from file input if needed
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.statusText);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>

      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Submitting..." : "Submit feedback"}
      </button>
      {status === "done" && <p>Thank you! Your report has been filed.</p>}
      {status === "error" && <p>Something went wrong. Please try again.</p>}
    </form>
  );
}`,repoHint:"Look at 'open311/open311.github.io' for the Open311 standard used by many cities for service requests, or 'codeforamerica/open311dashboard' for a reference dashboard.",tags:["mobile-app","feedback","AI","image-recognition","cross-agency"]},{id:"vienna-citizen-budget",title:"Vienna Citizen Budget",city:"Vienna",country:"Austria",category:"governance",problem:"Municipal budget decisions were opaque, and citizens felt disconnected from how their tax money was spent. Public consultations attracted only a tiny, unrepresentative group of regular attendees.",solution:"Vienna launched a participatory budgeting platform where residents propose neighbourhood projects, discuss ideas publicly, and vote on which projects receive funding. Each district allocates a fixed portion of its capital budget to citizen-chosen projects. The platform uses ranked-choice voting to ensure broad preferences are captured rather than simple majority rule.",impact:"Over 50,000 residents participated in the first cycle, and 120 community-proposed projects were funded across all 23 districts.",techStack:["JavaScript","TypeScript","React","Node.js","PostgreSQL"],difficulty:"intermediate",codeSnippet:`// Participatory budgeting -- ranked-choice voting interface (vanilla JS)
// Allows citizens to drag-rank their top project picks.

const projects = [
  { id: "p1", title: "New playground in Favoriten", cost: 85000 },
  { id: "p2", title: "Protected bike lane on Ringstrasse", cost: 120000 },
  { id: "p3", title: "Community garden in Ottakring", cost: 45000 },
  { id: "p4", title: "Free public Wi-Fi in Stephansplatz", cost: 60000 },
  { id: "p5", title: "Senior centre renovation in Floridsdorf", cost: 95000 },
];

let ranking = [...projects]; // user reorders this list

function renderBallot(container) {
  container.innerHTML = "<h3>Rank these projects (1 = top choice)</h3>";
  const ol = document.createElement("ol");
  ranking.forEach((proj, idx) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.idx = idx;
    li.textContent = \`\${proj.title} (€\${proj.cost.toLocaleString()})\`;
    li.addEventListener("dragstart", (e) => e.dataTransfer.setData("idx", idx));
    li.addEventListener("dragover", (e) => e.preventDefault());
    li.addEventListener("drop", (e) => {
      const from = parseInt(e.dataTransfer.getData("idx"));
      const to = idx;
      const [moved] = ranking.splice(from, 1);
      ranking.splice(to, 0, moved);
      renderBallot(container);
    });
    ol.appendChild(li);
  });
  container.appendChild(ol);

  const btn = document.createElement("button");
  btn.textContent = "Submit my vote";
  btn.onclick = () => submitVote(ranking.map((p) => p.id));
  container.appendChild(btn);
}

async function submitVote(rankedIds) {
  const res = await fetch("/api/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rankedIds, votedAt: new Date().toISOString() }),
  });
  alert(res.ok ? "Vote recorded -- thank you!" : "Error submitting vote.");
}

// Initialise: renderBallot(document.getElementById("ballot"));`,repoHint:"Search for 'DemocracyOS/democracyos' or 'consul/consul' -- both are open-source participatory democracy platforms used by dozens of cities worldwide.",tags:["democracy","participation","budgeting","voting","transparency"]},{id:"busan-smart-water",title:"Busan Smart Water",city:"Busan",country:"South Korea",category:"sustainability",problem:"Ageing pipe infrastructure led to undetected leaks and contamination events. Manual water-quality sampling happened only weekly, leaving dangerous gaps in monitoring.",solution:"Busan deployed IoT sensors throughout its water distribution network measuring pH, turbidity, chlorine residual, and flow rate in real time. A central platform aggregates readings, detects anomalies using rolling statistics, and pushes instant alerts to operators when values breach safety thresholds. The data also feeds a predictive model for pipe-burst risk.",impact:"Contamination detection time fell from days to under 15 minutes, and proactive pipe maintenance reduced water loss by 22%.",techStack:["Python","pandas","MQTT","InfluxDB","Grafana","IoT sensors"],difficulty:"advanced",codeSnippet:`# IoT water quality monitor -- reads sensor data and triggers alerts.
# Requires: pip install paho-mqtt pandas

import json
import pandas as pd
from datetime import datetime
import paho.mqtt.client as mqtt

# Safety thresholds (WHO / local standards)
THRESHOLDS = {
    "ph": (6.5, 8.5),
    "turbidity_ntu": (0, 4.0),
    "chlorine_mg_l": (0.2, 4.0),
    "flow_rate_l_min": (10, 5000),
}

readings = []  # rolling window of recent readings

def check_alert(sensor_id: str, metric: str, value: float) -> str | None:
    """Return an alert message if the value is outside safe range."""
    lo, hi = THRESHOLDS.get(metric, (None, None))
    if lo is not None and value < lo:
        return f"ALERT [{sensor_id}]: {metric}={value} BELOW minimum {lo}"
    if hi is not None and value > hi:
        return f"ALERT [{sensor_id}]: {metric}={value} ABOVE maximum {hi}"
    return None

def on_message(client, userdata, msg):
    """Process an incoming sensor reading from the water network."""
    data = json.loads(msg.payload)
    sensor_id = data["sensor_id"]
    timestamp = datetime.fromisoformat(data["timestamp"])

    for metric in ["ph", "turbidity_ntu", "chlorine_mg_l", "flow_rate_l_min"]:
        value = data.get(metric)
        if value is None:
            continue
        alert = check_alert(sensor_id, metric, value)
        if alert:
            print(f"  {alert}")
            # In production: send SMS/push notification to operators

    readings.append({**data, "received_at": datetime.now().isoformat()})
    # Keep a 1-hour rolling window for trend analysis
    if len(readings) > 3600:
        readings.pop(0)

    print(f"[{timestamp}] Sensor {sensor_id}  pH={data.get('ph')}  turb={data.get('turbidity_ntu')}")

client = mqtt.Client()
client.on_message = on_message
client.connect("mqtt.water.example", 1883)
client.subscribe("water/sensors/#")
print("Water quality monitor running...")
client.loop_forever()`,repoHint:"Explore 'UCHIC/GWSDAT' for groundwater monitoring, or search 'water-quality-monitoring IoT' on GitHub. InfluxDB + Grafana templates for water utilities are also widely shared.",tags:["IoT","water","environment","sensors","public-health","anomaly-detection"]},{id:"kigali-clean-city",title:"Kigali Clean City",city:"Kigali",country:"Rwanda",category:"community",problem:"Rapid urbanisation strained waste services, and informal settlements lacked regular cleanup. There was no systematic way to organise or track community-led maintenance.",solution:"Kigali formalised its traditional 'umuganda' community work practice into a digital scheduling system. Each neighbourhood cell registers volunteers, assigns monthly cleanup zones, and logs completed activities. Cell leaders can report issues via SMS, and the city dashboard shows cleanliness scores per district, creating healthy inter-neighbourhood competition.",impact:"Kigali is now consistently ranked as the cleanest city in Africa, with over 90% resident participation in monthly community cleanup events.",techStack:["Python","SQLite","SMS gateway","Flask"],difficulty:"starter",codeSnippet:`# Community cleanup rotation scheduler
# Assigns volunteer groups to zones on a fair rotation basis.
# Requires: Python 3.10+

from dataclasses import dataclass
from datetime import date, timedelta
from itertools import cycle

@dataclass
class Zone:
    id: str
    name: str
    area_km2: float

@dataclass
class VolunteerGroup:
    id: str
    name: str
    members: int

def generate_rotation(
    groups: list[VolunteerGroup],
    zones: list[Zone],
    start_date: date,
    weeks: int = 12,
) -> list[dict]:
    """Create a fair rotation schedule for community cleanups."""
    schedule = []
    zone_cycle = cycle(zones)

    for week in range(weeks):
        cleanup_date = start_date + timedelta(weeks=week)
        for group in groups:
            zone = next(zone_cycle)
            schedule.append({
                "date": cleanup_date.isoformat(),
                "group": group.name,
                "members": group.members,
                "zone": zone.name,
                "area_km2": zone.area_km2,
            })
    return schedule

# Example
groups = [
    VolunteerGroup("g1", "Nyamirambo Youth", 45),
    VolunteerGroup("g2", "Kicukiro Elders", 30),
    VolunteerGroup("g3", "Gasabo Women's Coop", 38),
]
zones = [
    Zone("z1", "Market Road", 0.4),
    Zone("z2", "Riverside Path", 0.6),
    Zone("z3", "School District", 0.3),
]

schedule = generate_rotation(groups, zones, date.today(), weeks=8)
for entry in schedule[:6]:  # preview first 6 assignments
    print(f"  {entry['date']}  {entry['group']:>25s}  ->  {entry['zone']}")`,repoHint:"Search for 'codeforafrica/sensors.AFRICA' for community-driven environmental monitoring, or 'ushahidi/platform' for community reporting and accountability tools.",tags:["community","volunteer","scheduling","accountability","SMS"]},{id:"fukuoka-startup-visa",title:"Fukuoka Startup Visa",city:"Fukuoka",country:"Japan",category:"governance",problem:"Japan's traditional business visa process required founders to already have office space, capital, and employees before applying -- a chicken-and-egg problem that deterred foreign entrepreneurs.",solution:"Fukuoka created a special six-month startup visa with a streamlined digital application. The form uses progressive validation -- checking business plan viability, identity documents, and financial thresholds in stages rather than requiring everything upfront. An automated scoring system pre-screens applications, reducing review time from months to weeks.",impact:"Over 200 foreign startups established in Fukuoka since launch, contributing to a 30% growth in the city's startup ecosystem.",techStack:["TypeScript","React","Zod","Node.js","PostgreSQL"],difficulty:"starter",codeSnippet:`// Multi-step visa application form validator using Zod (TypeScript)
// Validates each stage progressively before allowing the applicant to proceed.
// Requires: npm install zod

import { z } from "zod";

// Stage 1: Personal information
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  email: z.string().email("Valid email required"),
  passportNumber: z.string().regex(/^[A-Z0-9]{6,12}$/, "Invalid passport format"),
  dateOfBirth: z.string().refine(
    (d) => new Date(d) < new Date(),
    "Date of birth must be in the past"
  ),
});

// Stage 2: Business plan
const businessPlanSchema = z.object({
  companyName: z.string().min(1, "Company name required"),
  industry: z.enum(["tech", "biotech", "fintech", "cleantech", "creative", "other"]),
  summary: z.string().min(100, "Business summary must be at least 100 characters"),
  projectedRevenue12m: z.number().positive("Revenue projection must be positive"),
  capitalAvailable: z.number().min(5000, "Minimum capital requirement is 5,000 USD"),
});

// Stage 3: Supporting documents
const documentsSchema = z.object({
  passportScanUrl: z.string().url("Valid URL required for passport scan"),
  businessPlanPdfUrl: z.string().url("Valid URL required for business plan PDF"),
  bankStatementUrl: z.string().url("Valid URL required for bank statement"),
});

// Full application is all stages combined
const fullApplicationSchema = personalInfoSchema
  .merge(businessPlanSchema)
  .merge(documentsSchema);

// Validate a single stage and return errors or success
function validateStage(stage: number, data: unknown) {
  const schemas = [personalInfoSchema, businessPlanSchema, documentsSchema];
  const result = schemas[stage].safeParse(data);
  return result.success
    ? { valid: true, data: result.data }
    : { valid: false, errors: result.error.flatten().fieldErrors };
}

// Example usage:
// const step1 = validateStage(0, { fullName: "Tanaka Yuki", ... });
// if (step1.valid) proceedToStage(1);`,repoHint:"Look at 'colinhacks/zod' for the validation library, or search 'multi-step-form react zod' on GitHub for full implementations with React Hook Form integration.",tags:["immigration","digital-government","forms","validation","startups"]},{id:"bangkok-health-station",title:"Bangkok Health Station",city:"Bangkok",country:"Thailand",category:"health",problem:"Bangkok's PM2.5 levels regularly exceed safe limits during the dry season, but residents lacked localised, real-time health guidance beyond generic city-wide warnings.",solution:"The city deployed a network of low-cost air quality sensors across all 50 districts, feeding data to a public API. A companion app and web dashboard show hyper-local PM2.5 readings and generate personalised health advisories based on age, pre-existing conditions, and activity level. Schools and hospitals receive automated alerts when their district crosses hazardous thresholds.",impact:"Respiratory emergency admissions dropped 15% in districts with active sensor coverage, attributed to residents proactively reducing outdoor exposure on high-pollution days.",techStack:["Python","requests","OpenAQ API","pandas","FastAPI"],difficulty:"starter",codeSnippet:`# Air quality monitor -- fetches PM2.5 data from OpenAQ and generates
# health advisories based on WHO breakpoints.
# Requires: pip install requests

import requests
from datetime import datetime

# WHO PM2.5 breakpoints (24-hour mean, ug/m3)
AQI_LEVELS = [
    (0, 15, "Good", "Air quality is satisfactory. Enjoy outdoor activities."),
    (15.1, 35, "Moderate", "Sensitive groups should limit prolonged outdoor exertion."),
    (35.1, 75, "Unhealthy for sensitive groups", "Children, elderly, and those with respiratory conditions should stay indoors."),
    (75.1, 150, "Unhealthy", "Everyone should reduce outdoor activities. Wear N95 masks if going outside."),
    (150.1, 999, "Hazardous", "STAY INDOORS. Close windows. Run air purifiers. Seek medical attention if symptomatic."),
]

def get_pm25(city: str = "Bangkok", limit: int = 5) -> list[dict]:
    """Fetch latest PM2.5 readings from OpenAQ v3 API."""
    url = "https://api.openaq.org/v3/locations"
    params = {
        "city": city,
        "parameter": "pm25",
        "limit": limit,
        "sort": "desc",
        "order_by": "lastUpdated",
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    results = resp.json().get("results", [])
    return [
        {
            "location": r["name"],
            "pm25": r["parameters"][0]["lastValue"] if r.get("parameters") else None,
            "updated": r.get("datetimeLast", {}).get("local", "unknown"),
        }
        for r in results
        if r.get("parameters")
    ]

def health_advisory(pm25_value: float) -> str:
    """Return a health advisory string for a given PM2.5 level."""
    for lo, hi, level, advice in AQI_LEVELS:
        if lo <= pm25_value <= hi:
            return f"[{level.upper()}] PM2.5 = {pm25_value} ug/m3 -- {advice}"
    return f"PM2.5 = {pm25_value} ug/m3 -- level unknown, exercise caution."

if __name__ == "__main__":
    print(f"Bangkok air quality check -- {datetime.now():%Y-%m-%d %H:%M}")
    print("-" * 60)
    stations = get_pm25("Bangkok", limit=5)
    for s in stations:
        if s["pm25"] is not None:
            print(f"  {s['location']}")
            print(f"    {health_advisory(s['pm25'])}")
            print()
    if not stations:
        print("  No stations returned. Check API key or city name.")`,repoHint:"See 'openaq/openaq-api' for the open air quality API, or 'breathe-free/breathe' for community air quality dashboards. Also search 'purple-air open-source' for sensor firmware.",tags:["air-quality","PM2.5","health","sensors","public-api","advisories"]}],f=[{value:"citizen-reporting",label:"Citizen Reporting"},{value:"smart-infrastructure",label:"Smart Infrastructure"},{value:"civic-ai",label:"Civic AI"},{value:"mobility",label:"Mobility"},{value:"sustainability",label:"Sustainability"},{value:"community",label:"Community"},{value:"governance",label:"Governance"},{value:"health",label:"Health"}];function m(a,i,r){a.preventDefault(),i(r)}const x={starter:"var(--accent-green)",intermediate:"var(--accent-amber)",advanced:"var(--accent-red)"};function _({text:a}){const[i,r]=d.useState(!1);function l(){navigator.clipboard.writeText(a).then(()=>{r(!0),setTimeout(()=>r(!1),2e3)})}return e.jsx("button",{type:"button",className:"idea-copy-btn",onClick:l,children:i?"Copied!":"Copy code"})}function C({onNavigate:a,locale:i,onLocaleChange:r}){const l=S(i),[c,h]=d.useState("all"),[n,p]=d.useState("all"),[u,y]=d.useState(null),g=d.useMemo(()=>{let t=[...w];return c!=="all"&&(t=t.filter(s=>s.category===c)),n!=="all"&&(t=t.filter(s=>s.difficulty===n)),t},[c,n]);return e.jsxs(e.Fragment,{children:[e.jsxs("header",{className:"rankings-hero section",children:[e.jsxs("div",{className:"topbar topbar-stack",children:[e.jsxs("div",{className:"topbar-left",children:[e.jsx("button",{type:"button",className:"back-arrow",onClick:()=>a("/"),"aria-label":"Back to home",children:"←"}),e.jsx(b,{eyebrow:"Steal This Idea",microCopy:"City innovation studio"})]}),e.jsxs("div",{className:"topbar-actions",children:[e.jsx(v,{locale:i,onChange:r}),e.jsxs("nav",{className:"topnav","aria-label":"Page navigation",children:[e.jsx("a",{href:"/",onClick:t=>m(t,a,"/"),children:l.nav.home}),e.jsx("a",{href:"/rankings",onClick:t=>m(t,a,"/rankings"),children:l.nav.rankings}),e.jsx("a",{href:"/methodology",onClick:t=>m(t,a,"/methodology"),children:l.nav.methodology})]})]})]}),e.jsxs("div",{className:"rankings-hero-grid",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"rankings-title",children:"Steal This Idea"}),e.jsx("p",{className:"hero-intro",children:"Real city innovations with working code you can copy, adapt, and deploy. Each idea comes from a real programme in a real city. The code snippets are starter templates you can drop into a no-code platform or build on directly."})]}),e.jsxs("div",{className:"rankings-controls",children:[e.jsxs("div",{className:"rankings-filter-group",children:[e.jsx("p",{className:"panel-label",children:"Category"}),e.jsxs("div",{className:"region-switch",role:"tablist",children:[e.jsx("button",{type:"button",className:c==="all"?"region-button active":"region-button",onClick:()=>h("all"),children:"All"}),f.map(t=>e.jsx("button",{type:"button",className:c===t.value?"region-button active":"region-button",onClick:()=>h(t.value),children:t.label},t.value))]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"panel-label",children:"Difficulty"}),e.jsxs("div",{className:"mode-switch",role:"tablist",children:[e.jsx("button",{type:"button",className:n==="all"?"mode-button active":"mode-button",onClick:()=>p("all"),children:"All"}),e.jsx("button",{type:"button",className:n==="starter"?"mode-button active":"mode-button",onClick:()=>p("starter"),children:"Starter"}),e.jsx("button",{type:"button",className:n==="intermediate"?"mode-button active":"mode-button",onClick:()=>p("intermediate"),children:"Intermediate"}),e.jsx("button",{type:"button",className:n==="advanced"?"mode-button active":"mode-button",onClick:()=>p("advanced"),children:"Advanced"})]})]})]})]})]}),e.jsx("main",{children:e.jsxs("section",{className:"rankings-top section",children:[e.jsxs("div",{className:"section-heading",children:[e.jsxs("div",{children:[e.jsxs("p",{className:"eyebrow",children:[g.length," ideas"]}),e.jsx("h2",{children:"Copy, adapt, deploy"})]}),e.jsx("p",{className:"section-summary",children:"Click any card to reveal the working code snippet. Copy it directly or use it as a starting point."})]}),e.jsx("div",{className:"idea-grid",children:g.map(t=>{var s;return e.jsxs("article",{className:"idea-card",children:[e.jsx("div",{className:"idea-card-head",children:e.jsxs("div",{children:[e.jsxs("div",{className:"idea-card-meta",children:[e.jsx("span",{className:"idea-difficulty",style:{color:x[t.difficulty]},children:t.difficulty}),e.jsx("span",{className:"idea-category",children:(s=f.find(o=>o.value===t.category))==null?void 0:s.label})]}),e.jsx("h3",{children:t.title}),e.jsxs("p",{className:"city-location",children:[t.city,", ",t.country]})]})}),e.jsxs("p",{className:"idea-problem",children:[e.jsx("strong",{children:"Problem:"})," ",t.problem]}),e.jsxs("p",{className:"idea-solution",children:[e.jsx("strong",{children:"Solution:"})," ",t.solution]}),e.jsxs("p",{className:"idea-impact",children:[e.jsx("strong",{children:"Impact:"})," ",t.impact]}),e.jsx("div",{className:"metric-taglist",children:t.techStack.map(o=>e.jsx("span",{children:o},o))}),e.jsx("button",{type:"button",className:u===t.id?"idea-toggle active":"idea-toggle",onClick:()=>y(u===t.id?null:t.id),children:u===t.id?"Hide code":"Show code"}),u===t.id&&e.jsxs("div",{className:"idea-code-block",children:[e.jsxs("div",{className:"idea-code-header",children:[e.jsx("span",{children:"Starter code"}),e.jsx(_,{text:t.codeSnippet})]}),e.jsx("pre",{className:"idea-code",children:e.jsx("code",{children:t.codeSnippet})}),e.jsx("p",{className:"idea-repo-hint",children:t.repoHint})]}),e.jsx("div",{className:"metric-taglist",children:t.tags.map(o=>e.jsx("span",{children:o},o))})]},t.id)})})]})}),e.jsx(k,{onNavigate:a,locale:i})]})}export{C as default};
