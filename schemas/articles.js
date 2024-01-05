const z = require("zod");

const articleSchema = z.object({
  title: z.string(),
  lead: z.string(),
  image: z.string().url(),
  altImage: z.string(),
  content: z.string(),
  author: z.string().nullable().default(null),
});

function validateArticle(shape) {
  return articleSchema.safeParse(shape);
}

function validatePartialArticle(shape) {
  return articleSchema.partial().safeParse(shape);
}

module.exports = { validateArticle, validatePartialArticle };
