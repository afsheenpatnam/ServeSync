const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString()

export const MOCK_USER = {
  _id: 'demo_user1',
  name: 'Rahul Kumar',
  email: 'user@demo.com',
  role: 'user',
}

export const MOCK_ADMIN = {
  _id: 'demo_admin1',
  name: 'Admin Manager',
  email: 'admin@demo.com',
  role: 'admin',
}

export const MOCK_ITEMS = [
  {
    _id: 'mi1', name: 'Masala Dosa', emoji: '🥞', is_veg: true,
    description: 'Crispy golden crepe stuffed with spiced potato filling, served with sambar & coconut chutney',
    price: 60, category: 'Breakfast', stock: 15, is_available: true, rating: 4.8,
  },
  {
    _id: 'mi2', name: 'Idli Sambar', emoji: '🍚', is_veg: true,
    description: 'Soft steamed rice cakes with aromatic lentil sambar and fresh mint chutney',
    price: 40, category: 'Breakfast', stock: 20, is_available: true, rating: 4.5,
  },
  {
    _id: 'mi3', name: 'Poha', emoji: '🌾', is_veg: true,
    description: 'Light flattened rice with mustard seeds, onions, peas and fresh coriander',
    price: 30, category: 'Breakfast', stock: 18, is_available: true, rating: 4.2,
  },
  {
    _id: 'mi4', name: 'Bread Omelette', emoji: '🍳', is_veg: false,
    description: 'Fluffy 3-egg omelette loaded with veggies, served on toasted butter bread',
    price: 45, category: 'Breakfast', stock: 10, is_available: true, rating: 4.3,
  },
  {
    _id: 'mi5', name: 'Veg Thali', emoji: '🍱', is_veg: true,
    description: 'Complete meal — rice, 2 sabzis, dal, roti, salad and papad',
    price: 90, category: 'Lunch', stock: 25, is_available: true, rating: 4.7,
  },
  {
    _id: 'mi6', name: 'Chicken Biryani', emoji: '🍗', is_veg: false,
    description: 'Aromatic basmati rice layered with tender chicken, dum-cooked with whole spices',
    price: 120, category: 'Lunch', stock: 12, is_available: true, rating: 4.9,
  },
  {
    _id: 'mi7', name: 'Paneer Butter Masala', emoji: '🧀', is_veg: true,
    description: 'Creamy tomato curry with soft paneer cubes, served with 2 butter rotis',
    price: 110, category: 'Lunch', stock: 8, is_available: true, rating: 4.6,
  },
  {
    _id: 'mi8', name: 'Dal Tadka + Roti', emoji: '🫘', is_veg: true,
    description: 'Yellow lentils tempered with ghee and cumin, served with 3 fresh rotis',
    price: 75, category: 'Lunch', stock: 20, is_available: true, rating: 4.4,
  },
  {
    _id: 'mi9', name: 'Samosa (2 pcs)', emoji: '🥟', is_veg: true,
    description: 'Crispy pastry filled with spiced potatoes and peas, with mint chutney',
    price: 20, category: 'Snacks', stock: 40, is_available: true, rating: 4.8,
  },
  {
    _id: 'mi10', name: 'Vada Pav', emoji: '🍔', is_veg: true,
    description: "Mumbai street-style spiced potato fritter in a soft bun with chutneys",
    price: 25, category: 'Snacks', stock: 30, is_available: true, rating: 4.6,
  },
  {
    _id: 'mi11', name: 'French Fries', emoji: '🍟', is_veg: true,
    description: 'Golden crispy fries seasoned with chaat masala, served with ketchup',
    price: 60, category: 'Snacks', stock: 15, is_available: true, rating: 4.3,
  },
  {
    _id: 'mi12', name: 'Masala Chai', emoji: '☕', is_veg: true,
    description: 'Freshly brewed spiced tea with ginger, cardamom and aromatic spices',
    price: 15, category: 'Beverages', stock: 50, is_available: true, rating: 4.7,
  },
  {
    _id: 'mi13', name: 'Filter Coffee', emoji: '☕', is_veg: true,
    description: 'South Indian style strong decoction coffee with perfectly steamed milk',
    price: 20, category: 'Beverages', stock: 40, is_available: true, rating: 4.8,
  },
  {
    _id: 'mi14', name: 'Mango Lassi', emoji: '🥭', is_veg: true,
    description: 'Thick chilled yogurt drink blended with fresh Alphonso mango pulp',
    price: 45, category: 'Beverages', stock: 20, is_available: true, rating: 4.9,
  },
  {
    _id: 'mi15', name: 'Cold Coffee', emoji: '🧋', is_veg: true,
    description: 'Chilled blended coffee with full-cream milk and vanilla ice cream',
    price: 55, category: 'Beverages', stock: 0, is_available: false, rating: 4.5,
  },
  {
    _id: 'mi16', name: 'Gulab Jamun', emoji: '🍮', is_veg: true,
    description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup (2 pcs)',
    price: 35, category: 'Desserts', stock: 25, is_available: true, rating: 4.9,
  },
  {
    _id: 'mi17', name: 'Vanilla Ice Cream', emoji: '🍦', is_veg: true,
    description: 'Rich creamy vanilla ice cream served in a crispy waffle cup',
    price: 40, category: 'Desserts', stock: 10, is_available: true, rating: 4.7,
  },
  {
    _id: 'mi18', name: 'Butter Naan Set', emoji: '🫓', is_veg: true,
    description: 'Freshly baked soft butter naan (3 pcs) with paneer makhani gravy',
    price: 130, category: 'Dinner', stock: 12, is_available: true, rating: 4.8,
  },
  {
    _id: 'mi19', name: 'Chicken Curry Rice', emoji: '🍛', is_veg: false,
    description: 'Home-style chicken curry with fragrant basmati rice and papad',
    price: 140, category: 'Dinner', stock: 8, is_available: true, rating: 4.7,
  },
]

