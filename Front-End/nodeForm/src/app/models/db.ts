import { paragraphDb } from "./paragraphDb";

export interface DB{
  lingua:string,
  title:string,
  subtitle:string,
  description:string,
  destinationId:string[],
  mediaImage?:string,
  paragraph:paragraphDb[]
}
