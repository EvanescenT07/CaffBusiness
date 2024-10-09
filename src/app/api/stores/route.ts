import { db } from "@/lib/firebase"
import { auth } from "@clerk/nextjs/server"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export const POST = async (reqs: Request) => {
    try {
        const { userId } = auth()
        const body = await reqs.json()

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 })
        }

        const { name } = body

        if (!name) {
            return new NextResponse("Store Name is Missing", { status: 400 })
        }

        const storeData = {
            name,
            userId,
            createdAt: serverTimestamp()
        }

        const storeRef = await addDoc(collection(db, "stores"), storeData);

        const id = storeRef.id

        await updateDoc(doc(db, "stores", id), {
            ...storeData,
            id,
            upadatedAt: serverTimestamp()
        })

        return NextResponse.json({ id, ...storeData })

    } catch (error) {
        console.log(`STORES POST ERROR: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}