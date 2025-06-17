const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// CORS-Konfiguration für Angular Frontend
app.use(cors({
  origin: ['http://localhost:4200', 'https://witty-hill-01df38b03.6.azurestaticapps.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock Blog-Daten
const blogPosts = [
  {
    id: 1,
    title: 'Angular Control Flow - Die Revolution der Templates',
    content: 'Angular 17 führt eine neue Control Flow Syntax ein, die Templates lesbarer und performanter macht. Mit @if, @for und @switch wird die Template-Syntax deutlich vereinfacht.',
    author: 'Mehmet Oezdag',
    publishDate: '2024-01-15',
    category: 'Angular',
    tags: ['Angular', 'Control Flow', 'Templates'],
    featured: true,
    imageUrl: 'https://picsum.photos/400/250?random=1'
  },
  {
    id: 2,
    title: 'SCSS Best Practices für moderne Web-Entwicklung',
    content: 'SCSS bietet mächtige Features für die Stylesheet-Entwicklung. Von Variablen über Mixins bis hin zu verschachtelten Regeln - hier sind die wichtigsten Best Practices.',
    author: 'Mehmet Oezdag',
    publishDate: '2024-01-10',
    category: 'CSS',
    tags: ['SCSS', 'CSS', 'Styling'],
    featured: false,
    imageUrl: 'https://picsum.photos/400/250?random=2'
  },
  {
    id: 3,
    title: 'Flexbox Layout Patterns für responsive Design',
    content: 'Flexbox ist ein mächtiges Layout-Tool für moderne Webseiten. Diese Anleitung zeigt praktische Patterns für responsive und flexible Layouts.',
    author: 'Mehmet Oezdag',
    publishDate: '2024-01-05',
    category: 'CSS',
    tags: ['Flexbox', 'Responsive', 'Layout'],
    featured: true,
    imageUrl: 'https://picsum.photos/400/250?random=3'
  },
  {
    id: 4,
    title: 'TypeScript Tipps für Angular Entwickler',
    content: 'TypeScript macht Angular-Entwicklung sicherer und produktiver. Hier sind fortgeschrittene TypeScript-Techniken speziell für Angular-Projekte.',
    author: 'Mehmet Oezdag',
    publishDate: '2023-12-28',
    category: 'TypeScript',
    tags: ['TypeScript', 'Angular', 'Development'],
    featured: false,
    imageUrl: 'https://picsum.photos/400/250?random=4'
  },
  {
    id: 5,
    title: 'Angular Material - UI Components richtig einsetzen',
    content: 'Angular Material bietet eine umfangreiche Komponentenbibliothek. Diese Anleitung zeigt, wie Sie Material Design effektiv in Ihren Angular-Apps nutzen.',
    author: 'Mehmet Oezdag',
    publishDate: '2023-12-20',
    category: 'Angular',
    tags: ['Angular Material', 'UI', 'Components'],
    featured: false,
    imageUrl: 'https://picsum.photos/400/250?random=5'
  }
];

// API Endpoints
app.get('/api/posts', (req, res) => {
  const { category, featured } = req.query;
  
  let filteredPosts = blogPosts;
  
  if (category) {
    filteredPosts = filteredPosts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (featured !== undefined) {
    filteredPosts = filteredPosts.filter(post => 
      post.featured === (featured === 'true')
    );
  }
  
  res.json(filteredPosts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = blogPosts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(blogPosts.map(post => post.category))];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Backend Server läuft auf http://localhost:${PORT}`);
  console.log(`API verfügbar unter:`);
  console.log(`  - GET /api/posts - Alle Blog-Posts`);
  console.log(`  - GET /api/posts/:id - Einzelner Post`);
  console.log(`  - GET /api/categories - Verfügbare Kategorien`);
}); 