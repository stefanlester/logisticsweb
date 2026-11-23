const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sovereignfortune-super-secret-key-2025';

// Enhanced CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://sovereignfortunesecurities.com',  // Hostinger domain
    'https://www.sovereignfortunesecurities.com',  // With www
    'https://logzeeserver.onrender.com'  // Render domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the website directory (for local development)
app.use(express.static(path.join(__dirname, '../mannatstudio.com/html/logzee/v3')));

// In-memory databases (replace with real database in production)
const users = [
  {
    id: 1,
    email: 'j.okafor@sovereignfortunesecurities.com',
    password: '$2a$10$AHpoNElcaFEXpDI8/FdDF.nzKI.qSXnd0F2PhHC/f7CI/RKIhQlbK', // demo-client-1
    firstName: 'Jonathan',
    lastName: 'Okafor',
    company: 'Sovereign Fortune Securities',
    phone: '+1 (707) 530-2265',
    role: 'customer',
    verified: true,
    createdAt: new Date('2001-08-17'),
    vaultAssets: {
      gold: {
        description: 'Certified 24K Gold',
        vaulted: '110 kilograms',
        inTransit: '50.000 kg',
        purity: '99.99%'
      },
      diamonds: {
        description: 'Premium Diamonds',
        vaulted: '60 carats (D-Color, VVS, Excellent-quality cut)'
      },
      // 50 kg is with the carrier on consignment FS20251031DELIVERY
      goldInTransitNote: 'FS20251031DELIVERY',
      depositDate: '2001-08-17',
      storage: 'Sovereign Fortune Vault — Tour Aurelia, Fontvieille',
      location: 'Tour Aurelia, Fontvieille, Monaco'
    }
  },
  {
    id: 3,
    email: 'h.lindqvist@sovereignfortunesecurities.com',
    password: '$2a$10$bSEAj5zOVJB4hTYnsE3Zke0KelEHZO6NQW5lqHQtXH66OWR5BYlpC', // demo-client-2
    firstName: 'Henrik',
    lastName: 'Lindqvist',
    company: 'Sovereign Fortune Securities',
    phone: '+1 (707) 530-2265',
    role: 'customer',
    verified: true,
    createdAt: new Date('2012-07-01'),
    addresses: [
      '14 Kirkgate Mews, Edinburgh EH6 6QA',
      '48 Lindenhofstrasse, 70597 Stuttgart',
      '7 Harbour Crescent, Leith, Edinburgh EH6 7DX'
    ],
    vaultAssets: {
      owner: 'Henrik Lindqvist',
      addresses: [
        '14 Kirkgate Mews, Edinburgh EH6 6QA',
        '48 Lindenhofstrasse, 70597 Stuttgart'
      ],
      bonafideOwner: true,
      gold: {
        description: 'Refined Gold Bullion (Good Delivery Bars)',
        vaulted: '350.000 kg',
        inTransit: '50.000 kg',
        fineness: '999.9 (or as assayed)'
      },
      storage: 'Sovereign Fortune Vault — Keppel Gateway Tower, Changi North',
      serialNumber: '4417829930066182H',
      transactionCode: 'TRX-2012-AU-66182',
      securityCode: 'SEC-2012-7741',
      location: 'Keppel Gateway Tower, Changi North, Singapore (50kg in transit to Meridian Vault House, Sydney, Australia; remainder in storage)',
      address: '7 Harbour Crescent, Leith, Edinburgh EH6 7DX',
      depositDate: 'July 2012'
    }
  },
  {
    id: 4,
    email: 'r.castellanos@sovereignfortunesecurities.com',
    password: '$2a$10$s7TsLnBl48sWTH.Agr7a9erIf/xwTPavteKhZktIOk10JXz3rNhUG', // demo-client-3
    firstName: 'Rafael',
    lastName: 'Castellanos',
    company: 'Sovereign Fortune Securities',
    phone: '+1 (707) 530-2265',
    role: 'customer',
    verified: true,
    createdAt: new Date('2026-10-01'),
    addresses: [
      '22 Candlewick Row, Southwark, London SE1 9FR'
    ],
    vaultAssets: {
      owner: 'Rafael Castellanos',
      addresses: [
        '22 Candlewick Row, Southwark, London SE1 9FR'
      ],
      bonafideOwner: true,
      gold: {
        description: '24 Karat Gold',
        vaulted: '120.000 kg',
        inTransit: null,
        purity: '99.99%'
      },
      storage: 'Arrived at Harborline Vault Center, New York; awaiting authorised recipient declaration and release to the authorised recipient',
      purchasedFrom: 'Highveld Refining (Pty) Ltd',
      purchaseLocation: '9 Rand Exchange Road, Johannesburg, South Africa',
      location: 'Harborline Vault Center, New York, USA - arrived 2026-11-02',
      depositDate: '2026-10-01'
    }
  },
  {
    id: 5,
    email: 'f.marshall@sovereignfortunesecurities.com',
    password: '$2a$10$feEv49kr7oDUak1FeR2FKe6ZkhXFZbgcJySfWAyzLCuPLPCN8y872', // Meridian-dkaEa-5840
    firstName: 'Frank',
    lastName: 'Marshall',
    company: 'Sovereign Fortune Securities',
    phone: '+1 (707) 530-2265',
    role: 'customer',
    verified: true,
    createdAt: new Date('2009-11-11'),
    vaultAssets: {
      owner: 'Frankie Marshall',
      nextOfKin: 'Frank Marshall',
      bonafideOwner: true,
      certificateOfOwnership: {
        number: 'COO-2026-AU-22994',
        issuedOn: '2026-11-20'
      },
      gold: {
        description: 'Certified 24K Gold Bullion',
        vaulted: '370.000 kg',
        inTransit: null,
        purity: '99.99%'
      },
      storage: 'Sovereign Fortune Vault — Bishan Place Business Tower',
      serialNumber: '6838744994422994M',
      referenceId: 'VLT-2009-AU-22994',
      storageChargePerMonth: '$1,200',
      location: 'Bishan Place Business Tower, 9 Bishan Place, Singapore 579837',
      depositDate: '2009-11-11'
    }
  },
    {
        id: 2,
        email: 'admin@sovereignfortunesecurities.com',
        password: '$2a$10$z7bk3Z/bmsi4waBdSUsWHeal3mkaVPGDm0Km9yF3tC70uqR0B0XYy', // demo-admin
        firstName: 'Admin',
        lastName: 'User',
        company: 'Sovereign Fortune Securities',
        phone: '+1 (707) 530-2265',
        role: 'admin',
        verified: true,
  createdAt: new Date('2025-10-16')
    }
];

