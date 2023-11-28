import groq from "groq"

const PRODUCT_PAGE_QUERY = groq`*[_type == "product" && slug.current == $slug][0]`

export const CMS = { PRODUCT_PAGE_QUERY }