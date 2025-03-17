import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Building2, Calendar as CalendarIcon, Check, Loader2, Sliders } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";

const AMENITIES = [
  { value: "parking", label: "Parking" },
  { value: "conference_rooms", label: "Conference Rooms" },
  { value: "high_speed_internet", label: "High-Speed Internet" },
  { value: "kitchen", label: "Kitchen" },
  { value: "security", label: "24/7 Security" },
  { value: "reception", label: "Reception" },
  { value: "cleaning_service", label: "Cleaning Service" },
  { value: "bike_storage", label: "Bike Storage" },
  { value: "shower_facilities", label: "Shower Facilities" },
  { value: "gym", label: "Gym" },
];

export default function Search() {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultCount, setResultCount] = useState(8);

  const [formData, setFormData] = useState({
    location: "",
    office_size: "",
    desk_count: "",
    budget_min: "",
    budget_max: "",
    lease_type: "flexible",
    employee_count: "",
    move_in_date: "",
    additional_requirements: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const searchData = {
      ...formData,
      amenities: selectedAmenities,
      result_count: resultCount,
      timestamp: new Date().toISOString()
    };

    try {
      // Generate a unique search reference for this session
      const searchRef = Date.now().toString(36) + Math.random().toString(36).substring(2);
      
      // Store search parameters in session storage
      sessionStorage.setItem('office_search_' + searchRef, JSON.stringify(searchData));
      
      // Navigate directly to terms page
      navigate(createPageUrl("Terms") + "?search_ref=" + searchRef);
    } catch (error) {
      console.error("Error:", error);
      setError("There was a problem processing your search. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Find Your Perfect Office Space
          </motion.h1>
          <p className="text-gray-600">
            Tell us your requirements and we'll find the best matches for your startup
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader>
              <CardTitle>Office Requirements</CardTitle>
              <CardDescription>
                Fill in your office space requirements below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Downtown San Francisco"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="office_size">Office Size (sqm)</Label>
                    <Input
                      id="office_size"
                      type="number"
                      placeholder="e.g., 200"
                      value={formData.office_size}
                      onChange={(e) =>
                        handleInputChange("office_size", parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desk_count">Number of Desks</Label>
                    <Input
                      id="desk_count"
                      type="number"
                      placeholder="e.g., 20"
                      value={formData.desk_count}
                      onChange={(e) =>
                        handleInputChange("desk_count", parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee_count">Number of Employees</Label>
                    <Input
                      id="employee_count"
                      type="number"
                      placeholder="e.g., 15"
                      value={formData.employee_count}
                      onChange={(e) =>
                        handleInputChange("employee_count", parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Budget Range (per month)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={formData.budget_min}
                        onChange={(e) =>
                          handleInputChange("budget_min", parseInt(e.target.value))
                        }
                        required
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={formData.budget_max}
                        onChange={(e) =>
                          handleInputChange("budget_max", parseInt(e.target.value))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Lease Type</Label>
                    <Select
                      value={formData.lease_type}
                      onValueChange={(value) => handleInputChange("lease_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lease type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short_term">Short Term</SelectItem>
                        <SelectItem value="long_term">Long Term</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Move-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.move_in_date ? (
                            format(new Date(formData.move_in_date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.move_in_date ? new Date(formData.move_in_date) : undefined}
                          onSelect={(date) =>
                            handleInputChange("move_in_date", date?.toISOString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map((amenity) => (
                      <Badge
                        key={amenity.value}
                        variant={
                          selectedAmenities.includes(amenity.value)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleAmenity(amenity.value)}
                      >
                        {selectedAmenities.includes(amenity.value) && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {amenity.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Requirements</Label>
                  <textarea
                    id="additional"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Any specific requirements or preferences..."
                    value={formData.additional_requirements}
                    onChange={(e) =>
                      handleInputChange("additional_requirements", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Sliders className="w-4 h-4" />
                      Number of Recommendations: <span className="font-bold">{resultCount}</span>
                    </Label>
                    <span className="text-sm text-gray-500">({resultCount} offices)</span>
                  </div>
                  <Slider
                    value={[resultCount]}
                    min={3}
                    max={15}
                    step={1}
                    onValueChange={(values) => setResultCount(values[0])}
                    className="py-4"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 mr-2" />
                      Swap-It
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}