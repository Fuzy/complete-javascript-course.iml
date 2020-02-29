// Global app controller
import Search from './model/Search';
import * as SearchView from './views/searchView';
import {elements, renderLoader, clearLoader} from "./views/base";
import Recipe from "./model/Recipe";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = SearchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        SearchView.clearInput();
        SearchView.clearResults();
        renderLoader(elements.searchRes);

        // 4) Search for recipes
        await state.search.getResults();
        clearLoader();
        SearchView.renderResults(state.search.result);

    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResults();
        SearchView.renderResults(state.search.result, goToPage);
    }
});

const controlRecipe = async () => {

    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            console.log(state.recipe);
            console.log(state.recipe.ingredients);
        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

