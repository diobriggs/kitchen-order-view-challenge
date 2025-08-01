# Kitchen Order Display Challenge

## What You're Building
Imagine you're in a busy restaurant kitchen. Orders are coming in fast, and the kitchen staff need to see what to cook. 
You're going to build the digital display that shows all the order, and think of it like the modern version of paper tickets hanging on a kitchen rail.

## The Scenario
- The display is a tablet mounted on the kitchen wall
- Cooks are standing several feet away while cooking
- Their hands are usually messy or full
- They need to quickly see what orders to make

## Your Mission

### Part 1: Show the Orders
Create a React app that displays restaurant orders. Each order should show:
- The order number (like "Order #101")
- What type it is (eating in, takeout, or delivery)
- How long ago it came in (like "5 mins ago")
- What stage it's at (new, being cooked, or ready)

### Part 2: Display the Food Items
For each order, show:
- What food items they ordered
- How many of each item
- Any special requests (like "No pickles" or "Extra cheese")
- **IMPORTANT**: If there are allergy warnings, make them super obvious!

### Part 3: Update Order Status
- Add a way for kitchen staff to mark orders as "ready"
- Remember - they have messy hands, so keep it simple!
- When an order is ready, it should disappear or move out of the way

### Part 4: Make It Kitchen-Friendly
- The text needs to be HUGE (readable from across the kitchen)
- Use colors that are easy to see
- Keep the design clean and organized
- Think about what's most important for a busy cook to see first

## Getting Started

1. First, clone the repository
2. Install project dependencies
3. Start development server. 
3. Open `src/App.tsx` - this is where you'll write your code!

## What's Already Set Up For You

We've given you some files to help:
- **types.ts** - This defines what an "order" looks like in TypeScript
- **mockData.ts** - Fake orders to display (like a pretend database)
- **utils.ts** - Helper functions you might find useful
- **Tailwind CSS** - For styling (includes extra-large text sizes)

## Helpful Hints

- Start simple! First just try to display the orders on screen
- Then add the details for each order
- Finally, add the ability to mark orders as ready
- Don't forget about those allergy warnings - they're super important!
- Test your display by standing back from your screen


Good luck! 🍔
