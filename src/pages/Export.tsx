import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Database, Calendar, MapPin, Filter } from "lucide-react";

// Mock export data preview
const mockExportData = [
  { float_id: "5904471", date: "2024-01-15", depth: 0, temperature: 18.5, salinity: 35.2, oxygen: 220 },
  { float_id: "5904471", date: "2024-01-15", depth: 10, temperature: 18.2, salinity: 35.3, oxygen: 218 },
  { float_id: "5904471", date: "2024-01-15", depth: 25, temperature: 17.8, salinity: 35.5, oxygen: 215 },
  { float_id: "5906542", date: "2024-01-14", depth: 0, temperature: 17.8, salinity: 35.1, oxygen: 225 },
  { float_id: "5906542", date: "2024-01-14", depth: 10, temperature: 17.5, salinity: 35.2, oxygen: 222 },
];

const Export = () => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [selectedFloats, setSelectedFloats] = useState<string[]>(["5904471"]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>(["temperature", "salinity"]);
  const [dateRange, setDateRange] = useState({ from: "2024-01-01", to: "2024-01-31" });
  const [includeMetadata, setIncludeMetadata] = useState(true);

  const availableFloats = ["5904471", "5906542", "5904892", "5906123", "5905334"];
  const availableParameters = [
    { id: "temperature", label: "Temperature (°C)" },
    { id: "salinity", label: "Salinity (PSU)" },
    { id: "oxygen", label: "Dissolved Oxygen (μmol/kg)" },
    { id: "pressure", label: "Pressure (dbar)" },
    { id: "conductivity", label: "Conductivity (S/m)" },
  ];

  const exportFormats = [
    { id: "csv", label: "CSV", description: "Comma-separated values", icon: FileText },
    { id: "netcdf", label: "NetCDF", description: "Network Common Data Form", icon: Database },
    { id: "json", label: "JSON", description: "JavaScript Object Notation", icon: FileText },
  ];

  const handleFloatToggle = (floatId: string) => {
    setSelectedFloats(prev => 
      prev.includes(floatId) 
        ? prev.filter(id => id !== floatId)
        : [...prev, floatId]
    );
  };

  const handleParameterToggle = (parameterId: string) => {
    setSelectedParameters(prev => 
      prev.includes(parameterId) 
        ? prev.filter(id => id !== parameterId)
        : [...prev, parameterId]
    );
  };

  const handleExport = () => {
    // Mock export functionality
    const filename = `argo_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    console.log(`Exporting ${filename} with:`, {
      format: exportFormat,
      floats: selectedFloats,
      parameters: selectedParameters,
      dateRange,
      includeMetadata,
    });
    
    // In a real app, this would trigger the actual export
    alert(`Export started: ${filename}`);
  };

  const estimatedRecords = selectedFloats.length * 50; // Mock calculation
  const estimatedSize = Math.round(estimatedRecords * 0.1); // Mock size in KB

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            Export Data
          </h1>
          <p className="text-muted-foreground">
            Download ARGO ocean data in various formats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Export Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exportFormats.map(format => (
                  <div 
                    key={format.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      exportFormat === format.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setExportFormat(format.id)}
                  >
                    <div className="flex items-center gap-3">
                      <format.icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-muted-foreground">{format.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Data Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">From</label>
                    <Input 
                      type="date" 
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">To</label>
                    <Input 
                      type="date" 
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Float Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  ARGO Floats ({selectedFloats.length} selected)
                </label>
                <ScrollArea className="h-32 border rounded-md p-3">
                  <div className="space-y-2">
                    {availableFloats.map(floatId => (
                      <div key={floatId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`float-${floatId}`}
                          checked={selectedFloats.includes(floatId)}
                          onCheckedChange={() => handleFloatToggle(floatId)}
                        />
                        <label
                          htmlFor={`float-${floatId}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Float {floatId}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Parameter Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Parameters ({selectedParameters.length} selected)
                </label>
                <ScrollArea className="h-32 border rounded-md p-3">
                  <div className="space-y-2">
                    {availableParameters.map(param => (
                      <div key={param.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`param-${param.id}`}
                          checked={selectedParameters.includes(param.id)}
                          onCheckedChange={() => handleParameterToggle(param.id)}
                        />
                        <label
                          htmlFor={`param-${param.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {param.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-metadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
                  />
                  <label
                    htmlFor="include-metadata"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Include metadata (float positions, dates, QC flags)
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Summary & Preview */}
        <div className="space-y-6">
          {/* Export Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Format</span>
                  <Badge variant="outline">{exportFormat.toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Floats</span>
                  <span className="text-sm font-medium">{selectedFloats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Parameters</span>
                  <span className="text-sm font-medium">{selectedParameters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date Range</span>
                  <span className="text-sm font-medium">
                    {Math.ceil((new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Records</span>
                  <span className="text-sm font-medium">{estimatedRecords.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Size</span>
                  <span className="text-sm font-medium">{estimatedSize} KB</span>
                </div>
              </div>

              <Button 
                onClick={handleExport} 
                className="w-full"
                disabled={selectedFloats.length === 0 || selectedParameters.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>

          {/* Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                First 5 rows of selected data
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Float ID</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Depth</TableHead>
                      {selectedParameters.includes("temperature") && <TableHead className="text-xs">Temp</TableHead>}
                      {selectedParameters.includes("salinity") && <TableHead className="text-xs">Sal</TableHead>}
                      {selectedParameters.includes("oxygen") && <TableHead className="text-xs">O₂</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExportData.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs">{row.float_id}</TableCell>
                        <TableCell className="text-xs">{row.date}</TableCell>
                        <TableCell className="text-xs">{row.depth}m</TableCell>
                        {selectedParameters.includes("temperature") && (
                          <TableCell className="text-xs">{row.temperature}°C</TableCell>
                        )}
                        {selectedParameters.includes("salinity") && (
                          <TableCell className="text-xs">{row.salinity}</TableCell>
                        )}
                        {selectedParameters.includes("oxygen") && (
                          <TableCell className="text-xs">{row.oxygen}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Export Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Export Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add notes about this export (optional)..."
                className="min-h-20 text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Export;