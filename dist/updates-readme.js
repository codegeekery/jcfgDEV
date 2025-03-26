import * as fs from 'node:fs/promises';
import path from 'node:path';
const DEV_TO_API_BASE_URL = 'https://lg-resume-calculations-note.trycloudflare.com/api/latest-post';
const main = async () => {
    // Read the original file content
    const filePath = '../README.md';
    const markdown = await readFile(filePath);
    // Proceed only if the file was read successfully
    if (markdown) {
        // Fetch latest articles
        const articles = await fetchArticles();
        // Generate new content
        const newContent = generateArticlesContent(articles);
        // Replace content between markers
        const START_MARKER = '<!-- ARTICLES:START -->';
        const END_MARKER = '<!-- ARTICLES:END -->';
        const updatedMarkdown = replaceContentBetweenMarkers(markdown, START_MARKER, END_MARKER, newContent);
        // Save the updated file
        await saveFile(filePath, updatedMarkdown);
    }
};
// Fetch latest articles from the provided API
const fetchArticles = async () => {
    const response = await fetch(DEV_TO_API_BASE_URL, {
        method: 'GET',
        headers: {
            'X-CODEGEEKERY': process.env.SECRET_KEY || '', // Usar el secret
        },
    });
    const data = await response.json();
    // Map the data to match the ArticlePreview interface
    return data.map((article) => ({
        title: article.title,
        url: `https://lg-resume-calculations-note.trycloudflare.com/posts/${article.slug.current}`, // Construct URL for the article
        imageUrl: article.mainImage.asset.url, // Image URL
    }));
};
// Generate markdown from articles
const generateArticlesContent = (articles) => {
    let markdown = '';
    articles.forEach((article) => {
        markdown += `- [${article.title}](${article.url})\n![Image](${article.imageUrl})\n`;
    });
    return markdown;
};
// Read file
const readFile = async (filePath) => {
    try {
        const absolutePath = path.resolve(import.meta.dirname, filePath);
        console.log('Reading file from:', absolutePath);
        return await fs.readFile(absolutePath, 'utf8');
    }
    catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
};
// Generate updated markdown
const replaceContentBetweenMarkers = (markdown, startMarker, endMarker, newContent) => {
    const regex = new RegExp(`(${startMarker})([\\s\\S]*?)(${endMarker})`, 'g');
    return markdown.replace(regex, `$1\n${newContent}$3`);
};
// Save file
const saveFile = async (filePath, content) => {
    try {
        const absolutePath = path.resolve(import.meta.dirname, filePath);
        await fs.writeFile(absolutePath, content, 'utf8');
        console.log('File has been saved successfully!');
    }
    catch (err) {
        console.error('Error saving file:', err);
    }
};
main();
