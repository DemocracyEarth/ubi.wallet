import nacl from "tweetnacl"
import { encodeBase64, decodeBase64 } from "@/lib/utils"
import type { KeyPair } from "@/lib/types"

export function generateKeyPair(): KeyPair {
  const keyPair = nacl.sign.keyPair()

  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: keyPair.secretKey,
  }
}

export function signMessage(message: string, secretKey: Uint8Array): string {
  const messageUint8 = new TextEncoder().encode(message)
  const signature = nacl.sign.detached(messageUint8, secretKey)
  return encodeBase64(signature)
}

export function verifySignature(message: string, signature: string, publicKey: string): boolean {
  const messageUint8 = new TextEncoder().encode(message)
  const signatureUint8 = decodeBase64(signature)
  const publicKeyUint8 = decodeBase64(publicKey)

  return nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8)
}

