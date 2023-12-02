export type Image = {
  _type: 'image';
  asset: {
    _ref: string;
  }
}

export type File = {
  _type: 'file';
  asset: {
    _ref: string;
  }
}

export type ImageWithUrl = Image & {
  url: string;
}

export type Block = {
  _type: 'block';
  children: Array<{
    text: string;
  }>
}

export type ContentDescription = {
  _type: 'module.content.description';
  description: Array<Block>;
  image?: Image;
  media?: File;
  list?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export type ContentBigTitle = {
  _type: 'module.content.bigTitle';
  bigTitle: string;
  title: string;
  sideImage: Image;
}

export type ContentMoreInformation = {
  _type: 'module.content.moreInformation';
  delivery?: Array<Block>;
  included?: Array<Block>;
  guaranty?: Array<Block>;
}

export type ActionBlock = {
  _type: 'actionBlock';
  catchPhrase: string;
  title: string;
  content: string;
  mainImage: Image;
  additionalImage: Image;
  cta: {
    text: string;
    link: string;
  }
}

export type ProductPage = {
  _type: 'productPage',
  bigTitle: ContentBigTitle,
  defaultInformation: {
    delivery: Array<Block>;
    guaranty: Array<Block>;
  }
}

export type HomePage = {
  _type: 'home',
  hero: {
    carousel: Array<Image>;
  },
  cta: ActionBlock,
  productsSpotlight: Array<{
    store: {
      title: string,
      descriptionHtml: string,
      previewImageUrl: string,
      priceRange: { maxVariantPrice: number, minVariantPrice: number }
      slug: string,
    }
  }>
}
