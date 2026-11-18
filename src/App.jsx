
import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import recipes from './recipes';
import RecipeDetails from './pages/RecipeDetails';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Indian Breakfast',
    'Indian Meals',
    'Healthy Food',
    'International',
    'Snacks',
    'Desserts'
  ];

  const categoryCards = [
    ['🍳', 'Indian Breakfast'],
    ['🍛', 'Indian Meals'],
    ['🥗', 'Healthy Food'],
    ['🍝', 'International'],
    ['🥟', 'Snacks'],
    ['🍰', 'Desserts']
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const search = searchTerm.toLowerCase();

    const matchesSearch = [
      recipe.name,
      recipe.category,
      recipe.cuisine,
      recipe.description
    ].some(value => value.toLowerCase().includes(search));

    const matchesCategory =
      activeCategory === 'All' ||
      recipe.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const selectCategory = category => {
    setActiveCategory(category);
    setSearchTerm('');

    setTimeout(() => {
      document.getElementById('recipe-list')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  };

  return (
    <div className="website">
      <header className="navbar">
        <Link className="logo" to="/" aria-label="Tasty Plate homepage">
          Tasty<span>Plate.</span>
        </Link>

        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#recipes">Categories</a>
          <a href="#indian">Recipes</a>
          <a href="#international">International</a>
          <a href="#about">About</a>
        </nav>

        <a className="search-btn" href="#recipe-search">
          Find Recipes ⌕
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">GOOD FOOD, GOOD MOOD</span>

            <h1>
              Easy Indian &amp; International
              <span> Recipes for Every Kitchen.</span>
            </h1>

            <p>
              Discover delicious Indian and international recipes,
              simple cooking instructions and inspiring food ideas
              for your everyday meals.
            </p>

            <a href="#recipes" className="primary-btn">
              Explore Recipes →
            </a>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000"
              alt="Fresh colourful food bowl with vegetables and healthy ingredients"
              width="1000"
              height="700"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </section>

        <section className="categories" id="recipes">
          <div className="section-heading">
            <span className="eyebrow">EXPLORE BY CATEGORY</span>
            <h2>Find Recipes by Food Category</h2>
            <p>
              Browse breakfast, Indian meals, healthy dishes,
              international food, snacks and desserts.
            </p>
          </div>

          <div className="category-grid">
            {categoryCards.map(([icon, name]) => (
              <button
                className="category-card"
                key={name}
                onClick={() => selectCategory(name)}
                aria-label={`Explore ${name} recipes`}
              >
                <span>{icon}</span>
                <h3>{name}</h3>
              </button>
            ))}
          </div>
        </section>

        <section className="featured" id="indian">
          <div className="section-heading">
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Easy Indian and International Recipes</h2>
            <p>
              Discover step-by-step cooking ideas for delicious
              homemade meals.
            </p>
          </div>

          <input
            id="recipe-search"
            className="recipe-search"
            type="search"
            placeholder="Search recipes, cuisines or categories..."
            aria-label="Search recipes"
            value={searchTerm}
            onChange={event => {
              setSearchTerm(event.target.value);
              setActiveCategory('All');
            }}
          />

          <div className="filter-list" aria-label="Filter recipes">
            {categories.map(category => (
              <button
                key={category}
                className={
                  activeCategory === category ? 'filter-active' : ''
                }
                aria-pressed={activeCategory === category}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchTerm('');
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="recipe-grid" id="recipe-list">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <article className="recipe-card" key={recipe.id}>
                  <img
                    src={recipe.image}
                    alt={`${recipe.name}, ${recipe.cuisine} recipe`}
                    width="800"
                    height="550"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="recipe-info">
                    <span>{recipe.category.toUpperCase()}</span>
                    <h3>{recipe.name}</h3>

                    <p>
                      {recipe.time} · {recipe.difficulty}
                    </p>

                    <Link to={`/recipe/${recipe.id}`}>
                      View {recipe.name} Recipe →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="no-results">
                No recipes found. Try another search or category.
              </p>
            )}
          </div>
        </section>

        <section className="international" id="international">
          <span className="eyebrow">FROM AROUND THE WORLD</span>

          <h2>Explore International Food and Flavours</h2>

          <p>
            Discover inspiring dishes and cooking ideas from
            different cuisines around the world.
          </p>

          <a href="#recipes" className="primary-btn">
            Explore More →
          </a>
        </section>
      </main>

      <footer id="about">
        <Link className="logo" to="/">
          Tasty<span>Plate.</span>
        </Link>

        <p>Discover. Cook. Enjoy.</p>
        <p>Easy Indian and international recipes for food lovers.</p>
        <p>© 2026 Tasty Plate. All rights reserved.</p>
      </footer>
    </div>
  );
}

function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | Tasty Plate';

    let robots = document.querySelector('meta[name="robots"]');

    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }

    robots.content = 'noindex, follow';

    return () => {
      robots.content = 'index, follow';
      document.title = 'Tasty Plate | Easy Indian & International Recipes';
    };
  }, []);

  return (
    <main className="recipe-detail">
      <h1>404 - Page Not Found</h1>
      <p>
        Sorry, we couldn't find the page you were looking for.
        It may have moved or the address may be incorrect.
      </p>
      <Link to="/" className="back-link">
        ← Return to Tasty Plate
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
