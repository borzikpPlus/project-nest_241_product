export class ProductGetResDto {
  id: number;
  title: string;
  price: number;
  description: string | null;
  category: {
    id: number;
    title: string;
  };
}
