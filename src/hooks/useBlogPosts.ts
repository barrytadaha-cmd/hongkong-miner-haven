import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { blogPosts as staticPosts, BlogPost as StaticBlogPost } from '@/lib/blogData';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

// Transform database post to match the static format
const transformDBPost = (dbPost: any): BlogPost => ({
  id: dbPost.id,
  slug: dbPost.slug,
  title: dbPost.title,
  excerpt: dbPost.excerpt,
  content: dbPost.content,
  image: dbPost.image || '/products/avalon-mini-3-2.jpg',
  category: dbPost.category.charAt(0).toUpperCase() + dbPost.category.slice(1),
  tags: dbPost.tags || [],
  author: dbPost.author,
  authorAvatar: dbPost.author_avatar,
  date: new Date(dbPost.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  readTime: dbPost.read_time,
  featured: dbPost.featured,
});

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        // Fall back to static posts if database fails
        return staticPosts;
      }

      // If we have database posts, use them; otherwise fallback to static
      if (data && data.length > 0) {
        return data.map(transformDBPost);
      }

      return staticPosts;
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      // First try to fetch from database
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching blog post:', error);
      }

      // If found in database, return it
      if (data) {
        return transformDBPost(data);
      }

      // Otherwise, check static posts
      const staticPost = staticPosts.find(p => p.slug === slug);
      return staticPost || null;
    },
    enabled: !!slug,
  });
}

export function useRelatedPosts(currentPost: BlogPost | null, limit = 3) {
  return useQuery({
    queryKey: ['related-posts', currentPost?.id],
    queryFn: async () => {
      if (!currentPost) return [];

      // Try to fetch from database first
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .neq('id', currentPost.id)
        .limit(limit * 2);

      if (error || !data || data.length === 0) {
        // Fall back to static posts
        const related = staticPosts
          .filter(p => p.id !== currentPost.id)
          .filter(p => 
            p.category === currentPost.category || 
            p.tags.some(t => currentPost.tags.includes(t))
          )
          .slice(0, limit);
        return related;
      }

      // Score and sort by relevance
      const scored = data.map(post => {
        let score = 0;
        if (post.category.toLowerCase() === currentPost.category.toLowerCase()) score += 2;
        post.tags?.forEach((tag: string) => {
          if (currentPost.tags.includes(tag)) score += 1;
        });
        return { post: transformDBPost(post), score };
      });

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.post);
    },
    enabled: !!currentPost,
  });
}