let shipments = [
  {
    id: "GE20261029GOLD",
    trackingNumber: "GE20261029GOLD",
    origin: "Port of Durban, South Africa",
    destination: "Harborline Vault Center, New York, United States",
    authorisedRecipient: "Meridian Holdings LLC, 420 Fulton Yards, Springfield Gardens, NY 11413, USA",
    status: "Delivered",
    currentLocation: "Harborline Vault Center, New York, USA",
    estimatedDelivery: "2026-10-31",
    actualDelivery: "2026-11-02",
    weight: "120kg Gold (24 Karat)",
    statusCode: "delivered",
    assetTotals: { goldKg: 120 },
    service: "International Secure Asset Delivery",
    userId: 4, // Associated with Rafael Castellanos
    assetType: "gold_bullion",
    depositDate: "2026-10-01",
    assets: {
      gold: "120 kilograms of 24 karat gold (99.99%)",
      purchasedFrom: "Highveld Refining (Pty) Ltd",
      purchaseLocation: "North 90th Street, Cairo Business Plaza Building, 6th Floor, Units 616 & 617, Cairo, Egypt"
    },
    history: [
      {
        timestamp: "2026-10-01",
        location: "Port of Durban, South Africa",
        status: "Dispatched",
        description: "Consignment departed origin facility under armed escort."
      },
      {
        timestamp: "2026-10-19",
        location: "Algeciras, Spain",
        status: "In Transit",
        description: "Vessel transit through the Strait of Gibraltar; port call at Algeciras, Spain"
      },
      {
        timestamp: "2026-10-27",
        location: "Atlantic Ocean",
        status: "In Transit",
        description: "Vessel underway across the Atlantic Ocean bound for New Jersey"
      },
      {
        timestamp: "2026-11-01",
        location: "Harborline Terminal, New York, USA",
        status: "In Transit",
        description: "Port call completed at Port Newark, New Jersey; vessel proceeding to Elizabeth-Port Authority Marine Terminal"
      },
      {
        timestamp: "2026-11-02",
        location: "Harborline Vault Center, New York, USA",
        status: "Delivered",
        description: "Consignment arrived at destination vault and was logged into custody."
      }
    ],
    notes: [
      "High-value consignments require a customs declaration on entry.",
      "The authorised recipient completes a release declaration on collection.",
      "Consignment documentation is retained for seven years from date of release."
    ]
  },
  {
    id: "SFS2012AU0050",
    trackingNumber: "SFS2012AU0050",
    origin: "Keppel Gateway Tower, Changi North, Singapore",
    destination: "Meridian Vault House, Sydney, Australia",
    status: "In Transit to Sydney Vault",
    currentLocation: "Singapore",
    estimatedDelivery: "Pending Arrival at Meridian Vault House",
    weight: "50kg Gold (Good Delivery Bars)",
    statusCode: "in_transit",
    assetTotals: { goldKg: 50 },
    service: "International Secure Asset Transfer",
    userId: 3, // Associated with Henrik Lindqvist
    assetType: "gold_bullion",
    depositDate: "2025-10-29",
    assets: {
      gold: "350 kilograms refined gold bullion (999.9)",
      serialNumber: "4417829930066182H",
      transactionCode: "TRX-2012-AU-66182",
      securityCode: "SEC-2012-7741"
    },
    history: [
      {
        timestamp: "2025-10-29 09:00",
        location: "Keppel Gateway Tower, Changi North, Singapore",
        status: "Assets prepared for transfer",
        description: "350kg refined gold bullion secured for international transfer; 50kg released to Meridian Vault House, Sydney"
      },
      {
        timestamp: "2025-10-29 18:00",
        location: "Singapore Changi Air Cargo Terminal",
        status: "In transit",
        description: "50kg of gold bullion in secure transit to Meridian Vault House, Sydney, Australia"
      }
    ]
  },
  // Sample shipment for Jonathan Okafor
  {
    id: "FS20251031DELIVERY",
    trackingNumber: "FS20251031DELIVERY",
    origin: "Fontvieille, Monaco",
    destination: "420 Fulton Yards, Springfield Gardens, NY 11413, USA",
    status: "On Hold",
    currentLocation: "JFK Air Cargo Customs Inspection Point",
    estimatedDelivery: "2025-10-31",
    weight: "50kg Gold (50 x 1kg bars) + 40ct Diamonds (D-color, VVS1, GIA)",
    statusCode: "on_hold",
    assetTotals: { goldKg: 50, diamondsCt: 40 },
    service: "International Secure Asset Delivery",
    userId: 1, // Jonathan Okafor
    assetType: "gold_bars_diamonds",
    depositDate: "2025-10-31",
    assets: {
      gold: "50 one-kilogram bars of 24 carat gold (99.99%)",
      diamonds: "40 D-colored, VVS1 graded diamonds, each with GIA certification"
    },
    history: [
      {
        timestamp: "2025-10-31 08:00",
        location: "Fontvieille, Monaco",
        status: "Dispatched",
        description: "Shipment departed from Fontvieille, Monaco."
      },
      {
        timestamp: "2025-10-31 10:00",
        location: "Express New York, New York, USA",
        status: "In Transit",
        description: "Arrived in New York (Express New York). Awaiting further transfer to Virginia."
      },
      {
        timestamp: "2025-11-02 09:30",
        location: "JFK Air Cargo Customs Inspection Point",
        status: "On Hold",
        description: "Held pending customs documentation review."
      }
    ]
  },
  {
    id: "FS2001ASSETS",
    trackingNumber: "FS2001ASSETS",
    origin: "Fontvieille, Monaco",
    destination: "420 Fulton Yards, Springfield Gardens, NY 11413, USA",
    status: "Secured in Vault - Ready for Transfer",
    currentLocation: "Monaco Vault Facility",
    estimatedDelivery: "Pending Transfer Authorization",
    weight: "110kg Gold + 60ct Diamonds",
    statusCode: "preparing",
    assetTotals: { goldKg: 110, diamondsCt: 60 },
    service: "International Secure Asset Transfer",
    userId: 1, // Jonathan Okafor
    assetType: "precious_metals_diamonds",
    depositDate: "2001-08-17",
    assets: {
      gold: "110 kilograms certified 24K",
      diamonds: "60 carats D-Color VVS"
    },
    history: [
      {
        timestamp: "2001-08-17 10:00",
        location: "Fontvieille, Monaco",
        status: "Assets deposited",
        description: "Precious metals and diamonds secured in vault"
      },
      {
        timestamp: "2001-08-17 15:30",
        location: "Monaco Vault Facility",
        status: "Vault secured",
        description: "All assets verified and placed in maximum security vault"
      },
      {
        timestamp: "2025-10-18 09:00",
        location: "Monaco Vault Facility",
        status: "Transfer preparation",
        description: "Consignment prepared, weighed and sealed for dispatch."
      },
      {
        timestamp: "2025-10-18 14:30",
        location: "Monaco Vault Facility",
        status: "Ready for transfer",
        description: "Export documentation and assay certificates lodged."
      }
    ]
  },
  {
    id: "SFS2025002",
    trackingNumber: "SFS2025002",
    origin: "Singapore",
    destination: "London, United Kingdom",
    status: "Delivered",
    currentLocation: "London, United Kingdom",
  estimatedDelivery: "2025-10-16",
  actualDelivery: "2025-10-16",
    weight: "12.8 kg",
    statusCode: "delivered",
    assetTotals: { otherKg: 12.8 },
    service: "Secure Freight",
    userId: 1, // Associated with demo user
    history: [
      {
  timestamp: "2025-10-16 10:00",
        location: "Singapore",
        status: "Package picked up",
        description: "Package collected from origin"
      },
      {
  timestamp: "2025-10-16 16:45",
        location: "Dubai, UAE",
        status: "In transit",
        description: "Package in transit"
      },
      {
  timestamp: "2025-10-16 12:20",
        location: "Frankfurt, Germany",
        status: "In transit",
        description: "Package in transit"
      },
      {
  timestamp: "2025-10-16 09:30",
        location: "London, United Kingdom",
        status: "Delivered",
        description: "Package delivered to recipient"
      }
    ]
  },
  {
    id: "SFS2025003", 
    trackingNumber: "SFS2025003",
    origin: "Dubai, UAE",
    destination: "Cape Town, South Africa",
    status: "Processing",
    currentLocation: "Dubai, UAE",
  estimatedDelivery: "2025-10-16",
    weight: "78.5 kg",
    statusCode: "preparing",
    assetTotals: { otherKg: 78.5 },
    service: "Secure Freight",
    userId: 4, // Associated with Rafael Castellanos
    history: [
      {
  timestamp: "2025-10-16 07:30",
        location: "Dubai, UAE",
        status: "Order received",
        description: "Shipment order created and processing"
      }
    ]
  }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const tokenExpiry = rememberMe ? '30d' : '1d';
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            }, 
            JWT_SECRET, 
            { expiresIn: tokenExpiry }
        );
        
        // Return user info (without password) and token
        const { password: _, ...userInfo } = user;
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userInfo
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, company, phone, password } = req.body;
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            company: company || null,
            phone,
            role: 'customer',
            verified: false,
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        // Return success (without password)
        const { password: _, ...userInfo } = newUser;
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: userInfo
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/auth/forgot-password', (req, res) => {
    try {
        const { email } = req.body;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
        }
        
        // In production, generate reset token and send email
        console.log(`Password reset requested for: ${email}`);
        
        res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
    // If middleware passes, token is valid
    res.json({ success: true, message: 'Token is valid', user: req.user });
});

