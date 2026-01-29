# Auction Academy Test Prep

A website for auction industry test preparation materials and resources.

## 🚀 How to Run the Website on a Custom Localhost Port

There are multiple ways to run this website locally. Choose the method that works best for you:

### Method 1: Node.js Server (Recommended)

This method uses the included `server.js` script that allows you to easily specify a custom port.

#### Prerequisites
- Node.js installed on your computer ([Download here](https://nodejs.org/))

#### Steps

1. **Open a terminal/command prompt** in the project directory

2. **Run on default port (8080):**
   ```bash
   node server.js
   ```

3. **Run on a custom port (e.g., 3000):**
   ```bash
   node server.js 3000
   ```

4. **Run on any custom port (e.g., 5000, 8000, 9000):**
   ```bash
   node server.js 5000
   ```

5. **Using npm scripts:**
   ```bash
   npm start           # Runs on default port (8080)
   npm run dev         # Runs on port 3000
   npm run custom-port 4000  # Runs on specified port
   ```

6. **Using environment variable:**
   ```bash
   PORT=3000 node server.js
   ```

The server will display the URL where you can access the website:
```
========================================
🚀 Server is running!
📡 Access your website at:
   http://localhost:3000
========================================
```

### Method 2: Python Simple HTTP Server

If you have Python installed, you can use its built-in HTTP server:

**Python 3:**
```bash
python -m http.server 3000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 3000
```

Replace `3000` with any port number you want to use.

### Method 3: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. To change the port, go to Settings → Search "Live Server" → Update "Live Server > Settings: Port"

### Method 4: Other HTTP Servers

**Using PHP:**
```bash
php -S localhost:3000
```

**Using Ruby:**
```bash
ruby -run -ehttpd . -p3000
```

## 📂 Project Structure

```
Auction-Academy-Test-Prep/
├── index.html              # Main website homepage
├── server.js              # Node.js server with custom port support
├── package.json           # Node.js project configuration
├── Auction Academy Logo.png
├── Auction Academy Logo.jpg
├── Auction Academy Icon.png
├── Auction Academy Icon.svg
└── README.md
```

## 🛠️ Troubleshooting

### Port Already in Use
If you get an error that the port is already in use, try:
- Using a different port number (e.g., 3001, 8000, 9000)
- Closing other applications using that port
- Finding and stopping the process using the port

### Can't Access the Website
- Make sure the server is running (check the terminal)
- Verify you're using the correct port number
- Try `http://127.0.0.1:PORT` instead of `localhost`
- Check your firewall settings

## 💡 Tips

- Common port numbers: 3000, 8000, 8080, 5000, 9000
- Ports below 1024 typically require administrator/root access
- Use ports between 1024-65535 for local development
- The server logs all requests to help with debugging

## 📝 License

ISC