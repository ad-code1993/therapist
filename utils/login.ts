import { auth } from "@/lib/auth"
// import { headers } from "next/headers"

const login = async (email: string, password:string) => {
    console.log("loggin user")
    await auth.api.signInEmail({
        body: {email, password},
        // headers: await headers(),
        asResponse: true
    })
}

export default login