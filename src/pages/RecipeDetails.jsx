
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import recipes from '../recipes';
import './RecipeDetails.css';

const homepageTitle = 'Tasty Plate | Easy Indian & International Recipes';

const homepageDescription =
  'Discover easy Indian recipes, South Indian breakfast ideas, delicious snacks, healthy meals and international dishes. Find ingredients and step-by-step cooking instructions at Tasty Plate.';

const seoContent = {
  'masala-dosa': {
    title: 'Masala Dosa | Easy South Indian Recipe - Tasty Plate',
    description:
      'Make crispy South Indian masala dosa with a flavourful spiced potato filling. Follow this easy recipe and serve with coconut chutney and sambar.'
  },
  'creamy-pasta': {
    title: 'Creamy Italian Pasta Recipe | Tasty Plate',
    description:
      'Make creamy Italian pasta at home with garlic, milk, butter, cheese and herbs. Follow this easy pasta recipe for a delicious lunch or dinner.'
  },
  'vegetable-salad': {
    title: 'Fresh Vegetable Salad Recipe | Tasty Plate',
    description:
      'Prepare a fresh vegetable salad with cucumber, tomatoes, carrot and lettuce. Try this quick 15-minute salad with a simple lemon dressing.'
  },
  'paneer-butter-masala': {
    title: 'Paneer Butter Masala Recipe | Tasty Plate',
    description:
      'Make restaurant-style paneer butter masala with soft paneer cubes in rich tomato gravy. Enjoy this North Indian curry with naan, roti or rice.'
  },
  'vegetable-samosa': {
    title: 'Crispy Vegetable Samosa Recipe | Tasty Plate',
    description:
      'Learn how to make crispy Indian vegetable samosas filled with spiced potatoes and green peas. Follow these step-by-step cooking instructions.'
  },
  'chocolate-cake': {
    title: 'Homemade Chocolate Cake Recipe | Tasty Plate',
    description:
      'Bake a soft and rich homemade chocolate cake with cocoa powder, flour, eggs and milk. Follow this easy recipe for a delicious homemade dessert.'
  }
};

function RecipeDetails() {
  const { id } = useParams();
  const recipe = recipes.find(item => item.id === id);

  const relatedRecipes = recipe
    ? recipes.filter(item =>
        item.id !== recipe.id &&
        (item.category === recipe.category ||
          item.cuisine === recipe.cuisine)
      ).slice(0, 3)
    : [];

  useEffect(() => {
    if (!recipe) return;

    const siteUrl = window.location.origin;
    const pageUrl = `${siteUrl}/recipe/${recipe.id}`;

    const seo = seoContent[recipe.id] || {
      title: `${recipe.name} Recipe | Tasty Plate`,
      description: recipe.description
    };

    const seoTitle = seo.title;
    const seoDescription = seo.description;

    document.title = seoTitle;

    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }

      element.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', 'content', seoDescription);
    setMeta('meta[name="robots"]', 'content', 'index, follow');

    setMeta('meta[property="og:type"]', 'content', 'article');
    setMeta('meta[property="og:title"]', 'content', seoTitle);
    setMeta('meta[property="og:description"]', 'content', seoDescription);
    setMeta('meta[property="og:image"]', 'content', recipe.image);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:site_name"]', 'content', 'Tasty Plate');

    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', seoTitle);
    setMeta('meta[name="twitter:description"]', 'content', seoDescription);
    setMeta('meta[name="twitter:image"]', 'content', recipe.image);

    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    canonical.href = pageUrl;

    const toISOTime = value => {
      const minutes = parseInt(value, 10) || 0;
      return `PT${minutes}M`;
    };

    const recipeSchema = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.name,
      description: seoDescription,
      image: [recipe.image],
      author: {
        '@type': 'Organization',
        name: 'Tasty Plate'
      },
      mainEntityOfPage: pageUrl,
      recipeCategory: recipe.category,
      recipeCuisine: recipe.cuisine,
      recipeYield: recipe.servings,
      prepTime: toISOTime(recipe.prepTime),
      cookTime: toISOTime(recipe.cookTime),
      totalTime: toISOTime(recipe.time),
      recipeIngredient: recipe.ingredients,
      recipeInstructions: recipe.instructions.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        text: step
      }))
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: recipe.category,
          item: `${siteUrl}/#recipes`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: recipe.name,
          item: pageUrl
        }
      ]
    };

    const addSchema = (schemaId, data) => {
      let script = document.getElementById(schemaId);

      if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(data);
    };

    addSchema('recipe-schema', recipeSchema);
    addSchema('breadcrumb-schema', breadcrumbSchema);

    return () => {
      document.getElementById('recipe-schema')?.remove();
      document.getElementById('breadcrumb-schema')?.remove();

      document.title = homepageTitle;

      setMeta('meta[name="description"]', 'content', homepageDescription);
      setMeta('meta[name="robots"]', 'content', 'index, follow');

      setMeta('meta[property="og:type"]', 'content', 'website');
      setMeta('meta[property="og:title"]', 'content', homepageTitle);
      setMeta('meta[property="og:description"]', 'content', homepageDescription);
      setMeta(
        'meta[property="og:url"]',
        'content',
        `${siteUrl}/`
      );

      setMeta(
        'meta[name="twitter:title"]',
        'content',
        homepageTitle
      );
      setMeta(
        'meta[name="twitter:description"]',
        'content',
        homepageDescription
      );

      if (canonical) {
        canonical.href = `${siteUrl}/`;
      }
    };
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <h2>Recipe not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <main className="recipe-detail">
      <nav aria-label="Breadcrumb" className="recipe-breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to="/#recipes">{recipe.category}</Link>
        <span> / </span>
        <span aria-current="page">{recipe.name}</span>
      </nav>

      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <img src={recipe.image} alt={recipe.name} />

      <span>{recipe.category} | {recipe.cuisine}</span>

      <h1>{recipe.name}</h1>

      <p>{recipe.description}</p>

      <div className="recipe-meta">
        <p>⏱ Total time: {recipe.time}</p>
        <p>🥣 Preparation: {recipe.prepTime}</p>
        <p>🍳 Cooking: {recipe.cookTime}</p>
        <p>🍽 Servings: {recipe.servings}</p>
        <p>Difficulty: {recipe.difficulty}</p>
      </div>

      <h2>Ingredients</h2>

      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2>Preparation Instructions</h2>

      <ol>
        {recipe.instructions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>

      {relatedRecipes.length > 0 && (
        <section className="related-recipes">
          <h2>Related Recipes You May Enjoy</h2>

          <div className="recipe-grid">
            {relatedRecipes.map(item => (
              <article className="recipe-card" key={item.id}>
                <img
                  src={item.image}
                  alt={`${item.name} recipe`}
                  loading="lazy"
                />

                <div className="recipe-info">
                  <span>{item.category.toUpperCase()}</span>
                  <h3>{item.name}</h3>
                  <p>{item.time} · {item.difficulty}</p>

                  <Link to={`/recipe/${item.id}`}>
                    View Recipe →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <Link to="/" className="back-link">
        ← Explore More Recipes
      </Link>
    </main>
  );
}

export default RecipeDetails;
