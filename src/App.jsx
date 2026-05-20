cat > src/App.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
export default function NuclearMedicineRender() {
const mountRef = useRef(null);
useEffect(() => {
const mount = mountRef.current;
if (!mount) return;
const W = mount.clientWidth || window.innerWidth;
const H = mount.clientHeight || window.innerHeight;
// ── Scene ──────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080d18);
scene.fog = new THREE.FogExp2(0x080d18, 0.006);
// ── Camera ─────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 500);
let theta = -0.35, phi = 0.68, radius = 90;
const CX = 20, CZ = 14;
function posCamera() {
camera.position.set(
CX + radius * Math.sin(phi) * Math.sin(theta),
radius * Math.cos(phi),
CZ + radius * Math.sin(phi) * Math.cos(theta)
);
camera.lookAt(CX, 2, CZ);
}
posCamera();
// ── Renderer ────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
mount.appendChild(renderer.domElement);
// ── Lights ──────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x7090b8, 0.55));
const sun = new THREE.DirectionalLight(0xfff5d8, 1.5);
sun.position.set(60, 90, 30);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const sc = sun.shadow.camera;
sc.left = -60; sc.right = 65; sc.top = 45; sc.bottom = -42; sc.far = 220;
sun.shadow.bias = -0.001;
scene.add(sun);
const fillLight = new THREE.DirectionalLight(0x5080a0, 0.4);
fillLight.position.set(-40, 30, -20);
scene.add(fillLight);
// Interior warm lights
const ptLight = (x, y, z, col, inten, dist) => {
const l = new THREE.PointLight(col, inten, dist);
l.position.set(x, y, z);
scene.add(l);
return l;
};
ptLight(5, 2.8, 10, 0xffe0a0, 0.6, 20); // Admin
ptLight(17, 2.8, 12, 0x90ffc0, 0.5, 18); // Patients
const petLight = ptLight(27.5, 3.0, 18, 0x8060ff, 1.0, 22); // PET/CT
const specLight = ptLight(27.5, 3.0, 25, 0x4090ff, 0.8, 18); // SPECT
ptLight(28, 3.0, 3.5, 0xff8820, 0.6, 16); // Pharmacy
// ── Materials ───────────────────────────────────────────────
const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2d9c8, roughness: 0.82 });
const wallCtrl = new THREE.MeshStandardMaterial({ color: 0xd4c8a8, roughness: 0.82 });
const beamMat = new THREE.MeshStandardMaterial({ color: 0xb8b0a0, roughness: 0.7, metal
const metalMat = new THREE.MeshStandardMaterial({ color: 0xc8d4e0, roughness: 0.2, metal
const leadMat = new THREE.MeshStandardMaterial({ color: 0x4a5248, roughness: 0.65, meta
const glassMat = new THREE.MeshStandardMaterial({ color: 0x70a0c0, roughness: 0.05, meta
const groundMat = new THREE.MeshStandardMaterial({ color: 0x1c2818, roughness: 1.0 });
const plazaMat = new THREE.MeshStandardMaterial({ color: 0x958980, roughness: 0.9 });
const paveMat = new THREE.MeshStandardMaterial({ color: 0xaaa090, roughness: 0.9 });
const roomMat = {
admin: new THREE.MeshStandardMaterial({ color: 0x2a5272, roughness: 0.55, emissive:
patient: new THREE.MeshStandardMaterial({ color: 0x245840, roughness: 0.55, emissive:
corridor: new THREE.MeshStandardMaterial({ color: 0x2c2c44, roughness: 0.70, emissive:
support: new THREE.MeshStandardMaterial({ color: 0x4c3820, roughness: 0.70, emissive:
petct: new THREE.MeshStandardMaterial({ color: 0x441858, roughness: 0.45, metalness:
spect: new THREE.MeshStandardMaterial({ color: 0x1c3860, roughness: 0.45, metalness:
pharmacy: new THREE.MeshStandardMaterial({ color: 0x5a2c10, roughness: 0.60, emissive:
decay: new THREE.MeshStandardMaterial({ color: 0x240c28, roughness: 0.80, emissive:
};
// ── Geometry helpers ─────────────────────────────────────────
const BOX = (x, y, z, w, h, d, mat, shadow = true) => {
const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
m.position.set(x, y, z);
m.castShadow = shadow ? true : false;
m.receiveShadow = true;
scene.add(m);
return m;
};
const CYL = (x, y, z, rT, rB, h, segs, mat) => {
const m = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, segs), mat);
m.position.set(x, y, z);
m.castShadow = true;
m.receiveShadow = true;
scene.add(m);
return m;
};
// ── Ground & landscaping ─────────────────────────────────────
BOX(20, -0.2, 14, 220, 0.4, 180, groundMat, false);
BOX(20, 0.0, 14, 54, 0.2, 38, plazaMat, false);
BOX(-6, 0.02, 2.5, 12, 0.04, 5, paveMat, false); // entry path
BOX(50, 0.05, 14, 14, 0.1, 32, new THREE.MeshStandardMaterial({ color: 0x383838, rough
// Parking lines
for (let i = 0; i < 6; i++)
BOX(43.5 + i * 1.9, 0.11, 14, 0.07, 0.04, 6, new THREE.MeshStandardMaterial({ color: 0x
// ── Building slab ─────────────────────────────────────────────
BOX(20, 0.12, 14, 40.6, 0.22, 28.6, paveMat, false);
// ── Room floors ────────────────────────────────────────────────
const ROOMS = [
{ x:0, z:0, w:10, d:5, c:'admin' },
{ x:0, z:5, w:10, d:7, c:'admin' },
{ x:0, z:12, w:5, d:5, c:'admin' },
{ x:5, z:12, w:5, d:5, c:'admin' },
{ x:0, z:17, w:5, d:3, c:'support' },
{ x:5, z:17, w:5, d:3, c:'support' },
{ x:0, z:20, w:10, d:4, c:'support' },
{ x:0, z:24, w:10, d:4, c:'support' },
{ x:10, z:0, w:2, d:28, c:'corridor' },
{ x:12, z:0, w:5, d:4, c:'patient' },
{ x:17, z:0, w:5, d:4, c:'patient' },
{ x:12, z:4, w:5, d:4, c:'patient' },
{ x:17, z:4, w:5, d:4, c:'patient' },
{ x:12, z:8, w:10, d:2, c:'corridor' },
{ x:12, z:10, w:3.33, d:4, c:'patient' },
{ x:15.33, z:10, w:3.33, d:4, c:'patient' },
{ x:18.66, z:10, w:3.34, d:4, c:'patient' },
{ x:12, z:14, w:3.33, d:4, c:'patient' },
{ x:15.33, z:14, w:3.33, d:4, c:'patient' },
{ x:18.66, z:14, w:3.34, d:4, c:'patient' },
{ x:12, z:18, w:5, d:5, c:'patient' },
{ x:17, z:18, w:5, d:5, c:'patient' },
{ x:12, z:23, w:10, d:3, c:'support' },
{ x:12, z:26, w:10, d:2, c:'support' },
{ x:22, z:0, w:2, d:28, c:'corridor' },
{ x:24, z:0, w:8, d:7, c:'pharmacy' },
{ x:32, z:0, w:8, d:7, c:'pharmacy' },
{ x:24, z:7, w:8, d:5, c:'pharmacy' },
{ x:32, z:7, w:8, d:5, c:'decay' },
{ x:24, z:12, w:16, d:2, c:'corridor' },
{ x:24, z:14, w:10, d:8, c:'petct' },
{ x:34, z:14, w:6, d:8, c:'petct' },
{ x:24, z:22, w:10, d:6, c:'spect' },
{ x:34, z:22, w:6, d:6, c:'spect' },
];
ROOMS.forEach(r => BOX(r.x + r.w / 2, 0.30, r.z + r.d / 2, r.w - 0.06, 0.16, r.d - 0.06,
// ── Exterior walls ────────────────────────────────────────────
const WH = 4.3, WT = 0.28, WY = WH / 2 + 0.22;
BOX(20, WY, 0, 40, WH, WT, wallMat); // N
BOX(20, WY, 28, 40, WH, WT, wallMat); // S
BOX(0, WY, 14, WT, WH, 28, wallMat); // W
BOX(40, WY, 14, WT, WH, 28, wallMat); // E
// Zone separator walls (corridors)
const IWH = WH + 0.15;
const IWY = IWH / 2 + 0.22;
BOX(10, IWY, 14, WT, IWH, 28, new THREE.MeshStandardMaterial({ color: 0xd8d0be, roughnes
BOX(12, IWY, 14, WT, IWH, 28, new THREE.MeshStandardMaterial({ color: 0xd8d0be, roughnes
BOX(22, IWY, 14, WT, IWH + 0.2, 28, wallCtrl);
BOX(24, IWY, 14, WT, IWH + 0.2, 28, wallCtrl);
// ── Roof structure ─────────────────────────────────────────────
const RY = WH + 0.22 + 0.05;
// Transparent zone roofs
BOX(5, RY, 14, 10, 0.08, 28, new THREE.MeshStandardMaterial({ color: 0x80b0d0, roughne
BOX(17, RY, 14, 10, 0.08, 28, new THREE.MeshStandardMaterial({ color: 0x60c090, roughne
BOX(32, RY, 14, 16.4, 0.10, 28, new THREE.MeshStandardMaterial({ color: 0xb06030, roughne
BOX(11, RY, 14, 2, 0.06, 28, glassMat, false);
BOX(23, RY, 14, 2, 0.06, 28, glassMat, false);
// Roof edge beams
const bH = 0.38, bT = 0.28;
BOX(20, WH + bH / 2 + 0.22, 0, 40, bH, bT, beamMat);
BOX(20, WH + bH / 2 + 0.22, 28, 40, bH, bT, beamMat);
BOX(0, WH + bH / 2 + 0.22, 14, bT, bH, 28, beamMat);
BOX(40, WH + bH / 2 + 0.22, 14, bT, bH, 28, beamMat);
[8, 16, 24, 32].forEach(xb => BOX(xb, WH + bH / 2 + 0.22, 14, bT, bH, 28, beamMat));
[7, 14, 21, 28].forEach(zb => BOX(20, WH + bH / 2 + 0.22, zb, 40, bH, bT, beamMat));
// ── Entry canopy ────────────────────────────────────────────────
BOX(4, WH * 0.72, -2.0, 9, 0.14, 4, new THREE.MeshStandardMaterial({ color: 0xc8e0f8, rou
BOX(1, WH * 0.36, -2.0, 0.18, WH * 0.72, 0.18, metalMat);
BOX(7, WH * 0.36, -2.0, 0.18, WH * 0.72, 0.18, metalMat);
BOX(4, WH * 0.72, -4.0, 0.18, WH * 0.04, 6.0, metalMat, false); // fascia
// ── PET/CT Scanner ──────────────────────────────────────────────
// Gantry ring
const gantryGeo = new THREE.TorusGeometry(1.85, 0.32, 16, 40);
const gantryMat = new THREE.MeshStandardMaterial({ color: 0xd8e4f0, roughness: 0.22, meta
const gantry = new THREE.Mesh(gantryGeo, gantryMat);
gantry.position.set(27.5, 2.1, 18);
gantry.rotation.y = Math.PI / 2;
gantry.castShadow = true;
scene.add(gantry);
// Gantry body housing
BOX(27.5, 2.1, 18, 0.9, 4.0, 4.0, new THREE.MeshStandardMaterial({ color: 0xe8f0f8, rough
// Patient table
BOX(27.5, 0.90, 18, 5.8, 0.12, 0.68, metalMat);
BOX(29.5, 0.52, 18, 0.6, 0.52, 0.55, new THREE.MeshStandardMaterial({ color: 0x8090a0, ro
// Blue glow inside gantry
const gantryGlow = new THREE.PointLight(0x6080ff, 1.2, 4.5);
gantryGlow.position.set(27.5, 2.1, 18);
scene.add(gantryGlow);
// ── SPECT Gamma Camera ───────────────────────────────────────────
const detGeo = new THREE.BoxGeometry(0.22, 1.7, 2.2);
const detMat = new THREE.MeshStandardMaterial({ color: 0xd0dce8, roughness: 0.35, metalne
// Head 1 (top)
const h1 = new THREE.Mesh(detGeo, detMat);
h1.position.set(27.5, 2.8, 25); h1.castShadow = true; scene.add(h1);
// Head 2 (side, 90° rotated)
const h2 = new THREE.Mesh(detGeo, detMat);
h2.position.set(27.5, 1.1, 25); h2.rotation.z = Math.PI / 2; h2.castShadow = true; // Pivot arm
BOX(27.5, 1.95, 25, 0.16, 0.16, 0.16, metalMat);
scene.
BOX(27.5, 0.86, 25, 4.8, 0.11, 0.65, metalMat); // table
// ── Hot cells (Radiofarmacia) ────────────────────────────────────
BOX(26.5, 1.4, 3.5, 2.0, 2.6, 1.6, leadMat);
BOX(29.5, 1.4, 3.5, 2.0, 2.6, 1.6, leadMat);
// Glass window on hot cell
BOX(26.5, 1.8, 2.7, 1.2, 0.55, 0.06, new THREE.MeshStandardMaterial({ color: 0x90d0ff, ro
BOX(29.5, 1.8, 2.7, 1.2, 0.55, 0.06, new THREE.MeshStandardMaterial({ color: 0x90d0ff, ro
// ── Decay room barrels ────────────────────────────────────────────
const barrelMat = new THREE.MeshStandardMaterial({ color: 0xf09018, roughness: 0.55, meta
[[33.4,3.3],[34.5,3.3],[35.6,3.3],[33.4,5.0],[34.5,5.0],[35.6,5.0],[33.4,6.5],[34.5,6.5]]
CYL(bx, 0.38, bz, 0.26, 0.27, 0.72, 10, barrelMat);
BOX(bx, 0.77, bz, 0.52, 0.06, 0.52, new THREE.MeshStandardMaterial({ color: 0x282820, r
});
// Radiation warning sign on decay room wall
BOX(32.02, 2.5, 9.5, 0.04, 0.7, 0.7, new THREE.MeshStandardMaterial({ color: 0xf0c020, ro
// ── Reception desk ─────────────────────────────────────────────
const deskMat = new THREE.MeshStandardMaterial({ color: 0x5a4830, roughness: 0.65 });
BOX(3.5, 0.55, 1.8, 5, 0.9, 0.5, deskMat);
BOX(1.2, 0.55, 3.2, 0.5, 0.9, 2.4, deskMat);
// Monitor
BOX(3.5, 1.16, 1.62, 0.62, 0.46, 0.05, new THREE.MeshStandardMaterial({ color: 0x181820,
BOX(3.5, 0.86, 1.65, 0.1, 0.25, 0.05, metalMat);
// ── Waiting area chairs (lobby) ────────────────────────────────
const chairMat = new THREE.MeshStandardMaterial({ color: 0x2a3a5a, roughness: 0.7 });
[[1.5,7],[3.5,7],[5.5,7],[1.5,9],[3.5,9],[5.5,9]].forEach(([cx,cz]) => {
BOX(cx, 0.45, cz, 0.65, 0.08, 0.65, chairMat);
BOX(cx, 0.68, cz - 0.28, 0.65, 0.48, 0.07, chairMat);
});
// ── Trees ─────────────────────────────────────────────────────
const trunkM = new THREE.MeshStandardMaterial({ color: 0x3e2a16, roughness: 1 });
const leaf1 = new THREE.MeshStandardMaterial({ color: 0x244c18, roughness: 1 });
const leaf2 = new THREE.MeshStandardMaterial({ color: 0x1e5c22, roughness: 1 });
[
[-6, -6, 5.5, leaf1], [-6, 12, 4.8, leaf2], [-6, 25, 6.0, leaf1],
[-6, 35, 5.2, leaf2], [10, -7, 4.5, leaf1], [25, -7, 5.8, leaf2],
[38, -7, 4.8, leaf1], [47, 4, 5.5, leaf2], [47, 15, 4.5, leaf1],
[47, 26, 5.0, leaf2], [20, 36, 5.5, leaf1], [ 5, 36, 4.8, leaf2],
[35, 36, 5.5, leaf1],
].forEach(([tx, tz, th, lm]) => {
const tH = th * 0.55;
CYL(tx, tH / 2, tz, 0.14, 0.22, tH, 7, trunkM);
const sph = new THREE.Mesh(new THREE.SphereGeometry(1.5 + Math.random() * 0.6, 8, 6), l
sph.position.set(tx, tH + 1.2, tz);
sph.castShadow = true; scene.add(sph);
});
// ── Stars ─────────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starVerts = [];
for (let i = 0; i < 1200; i++) {
starVerts.push((Math.random() - 0.5) * 400, 80 + Math.random() * 100, (Math.random() -
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2
// ── Animation ─────────────────────────────────────────────────
let animId;
let t = 0;
const animate = () => {
animId = requestAnimationFrame(animate);
t += 0.012;
gantry.rotation.x += 0.004;
gantryGlow.intensity = 0.9 + Math.sin(t * 2) * 0.3;
petLight.intensity = 0.85 + Math.sin(t * 1.5) * 0.15;
specLight.intensity = 0.7 + Math.sin(t * 1.8 + 1) * 0.12;
renderer.render(scene, camera);
};
animate();
// ── Controls ─────────────────────────────────────────────────
let dragging = false, pX = 0, pY = 0;
const onDown = e => { dragging = true; pX = e.clientX; pY = e.clientY; };
const onMove = e => {
if (!dragging) return;
theta -= (e.clientX - pX) * 0.006;
phi = Math.max(0.12, Math.min(1.38, phi + (e.clientY - pY) * 0.006));
pX = e.clientX; pY = e.clientY;
posCamera();
};
const onUp = () => { dragging = false; };
const onWheel = e => { radius = Math.max(25, Math.min(160, radius + e.deltaY * 0.09)); po
let lTX = 0, lTY = 0, lTD = 0;
const onTS = e => {
if (e.touches.length === 1) { lTX = e.touches[0].clientX; lTY = e.touches[0].clientY; }
if (e.touches.length === 2) lTD = Math.hypot(e.touches[0].clientX - e.touches[1].client
};
const onTM = e => {
if (e.touches.length === 1) {
theta -= (e.touches[0].clientX - lTX) * 0.006;
phi = Math.max(0.12, Math.min(1.38, phi + (e.touches[0].clientY - lTY) * 0.006));
lTX = e.touches[0].clientX; lTY = e.touches[0].clientY;
posCamera();
}
if (e.touches.length === 2) {
const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].client
radius = Math.max(25, Math.min(160, radius - (d - lTD) * 0.12));
lTD = d; posCamera();
}
e.preventDefault();
};
mount.addEventListener('mousedown', onDown);
mount.addEventListener('mousemove', onMove);
mount.addEventListener('mouseup', onUp);
mount.addEventListener('mouseleave', onUp);
mount.addEventListener('wheel', onWheel, { passive: false });
mount.addEventListener('touchstart', onTS, { passive: false });
mount.addEventListener('touchmove', onTM, { passive: false });
const onResize = () => {
const nW = mount.clientWidth, nH = mount.clientHeight;
camera.aspect = nW / nH; camera.updateProjectionMatrix();
renderer.setSize(nW, nH);
};
window.addEventListener('resize', onResize);
return () => {
cancelAnimationFrame(animId);
['mousedown','mousemove','mouseup','mouseleave'].forEach(ev => mount.removeEventListene
mount.removeEventListener('wheel', onWheel);
mount.removeEventListener('touchstart', onTS);
mount.removeEventListener('touchmove', onTM);
window.removeEventListener('resize', onResize);
renderer.dispose();
if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
};
}, []);
const legendItems = [
{ c: '#2a5272', l: 'Zona Administrativa' },
{ c: '#245840', l: 'Zona de Pacientes' },
{ c: '#441858', l: 'PET / CT' },
{ c: '#1c3860', l: 'SPECT' },
{ c: '#5a2c10', l: 'Radiofarmacia / CQ' },
{ c: '#240c28', l: 'Cuarto de Decaimiento' },
{ c: '#4c3820', l: 'Áreas de Apoyo' },
];
return (
<div style={{ width: '100%', height: '100vh', background: '#080d18', overflow: 'hidden',
<div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
{/* Title */}
<div style={{
position: 'absolute', top: 22, left: 22, pointerEvents: 'none', userSelect: 'none',
fontFamily: "'Courier New', monospace",
}}>
</div>
</div>
<div style={{ fontSize: 10, letterSpacing: 5, color: '#556', marginBottom: 5 }}>RENDE
<div style={{ fontSize: 24, fontFamily: 'Georgia, serif', fontWeight: 400, letterSpac
Centro de Medicina Nuclear
<div style={{ fontSize: 10, color: '#445', marginTop: 4, letterSpacing: 2 }}>40 m × 2
{/* Legend */}
<div style={{
position: 'absolute', bottom: 22, left: 22, pointerEvents: 'none', userSelect: display: 'flex', flexDirection: 'column', gap: 6,
'none'
}}>
{legendItems.map(item => (
<div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
<div style={{ width: 11, height: 11, borderRadius: 2, background: item.c, border:
<span style={{ color: '#667', fontSize: 10, fontFamily: "'Courier New', monospace
</div>
))}
</div>
{/* Controls hint */}
<div style={{
position: 'absolute', bottom: 22, right: 22, color: '#445',
fontFamily: "'Courier New', monospace", fontSize: 10, textAlign: 'right',
pointerEvents: 'none', lineHeight: 2,
}}>
<div> Arrastrar · Rotar cámara</div>
<div> Scroll · Zoom</div>
<div> Deslizar · Pellizcar</div>
</div>
</div>
);
}
