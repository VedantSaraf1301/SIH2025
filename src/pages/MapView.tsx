import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Filter, Download } from "lucide-react";

// Mock ARGO float data
const mockFloats = [
  { id: "5904471", lat: 45.2, lon: -30.1, status: "active", lastUpdate: "2024-01-15", region: "North Atlantic" },
  { id: "5906542", lat: 35.8, lon: -40.3, status: "active", lastUpdate: "2024-01-14", region: "North Atlantic" },
  { id: "5904892", lat: -10.5, lon: 15.2, status: "inactive", lastUpdate: "2024-01-10", region: "South Atlantic" },
  { id: "5906123", lat: 25.1, lon: -80.4, status: "active", lastUpdate: "2024-01-15", region: "Gulf of Mexico" },
  { id: "5905334", lat: 60.2, lon: -20.8, status: "active", lastUpdate: "2024-01-15", region: "Nordic Seas" },
];

const MapView = () => {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFloats = mockFloats.filter(float => {
    const matchesRegion = regionFilter === "all" || float.region === regionFilter;
    const matchesStatus = statusFilter === "all" || float.status === statusFilter;
    const matchesSearch = float.id.includes(searchQuery) || float.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRegion && matchesStatus && matchesSearch;
  });

  const regions = Array.from(new Set(mockFloats.map(f => f.region)));

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar Filters */}
      <div className="w-80 border-r border-border bg-card/30 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters & Search
            </h2>
            
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search Floats</label>
                <Input
                  placeholder="Float ID or region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" placeholder="From" />
                  <Input type="date" placeholder="To" />
                </div>
              </div>
            </div>
          </div>

          {/* Float List */}
          <div>
            <h3 className="text-md font-medium mb-3 flex items-center justify-between">
              Float List 
              <Badge variant="secondary">{filteredFloats.length}</Badge>
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredFloats.map(float => (
                <Card 
                  key={float.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFloat === float.id ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedFloat(float.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{float.id}</div>
                        <div className="text-xs text-muted-foreground">{float.region}</div>
                        <div className="text-xs text-muted-foreground">
                          {float.lat.toFixed(2)}°, {float.lon.toFixed(2)}°
                        </div>
                      </div>
                      <Badge 
                        variant={float.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {float.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {float.lastUpdate}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 flex flex-col">
        {/* Map Header */}
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Global ARGO Float Map
              </h1>
              <p className="text-sm text-muted-foreground">
                Interactive map showing {filteredFloats.length} ARGO floats worldwide
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export View
              </Button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-gradient-to-br from-ocean-100 to-ocean-200">
          {/* Placeholder Map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Interactive Map</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-muted/50 h-48 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Leaflet map will be rendered here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing {filteredFloats.length} ARGO floats
                    </p>
                  </div>
                </div>
                
                {selectedFloat && (
                  <div className="text-left">
                    <h4 className="font-medium text-sm mb-2">Selected Float</h4>
                    {(() => {
                      const float = mockFloats.find(f => f.id === selectedFloat);
                      return float ? (
                        <div className="space-y-1">
                          <div className="text-xs"><strong>ID:</strong> {float.id}</div>
                          <div className="text-xs"><strong>Location:</strong> {float.lat.toFixed(3)}°, {float.lon.toFixed(3)}°</div>
                          <div className="text-xs"><strong>Region:</strong> {float.region}</div>
                          <div className="text-xs"><strong>Status:</strong> 
                            <Badge className="ml-1" variant={float.status === "active" ? "default" : "secondary"} size="sm">
                              {float.status}
                            </Badge>
                          </div>
                          <div className="text-xs"><strong>Last Update:</strong> {float.lastUpdate}</div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map Stats Overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            <Card className="glass-effect">
              <CardContent className="p-3">
                <div className="text-xs text-center">
                  <div className="font-medium">Active Floats</div>
                  <div className="text-lg font-bold text-success">
                    {filteredFloats.filter(f => f.status === "active").length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardContent className="p-3">
                <div className="text-xs text-center">
                  <div className="font-medium">Regions</div>
                  <div className="text-lg font-bold text-info">
                    {new Set(filteredFloats.map(f => f.region)).size}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;