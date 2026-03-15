import { JWTPayload as BaseJwtPayload } from "jose";

export interface JwtPayload extends BaseJwtPayload {
    roles: string[];
}