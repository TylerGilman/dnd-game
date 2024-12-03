# Structure

## Features

| URL          | Features                                                                                                                                              |
|:------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
| `/`          | Displays 5 posts at a time with sorting options based on criteria. Pagination is enabled through URL parameters for navigating additional posts.       |
| `/search`    | Enables searching for current posts by title. The search bar on the home page redirects to this page when used.                                        |
| `/post`      | Displays the detailed view of a specific post based on URL parameters. Users can add comments on this page.                                            |
| `/login`     | Allows user authentication, including login, account creation, and logout functionality.                                                              |
| `/profile`   | Displays a specific user's profile based on their ID in the URL parameter. If logged in, users can see their following status and associated posts. Only the profile owner can view their email. |

## Models

**User**:

1. `isAdmin`: Defaults to a normal user. Admins have permissions to delete posts and ban users.
2. `username`: The unique username of the user.
3. `password`: The user's password.
4. `contact_email`: Email address for user contact purposes.
5. `profile_pic`: The user's profile picture.
6. `following`: A many-to-many relationship representing users being followed by this user.

**Posts**:

1. `user`: A foreign key linking the post to its creator.
2. `title`: The title of the post.
3. `description`: A brief description of the post.
4. `setup`: A text field supporting Markdown formatting.
5. `image`: An image generated using Hugging Face.
6. `upvote_count`: Tracks the number of upvotes the post has received.

**Comments**: (Replies are not allowed for simplicity)

1. `user`: A foreign key linking the comment to the user who made it.
2. `post`: A foreign key linking the comment to the related post.

