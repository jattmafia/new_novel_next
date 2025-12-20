# Story Reading Feature Implementation

## Overview
A complete story reading UI and flow similar to stck.me website, integrated into the Rowllr platform. Users can view stories, read chapters, and navigate through the reading experience.

## File Structure

### Pages
- **[src/app/[username]/story/[storyId]/page.tsx]** - Story detail page showing story info and chapter list
- **[src/app/[username]/story/[storyId]/chapter/[chapterId]/page.tsx]** - Chapter reading page

### Components
- **[src/components/story/StoryDetailWrapper.tsx]** - Main wrapper component managing story context and layout
- **[src/components/story/StoryHeader.tsx]** - Story header with cover, title, stats, and action buttons
- **[src/components/story/ChapterList.tsx]** - Sidebar displaying all chapters with navigation
- **[src/components/story/ChapterReader.tsx]** - Chapter content reader with reading customization (font size)
- **[src/components/story/ChapterNav.tsx]** - Navigation between chapters (previous/next)

### Hooks & Services
- **[src/lib/useStory.ts]** - React hooks for fetching stories, chapters, and chapter data
  - `useStory(storyId)` - Fetch single story details
  - `useChapters(storyId, token)` - Fetch all chapters for a story
  - `useChapter(chapterId, token)` - Fetch single chapter content

## URL Structure

```
Profile: /{username}
Story Detail: /{username}/story/{storyId}
Chapter Read: /{username}/story/{storyId}/chapter/{chapterId}

Example:
/aaaaaaasddd
/aaaaaaasddd/story/64a1f2e9b5d6c3f1a2b3c4d5
/aaaaaaasddd/story/64a1f2e9b5d6c3f1a2b3c4d5/chapter/66b2a3c4d5e6f7a8b9c0d1e2
```

## Features

### 1. Story Detail Page
- Story cover image, title, and description
- Story statistics (chapters, likes, views)
- Like button (toggleable)
- Share button (uses native share or clipboard)
- Chapter toggle button (for mobile)
- Chapter list with chapter numbers and word counts
- Link to start reading first chapter

### 2. Chapter Reader
- Full chapter content display
- Chapter header with number and title
- Reading settings toolbar:
  - Font size adjustment (A-, A+)
  - Reading/Stats toggle
- Chapter statistics (word count, access type, publish date)
- Chapter navigation (previous, next, back to story)
- Auto-mark chapter as read

### 3. Responsive Design
- **Desktop**: Sidebar chapters + main content
- **Mobile**: Toggle between chapters and content
- Sticky header for easy navigation
- Touch-friendly buttons and spacing

### 4. Reading Experience
- Clean, minimal design focused on content
- Justified text with comfortable line height
- Adjustable font size (12px - 24px)
- Chapter stats view
- Smooth navigation between chapters
- Visual indicators for paid chapters

## API Integration

### Expected API Endpoints

```
GET /api/stories/{storyId}
Response: {
  "story": {
    "_id": string,
    "authorId": string,
    "title": string,
    "description": string,
    "coverImage": string,
    "visibility": string,
    "chapterCount": number,
    "viewCount": number,
    "likeCount": number,
    "createdAt": string,
    "updatedAt": string
  }
}

GET /api/stories/{storyId}/chapters
Headers: "Authorization: Bearer {TOKEN}" (optional)
Response: {
  "chapters": [
    {
      "_id": string,
      "storyId": string,
      "authorId": string,
      "chapterNumber": number,
      "title": string,
      "content": string,
      "coverImage": string,
      "wordCount": number,
      "accessType": "free" | "paid",
      "price": number,
      "currency": string,
      "isPublished": boolean,
      "publishedAt": string,
      "createdAt": string,
      "updatedAt": string
    }
  ]
}

GET /api/chapters/{chapterId}
Headers: "Authorization: Bearer {TOKEN}" (optional)
Response: {
  "chapter": { ...chapter object }
}

POST /api/chapters/{chapterId}/read
Headers: "Authorization: Bearer {TOKEN}"
Response: { "message": "success" }
```

## Profile Page Integration

The story links in the profile page's "Featured Stories" section now navigate to the story reading interface:

```tsx
<a href={`/story/${s._id || s.id}`} className="text-sm text-purple-600 font-semibold">
  View
</a>
```

## Styling

- **Colors**: Purple (#6366f1) and Pink (#ec4899) gradients
- **Typography**: 
  - Headers: Bold, gradient text
  - Content: Clean sans-serif (Geist)
  - Reading content: Justified, 16-24px font size
- **Spacing**: Consistent padding and margins following Tailwind conventions
- **Interactions**: Smooth transitions, hover effects, visual feedback

## Usage Example

1. User views profile: `http://localhost:3000/aaaaaaasddd`
2. Clicks "View" on a story card
3. Navigates to story detail: `/aaaaaaasddd/story/{storyId}`
4. Clicks "Start Reading" to go to first chapter
5. Reads chapter with customizable font size
6. Navigates to next chapter using bottom navigation
7. Can toggle back to story or previous chapter

## Customization Options

### Font Size Adjustment
Located in ChapterReader, currently supports 12px - 24px with 2px increments.

### Colors & Gradients
All colors are defined in components using Tailwind classes. Easy to customize by updating the className values.

### Chapter Stats
Customize what's displayed in the stats view at [src/components/story/ChapterReader.tsx](src/components/story/ChapterReader.tsx) line ~150.

### Navigation Buttons
Customize button styling and placement in [src/components/story/ChapterNav.tsx](src/components/story/ChapterNav.tsx).

## Future Enhancements

1. **Bookmarks & Reading Progress**
   - Save reading position
   - Bookmark favorite chapters
   - Reading statistics

2. **Comments & Ratings**
   - Chapter comments
   - Story ratings
   - Reader feedback

3. **Advanced Reading Features**
   - Dark mode
   - Text selection and highlighting
   - Accessibility options (line spacing, letter spacing)

4. **Social Features**
   - Share specific chapters
   - Follow authors
   - Recommendations based on reading history

5. **Monetization**
   - Paid chapter access
   - In-app purchases
   - Reader subscriptions

## Troubleshooting

**Issue**: Chapter links return 404
- Ensure backend API is running
- Check that storyId and chapterId formats match API expectations

**Issue**: Images not loading
- Verify coverImage URLs are absolute URLs or proxied correctly
- Check image permissions

**Issue**: Font size not changing
- Ensure JavaScript is enabled
- Check browser console for errors

**Issue**: Mobile sidebar not working
- Test on actual mobile device or DevTools mobile view
- Verify touch events are working
