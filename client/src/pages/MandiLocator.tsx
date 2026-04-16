import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Phone, Clock, TrendingUp, Search, Loader2, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

declare global {
  interface Window { L: any; }
}

const ALL_MANDIS = [
  // Andhra Pradesh
  { id: 1, state: "Andhra Pradesh", name: "APMC Guntur", lat: 16.3067, lng: 80.4365, phone: "0863-2233456", timing: "5 AM - 2 PM", crops: ["Dry Chilli", "Cotton", "Tobacco"], type: "Grade A", rating: 4.7 },
  { id: 2, state: "Andhra Pradesh", name: "APMC Kurnool", lat: 15.8281, lng: 78.0373, phone: "08518-228901", timing: "6 AM - 2 PM", crops: ["Sunflower", "Groundnut", "Cotton"], type: "Grade A", rating: 4.5 },
  { id: 3, state: "Andhra Pradesh", name: "APMC Madanapalle", lat: 13.5503, lng: 78.5023, phone: "08571-222456", timing: "5 AM - 1 PM", crops: ["Tomato", "Chilli", "Groundnut"], type: "Grade B", rating: 4.3 },
  { id: 4, state: "Andhra Pradesh", name: "APMC Nellore", lat: 14.4426, lng: 79.9865, phone: "0861-2323456", timing: "6 AM - 2 PM", crops: ["Paddy", "Prawn", "Chilli"], type: "Grade A", rating: 4.4 },
  { id: 5, state: "Andhra Pradesh", name: "APMC Vijayawada", lat: 16.5062, lng: 80.6480, phone: "0866-2571234", timing: "5 AM - 1 PM", crops: ["Paddy", "Vegetables", "Fruits"], type: "Grade A", rating: 4.6 },
  // Assam
  { id: 6, state: "Assam", name: "Fancy Bazar Market, Guwahati", lat: 26.1845, lng: 91.7362, phone: "0361-2731234", timing: "6 AM - 2 PM", crops: ["Tea", "Ginger", "Vegetables"], type: "Grade A", rating: 4.3 },
  { id: 7, state: "Assam", name: "Jorhat APMC", lat: 26.7509, lng: 94.2037, phone: "0376-2321234", timing: "7 AM - 1 PM", crops: ["Tea", "Mustard", "Paddy"], type: "Grade B", rating: 4.1 },
  { id: 8, state: "Assam", name: "Silchar Market", lat: 24.8333, lng: 92.7789, phone: "03842-231234", timing: "6 AM - 2 PM", crops: ["Vegetables", "Fish", "Rice"], type: "Grade B", rating: 4.0 },
  // Bihar
  { id: 9, state: "Bihar", name: "Patna APMC", lat: 25.5941, lng: 85.1376, phone: "0612-2221234", timing: "5 AM - 2 PM", crops: ["Wheat", "Maize", "Vegetables"], type: "Grade A", rating: 4.4 },
  { id: 10, state: "Bihar", name: "Muzaffarpur Mandi", lat: 26.1209, lng: 85.3647, phone: "0621-2221234", timing: "5 AM - 1 PM", crops: ["Lychee", "Vegetables", "Wheat"], type: "Grade A", rating: 4.6 },
  { id: 11, state: "Bihar", name: "Darbhanga Mandi", lat: 26.1542, lng: 85.8918, phone: "06272-224567", timing: "6 AM - 2 PM", crops: ["Makhana", "Jute", "Paddy"], type: "Grade B", rating: 4.2 },
  { id: 12, state: "Bihar", name: "Gaya APMC", lat: 24.7914, lng: 84.9994, phone: "0631-2220123", timing: "6 AM - 1 PM", crops: ["Wheat", "Vegetables", "Maize"], type: "Grade B", rating: 4.1 },
  // Chhattisgarh
  { id: 13, state: "Chhattisgarh", name: "Raipur APMC", lat: 21.2514, lng: 81.6296, phone: "0771-2221234", timing: "6 AM - 2 PM", crops: ["Paddy", "Wheat", "Soyabean"], type: "Grade A", rating: 4.3 },
  { id: 14, state: "Chhattisgarh", name: "Bilaspur Mandi", lat: 22.0797, lng: 82.1409, phone: "07752-221234", timing: "6 AM - 1 PM", crops: ["Paddy", "Vegetables", "Wheat"], type: "Grade B", rating: 4.1 },
  // Delhi/NCR
  { id: 15, state: "Delhi", name: "Azadpur APMC (Largest in Asia)", lat: 28.7244, lng: 77.1804, phone: "011-27681234", timing: "3 AM - 12 PM", crops: ["All Fruits", "All Vegetables", "Flowers"], type: "Grade A", rating: 4.8 },
  { id: 16, state: "Delhi", name: "Narela APMC", lat: 28.8585, lng: 77.0874, phone: "011-27841234", timing: "4 AM - 12 PM", crops: ["Grains", "Oilseeds", "Pulses"], type: "Grade A", rating: 4.5 },
  // Goa
  { id: 17, state: "Goa", name: "Mapusa Market", lat: 15.5920, lng: 73.8100, phone: "0832-2261234", timing: "7 AM - 1 PM", crops: ["Cashew", "Coconut", "Vegetables"], type: "Grade B", rating: 4.4 },
  { id: 18, state: "Goa", name: "Panjim Municipal Market", lat: 15.4909, lng: 73.8278, phone: "0832-2223456", timing: "7 AM - 2 PM", crops: ["Fish", "Vegetables", "Fruits"], type: "Grade B", rating: 4.2 },
  // Gujarat
  { id: 19, state: "Gujarat", name: "Ahmedabad APMC (Dudheswar)", lat: 23.0225, lng: 72.5714, phone: "079-22851234", timing: "5 AM - 2 PM", crops: ["All Vegetables", "Fruits", "Spices"], type: "Grade A", rating: 4.7 },
  { id: 20, state: "Gujarat", name: "Rajkot APMC", lat: 22.3039, lng: 70.8022, phone: "0281-2471234", timing: "6 AM - 2 PM", crops: ["Groundnut", "Cotton", "Cumin"], type: "Grade A", rating: 4.6 },
  { id: 21, state: "Gujarat", name: "Surat APMC", lat: 21.1702, lng: 72.8311, phone: "0261-2471234", timing: "5 AM - 1 PM", crops: ["Cotton", "Vegetables", "Sugarcane"], type: "Grade A", rating: 4.5 },
  { id: 22, state: "Gujarat", name: "Unjha APMC (Spice Hub)", lat: 23.8108, lng: 72.3962, phone: "02767-252234", timing: "6 AM - 2 PM", crops: ["Cumin", "Fennel", "Ajwain"], type: "Specialised", rating: 4.9 },
  { id: 23, state: "Gujarat", name: "Gondal APMC", lat: 21.9609, lng: 70.7985, phone: "02825-220456", timing: "6 AM - 1 PM", crops: ["Groundnut", "Cotton", "Castor"], type: "Grade A", rating: 4.5 },
  // Haryana
  { id: 24, state: "Haryana", name: "Karnal Grain Market", lat: 29.6857, lng: 76.9905, phone: "0184-2221234", timing: "6 AM - 2 PM", crops: ["Basmati Rice", "Wheat", "Paddy"], type: "Grade A", rating: 4.8 },
  { id: 25, state: "Haryana", name: "Sonipat APMC", lat: 28.9931, lng: 77.0151, phone: "0130-2221234", timing: "5 AM - 1 PM", crops: ["Wheat", "Vegetables", "Paddy"], type: "Grade A", rating: 4.4 },
  { id: 26, state: "Haryana", name: "Kurukshetra APMC", lat: 29.9695, lng: 76.8783, phone: "01744-232456", timing: "6 AM - 2 PM", crops: ["Wheat", "Paddy", "Mustard"], type: "Grade B", rating: 4.3 },
  // Himachal Pradesh
  { id: 27, state: "Himachal Pradesh", name: "Shimla APMC", lat: 31.1048, lng: 77.1734, phone: "0177-2621234", timing: "7 AM - 2 PM", crops: ["Apple", "Pear", "Plum"], type: "Grade A", rating: 4.7 },
  { id: 28, state: "Himachal Pradesh", name: "Palampur Market", lat: 32.1100, lng: 76.5384, phone: "01894-230456", timing: "7 AM - 1 PM", crops: ["Tea", "Ginger", "Vegetables"], type: "Grade B", rating: 4.3 },
  // Jammu & Kashmir
  { id: 29, state: "Jammu & Kashmir", name: "Sopore Fruit Mandi", lat: 34.2993, lng: 74.4735, phone: "01954-223456", timing: "7 AM - 2 PM", crops: ["Apple", "Walnut", "Pear"], type: "Specialised", rating: 4.8 },
  { id: 30, state: "Jammu & Kashmir", name: "Jammu Narwal Mandi", lat: 32.7186, lng: 74.8571, phone: "0191-2471234", timing: "6 AM - 2 PM", crops: ["Vegetables", "Fruits", "Grains"], type: "Grade A", rating: 4.4 },
  // Jharkhand
  { id: 31, state: "Jharkhand", name: "Ranchi APMC", lat: 23.3441, lng: 85.3096, phone: "0651-2221234", timing: "6 AM - 2 PM", crops: ["Vegetables", "Paddy", "Maize"], type: "Grade A", rating: 4.2 },
  { id: 32, state: "Jharkhand", name: "Jamshedpur Market", lat: 22.8046, lng: 86.2029, phone: "0657-2221234", timing: "6 AM - 1 PM", crops: ["Vegetables", "Fruits", "Grains"], type: "Grade B", rating: 4.1 },
  // Karnataka
  { id: 33, state: "Karnataka", name: "APMC Bangalore (Yeshwanthpur)", lat: 13.0259, lng: 77.5448, phone: "080-23371234", timing: "5 AM - 1 PM", crops: ["Flowers", "Vegetables", "Fruits"], type: "Grade A", rating: 4.7 },
  { id: 34, state: "Karnataka", name: "Kolar APMC", lat: 13.1363, lng: 78.1294, phone: "08152-221234", timing: "5 AM - 12 PM", crops: ["Grapes", "Tomato", "Potato"], type: "Grade A", rating: 4.6 },
  { id: 35, state: "Karnataka", name: "Bellary APMC", lat: 15.1394, lng: 76.9214, phone: "08392-231234", timing: "6 AM - 2 PM", crops: ["Cotton", "Ragi", "Groundnut"], type: "Grade B", rating: 4.3 },
  { id: 36, state: "Karnataka", name: "Tumkur APMC", lat: 13.3379, lng: 77.1014, phone: "0816-2271234", timing: "6 AM - 1 PM", crops: ["Coconut", "Groundnut", "Ragi"], type: "Grade B", rating: 4.2 },
  { id: 37, state: "Karnataka", name: "Dharwad APMC", lat: 15.4589, lng: 75.0078, phone: "0836-2441234", timing: "6 AM - 2 PM", crops: ["Cotton", "Groundnut", "Sunflower"], type: "Grade B", rating: 4.3 },
  // Kerala
  { id: 38, state: "Kerala", name: "Chalai Market, Thiruvananthapuram", lat: 8.5241, lng: 76.9366, phone: "0471-2471234", timing: "6 AM - 8 PM", crops: ["Vegetables", "Fish", "Spices"], type: "Grade A", rating: 4.4 },
  { id: 39, state: "Kerala", name: "Ernakulam Wholesale Market", lat: 9.9312, lng: 76.2673, phone: "0484-2361234", timing: "5 AM - 2 PM", crops: ["Coconut", "Rubber", "Vegetables"], type: "Grade A", rating: 4.5 },
  { id: 40, state: "Kerala", name: "Kozhikode Market", lat: 11.2588, lng: 75.7804, phone: "0495-2721234", timing: "6 AM - 2 PM", crops: ["Spices", "Coconut", "Fruits"], type: "Grade B", rating: 4.3 },
  // Madhya Pradesh
  { id: 41, state: "Madhya Pradesh", name: "Indore APMC (Choithram)", lat: 22.7196, lng: 75.8577, phone: "0731-2471234", timing: "4 AM - 1 PM", crops: ["Soyabean", "Garlic", "Onion"], type: "Grade A", rating: 4.7 },
  { id: 42, state: "Madhya Pradesh", name: "Bhopal APMC", lat: 23.2599, lng: 77.4126, phone: "0755-2551234", timing: "5 AM - 1 PM", crops: ["Wheat", "Soyabean", "Vegetables"], type: "Grade A", rating: 4.5 },
  { id: 43, state: "Madhya Pradesh", name: "Jabalpur APMC", lat: 23.1815, lng: 79.9864, phone: "0761-2621234", timing: "6 AM - 2 PM", crops: ["Wheat", "Arhar Dal", "Vegetables"], type: "Grade B", rating: 4.3 },
  { id: 44, state: "Madhya Pradesh", name: "Neemuch APMC (Opium Hub)", lat: 24.4696, lng: 74.8697, phone: "07423-222456", timing: "6 AM - 2 PM", crops: ["Coriander", "Soyabean", "Garlic"], type: "Specialised", rating: 4.6 },
  // Maharashtra
  { id: 45, state: "Maharashtra", name: "APMC Pune", lat: 18.5204, lng: 73.8567, phone: "020-24456789", timing: "5 AM - 2 PM", crops: ["Onion", "Tomato", "Potato"], type: "Grade A", rating: 4.6 },
  { id: 46, state: "Maharashtra", name: "Nashik APMC", lat: 20.0059, lng: 73.7897, phone: "0253-2350671", timing: "5 AM - 1 PM", crops: ["Grapes", "Onion", "Wheat"], type: "Grade A", rating: 4.4 },
  { id: 47, state: "Maharashtra", name: "Lasalgaon Onion Mandi", lat: 20.1200, lng: 74.0800, phone: "02550-283456", timing: "6 AM - 12 PM", crops: ["Onion (Largest in Asia)"], type: "Specialised", rating: 4.9 },
  { id: 48, state: "Maharashtra", name: "Navi Mumbai APMC (Vashi)", lat: 19.0330, lng: 73.0297, phone: "022-27572012", timing: "4 AM - 11 AM", crops: ["All Vegetables", "Fruits", "Grains"], type: "Grade A", rating: 4.5 },
  { id: 49, state: "Maharashtra", name: "Nagpur APMC", lat: 21.1458, lng: 79.0882, phone: "0712-2721234", timing: "5 AM - 2 PM", crops: ["Orange", "Soyabean", "Cotton"], type: "Grade A", rating: 4.5 },
  { id: 50, state: "Maharashtra", name: "Solapur APMC", lat: 17.6868, lng: 75.9054, phone: "0217-2620890", timing: "6 AM - 3 PM", crops: ["Jowar", "Groundnut", "Pomegranate"], type: "Grade B", rating: 4.2 },
  { id: 51, state: "Maharashtra", name: "Kolhapur APMC", lat: 16.7050, lng: 74.2433, phone: "0231-2654321", timing: "6 AM - 2 PM", crops: ["Sugarcane", "Vegetables", "Jaggery"], type: "Grade B", rating: 4.1 },
  { id: 52, state: "Maharashtra", name: "Sangli APMC (Turmeric Hub)", lat: 16.8543, lng: 74.5651, phone: "0233-2621234", timing: "6 AM - 1 PM", crops: ["Turmeric", "Grapes", "Sugarcane"], type: "Specialised", rating: 4.7 },
  // Manipur
  { id: 53, state: "Manipur", name: "Ima Keithel Market, Imphal", lat: 24.8170, lng: 93.9368, phone: "0385-2221234", timing: "7 AM - 2 PM", crops: ["Vegetables", "Fruits", "Local Products"], type: "Grade B", rating: 4.5 },
  // Meghalaya
  { id: 54, state: "Meghalaya", name: "Iewduh Market, Shillong", lat: 25.5788, lng: 91.8933, phone: "0364-2221234", timing: "7 AM - 4 PM", crops: ["Ginger", "Turmeric", "Fruits"], type: "Grade B", rating: 4.3 },
  // Odisha
  { id: 55, state: "Odisha", name: "Bhubaneswar APMC", lat: 20.2961, lng: 85.8245, phone: "0674-2395234", timing: "5 AM - 2 PM", crops: ["Paddy", "Vegetables", "Pulses"], type: "Grade A", rating: 4.3 },
  { id: 56, state: "Odisha", name: "Cuttack Market", lat: 20.4625, lng: 85.8830, phone: "0671-2621234", timing: "5 AM - 1 PM", crops: ["Paddy", "Jute", "Vegetables"], type: "Grade B", rating: 4.1 },
  // Punjab
  { id: 57, state: "Punjab", name: "Amritsar Grain Market", lat: 31.6340, lng: 74.8723, phone: "0183-2221234", timing: "6 AM - 2 PM", crops: ["Wheat", "Paddy", "Maize"], type: "Grade A", rating: 4.7 },
  { id: 58, state: "Punjab", name: "Ludhiana Mandi", lat: 30.9010, lng: 75.8573, phone: "0161-2771234", timing: "5 AM - 1 PM", crops: ["Wheat", "Paddy", "Vegetables"], type: "Grade A", rating: 4.6 },
  { id: 59, state: "Punjab", name: "Khanna Grain Market", lat: 30.7046, lng: 76.2195, phone: "01628-221234", timing: "6 AM - 2 PM", crops: ["Wheat (Largest in Asia)", "Paddy"], type: "Specialised", rating: 4.9 },
  { id: 60, state: "Punjab", name: "Jalandhar APMC", lat: 31.3260, lng: 75.5762, phone: "0181-2221234", timing: "6 AM - 2 PM", crops: ["Wheat", "Paddy", "Sugarcane"], type: "Grade A", rating: 4.5 },
  // Rajasthan
  { id: 61, state: "Rajasthan", name: "Jaipur APMC (Muhana)", lat: 26.7606, lng: 75.7869, phone: "0141-2771234", timing: "5 AM - 2 PM", crops: ["Vegetables", "Fruits", "Spices"], type: "Grade A", rating: 4.6 },
  { id: 62, state: "Rajasthan", name: "Jodhpur APMC", lat: 26.2389, lng: 73.0243, phone: "0291-2771234", timing: "6 AM - 2 PM", crops: ["Bajra", "Cumin", "Groundnut"], type: "Grade A", rating: 4.4 },
  { id: 63, state: "Rajasthan", name: "Bikaner Mandi", lat: 28.0229, lng: 73.3119, phone: "0151-2521234", timing: "6 AM - 2 PM", crops: ["Moong Dal", "Guar", "Moth"], type: "Grade B", rating: 4.3 },
  { id: 64, state: "Rajasthan", name: "Kota APMC", lat: 25.2138, lng: 75.8648, phone: "0744-2451234", timing: "6 AM - 2 PM", crops: ["Coriander", "Soyabean", "Wheat"], type: "Grade B", rating: 4.4 },
  { id: 65, state: "Rajasthan", name: "Alwar APMC", lat: 27.5530, lng: 76.6347, phone: "0144-2321234", timing: "6 AM - 1 PM", crops: ["Mustard", "Wheat", "Vegetables"], type: "Grade B", rating: 4.2 },
  // Tamil Nadu
  { id: 66, state: "Tamil Nadu", name: "Chennai Koyambedu APMC", lat: 13.0673, lng: 80.1944, phone: "044-24798234", timing: "4 AM - 12 PM", crops: ["Vegetables", "Fruits", "Flowers"], type: "Grade A", rating: 4.7 },
  { id: 67, state: "Tamil Nadu", name: "Coimbatore APMC", lat: 11.0168, lng: 76.9558, phone: "0422-2571234", timing: "5 AM - 1 PM", crops: ["Maize", "Coconut", "Vegetables"], type: "Grade A", rating: 4.5 },
  { id: 68, state: "Tamil Nadu", name: "Dindigul APMC", lat: 10.3673, lng: 77.9803, phone: "0451-2421234", timing: "6 AM - 1 PM", crops: ["Cardamom", "Banana", "Vegetables"], type: "Specialised", rating: 4.7 },
  { id: 69, state: "Tamil Nadu", name: "Erode APMC (Turmeric)", lat: 11.3410, lng: 77.7172, phone: "0424-2221234", timing: "6 AM - 2 PM", crops: ["Turmeric", "Banana", "Coconut"], type: "Specialised", rating: 4.8 },
  // Telangana
  { id: 70, state: "Telangana", name: "Bowenpally APMC, Hyderabad", lat: 17.4760, lng: 78.4980, phone: "040-27631234", timing: "4 AM - 12 PM", crops: ["Vegetables", "Fruits", "Flowers"], type: "Grade A", rating: 4.6 },
  { id: 71, state: "Telangana", name: "Nizamabad Turmeric Mandi", lat: 18.6726, lng: 78.0942, phone: "08462-231234", timing: "6 AM - 2 PM", crops: ["Turmeric", "Maize", "Paddy"], type: "Specialised", rating: 4.8 },
  { id: 72, state: "Telangana", name: "Warangal APMC", lat: 17.9689, lng: 79.5941, phone: "0870-2571234", timing: "6 AM - 2 PM", crops: ["Paddy", "Cotton", "Vegetables"], type: "Grade A", rating: 4.4 },
  // Uttar Pradesh
  { id: 73, state: "Uttar Pradesh", name: "Azadpur-linked APMC Agra", lat: 27.1767, lng: 78.0081, phone: "0562-2531234", timing: "5 AM - 2 PM", crops: ["Potato", "Vegetables", "Wheat"], type: "Grade A", rating: 4.5 },
  { id: 74, state: "Uttar Pradesh", name: "Lucknow APMC", lat: 26.8467, lng: 80.9462, phone: "0522-2671234", timing: "5 AM - 2 PM", crops: ["Vegetables", "Fruits", "Sugarcane"], type: "Grade A", rating: 4.5 },
  { id: 75, state: "Uttar Pradesh", name: "Kanpur APMC", lat: 26.4499, lng: 80.3319, phone: "0512-2291234", timing: "5 AM - 1 PM", crops: ["Wheat", "Urad Dal", "Vegetables"], type: "Grade A", rating: 4.4 },
  { id: 76, state: "Uttar Pradesh", name: "Varanasi APMC", lat: 25.3176, lng: 82.9739, phone: "0542-2221234", timing: "6 AM - 2 PM", crops: ["Vegetables", "Spices", "Grains"], type: "Grade B", rating: 4.3 },
  { id: 77, state: "Uttar Pradesh", name: "Mathura APMC", lat: 27.4924, lng: 77.6737, phone: "0565-2421234", timing: "6 AM - 1 PM", crops: ["Potato", "Mustard", "Wheat"], type: "Grade B", rating: 4.3 },
  // Uttarakhand
  { id: 78, state: "Uttarakhand", name: "Haridwar Mandi", lat: 29.9457, lng: 78.1642, phone: "01334-220456", timing: "6 AM - 2 PM", crops: ["Vegetables", "Wheat", "Rice"], type: "Grade B", rating: 4.2 },
  { id: 79, state: "Uttarakhand", name: "Dehradun Mandi", lat: 30.3165, lng: 78.0322, phone: "0135-2621234", timing: "6 AM - 1 PM", crops: ["Apple", "Wheat", "Vegetables"], type: "Grade A", rating: 4.3 },
  // West Bengal
  { id: 80, state: "West Bengal", name: "Mecheda APMC", lat: 22.3968, lng: 87.7878, phone: "03228-253456", timing: "5 AM - 2 PM", crops: ["Potato", "Vegetables", "Rice"], type: "Grade B", rating: 4.3 },
  { id: 81, state: "West Bengal", name: "Kolkata Koley Market", lat: 22.5726, lng: 88.3639, phone: "033-22641234", timing: "4 AM - 11 AM", crops: ["Vegetables", "Fruits", "Fish"], type: "Grade A", rating: 4.5 },
  { id: 82, state: "West Bengal", name: "Siliguri Mandi", lat: 26.7271, lng: 88.3953, phone: "0353-2521234", timing: "6 AM - 2 PM", crops: ["Tea", "Ginger", "Vegetables"], type: "Grade B", rating: 4.2 },
  // North-East
  { id: 83, state: "Nagaland", name: "Kohima Market", lat: 25.6747, lng: 94.1100, phone: "0370-2221234", timing: "7 AM - 3 PM", crops: ["Vegetables", "Local Produce"], type: "Grade B", rating: 4.0 },
  { id: 84, state: "Tripura", name: "Agartala Market", lat: 23.8315, lng: 91.2868, phone: "0381-2321234", timing: "7 AM - 2 PM", crops: ["Pineapple", "Rubber", "Vegetables"], type: "Grade B", rating: 4.1 },
  { id: 85, state: "Mizoram", name: "Aizawl Market", lat: 23.7271, lng: 92.7176, phone: "0389-2334567", timing: "7 AM - 3 PM", crops: ["Ginger", "Vegetables", "Fruits"], type: "Grade B", rating: 3.9 },
  { id: 86, state: "Arunachal Pradesh", name: "Itanagar Market", lat: 27.0844, lng: 93.6053, phone: "0360-2291234", timing: "7 AM - 2 PM", crops: ["Fruits", "Vegetables", "Ginger"], type: "Grade B", rating: 3.8 },
];

