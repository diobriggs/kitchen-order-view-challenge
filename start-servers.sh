#!/bin/bash

echo "🚀 Starting Kitchen Order Display System..."

# Initialize database
echo "📊 Initializing database..."
cd server
npm run init-db
echo "✅ Database initialized"

# Start backend server in background
echo "🖥️  Starting backend server..."
npm run dev &
BACKEND_PID=$!
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Kitchen Order Display System is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:3001/api/orders"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All servers stopped"
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for servers to finish
wait