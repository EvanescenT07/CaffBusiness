import { db } from "@/lib/firebase"
import { auth, currentUser } from "@clerk/nextjs/server"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export const POST = async (reqs: Request) => {
    try {
        const { userId } = auth()
        const body = await reqs.json()
        const user = await currentUser()

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 })
        }

        const { name } = body

        if (!name) {
            return new NextResponse("Business Name is Missing", { status: 400 })
        }

        const businessOwner = user?.firstName && user?.lastName ?
        `${user?.firstName} ${user?.lastName}` : user?.username 

        const businessData = {
            name,
            BusinessOwner: businessOwner,
            userId,
            status: "active",
            createdAt: serverTimestamp()
        }

        const businessRef = await addDoc(collection(db, "business"), businessData);

        const id = businessRef.id

        await updateDoc(doc(db, "business", id), {
            ...businessData,
            id,
            upadatedAt: serverTimestamp()
        })

        return NextResponse.json({ id, ...businessData })

    } catch (error) {
        console.log(`Business POST ERROR: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}