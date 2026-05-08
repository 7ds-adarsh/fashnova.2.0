"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { useCart } from "@/app/context/CartContext";
import { useProducts } from "@/app/context/ProductContext";
import { useToast } from "@/app/hooks/use-toast";
import Link from "next/link";
import { CreditCard, Truck, Shield, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

// ── Razorpay type declaration ──────────────────────────────
declare global {
  interface Window { Razorpay: any; }
}

const CheckoutPage = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { products: globalProducts } = useProducts();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    // ❌ Removed: cardNumber, expiryDate, cvv, nameOnCard
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [stockValidation, setStockValidation] = useState<{
    [key: string]: { available: number; isValid: boolean };
  }>({});

  // Validate stock for cart items
  useEffect(() => {
    const validateStock = async () => {
      const validation: { [key: string]: { available: number; isValid: boolean } } = {};
      for (const item of cart) {
        const product = globalProducts.find(
          (p) => p._id === item.id || p.id?.toString() === item.id
        );
        if (product && product.stockQuantity !== undefined) {
          const availableStock = (product.stockQuantity || 0) - (product.reservedStock || 0);
          validation[item.id] = {
            available: availableStock,
            isValid: item.quantity <= availableStock,
          };
        }
      }
      setStockValidation(validation);
    };
    if (cart.length > 0 && globalProducts.length > 0) validateStock();
  }, [cart, globalProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Load Razorpay script dynamically ──────────────────────
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ── Save order to your DB after payment success ────────────
  const saveOrderToDb = async (paymentId: string) => {
    const shippingAddress = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      country: formData.country.trim(),
    };

    const orderData = {
      orderId: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "Processing",
      total: total,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      trackingNumber: null,
      userEmail: formData.email.trim(),
      username: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      shippingAddress,
      paymentId, // ✅ Store Razorpay payment ID
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (response.ok) {
      clearCart();
      router.push(`/order-success/${result.order.orderId}`);
    } else {
      throw new Error(result.error || "Failed to save order");
    }
  };

  // ── Main submit handler ────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    console.log("✅ Step 1: handleSubmit triggered");

    try {
      // 1. Validate shipping fields
      if (
        !formData.firstName || !formData.lastName || !formData.email ||
        !formData.phone || !formData.address || !formData.city ||
        !formData.state || !formData.zipCode || !formData.country
      ) {
        alert("Please fill in all required shipping information fields.");
        setIsProcessing(false);
        return;
      }
      console.log("✅ Step 2: Shipping fields valid");

      // 2. Skip stock validation for now
      console.log("✅ Step 3: Stock check skipped");

      // 3. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      console.log("✅ Step 4: Script loaded?", scriptLoaded);
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load.");
        setIsProcessing(false);
        return;
      }

      // 4. Call create-order API
      console.log("✅ Step 5: Calling /api/create-order with amount:", Math.round(total));
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total) }),
      });
      console.log("✅ Step 6: API response status:", res.status);
      const order = await res.json();
      console.log("✅ Step 7: Order from API:", order);

      if (!order.id) {
        alert("Failed to create Razorpay order. Check console.");
        setIsProcessing(false);
        return;
      }

      // 5. Check the key
      const key =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.NEXT_PUBLIC_ROZERPAY_KEY_ID;
      console.log("✅ Step 8: Razorpay key present?", !!key, "| starts with rzp_test?", key?.startsWith("rzp_test"));

      // 6. Open Razorpay
      console.log("✅ Step 9: Opening Razorpay popup...");
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Fashnova",
        description: `Order for ${formData.firstName} ${formData.lastName}`,
        order_id: order.id,
        handler: async function (response: any) {
          console.log("✅ Payment success:", response);
          try {
            await saveOrderToDb(response.razorpay_payment_id);
          } catch (err) {
            alert("Payment received but order saving failed. Contact support.");
            console.error(err);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => {
            console.log("❌ Razorpay modal dismissed by user");
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("❌ Payment failed:", response);
        toast({ title: "Payment Failed", description: response.error.description, variant: "destructive" });
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error("❌ Checkout error at step:", error);
      alert(`Error: ${error}`);
      setIsProcessing(false);
    }
  };

  const subtotal = getTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen font-inter">
        <Navigation />
        <main className="pt-24 pb-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-16">
              <h1 className="text-3xl font-playfair font-medium mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">Add some items before checking out.</p>
              <Link href="/shop"><Button size="lg">Continue Shopping</Button></Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-playfair font-medium mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="sticky top-24">
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          {stockValidation[item.id] && !stockValidation[item.id].isValid && (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Only {stockValidation[item.id].available} available</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span><span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Secure checkout powered by Razorpay</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Form */}
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Razorpay replaces the old card form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Secure Payment via Razorpay</p>
                      <p className="text-xs text-muted-foreground">
                        Pay with UPI, Card, Net Banking, or Wallet. You'll be prompted after clicking below.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full"
              // disabled={isProcessing || Object.values(stockValidation).some((v) => !v.isValid)}
              >
                {isProcessing ? "Opening Payment..." : `Pay ₹${total.toFixed(2)} via Razorpay`}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Fashnova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;