export const MOCK_ORDERS = [
  {
    _id: 'order_abc123',
    user_id: 'demo_user1', user_name: 'Rahul Kumar',
    status: 'preparing',
    items: [
      { item_id: 'mi1', name: 'Masala Dosa', price: 60, quantity: 2 },
      { item_id: 'mi12', name: 'Masala Chai', price: 15, quantity: 2 },
    ],
    total_amount: 157.5,
    created_at: hoursAgo(1),
  },
  {
    _id: 'order_def456',
    user_id: 'demo_user1', user_name: 'Rahul Kumar',
    status: 'delivered',
    items: [
      { item_id: 'mi6', name: 'Chicken Biryani', price: 120, quantity: 1 },
      { item_id: 'mi16', name: 'Gulab Jamun', price: 35, quantity: 1 },
    ],
    total_amount: 163.5,
    created_at: hoursAgo(24),
  },
  {
    _id: 'order_ghi789',
    user_id: 'demo_user2', user_name: 'Priya Sharma',
    status: 'pending',
    items: [
      { item_id: 'mi5', name: 'Veg Thali', price: 90, quantity: 2 },
      { item_id: 'mi14', name: 'Mango Lassi', price: 45, quantity: 2 },
    ],
    total_amount: 283.5,
    created_at: hoursAgo(0.4),
  },
  {
    _id: 'order_jkl012',
    user_id: 'demo_user3', user_name: 'Amit Patel',
    status: 'ready',
    items: [
      { item_id: 'mi7', name: 'Paneer Butter Masala', price: 110, quantity: 1 },
      { item_id: 'mi13', name: 'Filter Coffee', price: 20, quantity: 2 },
    ],
    total_amount: 157.5,
    created_at: hoursAgo(2),
  },
  {
    _id: 'order_mno345',
    user_id: 'demo_user4', user_name: 'Sneha Reddy',
    status: 'confirmed',
    items: [
      { item_id: 'mi9', name: 'Samosa (2 pcs)', price: 20, quantity: 4 },
      { item_id: 'mi12', name: 'Masala Chai', price: 15, quantity: 2 },
    ],
    total_amount: 115.5,
    created_at: hoursAgo(0.2),
  },
]
