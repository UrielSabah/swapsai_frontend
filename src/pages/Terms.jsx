
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, FileText, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Terms() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const searchRef = urlParams.get("search_ref");

  const [formData, setFormData] = useState({
    company_name: "",
    contact_email: "",
    terms_accepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [contract, setContract] = useState("");
  const [error, setError] = useState("");
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('office_search_' + searchRef);
    if (storedData) {
      setSearchData(JSON.parse(storedData));
    } else {
      setError("Search information not found. Please start a new search.");
    }
  }, [searchRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.terms_accepted) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      sessionStorage.setItem('office_user_' + searchRef, JSON.stringify(formData));
      navigate(createPageUrl("Results") + "?search_ref=" + searchRef);
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleDecline = () => {
    sessionStorage.removeItem('office_search_' + searchRef);
    navigate(createPageUrl("Search"));
  };

  const viewContract = async () => {
    setShowContract(true);
    setContract(""); // Reset previous contract
    
    try {
      const response = await fetch("https://swapsai-agent.onrender.com/mockup");
      if (response.ok) {
        const data = await response.json();
        console.log("Contract API response:", data); // Log API response for debugging
        
        if (data) {
          const apiContent = data.message || "";
          const apiImageUrl = data.image_url || "";
          
          setContract(`TERMS AND CONDITIONS

Last Updated: ${new Date().toLocaleDateString()}

${apiContent}

1. ACCEPTANCE OF TERMS

By accessing and using the Office Finder platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, do not use the Service.

2. SERVICE DESCRIPTION

The Service provides office space search and booking functionality. We act as an intermediary between office space providers and potential tenants.

3. USER OBLIGATIONS

Users must:
- Provide accurate and complete information
- Maintain the confidentiality of their account
- Use the service in compliance with applicable laws

4. PRIVACY AND DATA

We collect and process personal data as described in our Privacy Policy. By using the Service, you consent to such processing.

Company: ${formData.company_name || '[Your Company]'}
Email: ${formData.contact_email || '[Your Email]'}
Date: ${new Date().toLocaleDateString()}

${apiImageUrl ? `\n[Contract Image: ${apiImageUrl}]\n` : ''}

[End of Terms]`);
          return;
        }
      }
    } catch (apiError) {
      console.warn("External API contract fetch failed", apiError);
    }
    
    setContract(`TERMS AND CONDITIONS

Last Updated: ${new Date().toLocaleDateString()}

1. ACCEPTANCE OF TERMS

By accessing and using the Office Finder platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, do not use the Service.

2. SERVICE DESCRIPTION

The Service provides office space search and booking functionality. We act as an intermediary between office space providers and potential tenants.

3. USER OBLIGATIONS

Users must:
- Provide accurate and complete information
- Maintain the confidentiality of their account
- Use the service in compliance with applicable laws

4. PRIVACY AND DATA

We collect and process personal data as described in our Privacy Policy. By using the Service, you consent to such processing.

5. LIMITATION OF LIABILITY

The Service is provided "as is" without warranties of any kind, either express or implied.

6. TERMINATION

We reserve the right to terminate or suspend access to our Service immediately, without prior notice.

Company: ${formData.company_name || '[Your Company]'}
Email: ${formData.contact_email || '[Your Email]'}
Date: ${new Date().toLocaleDateString()}

[End of Terms]`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="backdrop-blur-sm bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                Almost There!
              </CardTitle>
              <CardDescription>
                Please provide your company details and accept our terms to view the results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      required
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company_name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      required
                      value={formData.contact_email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact_email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-start space-x-2 pt-4">
                    <Checkbox
                      id="terms"
                      checked={formData.terms_accepted}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          terms_accepted: checked,
                        }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        I agree to receive communications about office spaces and
                        accept the terms of service and privacy policy.
                      </Label>
                      <Button
                        type="button"
                        variant="link"
                        className="text-blue-600 h-auto p-0 text-left font-normal"
                        onClick={viewContract}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Terms and Conditions
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleDecline}
                    disabled={loading}
                  >
                    Decline
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!formData.terms_accepted || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "View Results"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showContract} onOpenChange={setShowContract}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Terms and Conditions
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none mt-4">
            {contract ? (
              <div className="whitespace-pre-wrap font-mono text-sm">
                {contract}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