const STATES = ["All States", ...Array.from(new Set(ALL_MANDIS.map(m => m.state))).sort()];
const MANDI_TYPES = ["All Types", "Grade A", "Grade B", "Specialised"];

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (window.L) return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export default function MandiLocator() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedMandi, setSelectedMandi] = useState<typeof ALL_MANDIS[0] | null>(null);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedType, setSelectedType] = useState("All Types");
  const [mapReady, setMapReady] = useState(false);

  const filtered = ALL_MANDIS.filter(m => {
    const matchState = selectedState === "All States" || m.state === selectedState;
    const matchType = selectedType === "All Types" || m.type === selectedType;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.crops.some(c => c.toLowerCase().includes(search.toLowerCase())) || m.state.toLowerCase().includes(search.toLowerCase());
    return matchState && matchType && matchSearch;
  });

  useEffect(() => {
    loadLeaflet().then(() => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const map = window.L.map(mapRef.current, { scrollWheelZoom: true });
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
      map.setView([20.5937, 78.9629], 5);
      mapInstanceRef.current = map;
      setMapReady(true);
    });
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const color = (type: string) => type === "Specialised" ? "#b5451b" : type === "Grade A" ? "#2d6a4f" : "#52796f";
    filtered.forEach(mandi => {
      const icon = window.L.divIcon({
        className: "",
        html: `<div style="background:${color(mandi.type)};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)" title="${mandi.name}">M</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      const marker = window.L.marker([mandi.lat, mandi.lng], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${mandi.name}</b><br><small>${mandi.state}</small><br>${mandi.crops.slice(0, 2).join(", ")}<br><b>${mandi.timing}</b>`);
      markersRef.current.push(marker);
    });
  }, [filtered, mapReady]);

  const locateUser = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        setLocationLoading(false);
        if (mapInstanceRef.current) {
          const icon = window.L.divIcon({ className: "", html: `<div style="background:#e63946;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">Y</div>`, iconSize: [28, 28], iconAnchor: [14, 14] });
          window.L.marker([lat, lng], { icon }).addTo(mapInstanceRef.current).bindPopup("Your Location").openPopup();
          mapInstanceRef.current.setView([lat, lng], 9);
        }
      },
      () => setLocationLoading(false)
    );
  };

  const focusMandi = (mandi: typeof ALL_MANDIS[0]) => {
    setSelectedMandi(mandi);
    if (mapInstanceRef.current) mapInstanceRef.current.setView([mandi.lat, mandi.lng], 12);
  };

  const openRoute = (mandi: typeof ALL_MANDIS[0]) => {
    if (userLocation) {
      window.open(`https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${mandi.lat},${mandi.lng}&engine=osrm_car`, "_blank");
    } else {
      window.open(`https://www.openstreetmap.org/?mlat=${mandi.lat}&mlon=${mandi.lng}#map=14/${mandi.lat}/${mandi.lng}`, "_blank");
    }
  };

  const badgeColor = (type: string) => type === "Specialised" ? "bg-orange-100 text-orange-800" : type === "Grade A" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" /> Mandi Locator — All India
          </h1>
          <p className="text-muted-foreground mt-1">{ALL_MANDIS.length} APMC mandis across all states of India — GPS map via OpenStreetMap</p>
        </div>
        <Button onClick={locateUser} disabled={locationLoading} data-testid="button-locate">
          {locationLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
          {locationLoading ? "Locating..." : "Use My Location"}
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2d6a4f] inline-block"></span> Grade A</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#52796f] inline-block"></span> Grade B</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#b5451b] inline-block"></span> Specialised</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#e63946] inline-block"></span> Your Location</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div ref={mapRef} style={{ height: "500px" }} data-testid="map-container" />
          </Card>
        </div>

        {/* Filters + Mandi List */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search mandi, crop, or state..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" data-testid="input-search" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="text-xs" data-testid="select-state">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="text-xs" data-testid="select-type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {MANDI_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">{filtered.length} mandis found</p>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filtered.map(mandi => (
              <div
                key={mandi.id}
                onClick={() => focusMandi(mandi)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors space-y-2 ${selectedMandi?.id === mandi.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                data-testid={`card-mandi-${mandi.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{mandi.name}</p>
                    <p className="text-xs text-muted-foreground">{mandi.state}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium ${badgeColor(mandi.type)}`}>{mandi.type}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {mandi.crops.slice(0, 2).map(c => <span key={c} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{c}</span>)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mandi.timing}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-yellow-500" /> {mandi.rating}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={e => { e.stopPropagation(); openRoute(mandi); }} data-testid={`button-navigate-${mandi.id}`}>
                    <Navigation className="w-3 h-3 mr-1" /> Navigate
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={e => { e.stopPropagation(); window.open(`tel:${mandi.phone}`); }} data-testid={`button-call-${mandi.id}`}>
                    <Phone className="w-3 h-3 mr-1" /> Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
