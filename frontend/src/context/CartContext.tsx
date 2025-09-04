import { createContext, useState, useEffect, useRef, ReactNode, useMemo } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  total: 0,
  totalItems: 0
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const loadedRef = useRef(false);

  // 🔥 CALCULAR TOTALES EN TIEMPO REAL
  const total = useMemo(() => {
    const calculatedTotal = cart.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price);
      const subtotal = price * item.quantity;
      return sum + subtotal;
    }, 0);
    return calculatedTotal;
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Cargar carrito desde localStorage solo una vez
  useEffect(() => {
    if (!loadedRef.current) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          const normalizedCart = parsedCart.map((item: any) => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price),
            quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : Number(item.quantity)
          }));
          setCart(normalizedCart);
        } catch {
          console.error("Error al leer carrito desde localStorage");
          localStorage.removeItem("cart");
        }
      }
      loadedRef.current = true;
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (loadedRef.current) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === newItem.id);
      
      if (existing) {
        return prevCart.map(item =>
          item.id === newItem.id
            ? { 
                ...item, 
                quantity: item.quantity + (newItem.quantity || 1),
                price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price)
              }
            : item
        );
      } else {
        return [...prevCart, { 
          ...newItem, 
          quantity: newItem.quantity || 1,
          price: typeof newItem.price === 'string' ? parseFloat(newItem.price) : Number(newItem.price)
        }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      total,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};