import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { BarChart3, TrendingUp, Thermometer, Droplets, Wind } from "lucide-react";

// Mock profile data
const mockProfileData = [
  { depth: 0, temperature: 18.5, salinity: 35.2, oxygen: 220 },
  { depth: 10, temperature: 18.2, salinity: 35.3, oxygen: 218 },
  { depth: 25, temperature: 17.8, salinity: 35.5, oxygen: 215 },
  { depth: 50, temperature: 16.2, salinity: 35.8, oxygen: 200 },
  { depth: 100, temperature: 13.5, salinity: 36.1, oxygen: 180 },
  { depth: 200, temperature: 9.8, salinity: 36.5, oxygen: 150 },
  { depth: 500, temperature: 5.2, salinity: 36.8, oxygen: 120 },
  { depth: 1000, temperature: 3.1, salinity: 37.0, oxygen: 100 },
  { depth: 2000, temperature: 2.1, salinity: 37.1, oxygen: 85 },
];

const mockTimeSeriesData = [
  { date: "2024-01-01", temperature: 18.2, salinity: 35.1 },
  { date: "2024-01-05", temperature: 18.5, salinity: 35.3 },
  { date: "2024-01-10", temperature: 18.1, salinity: 35.2 },
  { date: "2024-01-15", temperature: 17.9, salinity: 35.4 },
];

const mockFloats = [
  "5904471", "5906542", "5904892", "5906123", "5905334"
];

const Profiles = () => {
  const [selectedFloat, setSelectedFloat] = useState(mockFloats[0]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [viewMode, setViewMode] = useState("profile");

  const parameterConfig = {
    temperature: { 
      label: "Temperature", 
      unit: "°C", 
      color: "#ef4444", 
      icon: Thermometer,
      dataKey: "temperature" 
    },
    salinity: { 
      label: "Salinity", 
      unit: "PSU", 
      color: "#3b82f6", 
      icon: Droplets,
      dataKey: "salinity" 
    },
    oxygen: { 
      label: "Dissolved Oxygen", 
      unit: "μmol/kg", 
      color: "#10b981", 
      icon: Wind,
      dataKey: "oxygen" 
    },
  };

  const currentParam = parameterConfig[selectedParameter as keyof typeof parameterConfig];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Ocean Profiles
          </h1>
          <p className="text-muted-foreground">
            Analyze vertical ocean parameter profiles from ARGO floats
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Float ID</label>
              <Select value={selectedFloat} onValueChange={setSelectedFloat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockFloats.map(floatId => (
                    <SelectItem key={floatId} value={floatId}>
                      Float {floatId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Parameter</label>
              <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(parameterConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">View Mode</label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profile">Depth Profile</SelectItem>
                  <SelectItem value="timeseries">Time Series</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                Update Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentParam.icon className="h-5 w-5" style={{ color: currentParam.color }} />
              {currentParam.label} {viewMode === "profile" ? "vs Depth" : "Time Series"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              {viewMode === "profile" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={mockProfileData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      type="number"
                      dataKey={currentParam.dataKey}
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                      label={{ value: `${currentParam.label} (${currentParam.unit})`, position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      type="number"
                      dataKey="depth"
                      reversed={true}
                      domain={[0, 'dataMax']}
                      label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} ${currentParam.unit}`, 
                        currentParam.label
                      ]}
                      labelFormatter={(label) => `Depth: ${label} m`}
                    />
                    <Scatter 
                      dataKey={currentParam.dataKey}
                      fill={currentParam.color}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={currentParam.dataKey} 
                      stroke={currentParam.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      label={{ value: `${currentParam.label} (${currentParam.unit})`, angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} ${currentParam.unit}`, currentParam.label]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={currentParam.dataKey} 
                      stroke={currentParam.color}
                      strokeWidth={3}
                      dot={{ fill: currentParam.color, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Profile Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {viewMode === "profile" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Surface Value</span>
                    <span className="font-medium">
                      {mockProfileData[0][currentParam.dataKey as keyof typeof mockProfileData[0]]} {currentParam.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Depth</span>
                    <span className="font-medium">
                      {Math.max(...mockProfileData.map(d => d.depth))} m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Deep Value</span>
                    <span className="font-medium">
                      {mockProfileData[mockProfileData.length - 1][currentParam.dataKey as keyof typeof mockProfileData[0]]} {currentParam.unit}
                    </span>
                  </div>
                </>
              )}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Float Status</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Last Profile</span>
                  <span className="text-sm">2024-01-15</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Thermometer className="h-4 w-4 mr-2" />
                View Temperature
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Droplets className="h-4 w-4 mr-2" />
                View Salinity
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Wind className="h-4 w-4 mr-2" />
                View Oxygen
              </Button>
            </CardContent>
          </Card>

          {/* Profile Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Profile Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div><strong>Float ID:</strong> {selectedFloat}</div>
                <div><strong>Location:</strong> 45.2°N, 30.1°W</div>
                <div><strong>Date:</strong> 2024-01-15</div>
                <div><strong>Cycle:</strong> 127</div>
                <div><strong>Data Mode:</strong> Real-time</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profiles;