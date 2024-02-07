import { guest, companion } from "@prisma/client";

export default interface ApiFormData {
  name: string;
  email: string;
  hotel: boolean;
  vegan: boolean;
  vegetarian: boolean;
  declined: boolean | undefined;
  companions: companion[];
}
