
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import recipes from '../recipes';
import './RecipeDetails.css';

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
    const seoTitle = `${recipe.name} - Easy ${recipe.cuisine} Recipe | Tasty Plate`;

    document.title = seoTitle;

    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }

      element.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', 'content', recipe.description);
    setMeta('meta[name="robots"]', 'content', 'index, follow');

    setMeta('meta[property="og:type"]', 'content', 'article');
    setMeta('meta[property="og:title"]', 'content', seoTitle);
    setMeta('meta[property="og:description"]', 'content', recipe.description);
    setMeta('meta[property="og:image"]', 'content', recipe.image);
    setMeta('meta[property="og:url"]', 'content', pageUrl);

    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', seoTitle);
    setMeta('meta[name="twitter:description"]', 'content', recipe.description);
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
      description: recipe.description,
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

    const addSchema = (id, data) => {
      let script = document.getElementById(id);

      if (!script) {
        script = document.createElement('script');
        script.id = id;
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
      canonical?.remove();

      document.title = 'Tasty Plate | Easy Indian & International Recipes';
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
