export interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  purchased: boolean;
  imageUrl?: string;
}