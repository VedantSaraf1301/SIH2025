import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Globe, Thermometer, Droplets, MessageCircle, Map, BarChart3, GitCompare, Download } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-ocean-argo.jpg";

const Home = () => {
  const stats = [
    { title: "Active Floats", value: "3,947", icon: Activity, color: "text-primary" },
    { title: "Ocean Coverage", value: "Global", icon: Globe, color: "text-info" },
    { title: "Temperature Profiles", value: "2.1M+", icon: Thermometer, color: "text-chart-secondary" },
    { title: "Salinity Records", value: "1.8M+", icon: Droplets, color: "text-chart-tertiary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-ocean">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 overflow-hidden rounded-b-xl">
          <img 
            src={heroImage} 
            alt="ARGO floats in the deep ocean collecting oceanographic data"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
            <div className="max-w-4xl mx-auto px-8 text-white">
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                FloatChat
              </h1>
              <p className="text-xl mb-2 opacity-90">AI-Powered ARGO Data Explorer</p>
              <p className="text-lg opacity-75 max-w-2xl leading-relaxed">
                Explore and analyze global ocean data from autonomous ARGO floats through 
                intelligent conversation, interactive visualizations, and advanced data discovery.
              </p>
              <div className="flex gap-4 mt-6">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/chat">Start Exploring</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-primary hover:bg-white/10">
                  <Link to="/map">View Global Map</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.title} className="metric-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Features Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Intelligent Chat Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ask questions about ocean data in natural language. Get instant responses with 
                relevant charts, maps, and detailed analyses.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Natural Language Queries</Badge>
                <Badge variant="secondary">Real-time Responses</Badge>
                <Badge variant="secondary">Multi-format Output</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Interactive Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visualize ARGO float locations and trajectories on an interactive global map. 
                Filter by date ranges, regions, and data quality.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Global Coverage</Badge>
                <Badge variant="secondary">Real-time Updates</Badge>
                <Badge variant="secondary">Advanced Filtering</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="bg-muted/30 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" size="lg" className="h-auto p-6 flex-col gap-3">
              <Link to="/profiles">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">View Profiles</div>
                  <div className="text-sm text-muted-foreground">Temperature & Salinity</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto p-6 flex-col gap-3">
              <Link to="/compare">
                <GitCompare className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Compare Data</div>
                  <div className="text-sm text-muted-foreground">Multi-float Analysis</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto p-6 flex-col gap-3">
              <Link to="/export">
                <Download className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Export Data</div>
                  <div className="text-sm text-muted-foreground">CSV & NetCDF</div>
                </div>
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;