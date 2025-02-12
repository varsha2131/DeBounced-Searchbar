import React, { useState, useEffect } from "react";
import './RecipeSearch.css'; // Import the CSS file

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Suggestions for search results
  const [allRecipes, setAllRecipes] = useState([]); // State to hold all recipes
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State to hold the selected recipe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all recipes when the component mounts
  useEffect(() => {
    const fetchAllRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("https://dummyjson.com/recipes");
        const data = await response.json();
        setAllRecipes(data.recipes || []);
      } catch (err) {
        setError("Failed to fetch all recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  // Handle search and show suggestions
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setSelectedRecipe(null); // Reset the selected recipe when query is cleared
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchRecipes(query);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Fetch recipe data based on search query
  const fetchRecipes = async (searchTerm) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://dummyjson.com/recipes/search?q=${searchTerm}`
      );
      const data = await response.json();

      if (data.recipes && data.recipes.length > 0) {
        setSuggestions(data.recipes.slice(0, 5)); // Limit to 5 suggestions
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setError("Failed to fetch recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setQuery(recipe.name); // Set query to the name of the selected recipe
    setSelectedRecipe(recipe); // Set selected recipe to display details
    setSuggestions([]); // Clear the suggestions
  };

  // Render a dynamic list of details based on available fields
  const renderRecipeDetails = (recipe) => {
    return (
      <div className="recipeDetails">
        <h3>{recipe.name}</h3>
        <img
          src={recipe.image}
          alt={recipe.name}
          className="recipe-detail-image"
        />
        <h4>Ingredients:</h4>
        <ul className="ingredients-list">
          {recipe.ingredients?.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                {ingredient}
              </li>
            ))
          ) : (
            <p>No ingredients listed.</p>
          )}
        </ul>

        <h4>Instructions:</h4>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ul className="instructions-list">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="instruction-item">
                {instruction}
              </li>
            ))}
          </ul>
        ) : (
          <p>No instructions provided.</p>
        )}

        {/* New fields added dynamically */}
        {recipe.prepTimeMinutes && (
          <div>
            <h4>Preparation Time:</h4>
            <p>{recipe.prepTimeMinutes} minutes</p>
          </div>
        )}

        {recipe.cookTimeMinutes && (
          <div>
            <h4>Cooking Time:</h4>
            <p>{recipe.cookTimeMinutes} minutes</p>
          </div>
        )}

        {recipe.servings && (
          <div>
            <h4>Servings:</h4>
            <p>{recipe.servings}</p>
          </div>
        )}

        {recipe.difficulty && (
          <div>
            <h4>Difficulty:</h4>
            <p>{recipe.difficulty}</p>
          </div>
        )}

        {recipe.cuisine && (
          <div>
            <h4>Cuisine:</h4>
            <p>{recipe.cuisine}</p>
          </div>
        )}

        {recipe.caloriesPerServing && (
          <div>
            <h4>Calories Per Serving:</h4>
            <p>{recipe.caloriesPerServing} kcal</p>
          </div>
        )}

        {recipe.tags && recipe.tags.length > 0 && (
          <div>
            <h4>Tags:</h4>
            <ul className="tags-list">
              {recipe.tags.map((tag, index) => (
                <li key={index} className="tag-item">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.rating && (
          <div>
            <h4>Rating:</h4>
            <p>{recipe.rating} / 5</p>
          </div>
        )}

        {recipe.reviewCount && (
          <div>
            <h4>Reviews:</h4>
            <p>{recipe.reviewCount} reviews</p>
          </div>
        )}

        {recipe.mealType && recipe.mealType.length > 0 && (
          <div>
            <h4>Meal Type:</h4>
            <ul className="meal-type-list">
              {recipe.mealType.map((meal, index) => (
                <li key={index} className="meal-type-item">
                  {meal}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Optional: Display howToCook if it exists in the recipe data */}
        {recipe.howToCook && (
          <div>
            <h4>How to Cook:</h4>
            <p>{recipe.howToCook}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="header">Recipe Search</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a recipe..."
        className="input"
      />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Display search suggestions below the search bar */}
      {query && suggestions.length > 0 && (
        <ul className="suggestionsList">
          {suggestions.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => handleSelectRecipe(recipe)} // Click handler for suggestion
              className="suggestionItem"
            >
              {recipe.name}
            </li>
          ))}
        </ul>
      )}

      {/* If a recipe is selected, show its details */}
      {selectedRecipe ? (
        renderRecipeDetails(selectedRecipe)
      ) : (
        // Display all recipes if no recipe is selected
        <div className="all-recipes">
          {query === "" && (
            <h3>All Recipes</h3> // Only show "All Recipes" heading when query is empty
          )}
          <div className="recipes-grid">
            {allRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card"
                onClick={() => handleSelectRecipe(recipe)} // Click handler for selecting recipe
              >
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                <h4>{recipe.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
