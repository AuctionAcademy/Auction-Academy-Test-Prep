/* =====================================================
   script.js — Prestige Auction Group Demo Website

   TABLE OF CONTENTS
   1.  Smooth Scroll (nav links)
   2.  Sticky Navbar Shadow on Scroll
   3.  Mobile Hamburger Menu Toggle
   4.  Countdown Timers
   5.  Live Bid Demo
   6.  Registration Form Handler
   7.  Intersection Observer (scroll-in animations)
===================================================== */


/* ─────────────────────────────────────────────────────
   1. SMOOTH SCROLL
   When a user clicks any anchor link (href="#..."),
   the page scrolls smoothly instead of jumping.
   We handle it in JavaScript so we can offset for
   the sticky navbar height.
───────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (event) {

    // Only do custom scroll if the target section exists
    var targetId = this.getAttribute('href').slice(1);
    var targetEl = document.getElementById(targetId);

    if (targetEl) {
      event.preventDefault(); // stop the default jump

      // Close the mobile menu if it's open
      document.getElementById('navMenu').classList.remove('open');

      // Measure the navbar height so we don't hide content underneath it
      var navbarHeight = document.getElementById('navbar').offsetHeight;

      // Calculate position: top of target minus navbar height
      var offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'  // silky animation
      });
    }
  });
});


/* ─────────────────────────────────────────────────────
   2. STICKY NAVBAR SHADOW
   Adds a CSS class ("scrolled") to the navbar once the
   user scrolls down. The class adds a drop shadow.
───────────────────────────────────────────────────── */
var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.pageYOffset > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ─────────────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
   Toggle the "open" class on the nav-menu so it
   appears/disappears on small screens.
───────────────────────────────────────────────────── */
var navToggle = document.getElementById('navToggle');
var navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', function () {
  navMenu.classList.toggle('open');
});

// Close menu if user clicks outside of it
document.addEventListener('click', function (event) {
  var isInsideNav = navbar.contains(event.target);
  if (!isInsideNav) {
    navMenu.classList.remove('open');
  }
});


/* ─────────────────────────────────────────────────────
   4. COUNTDOWN TIMERS
   Each auction card shows a countdown to its end time.
   We use setInterval to update every second.
   Format: "X days, HH:MM:SS" or just "MM:SS" near end.
───────────────────────────────────────────────────── */

/**
 * createCountdown
 * @param {string} elementId  - The id of the <span> to update
 * @param {Date}   endDate    - When the auction closes
 */
