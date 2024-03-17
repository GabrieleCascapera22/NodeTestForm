import { Paragraph } from "./paragraph";

export interface RequestForm{
  lingua:string,
  title:string,
  subtitle:string,
  description:string,
  destinationId:string[],
  mediaImage:File|null|undefined,
  paragraph:Paragraph[]
}
