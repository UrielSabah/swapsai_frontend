
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Building2,
  ArrowLeft,
  Users,
  DollarSign,
  CalendarRange,
  CheckCircle,
  Mail,
  AlertCircle,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Results() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const searchRef = urlParams.get("search_ref");

  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [schedulingVisit, setSchedulingVisit] = useState(false);
  const [error, setError] = useState("");
  const [apiData, setApiData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadResults();
  }, [retryCount]);

  const loadResults = async () => {
    setLoading(true);
    setError("");
    
    try {
      const storedSearchData = sessionStorage.getItem('office_search_' + searchRef);
      const storedUserData = sessionStorage.getItem('office_user_' + searchRef);
      
      if (!storedSearchData || !storedUserData) {
        throw new Error("Search information not found. Please start a new search.");
      }
      
      const parsedSearchData = JSON.parse(storedSearchData);
      const parsedUserData = JSON.parse(storedUserData);
      
      setSearchData(parsedSearchData);
      setUserData(parsedUserData);

      try {
        console.log("Fetching API data...");
        
        const response = await fetch("https://swapsai-agent.onrender.com/mockup", {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const apiResponse = await response.json();
        console.log("API response received:", apiResponse);
        
        if (!apiResponse || !apiResponse.results || !Array.isArray(apiResponse.results)) {
          throw new Error("Invalid API response format");
        }
        
        setApiData(apiResponse);
        setResults(apiResponse.results);
        
        if (apiResponse.results.length === 0) {
          setError("No matching office spaces found. Please try different search criteria.");
          setTimeout(() => {
            navigate(createPageUrl("Search"));
          }, 3000);
        }
      } catch (apiError) {
        console.error("API fetch failed:", apiError);
        setError("Failed to retrieve office listings. Redirecting to search page...");
        
        setTimeout(() => {
          navigate(createPageUrl("Search"));
        }, 3000);
      }
    } catch (error) {
      console.error("Error loading results:", error);
      setError(error.message || "Failed to load office results. Redirecting to search page...");
      
      setTimeout(() => {
        navigate(createPageUrl("Search"));
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const scheduleVisit = async () => {
    setSchedulingVisit(true);
    try {
//       await SendEmail({
//         to: userData.contact_email,
//         subject: `Office Visit Scheduled - ${selectedOffice.name}`,
//         body: `Dear ${userData.company_name},
//
// Thank you for your interest in ${selectedOffice.name}. We've received your visit request and our team will contact you shortly to confirm the viewing details.
//
// Office Details:
// - Location: ${selectedOffice.location}
// - Size: ${selectedOffice.size_sqm} sqm
// - Price: $${selectedOffice.price_per_month}/month
// - Capacity: ${selectedOffice.employees_capacity} employees
//
// The office includes these amenities:
// ${selectedOffice.amenities ? selectedOffice.amenities.map(a => `- ${a}`).join('\n') : 'Information not available'}
//
// Best regards,
// Office Finder Team`
//       });

      setShowVisitDialog(false);
      setSelectedOffice(null);
    } catch (error) {
      console.error("Error scheduling visit:", error);
      setError("Failed to schedule visit. Please try again later.");
    }
    setSchedulingVisit(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-bounce" />
          <h2 className="text-2xl font-semibold mb-4">Finding Office Spaces...</h2>
          <p className="text-gray-600 mb-4">Searching for available offices in {searchData?.location || "your area"}</p>
          <Progress value={60} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <Alert variant="destructive" className="mb-6 max-w-xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p className="text-gray-600 mb-4">Redirecting to search page...</p>
          <Button 
            onClick={() => navigate(createPageUrl("Search"))}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Search Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Search"))}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            New Search
          </Button>
          <h1 className="text-2xl font-bold">
            Found {results.length} Office Spaces
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-medium mb-2">No Office Spaces Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any offices matching your criteria. Please try a different search.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl("Search"))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              New Search
            </Button>
          </div>
        )}

        {results.length > 0 && (
          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {results.map((office, index) => (
                  <motion.div
                    key={office.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-lg h-full ${
                        selectedOffice?.id === office.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedOffice(office)}
                    >
                      <div
                        className="h-48 bg-cover bg-center rounded-t-lg"
                        style={{
                          backgroundImage: `url(${office.image_url})`
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentNode.style.backgroundImage = 
                            "url('https://images.unsplash.com/photo-1497366216548-37526070297c')";
                        }}
                      />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{office.name}</CardTitle>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {Math.round(office.match_probability)}% Match
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {office.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-4 h-4" />
                            {office.size_sqm} sqm
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            ${office.price_per_month}/mo
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {office.employees_capacity} employees
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <CalendarRange className="w-4 h-4" />
                            {office.lease_type}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {selectedOffice && (
                <motion.div 
                  className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl z-50 overflow-auto"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                >
                  <div className="relative p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full"
                      onClick={() => setSelectedOffice(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </Button>
                    
                    <div
                      className="h-64 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${selectedOffice.image_url})`
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.backgroundImage = 
                          "url('https://images.unsplash.com/photo-1497366216548-37526070297c')";
                      }}
                    />

                    <div className="p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedOffice.name}</h2>
                        <p className="flex items-center gap-1 text-gray-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          {selectedOffice.location}
                        </p>
                        <Badge
                          className="mt-2 bg-blue-500 text-white"
                        >
                          {Math.round(selectedOffice.match_probability)}% Match
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <p className="text-xs text-blue-600 uppercase font-semibold">Size</p>
                          <p className="font-medium text-xl">{selectedOffice.size_sqm} m²</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <p className="text-xs text-blue-600 uppercase font-semibold">Price</p>
                          <p className="font-medium text-xl">${selectedOffice.price_per_month}</p>
                          <p className="text-xs text-gray-500">per month</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <p className="text-xs text-blue-600 uppercase font-semibold">Type</p>
                          <p className="font-medium">{selectedOffice.lease_type}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <p className="text-xs text-blue-600 uppercase font-semibold">Capacity</p>
                          <p className="font-medium">{selectedOffice.employees_capacity} employees</p>
                        </div>
                      </div>

                      {selectedOffice.amenities && selectedOffice.amenities.length > 0 && (
                        <div className="border-t pt-6">
                          <h3 className="font-semibold mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            Amenities
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedOffice.amenities.map((amenity, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-white border-green-200 text-green-800"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4">Why this is a good match</h3>
                        <p className="text-gray-600 mb-4">
                          This office meets {Math.round(selectedOffice.match_probability)}% of your requirements and is ideal for your business needs.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Located in your preferred area of {selectedOffice.location}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Provides {selectedOffice.size_sqm}m² of space, sufficient for your needs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Offers {selectedOffice.lease_type} lease terms as requested</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-6 border-t">
                        <h3 className="font-semibold mb-4">Interested in this office?</h3>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                          onClick={() => setShowVisitDialog(true)}
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Schedule a Visit
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Office Visit</DialogTitle>
            <DialogDescription>
              We'll send you an email with details to arrange your visit to {selectedOffice?.name}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffice && (
            <div className="p-4 bg-gray-50 rounded-md my-2 flex items-center gap-3">
              <div
                className="w-16 h-16 bg-cover bg-center rounded-md flex-shrink-0"
                style={{
                  backgroundImage: `url(${selectedOffice.image_url})`
                }}
              ></div>
              <div>
                <h4 className="font-medium">{selectedOffice.name}</h4>
                <p className="text-sm text-gray-600">{selectedOffice.location}</p>
                <p className="text-xs text-gray-500">${selectedOffice.price_per_month}/month • {selectedOffice.size_sqm}m²</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-medium">Your Contact Details</h4>
            <div className="text-sm">
              <p><span className="text-gray-500">Company:</span> {userData?.company_name}</p>
              <p><span className="text-gray-500">Email:</span> {userData?.contact_email}</p>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowVisitDialog(false)}
              disabled={schedulingVisit}
            >
              Cancel
            </Button>
            <Button
              onClick={scheduleVisit}
              disabled={schedulingVisit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {schedulingVisit ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Confirm Visit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