function createCountdown(elementId, endDate) {
  var timerEl = document.getElementById(elementId);
  if (!timerEl) return; // safety check

  function update() {
    var now       = new Date();
    var remaining = endDate - now; // milliseconds left

    if (remaining <= 0) {
      // Auction has closed
      timerEl.textContent = 'Auction Closed';
      timerEl.classList.add('urgent');
      return;
    }

    // Convert ms → days, hours, minutes, seconds
    var days    = Math.floor(remaining / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    // Pad single digits: 7 → "07"
    function pad(n) { return String(n).padStart(2, '0'); }

    // Build the display string
    var display;
    if (days > 0) {
      display = days + 'd ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    } else {
      display = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    }

    timerEl.textContent = display;

    // Add "urgent" style if under 1 hour
    if (remaining < 1000 * 60 * 60) {
      timerEl.classList.add('urgent');
    }
  }

  update();                          // run immediately
  setInterval(update, 1000);         // then every second
}

// ── Set up timers for each auction card ──────────────
// We generate end dates relative to "now" for demo purposes.
// In a real app these would come from a database.

var now = new Date();

// Card 1 (Farm Estate): closes in 2 hours 15 minutes (LIVE urgency)
var endTime1 = new Date(now.getTime() + (2 * 60 * 60 + 15 * 60) * 1000);
createCountdown('timer1', endTime1);

// Card 2 (Equipment): closes in 3 days 7 hours (upcoming)
var endTime2 = new Date(now.getTime() + (3 * 24 * 60 * 60 + 7 * 60 * 60) * 1000);
createCountdown('timer2', endTime2);

// Card 3 (Luxury Home): closes in 45 minutes (very urgent)
var endTime3 = new Date(now.getTime() + 45 * 60 * 1000);
createCountdown('timer3', endTime3);


/* ─────────────────────────────────────────────────────
   5. LIVE BID DEMO
   Simulates a real-time bidding interface.
   - currentBid tracks the displayed amount
   - placeBid() adds the chosen increment
   - updateBidDisplay() animates the number change
   - Randomly simulates other bidders to feel alive
───────────────────────────────────────────────────── */

// Starting bid (matches the HTML placeholder)
var currentBid = 875000;
var bidderCount = 14;   // displayed count of active bidders
var bidHistory  = [     // matches the HTML bid log
  { bidder: 'Bidder #472', amount: 875000 },
  { bidder: 'Bidder #219', amount: 870000 },
  { bidder: 'Bidder #104', amount: 865000 }
];

// DOM references
var liveBidAmountEl = document.getElementById('liveBidAmount');
var bidMessageEl    = document.getElementById('bidMessage');
var bidLogEl        = document.getElementById('bidLog');
var bidderCountEl   = document.getElementById('bidderCount');

/**
 * formatCurrency
 * Turns 875000 into "$875,000" using the browser's
 * built-in Intl.NumberFormat API.
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * updateBidLog
 * Rebuilds the bid history list in the DOM.
 * The most recent bid is always first.
 */
function updateBidLog() {
  bidLogEl.innerHTML = '';                // clear existing items

  // Show the three most recent bids
  var recentBids = bidHistory.slice(0, 3);

  recentBids.forEach(function (entry, index) {
    var li = document.createElement('li');
    li.textContent = entry.bidder + ' — ' + formatCurrency(entry.amount);
    if (index === 0) {
      li.style.color      = '#d4af37';    // gold for top bid
      li.style.fontWeight = '600';
    }
    bidLogEl.appendChild(li);
  });
}

/**
 * updateBidDisplay
 * Updates the large bid number and triggers the
 * "pop" CSS animation so the change is noticeable.
 */
function updateBidDisplay() {
  // Update the text
  liveBidAmountEl.textContent = formatCurrency(currentBid);

  // Remove then re-add the animation class so it replays
  liveBidAmountEl.classList.remove('bid-pop');
  // Force reflow (trick to restart CSS animation)
  void liveBidAmountEl.offsetWidth;
  liveBidAmountEl.classList.add('bid-pop');
}

/**
 * showBidMessage
 * Flashes the "New bid placed!" confirmation message,
 * then hides it after 3 seconds.
 */
var messageTimer = null;   // track existing timer so we can reset it

function showBidMessage(message) {
  bidMessageEl.style.display = 'flex';
  bidMessageEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + message;

  // Clear any previous hide-timer
  if (messageTimer) clearTimeout(messageTimer);

  // Hide the message after 3 seconds
  messageTimer = setTimeout(function () {
    bidMessageEl.style.display = 'none';
  }, 3000);
}

/**
 * placeBid  (called by the HTML "onclick" attributes)
 * @param {number} increment  — $100, $500, or $1000
 */
function placeBid(increment) {
  // Add increment to current bid
  currentBid += increment;

  // Record your bid in history (you = Bidder #YOU)
  bidHistory.unshift({ bidder: 'You (Bidder #YOU)', amount: currentBid });

  // Update the display + animate
  updateBidDisplay();
  updateBidLog();

  // Show confirmation
  showBidMessage('New bid placed! You are the high bidder.');
}

// ── Simulated competing bids ──────────────────────────
// Every 6–14 seconds, a "random" bidder places a bid.
// This makes the demo feel realistic and live.
var bidderNames = [
  'Bidder #109', 'Bidder #245', 'Bidder #318',
  'Bidder #061', 'Bidder #492', 'Bidder #537'
];

function simulateOtherBidder() {
  // Random increment: $100, $250, or $500
  var increments  = [100, 250, 500];
  var inc         = increments[Math.floor(Math.random() * increments.length)];
  var name        = bidderNames[Math.floor(Math.random() * bidderNames.length)];

  // Only simulate if there's an active bid (don't spam on fresh load)
  currentBid += inc;
  bidHistory.unshift({ bidder: name, amount: currentBid });
  if (bidHistory.length > 10) bidHistory.pop(); // keep log short

  // Also randomly bump the bidder count ±1
  bidderCount = Math.max(8, bidderCount + (Math.random() > 0.5 ? 1 : -1));
  bidderCountEl.textContent = bidderCount;

  updateBidDisplay();
  updateBidLog();

  // Schedule the next simulated bid (6–14 seconds from now)
  var delay = 6000 + Math.random() * 8000;
  setTimeout(simulateOtherBidder, delay);
}

// Start the simulation after a 5-second delay
setTimeout(simulateOtherBidder, 5000);


/* ─────────────────────────────────────────────────────
   6. REGISTRATION FORM HANDLER
   Prevents the default form submission (which would
   reload the page), validates required fields, then
   shows a success message.
───────────────────────────────────────────────────── */
var registerForm  = document.getElementById('registerForm');
var formSuccess   = document.getElementById('formSuccess');

registerForm.addEventListener('submit', function (event) {
  event.preventDefault();   // stop the default page reload

  // Grab form field values
  var name     = document.getElementById('fullName').value.trim();
  var email    = document.getElementById('email').value.trim();
  var interest = document.getElementById('interest').value;

  // Simple validation: name and email are required
  if (!name || !email) {
    // Shake the form to signal an error
    registerForm.style.animation = 'none';
    void registerForm.offsetWidth; // force reflow
    registerForm.style.animation = 'shake 0.4s ease';
    return;
  }

  // Hide the submit button and show the success message
  this.querySelector('.btn-submit').style.display = 'none';
  formSuccess.style.display = 'flex';

  // After 5 seconds, reset the form so it can be demoed again
  setTimeout(function () {
    registerForm.reset();
    registerForm.querySelector('.btn-submit').style.display = 'flex';
    formSuccess.style.display = 'none';
  }, 5000);
});

// Add a "shake" animation to the stylesheet dynamically
// (used when the form is submitted with missing fields)
var shakeStyle = document.createElement('style');
shakeStyle.textContent = [
  '@keyframes shake {',
  '  0%, 100% { transform: translateX(0); }',
  '  20%       { transform: translateX(-8px); }',
  '  40%       { transform: translateX(8px); }',
  '  60%       { transform: translateX(-5px); }',
  '  80%       { transform: translateX(5px); }',
  '}'
].join('\n');
document.head.appendChild(shakeStyle);


/* ─────────────────────────────────────────────────────
   7. INTERSECTION OBSERVER — Scroll-in Animations
   When a section or card enters the viewport, we add
   an "visible" class so it can animate in via CSS.
   This is a modern, performant way to trigger
   animations on scroll without using heavy libraries.
───────────────────────────────────────────────────── */

// Inject the animation CSS via JavaScript so it's
// self-contained and easy to explain in class.
var revealStyle = document.createElement('style');
revealStyle.textContent = [
  '.reveal {',
  '  opacity: 0;',
  '  transform: translateY(30px);',
  '  transition: opacity 0.6s ease, transform 0.6s ease;',
  '}',
  '.reveal.visible {',
  '  opacity: 1;',
  '  transform: translateY(0);',
  '}',
  // Stagger children of a grid by adding a small delay per item
  '.reveal-grid > * {',
  '  opacity: 0;',
  '  transform: translateY(30px);',
  '  transition: opacity 0.5s ease, transform 0.5s ease;',
  '}',
  '.reveal-grid.visible > *:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:0.0s; }',
  '.reveal-grid.visible > *:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:0.12s; }',
  '.reveal-grid.visible > *:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:0.24s; }',
  '.reveal-grid.visible > *:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:0.36s; }'
].join('\n');
document.head.appendChild(revealStyle);

// Add the "reveal" class to sections and grids we want to animate
var sectionsToReveal = document.querySelectorAll(
  '.section-header, .auction-grid, .steps-grid, .testimonial-grid, ' +
  '.live-bid-card, .form-wrapper'
);

sectionsToReveal.forEach(function (el) {
  // Grids get the stagger behaviour; single elements just fade in
  if (
    el.classList.contains('auction-grid') ||
    el.classList.contains('steps-grid')   ||
    el.classList.contains('testimonial-grid')
  ) {
    el.classList.add('reveal-grid');
  } else {
    el.classList.add('reveal');
  }
});

// Create the observer
var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop watching (saves CPU)
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }   // trigger when 15% of element is visible
);

// Attach observer to each element
sectionsToReveal.forEach(function (el) {
  observer.observe(el);
});
