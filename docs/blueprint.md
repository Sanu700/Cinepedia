# **App Name**: Cinepedia

## Core Features:

- User Authentication: Enable users to sign up, log in, and manage their profiles using Firebase Authentication. Store user data in Firestore.
- Movie Browsing and Reviewing: Allow users to browse movies, read reviews, and write their own reviews with ratings. Implement edit/delete functionality for user's own reviews.
- Random Movie Poll: Implement a voting system where users can vote on randomly selected movie pairings. Guest users can view but not vote; authenticated users can vote once per poll. Each poll must prevent duplicate voting per user using Firestore rules. After voting, immediately show: Percentage-based progress bars, total vote count, highlight the winning movie visually. Guest users should see a disabled vote state with a login CTA. Add a “Next Random Poll” button for logged-in users. Store voting history per user for dashboard analytics.
- Firestore Integration: Use Firestore to store movies, reviews, polls, votes, and user profiles.
- User Dashboard: Create a dashboard for authenticated users to view their profile, reviews, and voting history, with the ability to edit or delete their reviews. Add analytics: Total reviews written, average rating given by the user, number of polls participated in. Show recent activity timeline (review posted / poll voted).
- Review Suggestion: When a user starts writing a review, use an LLM tool to provide helpful and relevant feedback or suggestions based on similar reviews or the movie's synopsis, acting as an advisor. It does not rewrite the user's review, but rather improves it by giving suggestions like: “You can mention cinematography” or “Try comparing with similar movies”.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to evoke a sense of cinematic mystery and sophistication.
- Background color: Dark gray (#303030) for a modern dark mode aesthetic.
- Accent color: Light lavender (#D1C4E9) to provide highlights and contrast, especially for interactive elements.
- Body font: 'PT Sans' a humanist sans-serif font that combines a modern look and a little warmth or personality, suitable for body text
- Headline font: 'Playfair', a modern sans-serif similar to Didot, geometric, high contrast thin-thick lines, with an elegant, fashionable, high-end feel; suitable for headlines
- Use clean, minimalist icons from a set like Material Icons, customized to fit the movie theme (e.g., film reel, star, popcorn).
- Use a card-based layout with rounded corners and subtle shadows for movies, reviews, and polls. Implement a responsive grid for different screen sizes.
- Subtle animations such as fade-in effects, hover effects on cards, and a transition animation for poll results using progress bars.