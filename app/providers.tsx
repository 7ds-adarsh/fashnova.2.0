"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { WishlistProvider } from "./context/WishlistContext";
import { UserProvider } from "./context/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ProductProvider>
          <OrderProvider>
            <WishlistProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </WishlistProvider>
          </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </SessionProvider>
  );
}
