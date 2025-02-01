export const fetchSiteData = async (id: string) => {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    title: `Site ${id}`,
    views: Math.floor(Math.random() * 10000),
    totalLeads: Math.floor(Math.random() * 100),
    conversionRate: (Math.random() * 10).toFixed(2),
    averageTimeOnPage: Math.floor(Math.random() * 300),
    bounceRate: (Math.random() * 100).toFixed(2),
    viewsOverTime: Array.from({ length: 30 }, (_, i) => ({
      date: `2023-${String(i + 1).padStart(2, '0')}-01`,
      views: Math.floor(Math.random() * 1000),
    })),
    leadsBySource: [
      { name: 'Direct', value: Math.floor(Math.random() * 100) },
      { name: 'Organic Search', value: Math.floor(Math.random() * 100) },
      { name: 'Paid Search', value: Math.floor(Math.random() * 100) },
      { name: 'Social Media', value: Math.floor(Math.random() * 100) },
    ],
    conversionByDay: [
      { name: 'Mon', conversions: Math.floor(Math.random() * 50) },
      { name: 'Tue', conversions: Math.floor(Math.random() * 50) },
      { name: 'Wed', conversions: Math.floor(Math.random() * 50) },
      { name: 'Thu', conversions: Math.floor(Math.random() * 50) },
      { name: 'Fri', conversions: Math.floor(Math.random() * 50) },
      { name: 'Sat', conversions: Math.floor(Math.random() * 50) },
      { name: 'Sun', conversions: Math.floor(Math.random() * 50) },
    ],
    leads: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      phone: `(555) ${String(Math.floor(Math.random() * 900) + 100).padStart(
        3,
        '0'
      )}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
      status: ['New', 'Contacted', 'Qualified', 'Unqualified'][
        Math.floor(Math.random() * 4)
      ],
      date: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0],
    })),
    propertyInterest: [
      { name: 'Bedrooms', interested: 75, notInterested: 25 },
      { name: 'Location', interested: 90, notInterested: 10 },
      { name: 'Price', interested: 60, notInterested: 40 },
      { name: 'Amenities', interested: 80, notInterested: 20 },
    ],
    leadQualityScores: [
      { name: 'Hot', value: 30 },
      { name: 'Warm', value: 45 },
      { name: 'Cold', value: 25 },
    ],
    contactMethodPreferences: [
      { name: 'Phone', value: 40 },
      { name: 'Email', value: 35 },
      { name: 'Text', value: 25 },
    ],
    timeToFirstResponse: [
      { name: '< 1 hour', value: 20 },
      { name: '1-3 hours', value: 35 },
      { name: '3-6 hours', value: 25 },
      { name: '6-24 hours', value: 15 },
      { name: '> 24 hours', value: 5 },
    ],
    seasonalTrends: [
      { name: 'Jan', value: 65 },
      { name: 'Feb', value: 70 },
      { name: 'Mar', value: 80 },
      { name: 'Apr', value: 90 },
      { name: 'May', value: 95 },
      { name: 'Jun', value: 100 },
      { name: 'Jul', value: 98 },
      { name: 'Aug', value: 95 },
      { name: 'Sep', value: 90 },
      { name: 'Oct', value: 85 },
      { name: 'Nov', value: 75 },
      { name: 'Dec', value: 70 },
    ],
  };
};
