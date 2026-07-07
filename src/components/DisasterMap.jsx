/**
 * components/DisasterMap.jsx
 * -----------------------------------------------------------------------
 * Interactive map (Leaflet.js + OpenStreetMap tiles) plotting disaster
 * report locations. Marker color reflects severity.
 */

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const SEVERITY_COLORS = {
  Critical: '#FF4757',
  High: '#FFA734',
  Medium: '#4D8EFF',
  Low: '#3DD68C',
}

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:16px;height:16px;border-radius:50%;
      background:${color};
      border:2px solid #0F1620;
      box-shadow:0 0 0 4px ${color}33;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function DisasterMap({ reports = [], center = [20.5937, 78.9629], zoom = 5, height = '400px' }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    const validReports = reports.filter((r) => r.lat != null && r.lng != null)

    validReports.forEach((report) => {
      const color = SEVERITY_COLORS[report.severity] || '#94A7B8'
      const marker = L.marker([report.lat, report.lng], { icon: makeIcon(color) }).addTo(map)
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:180px">
          <strong style="color:#16202C">${report.disaster_type}</strong>
          <div style="font-size:12px;color:#555;margin:4px 0">${report.location}</div>
          <div style="font-size:12px;color:#555">${report.report_text.slice(0, 80)}${report.report_text.length > 80 ? '…' : ''}</div>
          <div style="margin-top:6px;font-size:11px;font-weight:600;color:${color}">${report.severity} · ${report.priority}</div>
        </div>
      `)
      markersRef.current.push(marker)
    })

    if (validReports.length > 0) {
      const bounds = L.latLngBounds(validReports.map((r) => [r.lat, r.lng]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
    }
  }, [reports])

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', borderRadius: '12px', zIndex: 0 }}
      className="overflow-hidden border border-ink-600"
    />
  )
}
