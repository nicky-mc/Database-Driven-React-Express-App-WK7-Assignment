# Database Driven React & Express App

## User Stories

- **Fast and Responsive App**: Ensured the app is fast and responsive. ✅

- **Read and Add Posts**: Users can read and add posts. ✅

- **Simple and Intuitive Form**: Created a simple and intuitive form for creating new posts. ✅

- **View Multiple Pages**: Implemented multiple pages for easy navigation. ✅

- **Database Schema and Seeding**: Built a database schema and seeded it with realistic data. ✅

- **View All Posts**: Users can view all posts within the database. ✅

- **Display Posts Using .map()**: Used `.map()` to efficiently display fetched data. ✅

## Requirements

- **Create a Client Using React**: Built the client using React. ✅

- **Use Express for Server**: Created the server using Express with GET and POST endpoints. ✅

- **Build a React Form**: Built a React form for users to create posts. ✅

- **Multiple Pages Using React Router**: Created multiple pages using React Router. ✅

- **Design Database Schema and Seed Data**: Designed a database schema and seeded it with realistic data. ✅

- **Use SQL to Retrieve Posts**: Used SQL to retrieve posts from the database in the Express server. ✅

- **Display Posts Using .map()**: Displayed all posts using `.map()`. ✅

## Stretch Goals

- **Dynamic Pages**: Created dynamic pages using `react-router-dom`. ✅

- **Explore Posts by Category**: Implemented dedicated routes for categories. ✅

- **Delete Posts**: Allowed users to delete their posts. ✅

- **Like Posts**: Added functionality to like posts. ✅

- **Filter Posts**: Created additional SQL queries to filter posts based on different criteria. ✅

## Additional Features

- **Theme Selector**: Implemented a theme selector to switch between light and dark modes.

- **Photo Uploads**: Added functionality for users to upload photos with their posts.

### Backend Development

Starting with the backend, I set up a server using Node.js and Express. This involved creating RESTful API endpoints to handle CRUD operations for posts and comments. One of the most challenging aspects was implementing user authentication and authorization. Despite my efforts, I was unable to fully implement a robust login system. This failure highlighted the complexity of secure authentication and the importance of understanding security best practices. I plan to revisit this topic in the future to ensure that I can implement secure login functionality in my applications.

Integrating the database was another crucial part of the backend development. I used PostgreSQL for this project, and it was my first time working with this relational database. Learning how to design the database schema, handle relationships between tables, and perform efficient queries was both challenging and rewarding. I now have a better understanding of how to manage data in a relational database and the trade-offs compared to NoSQL databases.

### Frontend Development with React

On the frontend, using React was a new and exciting challenge. One of the key components I worked on was the `PostDetail.jsx` file, which fetches and displays post details along with comments. Ensuring that this component was responsive and user-friendly required careful attention to CSS and layout design. I learned how to use flexbox and media queries to create a responsive design that looks good on both desktop and mobile screens.

Revising the search functionality was another significant task. Initially, the search results were not selectable, and users could not navigate to the detailed view of a post. By updating the `SearchResults.jsx` component, I was able to make the search results in a simple way by searching for any words in the post, tag, or category. Future updates will include adding a post author name to improve search, a dropdown to select categories, or a navigation.

### Theme Selector

One of the features I implemented was a theme selector, allowing users to switch between light and dark modes. This was achieved by maintaining a `theme` state in the `App.jsx` file and passing it down as a prop to various components, including `Home.jsx`, `CreatePost.jsx`, and `Navigation.jsx`. The theme state was toggled using a button in the `Navigation.jsx` component, which called a function to switch between light and dark modes. The selected theme was then applied to the body element and various components using CSS classes.

### Photo Uploads

Implementing photo uploads was another significant feature. In the `CreatePost.jsx` component, I used the `multer` middleware on the backend to handle file uploads. The frontend form included a file input element, and the selected image file was appended to a `FormData` object along with other post details. This form data was then sent to the server via a POST request. The server saved the uploaded image to a designated directory and stored the image URL in the database. This allowed users to upload and display images with their posts.

### CSS and Styling

Styling the application was a crucial part of the frontend development. I used CSS variables to maintain consistency across the styles and ensure that the application supports both light and dark modes. This involved defining colors, transition speeds, and other properties in one place, making the code more maintainable. I also learned how to use animations to enhance the user experience, such as adding fade-in and fade-out effects for comments.

### Challenges and Future Improvements

One of the biggest challenges was ensuring that all components worked seamlessly together. Debugging issues and ensuring that the frontend and backend communicated correctly required a lot of patience and problem-solving. I also realized the importance of thorough testing to catch and fix bugs early in the development process.

In the future, I plan to revisit the login functionality and implement a more secure authentication system. I also want to explore more advanced CSS techniques and frameworks to further improve the design and user experience of my applications.

### Conclusion

Overall, this project has been a comprehensive introduction to full-stack development with a React frontend. While there were many challenges and some aspects that I couldn't fully implement, the experience has been invaluable. I now have a better understanding of how to build and deploy a full-stack application using React, and I am excited to continue learning and improving my skills in this area.

The most complex thing I attempted was a login that included authorization, but sadly the way I tried to implement it wasn't quite right, so I reverted it back to my MVP and built from there to where we are now. Any advice on how to implement that would be welcomed. I am hoping my photo upload attempt continues to work. Using URLs as I've done in a couple of workshops seems to have done the trick. Maybe a more sophisticated method in the future. I also managed a basic search function but would like to learn how to refine that as well as refine an Edit post function as that would completely round off my app. Overall, I was really inspired by this assignment, and it is one I will continue to develop.

## Planning

![Screenshot 2024-10-13 at 20 57 56](https://github.com/user-attachments/assets/f59d1e29-3a02-4993-9cc6-52265eef83cc)

![Screenshot 2024-10-13 at 21 35 55](https://github.com/user-attachments/assets/2da5ec7a-907c-4c84-bb58-3f97ae80f2dc)

![Screenshot 2024-10-13 at 21 41 51](https://github.com/user-attachments/assets/6d274240-fc22-4f3f-8427-9140f921af89)

