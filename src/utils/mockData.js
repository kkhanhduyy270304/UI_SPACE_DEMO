/**
 * Generate realistic store summary mock data
 */
export const generateMockStoreSummary = () => {
  const totalPeople = Math.floor(Math.random() * 500 + 200); // 200-700 people
  const totalInvoices = Math.floor(totalPeople * (Math.random() * 0.3 + 0.15)); // 15-45% conversion
  const liveOccupancy = Math.floor(Math.random() * 100 + 50); // 50-150 current people

  return {
    storeId: 'store-001',
    daily_visitors: totalPeople,
    live_occupancy: liveOccupancy,
    conversion_rate: parseFloat((totalInvoices / totalPeople * 100).toFixed(2)),
    date: new Date().toISOString()
  };
};

/**
 * Generate mock hourly traffic data
 */
export const generateMockHourlyData = () => {
  const hours = [];
  for (let hour = 8; hour <= 22; hour++) {
    const baseTraffic = hour < 12 ? 20 + (hour - 8) * 10 : hour > 18 ? 80 - (hour - 18) * 15 : 80;
    const traffic = Math.floor(baseTraffic + Math.random() * 40 - 20);
    hours.push({
      hour: `${hour}:00`,
      visitors: Math.max(0, traffic)
    });
  }
  return hours;
};

/**
 * Generate realistic zone statistics
 * Clothing zones have higher dwell time, entrance has lower
 */
export const generateMockZoneStats = () => {
  const zones = [{
    name: 'Entrance',
    avgDwell: 30,
    conversionMultiplier: 0.1
  }, {
    name: 'Clothing',
    avgDwell: 420,
    conversionMultiplier: 1.5
  }, {
    name: 'Electronics',
    avgDwell: 360,
    conversionMultiplier: 1.3
  }, {
    name: 'Checkout',
    avgDwell: 90,
    conversionMultiplier: 1.0
  }, {
    name: 'Shelf A',
    avgDwell: 180,
    conversionMultiplier: 0.8
  }];
  return zones.map((zone, index) => {
    const peopleCount = Math.floor(Math.random() * 150 + 50);
    const baseConversion = Math.random() * 20 + 10; // 10-30%
    const trends = ['up', 'down', 'steady'];
    return {
      zone_id: `zone-${String(index + 1).padStart(3, '0')}`,
      zone_name: zone.name,
      people_count: peopleCount,
      performance: {
        conversion_rate: parseFloat((baseConversion * zone.conversionMultiplier).toFixed(2)),
        avg_dwell_time: zone.avgDwell + Math.floor(Math.random() * 60 - 30),
        total_stop_events: Math.floor(peopleCount * (Math.random() * 0.4 + 0.3))
      },
      trend: trends[Math.floor(Math.random() * trends.length)],
      date: new Date().toISOString()
    };
  });
};

/**
 * Generate realistic heatmap data
 * Higher density near entrance and hot zones
 */
export const generateMockHeatmap = (width = 1920, height = 1080) => {
  const dataPoints = [];
  const hotspots = [{
    x: width * 0.2,
    y: height * 0.3,
    radius: 200
  },
  // Entrance
  {
    x: width * 0.5,
    y: height * 0.5,
    radius: 150
  },
  // Center aisle
  {
    x: width * 0.7,
    y: height * 0.6,
    radius: 180
  } // Popular shelf
  ];

  // Generate points around hotspots
  for (let i = 0; i < 500; i++) {
    const hotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * hotspot.radius;
    const x = Math.floor(hotspot.x + Math.cos(angle) * distance);
    const y = Math.floor(hotspot.y + Math.sin(angle) * distance);
    const intensity = Math.max(0, 1 - distance / hotspot.radius) * (Math.random() * 0.3 + 0.7);
    dataPoints.push({
      x: Math.max(0, Math.min(width, x)),
      y: Math.max(0, Math.min(height, y)),
      intensity: parseFloat(intensity.toFixed(2))
    });
  }
  return {
    camera_id: 'cam-001',
    data_points: dataPoints,
    date: new Date().toISOString()
  };
};

/**
 * Generate hourly traffic data (peak at 18:00)
 */
export const generateHourlyTraffic = () => {
  return Array.from({
    length: 24
  }, (_, hour) => {
    let baseTraffic = 20;

    // Peak hours: 12:00-14:00 and 17:00-19:00
    if (hour >= 12 && hour <= 14) {
      baseTraffic = 80 + Math.random() * 40;
    } else if (hour >= 17 && hour <= 19) {
      baseTraffic = 100 + Math.random() * 50; // Highest peak
    } else if (hour >= 9 && hour < 12) {
      baseTraffic = 50 + Math.random() * 30;
    } else if (hour >= 15 && hour < 17) {
      baseTraffic = 40 + Math.random() * 20;
    } else if (hour >= 20 && hour <= 22) {
      baseTraffic = 30 + Math.random() * 20;
    }
    return {
      hour: `${String(hour).padStart(2, '0')}:00`,
      traffic: Math.floor(baseTraffic)
    };
  });
};