// Protected User Routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { password: _, ...userInfo } = user;
    res.json({ success: true, data: userInfo });
});

app.get('/api/user/shipments', authenticateToken, (req, res) => {
    const userShipments = shipments.filter(s => s.userId === req.user.id);
    res.json({ success: true, data: userShipments, count: userShipments.length });
});

app.get('/api/user/vault', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user || !user.vaultAssets) {
        return res.status(404).json({ success: false, message: 'No vault assets found' });
    }
    
    res.json({ success: true, data: user.vaultAssets });
});

// Public Tracking Routes
app.get('/api/track/:trackingNumber', optionalAuth, (req, res) => {
  const { trackingNumber } = req.params;
  
  const shipment = shipments.find(s => 
    s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
  );
  
  if (!shipment) {
    return res.status(404).json({
      success: false,
      message: 'Tracking number not found. Please check your tracking number and try again.',
      trackingNumber: trackingNumber
    });
  }

  // If user is authenticated and owns this shipment, return full details
  // Otherwise, return limited public information
  let responseData = shipment;
  if (!req.user || shipment.userId !== req.user.id) {
    // Public tracking - hide sensitive information
    responseData = {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      currentLocation: shipment.currentLocation,
      estimatedDelivery: shipment.estimatedDelivery,
      actualDelivery: shipment.actualDelivery,
      service: shipment.service,
      authorisedRecipient: shipment.authorisedRecipient,
      notes: shipment.notes,
      history: shipment.history.map(h => ({
        timestamp: h.timestamp,
        location: h.location,
        status: h.status,
        description: h.description
      }))
    };
  }
  
  res.json({
    success: true,
    data: responseData
  });
});

