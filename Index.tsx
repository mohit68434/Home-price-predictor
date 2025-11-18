import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocationSelector } from "@/components/LocationSelector";
import { PropertyFeatures } from "@/components/PropertyFeatures";
import { AdvancedFeatures } from "@/components/AdvancedFeatures";
import { PredictionResult } from "@/components/PredictionResult";
import { PropertyComparison, SavedProperty } from "@/components/PropertyComparison";
import { SimilarProperties } from "@/components/SimilarProperties";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { PropertyWishlist } from "@/components/PropertyWishlist";
import { calculatePrice } from "@/lib/priceCalculator";
import { Calculator, Building2, Save } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-house.jpg";

const Index = () => {
  const [city, setCity] = useState("");
  const [area, setArea] = useState(1000);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [locationRating, setLocationRating] = useState(5);
  const [schoolProximity, setSchoolProximity] = useState(2);
  const [marketProximity, setMarketProximity] = useState(1.5);
  const [amenities, setAmenities] = useState({
    parking: false,
    garden: false,
    balcony: false,
  });
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setAmenities((prev) => ({ ...prev, [amenity]: checked }));
  };

  const handlePrediction = () => {
    if (!city) {
      toast.error("Please select a city to continue", {
        description: "City selection is required for price prediction"
      });
      return;
    }

    setIsCalculating(true);
    setPredictedPrice(null);

    // Simulate calculation delay for better UX
    setTimeout(() => {
      const price = calculatePrice({
        city,
        area,
        bedrooms,
        bathrooms,
        locationRating,
        schoolProximity,
        marketProximity,
        amenities,
      });

      setPredictedPrice(price);
      setIsCalculating(false);
      toast.success("Price calculated successfully!", {
        description: "Your property valuation is ready"
      });
    }, 1500);
  };

  const handleSaveProperty = () => {
    if (!city || predictedPrice === null) {
      toast.error("Please predict a price first");
      return;
    }

    const newProperty: SavedProperty = {
      id: `${Date.now()}`,
      city,
      area,
      bedrooms,
      bathrooms,
      locationRating,
      price: predictedPrice,
      amenities,
    };

    setSavedProperties((prev) => [...prev, newProperty]);
    toast.success("Property saved for comparison!");
  };

  const handleRemoveProperty = (id: string) => {
    setSavedProperties((prev) => prev.filter((p) => p.id !== id));
    toast.success("Property removed");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Modern house" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <div className="flex items-center justify-center gap-3">
              <Building2 className="w-12 h-12 text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                House Price Predictor
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Get accurate property valuations based on location, features, and market trends
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-smooth">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Location</h2>
              <LocationSelector value={city} onChange={setCity} />
            </Card>

            {/* Basic Features */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-smooth">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Property Features</h2>
              <PropertyFeatures
                area={area}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                onAreaChange={setArea}
                onBedroomsChange={setBedrooms}
                onBathroomsChange={setBathrooms}
              />
            </Card>

            {/* Advanced Features */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-smooth">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Advanced Features
              </h2>
              <AdvancedFeatures
                locationRating={locationRating}
                schoolProximity={schoolProximity}
                marketProximity={marketProximity}
                amenities={amenities}
                onLocationRatingChange={setLocationRating}
                onSchoolProximityChange={setSchoolProximity}
                onMarketProximityChange={setMarketProximity}
                onAmenityChange={handleAmenityChange}
              />
            </Card>

            {/* Predict Button */}
            <div className="flex gap-3">
              <Button
                onClick={handlePrediction}
                disabled={isCalculating || !city}
                className="flex-1 h-14 text-lg font-semibold bg-gradient-accent hover:opacity-90 transition-smooth shadow-md"
              >
                <Calculator className="w-5 h-5 mr-2" />
                {isCalculating ? "Calculating..." : "Predict Price"}
              </Button>
              <Button
                onClick={handleSaveProperty}
                disabled={!predictedPrice}
                variant="outline"
                className="h-14 px-6"
              >
                <Save className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PredictionResult price={predictedPrice} isCalculating={isCalculating} />
            </div>
          </div>
        </div>

        {/* Property Comparison Section */}
        {savedProperties.length > 0 && (
          <div className="mt-8">
            <PropertyComparison 
              properties={savedProperties} 
              onRemove={handleRemoveProperty}
            />
          </div>
        )}

        {/* Price History Chart */}
        <div className="mt-8">
          <PriceHistoryChart selectedCity={city || undefined} />
        </div>

        {/* Property Wishlist */}
        <div className="mt-8">
          <PropertyWishlist 
            currentProperty={predictedPrice !== null ? {
              city,
              area,
              bedrooms,
              bathrooms,
              locationRating,
              price: predictedPrice,
              amenities,
            } : undefined}
          />
        </div>

        {/* Similar Properties Section */}
        {predictedPrice !== null && (
          <div className="mt-8">
            <SimilarProperties 
              targetPrice={predictedPrice} 
              currentCity={city}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
