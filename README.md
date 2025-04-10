# Web Development Project 6 - *CineScope*

Submitted by: **Ruhi Sawant**

This web app: **CineScope is a movie and TV show dashboard app that fetches data from TMDB, visualizes insights with interactive charts, and allows users to explore detailed views of movies, shows, and popular people in the industry.**

Time spent: **26 hours spent in total**

## Required Features

The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking on a movie, TV show, or person in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information like description, release date, ratings, and more
  - The same sidebar is displayed in detail view as in dashboard view
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
- [x] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  - e.g., `/movies/1234`, `/tv-shows/5678`, etc.
  - *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*
- [x] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - Average ratings over time (line chart)
  - Movie/TV popularity trends (bar chart or area chart)

## Optional Features

The following **optional** features are implemented:

- [x] The site’s customized dashboard contains more content that explains what is interesting about the data 
  - Includes titles, interactive tooltips, and hover effects to help interpret chart data
- [x] The site allows users to toggle between different data visualizations
  - Filter and sort functionalities allow users to customize what data they view

## Additional Features

* [x] Responsive sidebar with toggle functionality and route-based active state indication
* [x] Accessible design with ARIA labels for menu toggle
* [x] Integration with TMDB API to dynamically fetch up-to-date data
* [x] Uses `lucide-react` icons for a clean and modern UI

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='/src/assets/walkthrough2.gif' title='Video Walkthrough 2' width='100%' alt='Video Walkthrough 2' />

GIF created with [AdobeExpress](https://www.adobe.com/express/feature/video/convert/mov-to-gif)

## Notes

Describe any challenges encountered while building the app:

- Understanding how to structure routes for detail views while keeping the sidebar layout consistent
- Dynamically filtering data for chart displays
- Ensuring responsiveness for smaller screen sizes using `window.innerWidth` and toggle logic

## License

    Copyright 2025 Ruhi Sawant

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.