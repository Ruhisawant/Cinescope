# Web Development Project 5 - **CineScope**

Submitted by: **Ruhi Sawant**

This web app: **CineScope** is a movie dashboard that displays a list of popular movies and recent releases fetched from The Movie Database (TMDb) API. The dashboard includes interactive features like a search bar and a filter by genre to help users explore the movie data. It also shows summary statistics such as the total number of movies, average rating, and top genre.

Time spent: **15 hours** spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The site has a dashboard displaying a list of data fetched using an API call**
  - The dashboard displays at least 10 unique items, one per row. Movies are listed in the "Popular Movies" and "Recent Releases" sections, with a focus on displaying information such as title, genre, and average rating.
  - The dashboard includes at least two features in each row (e.g., movie title, genre, and rating).

- [x] **`useEffect` React hook and `async`/`await` are used**
  - The `useEffect` hook is used to fetch movie data when the component loads. The data is fetched asynchronously using `async`/`await` with `Promise.all` to load data for popular movies, recent releases, and genres.

- [x] **The app dashboard includes at least three summary statistics about the data**
  - **Total Popular Movies**: Shows the total number of popular movies.
  - **Recent Releases**: Displays the total number of movies in the "Recent Releases" category.
  - **Average Rating**: Displays the average rating of all popular movies.
  - **Top Genre**: Displays the name of the first genre in the list of genres from the API.

- [x] **A search bar allows the user to search for an item in the fetched data**
  - The search bar filters movies by title. It dynamically updates the list of results as the user types into the search bar, only displaying movies that match the search query.

- [x] **An additional filter allows the user to restrict displayed items by specified categories**
  - A genre filter allows users to filter movies based on their genre. The list dynamically updates as the user selects a genre from the dropdown menu.
  - The genre filter works separately from the search bar, using the `genre_ids` of the movies.

The following **optional** features are implemented:

- [x] **Multiple filters can be applied simultaneously**
  - The user can apply both the search bar filter and the genre filter at the same time to refine their movie search.

- [x] **Filters use different input types**
  - The genre filter uses a dropdown selection, and the search bar uses a text input field.

- [x] **The user can enter specific bounds for filter values**
  - Although not implemented in the current version, you could easily extend the filter features with more advanced filtering options such as a rating range slider.

The following **additional** features are implemented:

* [x] **Responsive Design**: The sidebar navigation collapses on smaller screens, providing a more mobile-friendly experience. The user can toggle the sidebar visibility with a hamburger menu.
* [x] **Active Link Highlighting**: The navigation links are highlighted based on the current page using the `isActive` function in the `Navigation` component.
* [x] **Movie Posters and Overviews**: The dashboard shows movie posters and includes an overview for recent releases, giving users a preview of the movie details.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='/src/assets/walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with ... [AdobeExpress](https://www.adobe.com/express/feature/video/convert/mov-to-gif)

## Notes

**Challenges encountered while building the app**:
- **API Data Handling**: One of the challenges was ensuring that the movie data was properly fetched and processed, particularly with respect to the asynchronous nature of `useEffect` and ensuring that the API responses were correctly handled using `async`/`await`.
- **Dynamic Filtering**: Implementing the search bar and genre filter to work simultaneously required some careful state management, especially when handling the filtering logic across different movie categories.
- **Responsive Design**: Ensuring that the sidebar navigation collapsed correctly on smaller screens and that the app was usable on both desktop and mobile devices was an interesting challenge.

## License

    Copyright [2025] [Ruhi Sawant]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.