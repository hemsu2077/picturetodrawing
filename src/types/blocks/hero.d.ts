import { Button, Image, Announcement } from "@/types/blocks/base";

export interface Announcement {
  title?: string;
  description?: string;
  label?: string;
  url?: string;
  target?: string;
}

export interface TipItem {
  text: string;
  icon: string;
}

export interface Hero {
  name?: string;
  disabled?: boolean;
  announcement?: Announcement;
  title?: string;
  highlight_text?: string;
  description?: string;
  buttons?: Button[];
  image?: Image;
  tip?: string;
  tip_items?: TipItem[];
  show_happy_users?: boolean;
  show_badge?: boolean;
}
