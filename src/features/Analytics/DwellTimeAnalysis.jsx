import { Card } from '../../components/common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Clock, TrendingUp, Users } from 'lucide-react';

// Mock data for dwell time analysis
const dwellTimeData = [
  { zone: 'Lối vào chính', avgDwellTime: 2.5, visitors: 450 },
  { zone: 'Quầy thanh toán', avgDwellTime: 5.2, visitors: 380 },
  { zone: 'Khu vực giảm giá', avgDwellTime: 8.3, visitors: 320 },
  { zone: 'Mỹ phẩm cao cấp', avgDwellTime: 12.1, visitors: 210 },
  { zone: 'Đồ chơi trẻ em', avgDwellTime: 7.8, visitors: 180 },
  { zone: 'Nội thất lớn', avgDwellTime: 15.4, visitors: 95 },
];

const hourlyDwellTime = [
  { hour: '08:00', avgDwell: 3.2 },
  { hour: '10:00', avgDwell: 6.5 },
  { hour: '12:00', avgDwell: 8.2 },
  { hour: '14:00', avgDwell: 7.9 },
  { hour: '16:00', avgDwell: 9.1 },
  { hour: '18:00', avgDwell: 10.3 },
  { hour: '20:00', avgDwell: 6.8 },
  { hour: '22:00', avgDwell: 4.2 },
];

/**
 * DwellTimeAnalysis - Analyzes how long customers stay in different zones
 */
export const DwellTimeAnalysis = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Phân tích thời gian dừng</h1>
          <p className="text-gray-600">Phân tích thời gian khách hàng dừng lại tại các khu vực khác nhau</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Thời gian dừng trung bình</p>
                <p className="text-3xl font-bold text-gray-900">8.6 phút</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Khách đã phân tích</p>
                <p className="text-3xl font-bold text-gray-900">1,635</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Khu vực nóng nhất</p>
                <p className="text-3xl font-bold text-gray-900">Nội thất lớn</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Average Dwell Time by Zone */}
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thời gian dừng trung bình theo khu vực</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dwellTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" label={{ value: 'Thời gian (phút)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Số khách', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgDwellTime" fill="#3B82F6" name="Thời gian dừng (phút)" />
                <Bar yAxisId="right" dataKey="visitors" fill="#10B981" name="Số khách" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hourly Dwell Time Trend */}
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Xu hướng thời gian dừng theo giờ</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyDwellTime}>
                <defs>
                  <linearGradient id="colorDwell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis label={{ value: 'Thời gian (phút)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value} phút`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgDwell" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Thời gian dừng trung bình"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Summary Table */}
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chi tiết theo khu vực</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Khu vực</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Thời gian dừng (phút)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Số khách</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Tỷ lệ (%)</th>
                </tr>
              </thead>
              <tbody>
                {dwellTimeData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{row.zone}</td>
                    <td className="py-3 px-4 text-right font-medium">{row.avgDwellTime}</td>
                    <td className="py-3 px-4 text-right">{row.visitors}</td>
                    <td className="py-3 px-4 text-right">{((row.visitors / 1635) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
