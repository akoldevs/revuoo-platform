// src/app/admin/content/page.tsx
import { client as sanityClient } from "@/lib/sanity/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  PlusCircle,
  Edit,
  HelpCircle,
  FileText,
  Eye,
} from "lucide-react"; // ✅ FIX: Removed unused 'BarChart' import
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ContentAnalytics } from "@/components/admin/ContentAnalytics";

export const dynamic = "force-dynamic";

// --- Type Definitions ---
type SanityPost = {
  _id: string;
  title: string;
  slug: { current: string };
  authorName: string | null;
  authorImage: string | null;
  mainImage: string | null;
  publishedAt: string | null;
};
type SanityHelpArticle = {
  _id: string;
  question: string;
  categoryTitle: string | null;
  _updatedAt: string;
};
type SanityLegalPage = {
  _id: string;
  title: string;
  slug: { current: string };
  _updatedAt: string;
};

// --- Sanity GROQ Queries ---
const postsQuery = `*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  slug,
  "authorName": author->name,
  "authorImage": author->image.asset->url,
  "mainImage": mainImage.asset->url,
  publishedAt
}`;
const faqsQuery = `*[_type == "helpArticle"] | order(_updatedAt desc) {
  _id,
  question,
  "categoryTitle": category->title,
  _updatedAt
}`;
const pagesQuery = `*[_type == "legalPage"] | order(_updatedAt desc) {
  _id,
  title,
  slug,
  _updatedAt
}`;

// --- Sanity Studio URL Helper ---
const getStudioUrl = (
  docId: string | null,
  docType: "post" | "helpArticle" | "legalPage"
) => {
  if (docId) {
    const documentId = docId.replace("drafts.", "");
    return `/studio/intent/edit/id=${documentId}`;
  } else {
    return `/studio/intent/create/template=${docType}`;
  }
};

export default async function ContentManagementPage() {
  const [posts, faqs, pages] = await Promise.all([
    sanityClient.fetch<SanityPost[]>(postsQuery),
    sanityClient.fetch<SanityHelpArticle[]>(faqsQuery),
    sanityClient.fetch<SanityLegalPage[]>(pagesQuery),
  ]);

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" /> Content Management
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage all &quot;Guides & Insights,&quot; FAQs, and other platform
          content.
        </p>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guides">Guides & Insights</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="pages">Website Pages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* --- Guides & Insights Tab --- */}
        <TabsContent value="guides">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Guides & Insights</CardTitle>
                <CardDescription>
                  A list of all articles published on the Revuoo blog.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href={getStudioUrl(null, "post")} target="_blank">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Guide
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* ✅ FIX: Explicitly typed 'post' to resolve 'any' type error. */}
                    {posts.map((post: SanityPost) => (
                      <TableRow key={post._id}>
                        <TableCell className="font-medium flex items-center gap-4">
                          {post.mainImage && (
                            <Image
                              src={post.mainImage}
                              alt={post.title}
                              width={64}
                              height={64}
                              className="rounded-md object-cover h-16 w-16"
                            />
                          )}
                          <span>{post.title}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {post.authorImage && (
                              <Image
                                src={post.authorImage}
                                alt={post.authorName || "Author"}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            )}
                            <span>{post.authorName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {post.publishedAt ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {!post.publishedAt && post.slug?.current && (
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={`/api/preview?slug=${post.slug.current}`}
                                target="_blank"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Link>
                            </Button>
                          )}
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={getStudioUrl(post._id, "post")}
                              target="_blank"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- FAQs Tab --- */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" /> FAQ Management
                </CardTitle>
                <CardDescription>
                  Manage all articles in the Help Center for users and
                  businesses.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href={getStudioUrl(null, "helpArticle")} target="_blank">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New FAQ
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* ✅ FIX: Explicitly typed 'faq' to resolve 'any' type error. */}
                    {faqs.map((faq: SanityHelpArticle) => (
                      <TableRow key={faq._id}>
                        <TableCell className="font-medium">
                          {faq.question}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {faq.categoryTitle || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(faq._updatedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={getStudioUrl(faq._id, "helpArticle")}
                              target="_blank"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Website Pages Tab --- */}
        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Website Page Management
                </CardTitle>
                <CardDescription>
                  Manage content for static pages like About Us, Privacy Policy,
                  etc.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href={getStudioUrl(null, "legalPage")} target="_blank">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Page
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page Title</TableHead>
                      <TableHead>URL Slug</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* ✅ FIX: Explicitly typed 'page' to resolve 'any' type error. */}
                    {pages.map((page: SanityLegalPage) => (
                      <TableRow key={page._id}>
                        <TableCell className="font-medium">
                          {page.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            /{page.slug?.current}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(page._updatedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={getStudioUrl(page._id, "legalPage")}
                              target="_blank"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Analytics Tab --- */}
        <TabsContent value="analytics">
          <ContentAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
