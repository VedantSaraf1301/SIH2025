import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GitCompare, TrendingUp, Plus, X, BarChart3 } from "lucide-react";

// Mock comparison data
const mockComparisonData = [
  { depth: 0, float1: 18.5, float2: 17.8, float3: 19.1 },
  { depth: 10, float1: 18.2, float2: 17.5, float3: 18.8 },
  { depth: 25, float1: 17.8, float2: 17.1, float3: 18.3 },
  { depth: 50, float1: 16.2, float2: 15.8, float3: 17.1 },
  { depth: 100, float1: 13.5, float2: 13.1, float3: 14.2 },
  { depth: 200, float1: 9.8, float2: 9.2, float3: 10.5 },
  { depth: 500, float1: 5.2, float2: 4.9, float3: 5.8 },
  { depth: 1000, float1: 3.1, float2: 2.8, float3: 3.5 },
];

const mockFloats = [
  { id: "5904471", location: "North Atlantic", status: "active", lastProfile: "2024-01-15" },
  { id: "5906542", location: "North Atlantic", status: "active", lastProfile: "2024-01-14" },
  { id: "5904892", location: "South Atlantic", status: "inactive", lastProfile: "2024-01-10" },
  { id: "5906123", location: "Gulf of Mexico", status: "active", lastProfile: "2024-01-15" },
  { id: "5905334", location: "Nordic Seas", status: "active", lastProfile: "2024-01-15" },
];

const comparisonColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

const Compare = () => {
  const [selectedFloats, setSelectedFloats] = useState<string[]>(["5904471", "5906542"]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [comparisonMode, setComparisonMode] = useState("overlay");

  const handleFloatToggle = (floatId: string) => {
    setSelectedFloats(prev => 
      prev.includes(floatId) 
        ? prev.filter(id => id !== floatId)
        : prev.length < 5 ? [...prev, floatId] : prev
    );
  };

  const removeFloat = (floatId: string) => {
    setSelectedFloats(prev => prev.filter(id => id !== floatId));
  };

  const parameterConfig = {
    temperature: { label: "Temperature", unit: "°C" },
    salinity: { label: "Salinity", unit: "PSU" },
    oxygen: { label: "Dissolved Oxygen", unit: "μmol/kg" },
  };

  const currentParam = parameterConfig[selectedParameter as keyof typeof parameterConfig];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitCompare className="h-6 w-6 text-primary" />
            Compare Profiles
          </h1>
          <p className="text-muted-foreground">
            Compare ocean parameters across multiple ARGO floats
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export Comparison
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Float Selection Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Select Floats
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose up to 5 floats to compare
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {mockFloats.map(float => (
                  <div key={float.id} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={float.id}
                        checked={selectedFloats.includes(float.id)}
                        onCheckedChange={() => handleFloatToggle(float.id)}
                        disabled={!selectedFloats.includes(float.id) && selectedFloats.length >= 5}
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <label
                          htmlFor={float.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Float {float.id}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {float.location}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={float.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {float.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {float.lastProfile}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Comparison Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comparison Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Parameter</label>
                  <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(parameterConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Comparison Mode</label>
                  <Select value={comparisonMode} onValueChange={setComparisonMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overlay">Overlay Profiles</SelectItem>
                      <SelectItem value="difference">Show Differences</SelectItem>
                      <SelectItem value="statistics">Statistical Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Update Comparison
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Floats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Selected Floats ({selectedFloats.length}/5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedFloats.map((floatId, index) => (
                  <Badge 
                    key={floatId} 
                    variant="outline" 
                    className="flex items-center gap-2 px-3 py-1"
                    style={{ 
                      borderColor: comparisonColors[index],
                      color: comparisonColors[index]
                    }}
                  >
                    Float {floatId}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeFloat(floatId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedFloats.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Select floats from the sidebar to start comparing
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Chart */}
          {selectedFloats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-primary" />
                  {currentParam.label} Profile Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey={currentParam.label.toLowerCase()}
                        type="number"
                        domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        label={{ 
                          value: `${currentParam.label} (${currentParam.unit})`, 
                          position: 'insideBottom', 
                          offset: -10 
                        }}
                      />
                      <YAxis 
                        dataKey="depth"
                        reversed={true}
                        domain={[0, 'dataMax']}
                        label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value} ${currentParam.unit}`, 
                          name
                        ]}
                        labelFormatter={(label) => `Depth: ${label} m`}
                      />
                      <Legend />
                      
                      {selectedFloats.map((floatId, index) => (
                        <Line
                          key={floatId}
                          type="monotone"
                          dataKey={`float${index + 1}`}
                          stroke={comparisonColors[index]}
                          strokeWidth={2}
                          name={`Float ${floatId}`}
                          dot={{ fill: comparisonColors[index], strokeWidth: 2, r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Statistics */}
          {selectedFloats.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Comparison Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">0.8°C</div>
                    <div className="text-sm text-muted-foreground">Average Difference</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-success">98.2%</div>
                    <div className="text-sm text-muted-foreground">Correlation</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-info">1200m</div>
                    <div className="text-sm text-muted-foreground">Max Depth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;