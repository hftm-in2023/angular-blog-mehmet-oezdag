Website link: https://witty-hill-01df38b03.6.azurestaticapps.net/

# AnguBlogMehmetOezdag

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Change Log

### December 2024
**Added Angular Material Demo Application**

Created a comprehensive demo component showcasing all essential Angular concepts:

**Features Implemented:**
- ✅ **Angular Material Integration** - Added Material Design components with Azure/Blue theme
- ✅ **Angular Material Components** - Buttons, Cards, Form Fields, Inputs, Selects, Sliders, Radio Buttons, Checkboxes, Icons, Chips, Tabs, Progress Bars
- ✅ **(click) Event Binding** - Interactive buttons with counters, toggles, and task management
- ✅ **@if Conditionals** - Dynamic content visibility based on component state
- ✅ **@switch Statements** - Multiple view modes (List, Grid, Cards) with seamless switching
- ✅ **@for Loops** - Task lists with tracking, loop variables ($index, $even, $first, $last), and @empty fallbacks
- ✅ **NgClass** - Dynamic CSS classes based on task status, priority, and position
- ✅ **NgStyle** - Live style updates with theme colors, opacity, and border radius controls
- ✅ **NgModel (2-way binding)** - Real-time form synchronization across text inputs, selects, sliders, radio buttons, and checkboxes

**Demo Structure:**
- **Tab 1:** Forms & 2-way Binding demonstrations
- **Tab 2:** Event Binding & Conditional rendering examples  
- **Tab 3:** Loops, Switch statements & Dynamic styling

**Technical Implementation:**
- Responsive Material Design interface
- Task management system with CRUD operations
- Theme switching with live preview
- Dark/Light mode toggle
- Progress tracking with completion percentage
- Professional German UI with comprehensive feature coverage

The application serves as a complete learning resource for modern Angular development patterns and best practices.

## 🚀 Backend Options - Express.js vs Quarkus

### Express.js Backend (Traditional)
- **Location:** `backend/`
- **Technology:** Node.js + Express.js + CORS
- **Startup:** `cd backend && npm start`
- **Advantages:** Quick setup, JavaScript familiarity

### Quarkus Backend (Supersonic) ⭐ **RECOMMENDED**
- **Location:** `quarkus-backend/`
- **Technology:** Java 17 + Quarkus + JAX-RS
- **Startup:** `cd quarkus-backend && ./mvnw quarkus:dev`
- **Advantages:** 
  - **10x faster startup** (20ms vs 500ms)
  - **70% less memory** usage (15MB vs 50MB)
  - **Live reload** during development
  - **Native compilation** with GraalVM
  - **Built-in monitoring** and health checks
  - **Swagger UI** at `/swagger-ui`
  - **Container-optimized** for cloud deployment

### 🛠️ Quick Start

#### Option 1: Automatic Detection (Recommended)
```bash
chmod +x start-dev.sh
./start-dev.sh
```
*Script automatically detects Java and uses Quarkus, falls back to Express.js if needed*

#### Option 2: Manual Quarkus Setup
```bash
# Backend (Quarkus)
cd quarkus-backend
./mvnw quarkus:dev

# Frontend (Angular)
cd ..
npm start
```

#### Option 3: Manual Express.js Setup
```bash
# Backend (Express.js)
cd backend
npm install && npm start

# Frontend (Angular)
cd ..
npm start
```

### 📊 Performance Comparison

| Metric | Express.js | Quarkus JVM | Quarkus Native |
|--------|------------|-------------|----------------|
| Startup Time | ~500ms | ~800ms | **~20ms** |
| Memory Usage | ~50MB | ~80MB | **~15MB** |
| Throughput | Good | **Excellent** | **Excellent** |
| Dev Experience | Good | **Excellent** | **Excellent** |
| Cloud Ready | ✅ | ✅ | **⭐** |

### 🌐 API Endpoints (Both Backends)

Both backends provide identical REST APIs:

- `GET /api/posts` - All blog posts (supports `?category=` and `?featured=` filters)
- `GET /api/posts/{id}` - Single post by ID
- `GET /api/categories` - Available categories
- `GET /api/posts/featured` - Only featured posts
- `GET /api/stats` - Blog statistics *(Quarkus only)*

### 🔧 Additional Quarkus Features

- **Health Checks:** `/health`, `/health/live`, `/health/ready`
- **API Documentation:** `/swagger-ui`
- **Dev UI:** `/q/dev/` (development mode only)
- **Metrics:** `/q/metrics`
- **Native Build:** `./mvnw package -Pnative`