// Protected Shipment Management Routes
app.get('/api/shipments', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    // Admin can see all shipments
    res.json({
      success: true,
      data: shipments,
      count: shipments.length
    });
  } else {
    // Regular users can only see their own shipments
    const userShipments = shipments.filter(s => s.userId === req.user.id);
    res.json({
      success: true,
      data: userShipments,
      count: userShipments.length
    });
  }
});

app.post('/api/shipments', authenticateToken, (req, res) => {
  const {
    origin,
    destination,
    weight,
    service = 'Standard Shipping'
  } = req.body;
  
  if (!origin || !destination || !weight) {
    return res.status(400).json({
      success: false,
      message: 'Origin, destination, and weight are required fields'
    });
  }
  
  const trackingNumber = `LZ${new Date().getFullYear()}${(shipments.length + 1).toString().padStart(3, '0')}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now
  
  const newShipment = {
    id: trackingNumber,
    trackingNumber,
    origin,
    destination,
    status: 'Processing',
    currentLocation: origin,
    estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
    weight,
    service,
    userId: req.user.id, // Associate with current user
    history: [
      {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: origin,
        status: 'Order received',
        description: 'Shipment order created and processing'
      }
    ]
  };
  
  shipments.push(newShipment);
  
  res.status(201).json({
    success: true,
    message: 'Shipment created successfully',
    data: newShipment
  });
});

app.put('/api/shipments/:trackingNumber/status', authenticateToken, (req, res) => {
  const { trackingNumber } = req.params;
  const { status, location, description } = req.body;
  
  const shipmentIndex = shipments.findIndex(s => 
    s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
  );
  
  if (shipmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Shipment not found'
    });
  }

  const shipment = shipments[shipmentIndex];
  
  // Check if user owns this shipment or is admin
  if (req.user.role !== 'admin' && shipment.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied - you can only update your own shipments'
    });
  }
  
  shipment.status = status;
  shipment.currentLocation = location || shipment.currentLocation;
  
  // Add to history
  shipment.history.push({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    location: location || shipment.currentLocation,
    status: status,
    description: description || `Status updated to ${status}`
  });
  
  shipments[shipmentIndex] = shipment;
  
  res.json({
    success: true,
    message: 'Shipment status updated',
    data: shipment
  });
});

// Admin-only routes
app.get('/api/admin/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    res.json({ success: true, data: sanitizedUsers });
});

app.get('/api/admin/shipments', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    res.json({ success: true, data: shipments });
});

// Serve HTML pages for local development
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../mannatstudio.com/html/logzee/v3/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../mannatstudio.com/html/logzee/v3/login.html'));
});

app.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, '../mannatstudio.com/html/logzee/v3/track.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../mannatstudio.com/html/logzee/v3/dashboard.html'));
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Sovereign Fortune Securities API Server',
    version: '2.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      track: '/api/track/:trackingNumber',
      auth: '/api/auth/*',
      user: '/api/user/*',
      admin: '/api/admin/*'
    },
    documentation: 'Contact admin for API documentation'
  });
});

// Quote requests from the website forms (in memory; swap for a store/mailer in production)
const quoteRequests = [];

app.post('/api/quote', (req, res) => {
    const {
        freightType, incoterms, originCity, destinationCity,
        grossWeightKg, dimensions, contactName, email, phone, message
    } = req.body || {};

    if (!contactName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Please provide your name and email address.'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address.'
        });
    }

    const request = {
        id: `QR-${Date.now()}`,
        receivedAt: new Date().toISOString(),
        freightType: freightType || null,
        incoterms: incoterms || null,
        originCity: originCity || null,
        destinationCity: destinationCity || null,
        grossWeightKg: grossWeightKg || null,
        dimensions: dimensions || null,
        contactName,
        email,
        phone: phone || null,
        message: message || null
    };

    quoteRequests.push(request);
    console.log(`📝 Quote request ${request.id} from ${contactName} <${email}>`);

    res.status(201).json({
        success: true,
        reference: request.id,
        message: `Thank you — your request is logged as ${request.id}. Our team will respond within one business day.`
    });
});

// Admin view of submitted quote requests
app.get('/api/admin/quotes', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    res.json({ success: true, count: quoteRequests.length, quotes: quoteRequests });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        server: 'Sovereign Fortune Securities Tracking API',
        version: '2.0.0',
        features: ['authentication', 'tracking', 'user_management']
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        availableEndpoints: ['/api/health', '/api/track/:id', '/api/auth/login']
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚚 Sovereign Fortune Securities Tracking Server running on port ${PORT}`);
  console.log(`� API Base: http://localhost:${PORT}/api`);
  console.log(`� Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('🔑 Demo Accounts:');
  console.log('  Customer: j.okafor@sovereignfortunesecurities.com / demo-client-1');
  console.log('  Admin: admin@sovereignfortunesecurities.com / demo-admin');
  console.log('');
  console.log('📦 Sample tracking numbers:');
  console.log('  - LZ2025001 (In Transit)');
  console.log('  - SFS2025002 (Delivered)');
  console.log('  - SFS2025003 (Processing)');
  console.log('');
  console.log('🔗 API Endpoints:');
  console.log('  • POST /api/auth/login - User login');
  console.log('  • POST /api/auth/signup - User registration');
  console.log('  • GET  /api/track/:number - Track shipment');
  console.log('  • GET  /api/user/profile - User profile (protected)');
  console.log('  • GET  /api/user/shipments - User shipments (protected)');
});

module.exports = app;
