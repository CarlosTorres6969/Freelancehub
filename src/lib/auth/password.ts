import "server-only"
import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
const derive = promisify(pbkdf2)
export async function hashPassword(password:string){const salt=randomBytes(16),iterations=210000;const hash=await derive(password,salt,iterations,32,"sha256");return `pbkdf2_sha256$${iterations}$${salt.toString("base64")}$${hash.toString("base64")}`}
export async function verifyPassword(password:string,encoded:string){const [algorithm,rounds,salt64,hash64]=encoded.split("$");if(algorithm!=="pbkdf2_sha256"||!rounds||!salt64||!hash64)return false;const expected=Buffer.from(hash64,"base64"),actual=await derive(password,Buffer.from(salt64,"base64"),Number(rounds),expected.length,"sha256");return actual.length===expected.length&&timingSafeEqual(actual,expected)}
