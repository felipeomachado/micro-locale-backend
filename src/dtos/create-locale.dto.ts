import { IsNotEmpty } from "class-validator";


export class CreateLocaleDto {

  @IsNotEmpty()
  readonly cityId: number;
  
  @IsNotEmpty()
  readonly cityName: string;
  
  @IsNotEmpty()
  readonly state: string;

}