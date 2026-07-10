# Soko Africa - Authentic African Products Marketplace

Soko Africa is a modern, scalable e-commerce platform that bridges the gap between African artisans, producers, and global customers. Built with Next.js 15, React 19, and Tailwind CSS.

## Features

### Core Platform
- **Modern Tech Stack**: Next.js 15 with React 19, Tailwind CSS 4
- **Component-Based Architecture**: Reusable, maintainable components
- **Responsive Design**: Mobile-first, works on all devices
- **Performance Optimized**: Image optimization, lazy loading, code splitting
- **SEO Ready**: Optimized metadata, structured data

### Security & Performance
- **Security Headers**: CSP, XSS protection, content type validation
- **Input Validation**: Client-side and server-side validation
- **Image Optimization**: WebP/AVIF formats, multiple sizes
- **Code Splitting**: Optimized bundle sizes
- **Compression**: Gzip compression enabled

### E-commerce Features
- **Product Catalog**: Browse by categories, search, filters
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite products
- **User Accounts**: Customer and seller accounts
- **Seller Portal**: Multi-vendor marketplace support
- **Global Shipping**: International delivery support

### African Focus
- **Cultural Authenticity**: Celebrating African heritage
- **Artisan Support**: Direct connection with African producers
- **Fair Trade**: Supporting sustainable practices
- **Global Reach**: Bringing African products worldwide

## Architecture

### Component Structure
```
app/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── CategoryCard.jsx
│   └── sections/           # Page sections
│       ├── HeroSection.jsx
│       ├── CategoriesSection.jsx
│       ├── SeasonalPicksSection.jsx
│       ├── FeaturedProductsSection.jsx
│       ├── TestimonialsSection.jsx
│       └── WhyChooseUsSection.jsx
├── hooks/                  # Custom React hooks
│   ├── useCart.js
│   └── useWishlist.js
├── lib/                    # Utilities and constants
│   ├── utils.js
│   └── constants.js
├── about/                  # About page
│   └── page.jsx
├── categories/             # Categories page
│   └── page.jsx
├── nyamazone/              # Nyamazone page
│   └── page.jsx
├── sell/                   # Seller portal
│   └── page.jsx
├── layout.jsx              # Root layout
└── page.jsx                # Homepage
```

### File Naming Conventions
- **`.jsx`**: React components and pages containing JSX
- **`.js`**: Pure JavaScript utility files, hooks, constants
- **`.css`**: Styling files

### Key Technologies
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: Custom hooks with localStorage
- **Image Optimization**: Next.js Image component
- **Security**: Custom security headers, input validation

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/soko-africa.git
   cd soko-africa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Install dependencies
pnpm install

# Update dependencies
pnpm update

# Add new dependency
pnpm add <package-name>

# Add development dependency
pnpm add -D <package-name>
```

## Dependencies

### Production Dependencies
- `next`: ^15.4.6 - React framework
- `react`: ^19.1.0 - JavaScript library for building user interfaces
- `react-dom`: ^19.1.0 - React DOM bindings
- `lucide-react`: ^0.539.0 - Beautiful icon library
- `clsx`: ^2.1.1 - Utility for constructing className strings
- `@tailwindcss/typography`: ^0.5.16 - Typography plugin for Tailwind CSS

### Development Dependencies
- `tailwindcss`: ^4 - Utility-first CSS framework
- `eslint`: ^9 - JavaScript linter
- `eslint-config-next`: ^15.4.6 - ESLint configuration for Next.js

## Design System

### Colors
- **Primary**: Orange (#EA580C) - Warm, energetic, African sunset
- **Secondary**: Green (#16A34A) - Nature, growth, prosperity
- **Accent**: Yellow (#EAB308) - Gold, value, premium
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible

### Components
- **Consistent spacing**: Using Tailwind's spacing scale
- **Hover effects**: Smooth transitions for better UX
- **Responsive design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation

## Security Features

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy: Strict CSP rules
- Referrer-Policy: strict-origin-when-cross-origin

### Input Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- XSS protection through input sanitization
- Email and phone number validation

### Data Protection
- No sensitive data in localStorage
- Secure session management (when implemented)
- HTTPS enforcement in production

## Global Features

### Internationalization Ready
- Multi-currency support structure
- Shipping zone configuration
- Country-specific features

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## E-commerce Features

### Shopping Cart
- Add/remove products
- Quantity management
- Persistent storage
- Real-time updates

### Wishlist
- Save favorite products
- Easy cart conversion
- Persistent storage

### Product Catalog
- Category browsing
- Search functionality
- Product filtering
- Responsive grid layout

### Seller Portal
- Seller registration
- Business verification
- Product management (planned)
- Analytics dashboard (planned)

## Performance Optimizations

### Image Optimization
- Next.js Image component
- WebP/AVIF format support
- Responsive images
- Lazy loading

### Code Optimization
- Tree shaking
- Code splitting
- Bundle size optimization
- Server-side rendering

### Caching
- Static asset caching
- Image caching
- Component-level optimization

## Mobile Experience

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized navigation
- Fast loading times

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced experience with JavaScript
- Offline capabilities (planned)

## State Management

### Custom Hooks
- `useCart`: Shopping cart management
- `useWishlist`: Wishlist functionality
- Local storage integration
- Error handling

### Data Flow
- Unidirectional data flow
- Component isolation
- Predictable state updates
- Performance optimized

## Development

### Code Quality
- ESLint configuration
- Consistent formatting
- Component documentation
- Type safety (planned)

### Project Structure
- Clear separation of concerns
- Reusable components
- Maintainable codebase
- Scalable architecture

## Future Enhancements

### Planned Features
- User authentication system
- Payment processing integration
- Order management system
- Seller dashboard
- Admin panel
- Mobile app (React Native)
- Multi-language support
- Advanced analytics
- AI-powered recommendations
- Blockchain integration for authenticity

### Technical Improvements
- TypeScript migration
- Test suite (Jest, Cypress)
- CI/CD pipeline
- Database integration
- API development
- Real-time features
- PWA capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- African artisans and entrepreneurs who inspire this platform
- Open source community for amazing tools and libraries
- Contributors and supporters of the project

## Support

- Email: support@sokoafrica.com
- Phone: +254 700 123 456
- Website: https://sokoafrica.com

---

**Soko Africa** - Connecting Africa's finest products with the world