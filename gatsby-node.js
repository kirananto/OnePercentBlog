/**
  * Implement Gatsby's Node APIs in this file.
  *
  * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
  */
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const blogPost = path.resolve(`./src/templates/blog-post.js`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: {frontmatter: {date: DESC}}, limit: 1000) {
          edges {
            node {
              fields {
                slug
              }
              timeToRead
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
