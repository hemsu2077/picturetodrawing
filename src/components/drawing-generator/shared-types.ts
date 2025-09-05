export interface Drawing {
  uuid: string;
  generated_image_url: string;
  original_image_url: string | null;
  style: string;
  model: string;
  ratio: string | null;
  created_at: Date | null;
  filename: string | null;
}
