import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link,
  Image,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  FileText,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';
import { blogCategories, blogTags as staticTags } from '@/lib/blogData';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: string;
  tags: string[];
  author: string;
  author_avatar: string;
  read_time: string;
  featured: boolean;
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogEditorProps {
  isAdmin: boolean;
}

// Simple markdown to HTML converter for preview
const renderMarkdown = (content: string): string => {
  let html = content
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>')
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="my-4">')
    // Line breaks
    .replace(/\n/g, '<br />');
  
  return `<div class="prose prose-lg max-w-none"><p class="my-4">${html}</p></div>`;
};

const RichTextToolbar = ({ onFormat }: { onFormat: (format: string, value?: string) => void }) => {
  const tools = [
    { icon: Bold, format: 'bold', label: 'Bold' },
    { icon: Italic, format: 'italic', label: 'Italic' },
    { icon: Underline, format: 'underline', label: 'Underline' },
    { icon: Heading1, format: 'h1', label: 'Heading 1' },
    { icon: Heading2, format: 'h2', label: 'Heading 2' },
    { icon: Heading3, format: 'h3', label: 'Heading 3' },
    { icon: List, format: 'ul', label: 'Bullet List' },
    { icon: ListOrdered, format: 'ol', label: 'Numbered List' },
    { icon: Quote, format: 'quote', label: 'Quote' },
    { icon: Code, format: 'code', label: 'Code' },
    { icon: Link, format: 'link', label: 'Link' },
    { icon: Image, format: 'image', label: 'Image' },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-t-md border border-b-0">
      {tools.map(({ icon: Icon, format, label }) => (
        <Button
          key={format}
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onFormat(format)}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

// AI Content Generator Component
const AIContentGenerator = ({ 
  onGenerate, 
  generating 
}: { 
  onGenerate: (type: 'title' | 'outline' | 'content') => void;
  generating: boolean;
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 w-full mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">AI Content Assistant</span>
      </div>
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        onClick={() => onGenerate('title')}
        disabled={generating}
      >
        {generating ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Wand2 className="mr-2 h-3 w-3" />}
        Generate Title
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        onClick={() => onGenerate('outline')}
        disabled={generating}
      >
        {generating ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Wand2 className="mr-2 h-3 w-3" />}
        Generate Outline
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        onClick={() => onGenerate('content')}
        disabled={generating}
      >
        {generating ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Wand2 className="mr-2 h-3 w-3" />}
        Expand Content
      </Button>
    </div>
  );
};

export default function BlogEditor({ isAdmin }: BlogEditorProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [contentRef, setContentRef] = useState<HTMLTextAreaElement | null>(null);
  const [activeTab, setActiveTab] = useState('write');
  const [generating, setGenerating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [keyword, setKeyword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'guides',
    author: 'MinerHaolan Team',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    read_time: '5 min read',
    featured: false,
    published: false,
    meta_title: '',
    meta_description: '',
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error loading posts',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // AI Content Generation
  const handleAIGenerate = async (type: 'title' | 'outline' | 'content') => {
    const searchKeyword = keyword || formData.category || 'cryptocurrency mining';
    
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          action: 'generate_blog_content',
          type,
          keyword: searchKeyword,
          existingTitle: formData.title,
          existingContent: formData.content,
          category: formData.category,
        }
      });

      if (error) throw error;

      if (type === 'title' && data.title) {
        setFormData(prev => ({
          ...prev,
          title: data.title,
          slug: generateSlug(data.title),
          meta_title: data.title,
        }));
        toast({ title: 'Title generated!', description: data.title });
      } else if (type === 'outline' && data.outline) {
        setFormData(prev => ({
          ...prev,
          content: prev.content + '\n\n' + data.outline,
          read_time: calculateReadTime(prev.content + data.outline),
        }));
        toast({ title: 'Outline generated!' });
      } else if (type === 'content' && data.content) {
        setFormData(prev => ({
          ...prev,
          content: data.content,
          read_time: calculateReadTime(data.content),
        }));
        toast({ title: 'Content expanded!' });
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: 'AI Generation Failed',
        description: error.message || 'Could not generate content. Please try again.',
        variant: 'destructive',
      });
    }
    setGenerating(false);
  };

  // Image Upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
      toast({ title: 'Image uploaded!', description: 'Featured image has been set.' });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Could not upload image.',
        variant: 'destructive',
      });
    }
    setUploadingImage(false);
  };

  const handleFormat = (format: string) => {
    if (!contentRef) return;

    const start = contentRef.selectionStart;
    const end = contentRef.selectionEnd;
    const selected = formData.content.substring(start, end);
    let replacement = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        cursorOffset = selected ? 0 : 2;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        cursorOffset = selected ? 0 : 1;
        break;
      case 'underline':
        replacement = `<u>${selected || 'underlined text'}</u>`;
        cursorOffset = selected ? 0 : 3;
        break;
      case 'h1':
        replacement = `\n# ${selected || 'Heading 1'}\n`;
        break;
      case 'h2':
        replacement = `\n## ${selected || 'Heading 2'}\n`;
        break;
      case 'h3':
        replacement = `\n### ${selected || 'Heading 3'}\n`;
        break;
      case 'ul':
        replacement = `\n- ${selected || 'List item'}\n`;
        break;
      case 'ol':
        replacement = `\n1. ${selected || 'List item'}\n`;
        break;
      case 'quote':
        replacement = `\n> ${selected || 'Quote text'}\n`;
        break;
      case 'code':
        replacement = selected.includes('\n') 
          ? `\n\`\`\`\n${selected || 'code'}\n\`\`\`\n`
          : `\`${selected || 'code'}\``;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          replacement = `[${selected || 'link text'}](${url})`;
        } else {
          return;
        }
        break;
      case 'image':
        // Trigger file upload instead of URL prompt
        fileInputRef.current?.click();
        return;
      default:
        return;
    }

    const newContent = formData.content.substring(0, start) + replacement + formData.content.substring(end);
    setFormData({ ...formData, content: newContent, read_time: calculateReadTime(newContent) });

    // Restore focus and cursor position
    setTimeout(() => {
      contentRef.focus();
      const newPosition = start + replacement.length - cursorOffset;
      contentRef.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleInlineImageUpload = async (file: File) => {
    if (!file || !contentRef) return;
    
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      const start = contentRef.selectionStart;
      const end = contentRef.selectionEnd;
      const imageMarkdown = `\n![${file.name}](${publicUrl})\n`;
      const newContent = formData.content.substring(0, start) + imageMarkdown + formData.content.substring(end);
      
      setFormData(prev => ({ ...prev, content: newContent, read_time: calculateReadTime(newContent) }));
      toast({ title: 'Image inserted!' });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    }
    setUploadingImage(false);
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title),
      meta_title: formData.meta_title || title,
    });
  };

  const handleExcerptChange = (excerpt: string) => {
    setFormData({
      ...formData,
      excerpt,
      meta_description: formData.meta_description || excerpt,
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const openNewPost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      category: 'guides',
      author: 'MinerHaolan Team',
      author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      read_time: '5 min read',
      featured: false,
      published: false,
      meta_title: '',
      meta_description: '',
    });
    setSelectedTags([]);
    setActiveTab('write');
    setKeyword('');
    setEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image || '',
      category: post.category,
      author: post.author,
      author_avatar: post.author_avatar,
      read_time: post.read_time,
      featured: post.featured,
      published: post.published,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
    });
    setSelectedTags(post.tags || []);
    setActiveTab('write');
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.slug) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in title, excerpt, content, and slug.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image || null,
      category: formData.category,
      tags: selectedTags,
      author: formData.author,
      author_avatar: formData.author_avatar,
      read_time: formData.read_time,
      featured: formData.featured,
      published: formData.published,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
    };

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;

        toast({
          title: 'Post updated!',
          description: 'Your blog post has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(postData);

        if (error) throw error;

        toast({
          title: 'Post created!',
          description: 'Your blog post has been created successfully.',
        });
      }

      setEditorOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast({
        title: 'Error saving post',
        description: error.message,
        variant: 'destructive',
      });
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Post deleted',
        description: 'The blog post has been removed.',
      });
      fetchPosts();
    }
  };

  if (!isAdmin) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Blog Manager ({posts.length} posts)
          </CardTitle>
          <Button onClick={openNewPost}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No blog posts yet. Create your first article!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    {post.featured && (
                      <Badge variant="secondary" className="shrink-0">Featured</Badge>
                    )}
                    <Badge 
                      variant={post.published ? "default" : "outline"}
                      className="shrink-0"
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.read_time}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditPost(post)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hidden file input for inline images */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleInlineImageUpload(file);
            e.target.value = '';
          }}
        />

        {/* Editor Dialog */}
        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* AI Content Generator */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter keyword for AI generation (e.g., bitcoin mining, ASIC profitability)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <AIContentGenerator onGenerate={handleAIGenerate} generating={generating} />
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="post-url-slug"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  placeholder="A brief summary of the article (displayed in previews)..."
                  rows={2}
                />
              </div>

              {/* Content with Preview Tabs */}
              <div className="space-y-2">
                <Label>Content (Markdown) *</Label>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-2">
                    <TabsTrigger value="write">
                      <Edit className="h-4 w-4 mr-2" />
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="write" className="mt-0">
                    <RichTextToolbar onFormat={handleFormat} />
                    <Textarea
                      ref={(ref) => setContentRef(ref)}
                      value={formData.content}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        content: e.target.value,
                        read_time: calculateReadTime(e.target.value)
                      })}
                      placeholder="Write your article content here using Markdown..."
                      rows={15}
                      className="font-mono text-sm rounded-t-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports Markdown: **bold**, *italic*, # headings, - lists, &gt; quotes, `code`
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-0">
                    <div 
                      className="min-h-[400px] p-6 border rounded-lg bg-card overflow-auto"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Featured Image with Upload */}
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL or upload below"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('featured-image-upload')?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    id="featured-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                      e.target.value = '';
                    }}
                  />
                </div>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded-lg mt-2"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {blogCategories.map(cat => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {staticTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* SEO Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">SEO Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title (for search engines)</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="SEO-optimized title (defaults to post title)"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.meta_title.length}/60 characters
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="SEO-optimized description (defaults to excerpt)"
                      maxLength={160}
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.meta_description.length}/160 characters
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Publishing Options */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(v) => setFormData({ ...formData, featured: v })}
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(v) => setFormData({ ...formData, published: v })}
                  />
                  <Label htmlFor="published">Published (visible to public)</Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditorOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
