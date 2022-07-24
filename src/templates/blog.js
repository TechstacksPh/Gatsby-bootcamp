import * as React from "react"
import { graphql } from "gatsby"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import Layout from "../components/layout"

export const query = graphql`
  query($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishedDate(formatString: "MMM Do, YYYY")
      body {
        raw
        references {
          ... on ContentfulAsset {
            contentful_id
            title
            gatsbyImageData(width: 1600)
            __typename
          }
        }
      }
    }
  }
`

const Blog= ({data}) => {

  const options = {
    renderMark: {
      [MARKS.BOLD]: text => <b>{text}</b>
    },
    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => {
        return <h1>{children}</h1>
      },
      [BLOCKS.EMBEDDED_ASSET]: node => {
        const { gatsbyImageData, title} = node.data.target
        return <GatsbyImage image={getImage(gatsbyImageData)} alt={title} />
      }
    }
  }

  return (
    <Layout>
      <h1>{data.contentfulBlogPost.title}</h1>
      <p>{data.contentfulBlogPost.publishedDate}</p>
      {renderRichText(data.contentfulBlogPost.body, options)}
    </Layout>
  )

}

export default Blog