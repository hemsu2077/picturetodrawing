import { Header } from "@/types/blocks/header";
import { Hero } from "@/types/blocks/hero";
import { Section } from "@/types/blocks/section";
import { Footer } from "@/types/blocks/footer";
import { Pricing } from "@/types/blocks/pricing";

export interface LandingPage {
  header?: Header;
  hero?: Hero;
  branding?: Section;
  introduce?: Section;
  benefit?: Section;
  art_styles?: Section;
  transformation_examples?: Section;
  perfect_uses?: Section;
  comparison?: Section;
  ai_excellence?: Section;
  usage?: Section;
  feature?: Section;
  showcase?: Section;
  stats?: Section;
  pricing?: Pricing;
  testimonial?: Section;
  faq?: Section;
  cta?: Section;
  footer?: Footer;
}

export interface PhotoTransformationPage {
  meta?: {
    title?: string;
    description?: string;
  };
  hero?: Hero;
  branding?: Section;
  introduce?: Section;
  benefit?: Section;
  art_styles?: Section;
  transformation_examples?: Section;
  perfect_uses?: Section;
  use_cases?: Section;
  comparison?: Section;
  ai_excellence?: Section;
  usage?: Section;
  feature?: Section;
  showcase?: Section;
  stats?: Section;
  pricing?: Pricing;
  testimonial?: Section;
  faq?: Section;
  cta?: Section;
}

export interface PricingPage {
  meta?: {
    title?: string;
    description?: string;
  };
  pricing?: Pricing;
  faq?: Section;
}

export interface ShowcasePage {
  showcase?: Section;
}

export interface DrawingStylesPage {
  meta?: {
    title?: string;
    description?: string;
  };
  hero?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  breadcrumb?: {
    home?: string;
    drawing_styles?: string;
  };
  categories?: {
    [key: string]: {
      name?: string;
      description?: string;
    };
  };
  style_metadata?: {
    [key: string]: {
      description?: string;
    };
  };
  style_card?: {
    learn_more?: string;
    try_now?: string;
  };
  cta?: {
    title?: string;
    description?: string;
    button?: string;
  };
  structured_data?: {
    name?: string;
    description?: string;
    breadcrumb_home?: string;
    breadcrumb_drawing_styles?: string;
  };
}
