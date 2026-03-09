import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const JAYA_RESPONSES: Record<string, string> = {
  weather:
    "Today's weather looks partly cloudy with 28°C temperature and 65% humidity. Good time for outdoor farm work! 🌤️",
  rain: "Rainfall expected this week is around 5mm. Keep your crops well-drained and avoid over-irrigation. 🌧️",
  tractor:
    "You can book a tractor from the Tractors page. Choose a date, pick an available tractor nearby, and confirm your booking. Prices start from ₹800/day.",
  labour:
    "Farm labourers are available for booking within 25 km. Go to the Labour page, pick your date, and book. Rates from ₹400/day per worker.",
  drone:
    "Drones are great for crop spraying and surveying! Book from the Drones page. Available for ₹1500/day.",
  price:
    "Today's top crop prices: Wheat ₹2200/qtl, Rice ₹1900/qtl, Cotton ₹6500/qtl, Sugarcane ₹350/qtl. Check the Crop Prices page for full list.",
  wheat:
    "Wheat is currently priced at ₹2200 per quintal at major mandis. Best time to sell is after Rabi harvest season.",
  rice: "Rice (paddy) price is around ₹1900/quintal today. MSP for common paddy is ₹2183/quintal this year.",
  cotton:
    "Cotton prices are strong at ₹6500/quintal. Ensure proper picking and storage to get best market price.",
  sugarcane:
    "Sugarcane SAP (State Advised Price) is ₹350/quintal. Coordinate with your nearest sugar mill for timely harvest.",
  book: "To book any service: 1) Go to the relevant page (Tractor/Labour/Drone), 2) Select your date, 3) Choose payment method, 4) Confirm booking. Simple!",
  payment:
    "We support online UPI payment (PhonePe, Google Pay) and offline cash payment. Online payments are instant and secure.",
  cancel:
    "You can cancel a booking from 'My Bookings' page. Tap the Cancel button next to your upcoming booking.",
  soil: "For soil health: test your soil every 2 years, maintain pH between 6-7.5, add organic compost, and rotate crops seasonally.",
  fertilizer:
    "For most crops: apply NPK (nitrogen, phosphorus, potassium) as per soil test. Use Urea for nitrogen, DAP for phosphorus, and MOP for potassium.",
  pest: "For pest control: use Integrated Pest Management (IPM). Prefer neem-based organic pesticides first, then chemical pesticides only if needed.",
  irrigation:
    "Drip irrigation saves 40-60% water vs flood irrigation. For wheat use 6 irrigations, rice needs 8-10, cotton needs 4-5 per season.",
  seed: "Always use certified seeds from government agricultural centers or reputed companies. Hybrid seeds give 20-30% higher yield.",
  hello:
    "Hello! I'm Jaya AI, your personal farm assistant. Ask me about weather, crop prices, bookings, farming tips, or anything related to your farm! 🌾",
  hi: "Hi there, farmer! I'm Jaya AI. How can I help you today? You can ask about crop prices, weather, bookings, or farming advice. 🌱",
  help: "I can help you with: 📋 Booking tractors, labour & drones | 🌦️ Weather updates | 💰 Crop prices | 🌱 Farming tips | 💊 Pest & fertilizer advice. Just ask!",
  profit:
    "To maximize farm profit: use quality seeds, timely irrigation, proper fertilization, sell at right market price, and keep farm records regularly.",
  organic:
    "Organic farming: avoid synthetic chemicals, use compost/vermicompost, crop rotation, neem spray for pests, and get organic certification for premium prices.",
  government:
    "Government schemes for farmers: PM Kisan (₹6000/year), Kisan Credit Card, Pradhan Mantri Fasal Bima Yojana (crop insurance), and soil health card scheme.",
  insurance:
    "Pradhan Mantri Fasal Bima Yojana (PMFBY) covers crop losses due to natural calamities. Premium is just 2% for Kharif and 1.5% for Rabi crops.",
};

function getJayaResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(JAYA_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "That's a great question! For detailed guidance, I recommend consulting your local Krishi Vigyan Kendra (KVK) or agricultural officer. I'm here to help with bookings, crop prices, weather, and general farming advice. 🌾";
}

export function JayaAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Namaste! I'm Jaya AI 🌾 Your personal farm assistant. Ask me about crop prices, weather, bookings, or farming tips!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      const reply = getJayaResponse(text);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setTyping(false);
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      {/* Chat window */}
      {open && (
        <div
          className="w-80 rounded-2xl shadow-2xl border border-green-200 bg-white flex flex-col overflow-hidden"
          style={{ maxHeight: "420px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🌾
              </div>
              <div>
                <p className="text-white font-bold text-sm">Jaya AI</p>
                <p className="text-green-100 text-xs">Farm Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-400 text-white text-xs px-2 py-0.5">
                Online
              </Badge>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-2 bg-green-50"
            style={{ maxHeight: "280px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}-${msg.text.slice(0, 8)}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs mr-1 mt-1 flex-shrink-0">
                    🌾
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-green-100 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs mr-1 mt-1">
                  🌾
                </div>
                <div className="bg-white border border-green-100 rounded-2xl rounded-tl-none px-3 py-2 text-sm text-gray-500 shadow-sm">
                  <span className="inline-flex gap-1">
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    >
                      •
                    </span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    >
                      •
                    </span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    >
                      •
                    </span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-1.5 bg-white border-t border-green-100 flex gap-1 overflow-x-auto">
            {["Crop prices", "Weather", "Book tractor", "Help"].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => {
                  setInput(s);
                  setTimeout(() => {
                    const text = s.trim();
                    setInput("");
                    setMessages((prev) => [...prev, { role: "user", text }]);
                    setTyping(true);
                    setTimeout(() => {
                      setMessages((prev) => [
                        ...prev,
                        { role: "ai", text: getJayaResponse(text) },
                      ]);
                      setTyping(false);
                    }, 800);
                  }, 10);
                }}
                className="flex-shrink-0 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full px-2 py-0.5 hover:bg-green-100 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-green-100 flex gap-2">
            <Input
              data-ocid="jaya_ai.input"
              placeholder="Ask Jaya AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm border-green-200 focus:border-green-400 rounded-full"
            />
            <Button
              data-ocid="jaya_ai.send_button"
              size="sm"
              onClick={sendMessage}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-3"
            >
              ➤
            </Button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        type="button"
        data-ocid="jaya_ai.open_modal_button"
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-500 shadow-lg hover:shadow-xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-white"
        title="Chat with Jaya AI"
      >
        <span className="text-xl leading-none">🌾</span>
        <span className="text-white text-[8px] font-bold leading-tight mt-0.5">
          Jaya AI
        </span>
      </button>
    </div>
  );
}
