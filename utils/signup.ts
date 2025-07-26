import { auth } from "@/lib/auth"
// import { headers } from "next/headers"

const signup = async (name:string, email: string, password:string) => {
    console.log("loggin user")
    await auth.api.signUpEmail({
        body: {name, email, password},
        asResponse: true,
    })
}

export default signup