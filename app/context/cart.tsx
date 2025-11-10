"use client"
import React, { createContext, useContext, useReducer, ReactNode } from "react";

type CartItem = {
    id: number | string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
};

type State = {
    items: CartItem[];
    isOpen: boolean;
};

type Action =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: { id: string | number } }
    | { type: "SET_QTY"; payload: { id: string | number; quantity: number } }
    | { type: "TOGGLE_CART" }
    | { type: "CLEAR_CART" };

const initialState: State = {
    items: [],
    isOpen: false,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((i) => i.id === action.payload.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
                    ),
                };
            }

            return { ...state, items: [...state.items, action.payload] };
        }
        case "REMOVE_ITEM":
            return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
        case "SET_QTY":
            return {
                ...state,
                items: state.items.map((i) => (i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i)),
            };
        case "TOGGLE_CART":
            return { ...state, isOpen: !state.isOpen };
        case "CLEAR_CART":
            return { ...state, items: [] };
        default:
            return state;
    }
}

type CartContextValue = {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeItem: (id: string | number) => void;
    setQty: (id: string | number, quantity: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
    total: () => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        dispatch({
            type: "ADD_ITEM",
            payload: { ...item, quantity: item.quantity ?? 1 },
        } as Action);
    };

    const removeItem = (id: string | number) => dispatch({ type: "REMOVE_ITEM", payload: { id } });

    const setQty = (id: string | number, quantity: number) =>
        dispatch({ type: "SET_QTY", payload: { id, quantity } });

    const toggleCart = () => dispatch({ type: "TOGGLE_CART" });

    const clearCart = () => dispatch({ type: "CLEAR_CART" });

    const total = () => state.items.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items: state.items, isOpen: state.isOpen, addItem, removeItem, setQty, toggleCart, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

export type { CartItem };
