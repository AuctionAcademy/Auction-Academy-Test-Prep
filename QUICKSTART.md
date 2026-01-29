# Quick Start Guide

## Running Your Website on a Custom Port

### Fastest Method (Node.js)

1. **Make sure Node.js is installed:**
   ```bash
   node --version
   ```
   If not installed, download from [nodejs.org](https://nodejs.org/)

2. **Navigate to the project folder in your terminal**

3. **Choose your port and run:**

   **Default Port (8080):**
   ```bash
   node server.js
   ```

   **Custom Port (e.g., 3000):**
   ```bash
   node server.js 3000
   ```

   **Or any other port (5000, 8000, 9000, etc.):**
   ```bash
   node server.js 5000
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:YOUR_PORT_NUMBER
   ```
   For example: `http://localhost:3000`

### Common Ports to Try:
- 3000 (most common for development)
- 8080 (default for this server)
- 5000
- 8000
- 9000

### Troubleshooting

**"Port already in use" error?**
- Try a different port number
- Or close the application using that port

**Can't see the website?**
- Make sure the server is running (check the terminal)
- Verify you typed the correct port number in the browser
- Try `http://127.0.0.1:PORT` instead of `localhost`

**To stop the server:**
- Press `Ctrl + C` in the terminal window

---

## Alternative Methods

### Using Python (if you have Python installed)

**Python 3:**
```bash
python -m http.server 3000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 3000
```

Replace `3000` with your desired port number.

### Using npm Scripts

```bash
npm start              # Port 8080
npm run dev            # Port 3000
npm run custom-port 4000   # Custom port
```

---

## Need Help?

See the full [README.md](README.md) for more detailed instructions and additional methods.
