import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string[] | null;
  featured_image: string | null;
  author_name: string | null;
  published_at: string | null;
  is_featured: boolean;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Find the first featured article, or just the first article if none are featured
        const featured = data.find(a => a.is_featured) || data[0];
        setFeaturedArticle(featured || null);

        // Filter out the featured article from the main list if it exists
        const others = featured ? data.filter(a => a.id !== featured.id) : data;
        setArticles(others);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">News & Updates</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed about the latest developments, industry insights, and company announcements.
            </p>
          </div>

          {featuredArticle && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Featured Story
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-64 lg:h-auto bg-muted relative">
                  {featuredArticle.featured_image ? (
                    <img
                      src={featuredArticle.featured_image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <Tag className="h-16 w-16 text-muted-foreground/20" />
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {featuredArticle.category.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredArticle.published_at || '').toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredArticle.author_name || 'Eagle & Thistle'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 hover:text-primary transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredArticle.excerpt || featuredArticle.content.substring(0, 200)}...
                  </p>
                  <Button className="w-fit group">
                    Read Full Story
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col h-full hover:shadow-md transition-shadow border-border">
                <div className="h-48 bg-muted relative overflow-hidden rounded-t-xl">
                  {article.featured_image ? (
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <Tag className="h-12 w-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <Badge variant="secondary" className="absolute top-4 right-4">
                    {article.category.replace('_', ' ')}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.published_at || '').toLocaleDateString()}
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.excerpt || article.content.substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {article.tags?.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="ghost" className="w-full justify-between group px-0 hover:bg-transparent hover:text-primary">
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {articles.length === 0 && !featuredArticle && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news articles published yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default News;
